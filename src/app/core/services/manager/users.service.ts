import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UsersDto, UsersImportDto } from '~/app/shared/models/users.model';
import { cloneObject } from '~/app/shared/helper/object/clone.object';
import { AuthService } from '~/app/core/services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})

export class UsersService {
	 
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
    Users(page: number, limit: number, search: string, custId: string, sort: string){
		const url = this.apiUrl.concat(Constant.Users) + "?page=" + page + "&limit=" + limit + "&search=" + search + "&custId=" + custId + "&sort=" + sort;
		console.log(url);
		return this.http.get<any>(url);
	}

    ListByCustId(custId: string){
		const url = this.apiUrl.concat(Constant.Users) + "/listByCustId?custId=" + custId;
		return this.http.get<any>(url);
	}
	
	GetOne(id: string){
		const url = this.apiUrl.concat(Constant.Users) + "/" + id;
		return this.http.get<any>(url);
	}

    Create(req: UsersDto){
		const url = this.apiUrl.concat(Constant.Users) + "/create";
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: UsersDto){
		const url = this.apiUrl.concat(Constant.Users)+ "/" + id;;
        let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string){
		const url = this.apiUrl.concat(Constant.Users) + "/" + id;
        let dataRequest = cloneObject({ id: id})
		return this.http.delete<any>(url, dataRequest);
	}

	Exist(req: UsersImportDto[]){
		const url = this.apiUrl.concat(Constant.Users) + "/checkExist";
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}
	
	Import(req: UsersImportDto[]){
		const url = this.apiUrl.concat(Constant.Users) + "/import";
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}
}
