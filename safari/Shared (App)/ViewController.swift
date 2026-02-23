import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "dev.jbscript.Tweak-New-Twitter.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {
  @IBOutlet var webView: WKWebView!

  override func viewDidLoad() {
    super.viewDidLoad()
    self.webView.navigationDelegate = self
#if os(iOS)
    self.webView.scrollView.isScrollEnabled = false
#endif
    self.webView.configuration.userContentController.add(self, name: "controller")
    self.webView.loadFileURL(
      Bundle.main.url(forResource: "Main", withExtension: "html")!,
      allowingReadAccessTo: Bundle.main.resourceURL!
    )

#if os(macOS)
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appDidBecomeActive),
      name: NSApplication.didBecomeActiveNotification,
      object: nil
    )
#endif
  }

  @objc private func appDidBecomeActive() {
    checkExtensionState()
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
    webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
    webView.evaluateJavaScript("show('mac')")
    checkExtensionState()
#endif
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
    if (message.body as! String == "open-preferences") {
      SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
        guard error == nil else {
          return
        }
      }
    }
#endif
  }

  func checkExtensionState() {
#if os(macOS)
    SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
      guard let state = state, error == nil else {
        return
      }
      DispatchQueue.main.async {
        self.webView.evaluateJavaScript("show('mac', \(state.isEnabled))")
      }
    }
#endif
  }

  deinit {
#if os(macOS)
    NotificationCenter.default.removeObserver(self)
#endif
  }
}
