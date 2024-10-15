import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class StartComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {

    }

}
