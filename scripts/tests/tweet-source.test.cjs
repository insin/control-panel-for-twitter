const assert = require('node:assert/strict')
const {readFileSync} = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const source = readFileSync(path.join(__dirname, '../../script.js'), 'utf8').replace(/\r\n/g, '\n')
const functions = source.slice(source.indexOf('// Cache promises'), source.lastIndexOf('/**', source.indexOf('async function tweakFocusedTweet')))
const constants = ['URL_TWEET_BASE_RE', 'TWITTER_API_AUTHORIZATION'].map(name => source.match(new RegExp(`^const ${name} = .+$`, 'm'))[0]).join('\n')
const response = {ok: true, json: async () => ({globalObjects: {tweets: {'123': {source: '<a>Legacy Client</a>'}}}})}

function element() {
  return {
    attributes: new Map(), children: [], isConnected: true,
    hasAttribute(name) { return this.attributes.has(name) },
    setAttribute(name, value) { this.attributes.set(name, value) },
    append(...children) { this.children.push(...children) },
    set innerHTML(value) { throw Error('Live elements must never receive HTML') },
  }
}

function setup(fetchImpl = async () => response) {
  const calls = [], timers = new Map()
  let nextTimer = 0
  const context = vm.createContext({
    AbortController,
    location: {pathname: '/user/status/123'},
    config: {enabled: true, restoreTweetSource: true},
    getTweetInfo: () => null,
    document: {
      cookie: 'other=value; ct0=current-csrf',
      createElement: tag => tag === 'template'
        // Stub browser parsing; assert the resulting text is never inserted as HTML.
        ? {innerHTML: '', content: {querySelector: () => ({textContent: 'Legacy <Client>'})}}
        : element(),
    },
    setTimeout(fn, delay) { const id = ++nextTimer; timers.set(id, {fn, delay}); return id },
    clearTimeout(id) { timers.delete(id) },
    fetch: (...args) => { calls.push(args); return fetchImpl(...args) },
  })
  vm.runInContext(`${constants}\n${functions}`, context)
  return {context, calls, timers}
}

test('legacy API wins over GraphQL, deduplicates requests and inserts plain text', async () => {
  const env = setup(), bar = element()
  await Promise.all([
    env.context.restoreTweetSource(bar, {source_name: 'GraphQL'}, '123'),
    env.context.restoreTweetSource(bar, {source_name: 'GraphQL'}, '123'),
  ])
  assert.equal(env.calls.length, 1)
  assert.match(env.calls[0][0], /^\/i\/api\/2\/timeline\/conversation\/123\.json\?/)
  assert.equal(env.calls[0][1].headers['x-csrf-token'], 'current-csrf')
  assert.equal(env.calls[0][1].credentials, 'include')
  assert.equal(bar.children.length, 2)
  assert.equal(bar.children[1].textContent, 'Legacy <Client>')
  await env.context.restoreTweetSource(element(), null, '123')
  assert.equal(env.calls.length, 1)
  assert.equal(env.timers.size, 0)
})

for (const failure of ['401', '403', '404', '429', 'network', 'json', 'missing-source']) {
  test(`${failure} falls back to GraphQL and caches failure`, async () => {
    const env = setup(async () => {
      if (failure === 'network') throw Error('offline')
      return {ok: !/^\d+$/.test(failure), json: async () => {
        if (failure === 'json') throw SyntaxError('invalid JSON')
        return {}
      }}
    }), bar = element()
    await env.context.restoreTweetSource(bar, {source_name: 'GraphQL'}, '123')
    assert.equal(bar.children[1].textContent, 'GraphQL')
    const revisit = element()
    await env.context.restoreTweetSource(revisit, null, '123')
    assert.equal(revisit.children.length, 0)
    assert.equal(env.calls.length, 1)
    assert.equal(env.timers.size, 0)
  })
}

test('disabled settings and invalid IDs never make requests', async () => {
  const env = setup()
  for (const flag of ['enabled', 'restoreTweetSource']) {
    env.context.config[flag] = false
    await env.context.restoreTweetSource(element(), null, '123')
    env.context.config[flag] = true
  }
  await env.context.restoreTweetSource(element(), null, '../123')
  assert.equal(env.calls.length, 0)
})

for (const change of ['enabled', 'restoreTweetSource', 'navigate', 'detach']) {
  test(`late result does not modify page after ${change}`, async () => {
    let finish
    const env = setup(() => new Promise(resolve => { finish = resolve })), bar = element()
    const pending = env.context.restoreTweetSource(bar, null, '123')
    if (change === 'navigate') env.context.location.pathname = '/user/status/456'
    else if (change === 'detach') bar.isConnected = false
    else env.context.config[change] = false
    finish(response)
    await pending
    assert.equal(bar.children.length, 0)
  })
}

test('timeout aborts the request and uses GraphQL data received while waiting', async () => {
  const env = setup((_url, {signal}) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(Error('aborted')), {once: true})
  })), bar = element()
  const pending = env.context.restoreTweetSource(bar, {source_name: 'Old GraphQL'}, '123')
  env.context.getTweetInfo = () => ({source_name: 'Current GraphQL'})
  const timer = [...env.timers.values()].find(timer => timer.delay === 10000)
  assert.ok(timer)
  timer.fn()
  await pending
  assert.equal(env.calls[0][1].signal.aborted, true)
  assert.equal(bar.children[1].textContent, 'Current GraphQL')
  assert.equal(env.timers.size, 0)
})
