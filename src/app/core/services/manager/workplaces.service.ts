import { Injectable } from '@angular/core';
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

export class WorkplacesService {

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
	Workplaces(page: number, limit: number, search: string, custId: string, sort: string) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "?page=" + page + "&limit=" + limit + "&search=" + search + "&custId=" + custId + "&sort=" + sort;
		return this.http.get<any>(url);
	}


	GetOne(id: string) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/" + id;
		return this.http.get<any>(url);
	}

	Create(req: UsersDto) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/create";
		let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Update(id: string, req: UsersDto) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/" + id;
		let dataRequest = cloneObject(req)
		return this.http.patch<any>(url, dataRequest);
	}

	Delete(id: string) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/" + id;
		let dataRequest = cloneObject({ id: id })
		return this.http.delete<any>(url, dataRequest);
	}

	Exist(req: UsersImportDto[]) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/checkExist";
		let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

	Import(req: UsersImportDto[]) {
		const url = this.apiUrl.concat(Constant.Workplaces) + "/import";
		let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}
}
