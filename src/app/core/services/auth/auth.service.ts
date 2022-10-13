import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constant } from '../../Constant';
import { ApiReturn } from '../../../shared/models/global.model';
import { LoginModel, ChangePasswordDto } from '../../../shared/models/auth.model';
import { Router, NavigationStart } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Cache} from '../../../core/lib/cache';
import { CacheService } from "~/app/core/services/auth/cache.service";
import { AvatarDto } from '../../../shared/models/users.model';
import { UsersDto } from '~/app/shared/models/users.model';
import { cloneObject } from '~/app/shared/helper/object/clone.object';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  apiUrl = environment.backEndApiURL;

  constructor( 
    private http: HttpClient, 
    public routerService: Router, 
    public toast: ToastrService, 
    public translate: TranslateService
    ,private cache: CacheService,) { 
  }

  userLogin(data: LoginModel){
    const url = this.apiUrl.concat(Constant.AUTH_USER_LOGIN);
    return this.http.post(url, data);
  }

  changePassword(data: ChangePasswordDto){
    const url = this.apiUrl.concat(Constant.AUTH_USER_CHANGE_PASSWORD);
    return this.http.post(url, data);
  }

  account(){
		const url = this.apiUrl.concat(Constant.AUTH_USER_INFO);
		return this.http.get<any>(url);
	}

  changeAvatar(userId: string, file: File) {
    let headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': "Bearer " + this.cache.getWithExpiry("token")
    });
    let formData: FormData = new FormData(); 

    formData.append('file', file);
    formData.append('avatarID', userId);
    const url = this.apiUrl.concat(Constant.AUTH_USER_CHANGE_AVATA);
    return this.http.post(url, formData, {headers: headers});
  }

  Update(req: UsersDto){
		const url = this.apiUrl.concat(Constant.AUTH_USER_CHANGE_PROFILE);
        let dataRequest = cloneObject(req)
		return this.http.post<any>(url, dataRequest);
	}

  setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: (now.getTime() + ttl),
    };
    window.localStorage.setItem(key, JSON.stringify(item));
  }
  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  redirectToLoginPage(){
    this.toast.error(this.translate.instant('auth_out-of-session'));
    this.routerService.navigate(['auth'], {});
  }

  checkValidToken(){
    const url = this.apiUrl.concat(Constant.AUTH_USER_CHECK);
    return this.http.get(url);
  }

  checkToken(){
    this.setURL();
    let token  = this.getWithExpiry("token");
    if (!token) {
      this.redirectToLoginPage()
    } else {
      this.checkValidToken().subscribe(rs => {
        let result = rs as ApiReturn;
        if (result.code == 401){
          localStorage.removeItem("token");
          this.redirectToLoginPage();
        }
      }, error => {
        if (error.status == 401){
          localStorage.removeItem("token");
          this.redirectToLoginPage();
        }
      })
    }
  }

  setURL()
  {
    const currentUrl = this.routerService.url;
    let urlPath = null;
    if(currentUrl != null)
      urlPath = currentUrl;
    else
      urlPath = location.href;
      
    this.setWithExpiry("url", urlPath, 3600 * 1000);
  }

  loadUrl(){
    var url = this.getWithExpiry("url");
    if(url == undefined || url == null || url == "" )
    {
      this.routerService.navigate(['home']);
    }
    else
    {
      this.routerService.navigate([url]);
    }
  }
  
	checkMenu(menuCode: string){
		const url = this.apiUrl.concat(Constant.Listmenu) + "/checkMenusByUserId?menuCode=" + menuCode;
		return this.http.get(url)
		.subscribe((res: any) => {
			if(res.code == 0 || res.data == null || res.data == false)
			{
        this.toast.error(this.translate.instant('permission_deny'));
        this.routerService.navigate(['404'], {});
			}
		  }, error => {
			console.log(error)
			this.toast.error(this.translate.instant('global_error_fail'));
		  });
	}
}
