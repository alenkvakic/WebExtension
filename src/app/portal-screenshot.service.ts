import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortalScreenshotService {
  private extensionInstalled = false;
  private browser: string;

  constructor() {
    this.browser = this.getBrowserInfo();
    this.setupExtensionCommunication();
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;

    if (/chrome|crios|crmo/i.test(userAgent) && !/edge|edgios|edga/i.test(userAgent)) {
      return 'chrome';
    } else if (/firefox|fxios/i.test(userAgent)) {
      return 'firefox';
    } else if (/safari/i.test(userAgent) && !/chrome|crios|crmo|android/i.test(userAgent)) {
      return 'safari';
    } else if (/edg/i.test(userAgent)) {
      return 'edge';
    } else {
      return 'other';
    }
  }

  private setupExtensionCommunication() {
    window.addEventListener('message', this.handleMessageFromExtension.bind(this));

    this.checkIfExtensionInstalled();
  }

  private handleMessageFromExtension(event: MessageEvent) {
    // only accept messages from the extension
    if (event.source !== window) return;

    const message = event.data;

    // --> ignore messages that we sent ourselves
    if (message.type === 'CAPTURE_SCREENSHOT') {
      // This is our own message; ignore it
      return;
    }

    if (message && message.type) {
      switch (message.type) {
        case 'EXTENSION_INSTALLED':
          this.extensionInstalled = true;
          break;

        case 'SCREENSHOT_CAPTURED':
          const screenshotUrl = message.screenshotUrl;
          this.processScreenshot(screenshotUrl);
          break;

        case 'EXTENSION_ERROR':
          console.error('Extension error:', message.error);
          break;

        default:
          console.warn('Unknown message from extension:', message);
      }
    }
  }

  private checkIfExtensionInstalled() {
    window.postMessage({ type: 'CHECK_EXTENSION' }, '*');

    // Set a timeout to check if the extension hasn't responded
    setTimeout(() => {
      if (!this.extensionInstalled) {
        // For the PoC, we're not prompting immediately
        // The user will be prompted when they click the capture button
      }
    }, 1000); // adjust the timeout duration as needed
  }

  private promptExtensionInstallation(  ) {
    let extensionLink = '';

    switch (this.browser) {
      case 'chrome':
      case 'edge':
        extensionLink = 'https://chrome.google.com/webstore/detail/celum-extension-id';
        break;
      case 'firefox':
        extensionLink = 'https://addons.mozilla.org/en-US/firefox/addon/celum-extension-id/';
        break;
      case 'safari':
        extensionLink = 'https://apps.apple.com/app/celum-extension-id';
        break;
      default:
        // Handle other browsers or provide a generic message
        alert('Your browser is not supported. Please use Chrome, Firefox, Edge, or Safari.');
        return;
    }

    // todo: display a user-friendly prompt or modal
    if (
      confirm(
        'To use the screenshot feature, please install our browser extension. Would you like to install it now?'
      )
    ) {
      window.open(extensionLink, '_blank');
    }
  }

  public captureScreenshot(
    cropHeight: number = 0,
    imageFormat: 'jpeg' | 'webp' = 'jpeg',
    imageQuality: number = 0.8
  ) {
    if (!this.extensionInstalled) {
      this.promptExtensionInstallation();
      return;
    }

    window.postMessage(
      {
        type: 'CAPTURE_SCREENSHOT',
        cropHeight: cropHeight,
        imageFormat: imageFormat,
        imageQuality: imageQuality,
      },
      '*'
    );
  }

  private processScreenshot(screenshotUrl: string) {
    // For testing purposes, open the screenshot in a new tab
    const win = window.open();
    win!.document.write(`<img src="${screenshotUrl}" />`);
  }
}
