import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModel, LoginReponseModel } from '../../shared/models/auth.model';
import { ApiReturn } from '../../shared/models/global.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Cache } from '../../core/lib/cache';
import { en_US, vi_VN, NzI18nService } from 'ng-zorro-antd/i18n';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isPageLoading: boolean = true;
  //form login
  loginForm: LoginModel;
  loginFormGroup: FormGroup;
  loginData: LoginModel;
  token: string;
  //disable login
  isDisabledLogin: boolean = false;

  isShowLoading: boolean = false;

  constructor(
    public authService: AuthService,
    public toast: ToastrService,
    public routerService: Router,
    public translate: TranslateService,
    private i18n: NzI18nService
  ) { }

  ngOnInit() {
    this.isPageLoading = false;
    this.checkLang();
    Cache.deleteCacheUser();
    this.loginForm = new LoginModel;
    this.loginFormGroup = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(null)
    });
    this.token = this.authService.getWithExpiry("token");
    if (this.token) this.routerService.navigate(['/home']);
  }

  get username() {
    return this.loginFormGroup.get('username');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }

  //login & disabled login
  submitLogin() {
    try {
      const form = this.loginFormGroup.value;
      this.isShowLoading = true;
      this.loginData = {
        username: form.username,
        password: form.password
      }

      var statusTag = document.getElementById("loginStatus") as HTMLElement;
      statusTag.innerHTML = "";

      this.authService.userLogin(this.loginData).subscribe(rs => {
        this.isShowLoading = false;
        let result = rs as ApiReturn;

        if (result.code == 1) {
          let data = result.data as LoginReponseModel;
          let info = this.parseJwt(data.accessToken);

          if (info != null) {
            this.toast.success(this.translate.instant('auth_login-success'));
            Cache.cache("username", info.userFullname);
            Cache.cache("userId", info.sub);
            this.authService.setWithExpiry("token", data.accessToken, info.exp);
            this.authService.loadUrl();
          }
        }
        else {
          this.toast.warning(this.translate.instant('auth_incorrect-user-pass'));
        }
      }, error => {
        this.isShowLoading = false;
        if (error.code == 401) {
          this.toast.warning(this.translate.instant('auth_incorrect-user-pass'));
        } else {
          this.toast.error(this.translate.instant('error_system'));
        }
      })
    } catch (error) {
      throw new Error(error);
    }
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  //change language
  changeLanguage() {
    let langCode = localStorage.getItem("lang");
    let currentLang = document.getElementById("languageToggle") as HTMLAnchorElement;
    if (langCode === "vi") {
      currentLang.classList.remove("langVN");
      currentLang.classList.add("langEN");
      this.translate.use("en");
      localStorage.setItem("lang", "en");
      this.i18n.setLocale(en_US);
    } else {
      currentLang.classList.add("langVN");
      currentLang.classList.remove("langEN");
      this.translate.use("vi");
      localStorage.setItem("lang", "vi");
      this.i18n.setLocale(vi_VN);
    }
  }

  checkLang() {
    let langCode = localStorage.getItem("lang");
    if (langCode == null) {
      langCode = "vi";
      localStorage.setItem("lang", "vi");
      this.translate.use("vi");
      this.i18n.setLocale(vi_VN);
    }
    let currentLang = document.getElementById("languageToggle") as HTMLAnchorElement;
    if (langCode === "vi") {
      currentLang.classList.remove("langEN");
      currentLang.classList.add("langVN");
      this.translate.use("vi");
      this.i18n.setLocale(vi_VN);
    } else {
      currentLang.classList.add("langEN");
      currentLang.classList.remove("langVN");
      this.translate.use("en");
      this.i18n.setLocale(en_US);
    }
  }
}
