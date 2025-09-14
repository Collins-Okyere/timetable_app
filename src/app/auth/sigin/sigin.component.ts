import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-sigin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sigin.component.html',
  styleUrl: './sigin.component.css'
})
export class SiginComponent implements OnInit {

  user:any = {};
  showPassword: boolean = false

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
  }

  onSubmit() {
    this.api.fakeSignIn(this.user);
  }

  async movePage(page: string) {
    localStorage.clear();
    localStorage.setItem('alreadyVisited', 'false');
    setTimeout(() => {
      this.router.navigate([`/${page}`]);
    })
  }

}
