import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AccountsDto } from '~/app/shared/models/accounts.model';
import { cloneObject } from '~/app/shared/helper/object/clone.object';
import { AuthService } from '~/app/core/services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})

export class AccountsService {
	 
	//global config
	apiUrl = environment.backEndApiURL;

	constructor(
		private http: HttpClient, 
		public router: Router, 
		public toast: ToastrService, 
		public authService: AuthService,
		public translate: TranslateService) {	
		let token = this.authService.getWithExpiry("token");
		if (!token) {
		this.authService.redirectToLoginPage();
		}
	}
    Accounts(page: number, limit: number, search: string, custId: string, sort: string){
		const url = this.apiUrl.concat(Constant.Accounts) + "?page=" + page + "&limit=" + limit + "&search=" + search + "&custId=" + custId + "&sort=" + sort;
		return this.http.get<any>(url);
	}

    GetOne(id: string){
		const url = this.apiUrl.concat(Constant.Accounts) + "/" + id;
		return this.http.get<any>(url);
	}
	
    checkPhoneNumber(edit: string, phone: string, phoneOld: string){
		const url = this.apiUrl.concat(Constant.Accounts) + "/checkPhoneNumber?edit=" + edit + "&phone=" + phone + "&phoneOld=" + phoneOld;
		return this.http.get<any>(url);
	}

	checkUsername(edit: string, username: string, usernameOld: string){
		const url = this.apiUrl.concat(Constant.Accounts) + "/checkUsername?edit=" + edit + "&username=" + username + "&usernameOld=" + usernameOld;
		return this.http.get<any>(url);
	}

    Create(req: AccountsDto){
		const url = this.apiUrl.concat(Constant.Accounts);
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: AccountsDto){
		const url = this.apiUrl.concat(Constant.Accounts) + "/" + id;
        let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string){
		const url = this.apiUrl.concat(Constant.Accounts) + "/" + id;
        let dataRequest = cloneObject({ id: id})
		return this.http.delete<any>(url, dataRequest);
	}
}
