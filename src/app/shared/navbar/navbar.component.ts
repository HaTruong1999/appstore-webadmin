import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { en_US, vi_VN, NzI18nService } from 'ng-zorro-antd/i18n';
import { Cache } from '../../core/lib/cache';
import { UsersService } from '~/app/core/services/manager/users.service';
import { AuthService } from '~/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '~/environments/environment';
const apiUrl = environment.backEndApiURL;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {

  @Output() onClick = new EventEmitter<any>();

  title: string;
  subTitle: string;
  modalType: string;

  public iconOnlyToggled = false;
  public sidebarToggled = false;

  username: string = Cache.getCache("username");
  userId: string = Cache.getCache("userId");
  avatar: string = "assets/uploads/avatar-default.png";
  messageCount: number = 0;

  constructor(
    config: NgbDropdownConfig,
    public translate: TranslateService,
    public routerService: Router,
    private modal: NzModalService,
    public usersService: UsersService,
    public authService: AuthService,
    public toast: ToastrService,
    private i18n: NzI18nService
  ) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.checkLang();

    this.getData();
  }

  getData() {
    if (this.userId == null) return;
    this.authService.account()
      .subscribe((res: any) => {
        if (res.code == 1) {
          this.username = res.data.userFullname;
          this.avatar = apiUrl + res.data.userAvatar;
        }
        else {
          this.toast.error(this.translate.instant('global_fail'));
        }
      }, error => {
        console.log(error)
        this.toast.error(this.translate.instant('global_error_fail'));
      });
  }

  toggleSidebar() {
    let body = document.querySelector('body');
    var sidebar = document.getElementById('sidebar') as HTMLElement;
    var overlay = document.getElementById('overlay-common') as HTMLElement;
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
    var screenW = window.innerWidth;
    if (screenW > 1100) {
      if (!this.iconOnlyToggled) {
        this.iconOnlyToggled = true;
        this.sidebarToggled = true;
        body.classList.add('sidebar-collapsed');
      } else {
        this.iconOnlyToggled = false;
        this.sidebarToggled = false;
        body.classList.remove('sidebar-collapsed');
      }
    }
    else {
      if (!this.iconOnlyToggled) {
        this.iconOnlyToggled = true;
        this.sidebarToggled = false;
        body.classList.add('sidebar-collapsed');
        sidebar.classList.add("show");
        overlay.classList.add("show");
      } else {
        this.iconOnlyToggled = false;
        this.sidebarToggled = true;
        body.classList.remove('sidebar-collapsed');
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
      }
    }

    this.onClick.emit(this.sidebarToggled);
  }

  logout(): void {
    this.modal.confirm({
      nzTitle: this.translate.instant('auth_logout_confirm'),
      nzOkText: this.translate.instant('global_submit'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.submit(),
      nzCancelText: this.translate.instant('global_cancel'),
    });
  }

  submit() {
    Cache.deleteCacheUser();
    Cache.deleteCacheUrl();
    this.routerService.navigate(['auth/login'], {});
  }

  home() {
    this.routerService.navigate(['home'], {});
  }

  info() {
    this.routerService.navigate(['profile'], {});
  }

  changePassword() {
    this.routerService.navigate(['profile/change-password'], {});
  }

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
