import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { StatehandlerServiceImpl } from './services/state-handler.service';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet]
})
export class AppComponent {

  title = 'backend';

  constructor() {
    const router = inject(Router);
    const handler = inject(StatehandlerServiceImpl);
    handler.initStateHandler(router);
  }
}
