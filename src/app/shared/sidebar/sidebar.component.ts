import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../core/services/nav/nav.service';
import { ApiReturn } from '../../shared/models/global.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() isCollapsed: boolean;

  //menus = [];
  menus = [
    {
      children: null,
      disabled: false,
      icon: "home",
      level: 1,
      open: false,
      selected: true,
      title: "Trang chủ",
      url: "home"
    },
    {
      children: null,
      disabled: false,
      icon: "user",
      level: 1,
      open: false,
      selected: false,
      title: "Quản lí người dùng",
      url: "manager/users"
    },
    {
      children: null,
      disabled: false,
      icon: "appstore",
      level: 1,
      open: false,
      selected: false,
      title: "Quản lí ứng dụng",
      url: "manager/apps"
    },
    {
      children: null,
      disabled: false,
      icon: "block",
      level: 1,
      open: false,
      selected: false,
      title: "Quản lí loại ứng dụng",
      url: "manager/apptypes"
    },
    {
      children: null,
      disabled: false,
      icon: "partition",
      level: 1,
      open: false,
      selected: false,
      title: "Quản lí đơn vị",
      url: "manager/workplaces"
    },
  ];

  constructor(
    private router: Router,
    public navServices: NavService,
    public toast: ToastrService,
    public translate: TranslateService
  ) {

    let current = window.location.pathname.substring(1);
    if (current == "auth/login")
      current = "home";

    // this.navServices.getMenu()
    //   .subscribe((res: any) => {
    //     let result = res as ApiReturn;
    //     if (result.code == 1) {
    //       console.log(result.data);
    //       this.menus = [];
    //       result.data.forEach(item1 => {
    //         let it1 = {
    //           level: 1,
    //           title: item1.menuName,
    //           icon: item1.icon,
    //           open: false,
    //           selected: item1.url == current ? true : false,
    //           disabled: false,
    //           url: item1.url,
    //           children: null
    //         };
    //         if (item1.children != null && item1.children.length > 0) {
    //           it1.children = [];
    //           item1.children.forEach(item2 => {
    //             let it2 = {
    //               level: 2,
    //               title: item2.menuName,
    //               icon: item2.icon,
    //               open: false,
    //               selected: item2.url == current ? true : false,
    //               disabled: false,
    //               url: item2.url,
    //               children: null
    //             };
    //             if (it2.selected == true) {
    //               it1.open = true;
    //             }

    //             if (item2.children != null && item2.children.length > 0) {
    //               it2.children = [];
    //               item2.children.forEach(item3 => {
    //                 let it3 = {
    //                   level: 3,
    //                   title: item3.menuName,
    //                   icon: item3.icon,
    //                   open: false,
    //                   selected: item3.url == current ? true : false,
    //                   disabled: false,
    //                   url: item3.url,
    //                 };
    //                 if (it3.selected == true) {
    //                   it1.open = true;
    //                   it2.open = true;
    //                 }
    //                 it2.children.push(it3);
    //               });
    //             }
    //             it1.children.push(it2);
    //           });
    //         }
    //         this.menus.push(it1);
    //       });
    //       console.log(this.menus);
    //     }
    //   }, error => {
    //     console.log(error)
    //   });
  }

  ngOnInit() {
  }

  menuClick(item) {
    if(item.url != null && item.url != '')
    this.router.navigate([item.url], {});
  }
}
