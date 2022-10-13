import { SettingDto } from './../../../shared/models/setting.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from '../../Constant';
import { AuthService } from '../auth/auth.service';
import { cloneObject } from '~/app/shared/helper/object/clone.object';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
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
    Setting(page: number, limit: number, search: string, sort: string){
		const url = this.apiUrl.concat(Constant.Setting) + "?page=" + page + "&limit=" + limit + "&search=" + search + "&sort=" + sort;
		return this.http.get<any>(url);
	}
    GetOne(id: string){
		const url = this.apiUrl.concat(Constant.Setting) + "/" + id;
		return this.http.get<any>(url);
	}
	
    Create(req: SettingDto){
		const url = this.apiUrl.concat(Constant.Setting);
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: SettingDto){
		const url = this.apiUrl.concat(Constant.Setting) + "/" + id;
        let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string){
		const url = this.apiUrl.concat(Constant.Setting) + "/" + id;
        let dataRequest = cloneObject({ id: id})
		return this.http.delete<any>(url, dataRequest);
	}
  
}
