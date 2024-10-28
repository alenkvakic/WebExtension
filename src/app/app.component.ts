import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ScreenshotComponent} from './app-screenshot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScreenshotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'angular-webextension-screenshot';
}
