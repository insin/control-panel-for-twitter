"""Native-menu E2E check. Requires marionette_driver and a Gecko browser.

Usage: python scripts/e2e-context-menu.py --browser /path/to/zen --output /path/to/results
Loads a temporary copy of the extension with a localhost match. No normal profile is used.
"""
import argparse
import base64
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import shutil
import tempfile
import threading
import time
from marionette_driver.marionette import Marionette
from marionette_driver.addons import Addons
from marionette_driver.by import By

parser = argparse.ArgumentParser()
parser.add_argument('--browser', required=True)
parser.add_argument('--mobile', action='store_true', help='Use an Android user agent; desktop mouse actions do not simulate a phone long press')
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
args.output.mkdir(parents=True, exist_ok=True)
results = []

def check(name, actual, expected=True):
    results.append(dict(name=name, expected=expected, actual=actual, passed=actual == expected))
    assert actual == expected, f'{name}: {actual!r} != {expected!r}'

with tempfile.TemporaryDirectory(prefix='cpft-context-menu-') as tmp:
    tmp = Path(tmp)
    extension = tmp / 'extension'
    extension.mkdir()
    for name in ['content.js', 'script.js', 'background.js', 'options.html', 'options.js', 'options.css', 'options-icon.png', '_locales', 'icons']:
        src = root / name
        if src.is_dir(): shutil.copytree(src, extension / name)
        else: shutil.copy2(src, extension / name)
    (extension / 'browser_action.html').write_text((root / 'options.html').read_text().replace('<body>', '<body class="browserAction">'))
    manifest = json.loads((root / 'manifest.mv2.json').read_text())
    manifest['content_scripts'][0]['matches'].append('http://127.0.0.1/*')
    (extension / 'manifest.json').write_text(json.dumps(manifest))
    site = tmp / 'site'
    site.mkdir()
    (site / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<title>Native image menu E2E</title><style>body{font:22px sans-serif;padding:30px}img{width:220px;height:180px;image-rendering:pixelated}</style>
<h1>Native image menu test</h1><p id="text">Text selection remains available.</p>
<img id="photo" src="photo.png"><p>Right-click the image to copy its pixels.</p>
<script>
window.siteMenus = 0; window.imageClicks = 0;
const cancel = e => { window.siteMenus++; e.preventDefault(); };
window.addEventListener('contextmenu', cancel, true);
document.addEventListener('contextmenu', cancel, true);
document.getElementById('photo').oncontextmenu = cancel;
document.getElementById('photo').onclick = () => window.imageClicks++;
</script></html>''')
    # A tiny valid PNG, generated independently of the extension.
    import struct, zlib
    def chunk(kind, data):
        return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)
    (site / 'photo.png').write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', 2, 2, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(b'\0\xff\0\0\0\xff\0\0\0\0\xff\xff\xff\0')) + chunk(b'IEND', b''))
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(SimpleHTTPRequestHandler, directory=str(site)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    page = f'http://127.0.0.1:{server.server_port}/'
    m = None
    try:
        m = Marionette(bin=args.browser, app='fxdesktop', headless=True, port=2839,
            app_args=['-no-remote', '--remote-allow-system-access'], workspace=str(tmp),
            gecko_log=str(args.output / 'browser.log'),
            prefs={'zen.welcome-screen.seen': True, 'browser.shell.checkDefaultBrowser': False})
        m.start_session()
        if args.mobile:
            m.set_context('chrome')
            m.execute_script('Services.prefs.setCharPref("general.useragent.override", "Mozilla/5.0 (Android 15; Mobile; rv:145.0) Gecko/145.0 Firefox/145.0")')
            m.set_context('content')
            m.set_window_rect(width=800, height=1000)
        addon_id = Addons(m).install(str(extension), temp=True)
        m.set_context('chrome')
        options_url = m.execute_async_script('''const done = arguments[arguments.length - 1];
          const {AddonManager} = ChromeUtils.importESModule('resource://gre/modules/AddonManager.sys.mjs');
          AddonManager.getAddonByID(arguments[0]).then(a => done(a.optionsURL));''', script_args=[addon_id])
        m.set_context('content')
        m.navigate(page)
        time.sleep(1)
        page_handle = m.current_window_handle
        m.open(type='tab', focus=True)
        time.sleep(0.5)
        options_handle = next(h for h in m.window_handles if h != page_handle)
        m.switch_to_window(options_handle)
        m.navigate(options_url)
        time.sleep(0.5)
        check('Option is enabled by default', m.find_element(By.CSS_SELECTOR, '[name=restoreNativeContextMenu]').is_selected())
        check('Option has a label', m.find_element(By.ID, 'restoreNativeContextMenuLabel').text, 'Restore native browser right-click menu')
        def toggle(name):
            m.switch_to_window(options_handle)
            m.find_element(By.CSS_SELECTOR, f'[name={name}]').click()
            time.sleep(0.3)
            m.switch_to_window(page_handle)
            time.sleep(0.2)
        def right_click(selector='#photo'):
            m.set_context('content')
            m.switch_to_window(page_handle)
            el = m.find_element(By.CSS_SELECTOR, selector)
            m.actions.sequence('pointer', 'mouse').pointer_move(0, 0, origin=el).pointer_down(button=2).pointer_up(button=2).perform()
            time.sleep(0.3)
            m.set_context('chrome')
            return m.execute_script('return document.getElementById("contentAreaContextMenu").state')
        def close_menu():
            m.execute_script('document.getElementById("contentAreaContextMenu").hidePopup()')
            m.set_context('content')
        check('Native menu opens on image', right_click(), 'open')
        check('Copy Image command is available', m.execute_script('const e=document.getElementById("context-copyimage-contents");return !!e && !e.hidden && !e.disabled'))
        m.execute_script('document.getElementById("context-copyimage-contents").doCommand()')
        time.sleep(0.5)
        check('Copy Image puts image data on clipboard', m.execute_script('const t = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable); t.init(null); t.addDataFlavor("application/x-moz-nativeimage"); Services.clipboard.getData(t, Services.clipboard.kGlobalClipboard); const d={}; t.getTransferData("application/x-moz-nativeimage",d); const img=d.value.QueryInterface(Ci.imgIContainer); return img.width === 2 && img.height === 2'))
        close_menu()
        check('Site context handlers were bypassed', m.execute_script('return window.wrappedJSObject.siteMenus'), 0)
        m.find_element(By.ID, 'photo').click()
        check('Normal image clicks still work', m.execute_script('return window.wrappedJSObject.imageClicks'), 1)
        toggle('restoreNativeContextMenu')
        check('Feature off restores site menu', right_click(), 'closed')
        close_menu()
        check('Site handlers run when feature is off', m.execute_script('return window.wrappedJSObject.siteMenus > 0'))
        m.navigate(page)
        time.sleep(0.7)
        check('Disabled setting survives reload', right_click(), 'closed')
        close_menu()
        toggle('restoreNativeContextMenu')
        check('Feature can be enabled without reload', right_click(), 'open')
        close_menu()
        toggle('enabled')
        check('Extension off restores site menu', right_click(), 'closed')
        close_menu()
        toggle('enabled')
        m.execute_script('const p=document.getElementById("photo");p.replaceWith(p.cloneNode(true))')
        check('Newly inserted image gets native menu', right_click(), 'open')
        close_menu()
        check('Text gets native menu', right_click('#text'), 'open')
        close_menu()
        m.switch_to_window(options_handle)
        (args.output / 'options.png').write_bytes(base64.b64decode(m.screenshot()))
        m.navigate(options_url.replace('options.html', 'browser_action.html'))
        time.sleep(0.4)
        check('Toolbar popup contains the setting', m.find_element(By.CSS_SELECTOR, '[name=restoreNativeContextMenu]').is_selected())
    finally:
        report = {'browser': m.session_capabilities.get('browserVersion') if m and m.session else None,
            'scope': 'Real extension in isolated headless Gecko; localhost fixture with site context-menu handlers. Live X not tested.', 'mobile_user_agent': args.mobile, 'checks': results}
        (args.output / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps(report, indent=2))
        if m: m.cleanup()
        server.shutdown()
