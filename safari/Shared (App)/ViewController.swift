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

#if os(macOS)
  private var pageLoaded = false
#endif

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
#if os(macOS)
    guard pageLoaded else { return }
    checkExtensionState()
#endif
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
    webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
    pageLoaded = true
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
      let status: String
      if let error = error {
        print("Error:", error.localizedDescription)
        status = "'error'"
      } else if let state = state {
        status = state.isEnabled ? "'on'" : "'off'"
      } else {
        print("State is nil with no error (unexpected)")
        status = "'error'"
      }
      DispatchQueue.main.async {
        self.webView.evaluateJavaScript("show('mac', \(status))")
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
