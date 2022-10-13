import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ListmenuDto } from '~/app/shared/models/listmenu.model';
import { cloneObject } from '~/app/shared/helper/object/clone.object';
import { AuthService } from '~/app/core/services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})

export class ListmenuService {
	 
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
    Listmenu(page: number, limit: number, search: string){
		const url = this.apiUrl.concat(Constant.Listmenu) + "?page=" + page + "&limit=" + limit + "&search=" + search;
		return this.http.get<any>(url);
	}

	ListmenuRole(){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/listMenus";
		return this.http.get(url);
	}
	
	ListAll(){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/listAllMenus";
		return this.http.get(url);
	 }
	

    GetOne(id: string){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/" + id;
		return this.http.get<any>(url);
	}
	
    Create(req: ListmenuDto){
		const url = this.apiUrl.concat(Constant.Listmenu);
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: ListmenuDto){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/" + id;
        let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/" + id;
        let dataRequest = cloneObject({ id: id})
		return this.http.delete<any>(url, dataRequest);
	}
}
