import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError, first, map, mergeMap } from "rxjs/operators";
import { keysToSnake } from "../convert/camel2Snake.helper";
import { keysToCamelClient } from "../convert/snake2Camel.helper";
import { CacheService } from "~/app/core/services/auth/cache.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';
const TOKEN_HEADER_KEY = "Authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private cache: CacheService,
    private router: Router,
    private toast: ToastrService,
    public translate: TranslateService
  ) {}

  notiMsg = Notification

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // set token header
    const headers = this.getHeader(req);
    const authReq = req.clone({
      headers: new HttpHeaders(
        Object.assign(
          // override default header
          {
            //"Content-Type": "application/json",
            Authorization: "Bearer " + this.cache.getWithExpiry("token"),
          },
          headers
        )
      ),
    });

    return next.handle(authReq).pipe(
      map((res: any) => {
        if (res.body?.code === 0) {
          console.log("error: ", res)
          //this.toast.error(this.translate.instant('error_system'));
        }
        return res;
      }),
      catchError((err)=> this.handleError(err))
    );
  }

  getHeader(req: HttpRequest<any>) {
    let headers = {};
    for (const k of req.headers.keys()) {
      headers[k] = req.headers.get(k);
    }
    return headers;
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error)
  }

  handleBodyFromCamel2Snake(req: HttpRequest<any>) {
    // convert camel to snake case
    const method = req.method.toLowerCase();
    const isContainBody =
      method === "patch" || method === "post" || method === "put";
    if (isContainBody) {
      req = req.clone({
        body: Object.assign({}, keysToSnake(req.body)),
      });
    }
    return req;
  }

  handleBodyFromSnake2Camel(event: HttpEvent<any>) {
    // convert snake to camel case !
    if (
      event instanceof HttpResponse &&
      (event.headers.get("content-type") || "").indexOf("application/json") >
        -1 &&
      event.body.constructor !== Array
    ) {
      // TODO: Temporarily leaving in both snakecase and adding camelcase keys until all of app is updated
      return event.clone({
        body: Object.assign({}, event.body, keysToCamelClient(event.body)),
      });
    }
    return event;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
