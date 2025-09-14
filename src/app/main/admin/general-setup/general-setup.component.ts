import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './general-setup.component.html',
  styleUrl: './general-setup.component.css'
})
export class GeneralSetupComponent {


  constructor() {}

}
