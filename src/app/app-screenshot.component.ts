import { Component } from '@angular/core';
import { PortalScreenshotService } from './portal-screenshot.service';

@Component({
  selector: 'app-screenshot',
  template: `
    <button (click)="capture()">Capture Screenshot</button>
    <button (click)="captureWithWebP()">Capture Screenshot (WebP)</button>
  `,
  standalone: true
})
export class ScreenshotComponent {
  constructor(private screenshotService: PortalScreenshotService) {}

  capture() {
    const cropHeight = 30; // Pixels to crop from the top
    const imageFormat = 'jpeg';
    const imageQuality = 0.8; // Quality between 0 and 1
    this.screenshotService.captureScreenshot(cropHeight, imageFormat, imageQuality);
  }

  captureWithWebP() {
    const cropHeight = 24; // Pixels to crop from the top
    const imageFormat = 'webp';
    const imageQuality = 0.96; // Quality between 0 and 1
    this.screenshotService.captureScreenshot(cropHeight, imageFormat, imageQuality);
  }
}
