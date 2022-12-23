import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'VNPT';
  isCollapsed = false;
  showSidebar: boolean = false;
  showNavbar: boolean = false;
  showFooter: boolean = false;
  isLoading: boolean;

  constructor(
    private router: Router, 
    // public translate: TranslateService, 
    private ref: ChangeDetectorRef) 
  {
    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
   
    this.showSidebar = false;
    this.showNavbar = false;
    this.showFooter = false;
    
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        if(event['url'] == '/' || (event['url'].indexOf('auth') >= 0) || (event['url'].indexOf('error') >= 0) || (event['url'].indexOf('404') >= 0) || (event['url'].indexOf('error-pages/500') >= 0)|| (event['url'].indexOf('404-not-found') >= 0)) {        
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
          document.querySelector('.main-container').classList.remove('main-wrapper');
          document.querySelector('.main-container').classList.add('main-wrapper-none');
        }
        else
        {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;
          document.querySelector('.main-container').classList.add('main-wrapper');
          document.querySelector('.main-container').classList.remove('main-wrapper-none');
        }
        this.ref.detectChanges();
      }
    });
    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
          this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
  }
  overlaySidebar()
  {
    var sidebar = document.getElementById('sidebar') as HTMLElement;
    var overlay = document.getElementById('overlay-common') as HTMLElement;
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  }

  clickCollapsed($event)
  {
    this.isCollapsed = $event;
  }
}
