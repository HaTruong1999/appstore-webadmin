import { Component, OnInit } from '@angular/core';
import {Cache} from '../../core/lib/cache';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  constructor(
    public authService: AuthService, 
    public toast: ToastrService) {
    //this.authService.checkMenu('home');
    this.authService.checkToken();
  }
  ngOnInit() {
  }

}
