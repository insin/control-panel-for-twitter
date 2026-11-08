import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { getEdition } from './lib.mjs'
import { prepareSafari } from './safari.mjs'

/**
 * @param {Record<string, {name: string, udid: string, state: string, isAvailable: boolean}[]>} devices
 * @param {string} [requested]
 */
export function selectSimulator(devices, requested) {
  const available = Object.entries(devices)
    .filter(([runtime]) => runtime.startsWith('com.apple.CoreSimulator.SimRuntime.iOS-'))
    .sort(([a], [b]) => b.localeCompare(a, 'en', { numeric: true }))
    .flatMap(([, devices]) => devices.filter((device) => device.isAvailable))
  const candidates = available.filter((device) =>
    requested
      ? device.udid == requested || device.name == requested
      : device.name.startsWith('iPhone'),
  )
  const device = candidates.find((device) => device.state == 'Booted') || candidates[0]
  if (!device)
    throw new Error(
      requested
        ? `No available iOS simulator matches "${requested}". Run xcrun simctl list devices available to see choices.`
        : 'No iPhone simulator is available. Install an iOS simulator runtime in Xcode first.',
    )
  return device
}

/** @param {string} command @param {string[]} args */
function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

function main() {
  const { values, positionals } = parseArgs({
    options: {
      edition: { type: 'string' },
      local: { type: 'boolean', default: false },
      device: { type: 'string' },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  })
  if (values.help) {
    console.log(`Usage:
  npm run dev:safari
  npm run dev:safari:ios
  npm run dev:safari:ios -- --device="iPhone 17 Pro"

Options: --edition=v4|v5 (default v4), --local (v5 localhost access), --device=<name or UDID> (iOS)`)
    return
  }
  if (process.platform != 'darwin')
    throw new Error('Safari development builds require macOS and Xcode.')
  const platform = positionals[0] || 'macos'
  if (positionals.length > 1 || !['macos', 'ios'].includes(platform))
    throw new Error('Choose macos or ios.')
  if (values.device && platform != 'ios') throw new Error('--device is only supported for iOS.')
  const edition = getEdition()
  process.chdir(fileURLToPath(new URL('..', import.meta.url)))
  const simulator =
    platform == 'ios'
      ? selectSimulator(
          JSON.parse(
            execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '--json'], {
              encoding: 'utf8',
            }),
          ).devices,
          values.device,
        )
      : null

  prepareSafari({ edition, local: values.local })
  const derivedData = path.resolve(`.scratch/safari-${platform}`)
  const log = path.resolve(`.scratch/safari-${edition}-${platform}.log`)
  fs.mkdirSync(path.dirname(log), { recursive: true })
  const output = fs.openSync(log, 'w')
  console.log(`Building Safari ${edition} for ${simulator?.name || 'macOS'}…\nBuild log: ${log}`)
  try {
    execFileSync(
      'xcodebuild',
      [
        '-project',
        'safari/Control Panel for Twitter.xcodeproj',
        '-scheme',
        `Control Panel for Twitter (${platform == 'ios' ? 'iOS' : 'macOS'})`,
        '-configuration',
        'Debug',
        '-destination',
        simulator ? `platform=iOS Simulator,id=${simulator.udid}` : 'platform=macOS',
        '-derivedDataPath',
        derivedData,
        'build',
      ],
      { stdio: ['ignore', output, output] },
    )
  } catch {
    console.error(fs.readFileSync(log, 'utf8').split('\n').slice(-60).join('\n'))
    throw new Error(`Safari build failed. Full log: ${log}`)
  } finally {
    fs.closeSync(output)
  }

  const app = path.join(
    derivedData,
    'Build/Products',
    platform == 'ios' ? 'Debug-iphonesimulator' : 'Debug',
    'Control Panel for Twitter.app',
  )
  if (simulator) {
    if (simulator.state != 'Booted') run('xcrun', ['simctl', 'boot', simulator.udid])
    run('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', simulator.udid])
    run('xcrun', ['simctl', 'bootstatus', simulator.udid, '-b'])
    run('xcrun', ['simctl', 'install', simulator.udid, app])
    const bundleId = execFileSync(
      '/usr/libexec/PlistBuddy',
      ['-c', 'Print :CFBundleIdentifier', path.join(app, 'Info.plist')],
      { encoding: 'utf8' },
    ).trim()
    run('xcrun', ['simctl', 'launch', '--terminate-running-process', simulator.udid, bundleId])
  } else {
    run(
      '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister',
      ['-f', app],
    )
    run('open', [app])
  }
  console.log(`Safari ${edition} is ready. Reload X to use the updated extension.`)
}

if (process.argv[1] && path.resolve(process.argv[1]) == fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
