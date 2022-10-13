import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RolesDto } from '~/app/shared/models/roles.model';
import { cloneObject } from '~/app/shared/helper/object/clone.object';
import { AuthService } from '~/app/core/services/auth/auth.service';

@Injectable({
	providedIn: 'root'
})

export class RolesService {
	 
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
    Roles(page: number, limit: number, search: string, sort: string){
		const url = this.apiUrl.concat(Constant.Roles) + "?page=" + page + "&limit=" + limit + "&search=" + search + "&sort=" + sort;
		return this.http.get<any>(url);
	}

	Select(){
		const url = this.apiUrl.concat(Constant.Roles) + "/select";
		return this.http.get<any>(url);
	}

    GetOne(id: string){
		const url = this.apiUrl.concat(Constant.Roles) + "/" + id;
		return this.http.get<any>(url);
	}
	
    Create(req: RolesDto){
		const url = this.apiUrl.concat(Constant.Roles);
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: RolesDto){
		const url = this.apiUrl.concat(Constant.Roles) + "/" + id;
        let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string){
		const url = this.apiUrl.concat(Constant.Roles) + "/" + id;
        let dataRequest = cloneObject({ id: id})
		return this.http.delete<any>(url, dataRequest);
	}
}
