"""Run the real extension in an isolated Gecko profile; inspect real clipboard data."""
import argparse, base64, functools, json, shutil, tempfile, threading, time
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from marionette_driver.marionette import Marionette
from marionette_driver.addons import Addons
from marionette_driver.by import By
p=argparse.ArgumentParser()
p.add_argument('--browser', required=True)
p.add_argument('--output', type=Path, required=True)
a=p.parse_args(); a.output.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parent.parent
checks=[]
def check(name, actual, expected):
    checks.append(dict(name=name,actual=actual,expected=expected,passed=actual==expected))
    assert actual==expected, checks[-1]
with tempfile.TemporaryDirectory(prefix='cpft-clean-links-') as tmp:
    tmp=Path(tmp); ext=tmp/'extension'; ext.mkdir(); site=tmp/'site'; site.mkdir()
    for name in ['content.js','script.js','background.js','options.html','options.js','options.css','options-icon.png','_locales','icons']:
        src=root/name
        if src.is_dir(): shutil.copytree(src,ext/name)
        else: shutil.copy2(src,ext/name)
    (ext/'browser_action.html').write_text((root/'options.html').read_text().replace('<body>','<body class="browserAction">'))
    manifest=json.loads((root/'manifest.mv2.json').read_text()); manifest['content_scripts'][0]['matches'].append('http://127.0.0.1/*')
    (ext/'manifest.json').write_text(json.dumps(manifest))
    (site/'index.html').write_text('''<!doctype html><html lang="en"><title>Clipboard E2E</title>
<h1>Copy link tests</h1><button id="copy">Copy</button><textarea id="selection"></textarea><div id="rich" contenteditable></div><pre id="result"></pre>
<script>
window.payload=''; window.mode='text';
document.querySelector('#copy').onclick=async()=>{
 try {
  if(mode==='text') await navigator.clipboard.writeText(payload);
  if(mode==='item') await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([payload],{type:'text/plain'}),'text/html':new Blob(['<b><a href="'+payload+'">Link</a></b>'],{type:'text/html'})})]);
  if(mode==='legacy') { const t=document.querySelector('#selection');t.value=payload;t.select();document.execCommand('copy'); }
  if(mode==='handler') { document.addEventListener('copy',e=>{e.clipboardData.setData('text/plain',payload);e.preventDefault()},{once:true}); document.execCommand('copy'); }
  if(mode==='image') {const c=document.createElement('canvas'); c.width=2;c.height=2;const blob=await new Promise(r=>c.toBlob(r));await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);}
  document.querySelector('#result').textContent='done';
 } catch(e) {document.querySelector('#result').textContent=e.name+': '+e.message;}
};
</script>''')
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(SimpleHTTPRequestHandler,directory=str(site)))
    threading.Thread(target=server.serve_forever,daemon=True).start(); url=f'http://127.0.0.1:{server.server_port}/'; m=None
    try:
        m=Marionette(bin=a.browser,app='fxdesktop',headless=True,port=2840,app_args=['-no-remote','--remote-allow-system-access'],workspace=str(tmp),gecko_log=str(a.output/'browser.log'),prefs={'zen.welcome-screen.seen':True,'browser.shell.checkDefaultBrowser':False})
        m.start_session(); addon=Addons(m).install(str(ext),temp=True); m.set_context('chrome')
        options=m.execute_async_script('const done=arguments[arguments.length-1]; const {AddonManager}=ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");AddonManager.getAddonByID(arguments[0]).then(a=>done(a.optionsURL));',script_args=[addon])
        m.set_context('content'); m.navigate(url); time.sleep(1); page=m.current_window_handle
        m.open(type='tab',focus=True); settings=next(h for h in m.window_handles if h!=page);m.switch_to_window(settings);m.navigate(options);time.sleep(.5)
        check('Enabled by default',m.find_element(By.CSS_SELECTOR,'[name=cleanCopiedLinks]').is_selected(),True)
        def toggle(name):
            m.switch_to_window(settings);m.find_element(By.CSS_SELECTOR,f'[name={name}]').click();time.sleep(.3);m.switch_to_window(page)
        def read(flavor='text/plain'):
            m.set_context('chrome')
            try: return m.execute_script('const t=Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);t.init(null);t.addDataFlavor(arguments[0]);Services.clipboard.getData(t,Services.clipboard.kGlobalClipboard);const d={};t.getTransferData(arguments[0],d);return d.value.QueryInterface(Ci.nsISupportsString).data;',script_args=[flavor])
            finally: m.set_context('content')
        def copy(text, mode='text'):
            m.switch_to_window(page);m.execute_script('window.wrappedJSObject.payload=arguments[0];window.wrappedJSObject.mode=arguments[1];document.querySelector("#result").textContent=""',script_args=[text,mode]);m.find_element(By.ID,'copy').click()
            for _ in range(50):
                if m.find_element(By.ID,'result').text:break
                time.sleep(.1)
            check('Clipboard write succeeds: '+mode,m.find_element(By.ID,'result').text,'done')
            return read() if mode!='image' else None
        dirty='https://x.com/Polymarket/status/2115789517235892424?a=KSDvl_Y98xpaS_ltOlM&s=20'
        clean='https://x.com/Polymarket/status/2115789517235892424'
        for mode in ['text','item','legacy','handler']:
            check('Tracking removed: '+mode,copy(dirty,mode),clean)
            if mode=='item': check('HTML link cleaned; formatting kept',m.execute_script('return new DOMParser().parseFromString(arguments[0], "text/html").body.innerHTML',script_args=[read('text/html')]),'<b><a href="'+clean+'">Link</a></b>')
        cases=[
          ('Duplicate and encoded keys','https://twitter.com/user/status/123?%61=one&s=20&t=two&a=three&lang=en#reply','https://twitter.com/user/status/123?lang=en#reply'),
          ('Photo route and query preserved','https://mobile.x.com/user/status/123/photo/2?s=20&lang=en%20US','https://mobile.x.com/user/status/123/photo/2?lang=en%20US'),
          ('Multiple links and punctuation','See ('+dirty+'). Also https://x.com/user/status/123?t=secret!','See ('+clean+'). Also https://x.com/user/status/123!'),
          ('Unrelated site unchanged','https://example.com/path?a=1&s=2&t=3','https://example.com/path?a=1&s=2&t=3'),
          ('Lookalike unchanged','https://x.com.evil.test/user/status/123?s=20','https://x.com.evil.test/user/status/123?s=20'),
          ('Search query unchanged','https://x.com/search?q=hello%20world&f=live','https://x.com/search?q=hello%20world&f=live'),
          ('Non-URL unchanged','hello a=1&s=20','hello a=1&s=20'),
          ('Clean URL unchanged',clean,clean)]
        for name,text,expected in cases:check(name,copy(text),expected)
        toggle('cleanCopiedLinks');check('Feature off',copy(dirty),dirty)
        m.navigate(url);time.sleep(.5);check('Off survives reload',copy(dirty),dirty)
        toggle('cleanCopiedLinks');check('On without reload',copy(dirty),clean)
        toggle('enabled');check('Extension off',copy(dirty),dirty);toggle('enabled')
        copy('', 'image');m.set_context('chrome')
        check('Image copy preserved',m.execute_script('const t=Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);t.init(null);t.addDataFlavor("application/x-moz-nativeimage");Services.clipboard.getData(t,Services.clipboard.kGlobalClipboard);const d={};t.getTransferData("application/x-moz-nativeimage",d);const i=d.value.QueryInterface(Ci.imgIContainer);return [i.width,i.height];'),[2,2]);m.set_context('content')
        m.switch_to_window(settings);(a.output/'options.png').write_bytes(base64.b64decode(m.screenshot()))
    finally:
        report={'scope':'Real extension and real clipboard in isolated Gecko, local fixture','checks':checks};(a.output/'results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
        if m:m.cleanup()
        server.shutdown()
