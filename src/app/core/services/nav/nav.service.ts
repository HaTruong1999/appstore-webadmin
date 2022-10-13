import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NavRequestModel } from '../../../shared/models/nav.model';
import { AuthService } from '../../../core/services/auth/auth.service';


// Menu
export interface Menu {
	url?: string;
	id: string;
	name?: string;
	icon?: string;
	status?: boolean;
	children?: Menu[];
	active: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	token: string;
	apiUrl = environment.backEndApiURL;

	// Collapse Sidebar
	constructor( private http: HttpClient, public authService: AuthService, public router: Router, public toast: ToastrService, public translate: TranslateService) {	 
		this.token = this.authService.getWithExpiry("token");
		if (!this.token) {
		  this.authService.redirectToLoginPage();
		}
	}


	getMenu(){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/listMenusByUserId";
		return this.http.get(url);
	}
}
