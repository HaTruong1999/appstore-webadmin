import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from "@/env-config.json";
const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken'

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  constructor(private cookieService: CookieService,
              private http: HttpClient) { }

  signOut(): void {
    this.cookieService.deleteAll();
    this.cookieService.delete(TOKEN_KEY, '/admin');
    this.cookieService.delete(TOKEN_KEY, '/user');
    this.cookieService.delete(TOKEN_KEY, '/');
    this.cookieService.delete(REFRESH_KEY, '/admin');
    this.cookieService.delete(REFRESH_KEY, '/user');
    this.cookieService.delete(REFRESH_KEY, '/');
  }

  public saveToken(token: any): void {
    this.cookieService.delete(TOKEN_KEY);
    this.cookieService.delete(REFRESH_KEY)
    this.cookieService.set(TOKEN_KEY, token.token);
    this.cookieService.set(REFRESH_KEY, token.refresh_token);
  }

  public validateToken() {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `Bearer ${this.cookieService.get(TOKEN_KEY)}`
      })
    }
    return this.http.get(`${url}/api/permission/v1/authentication/user/token/validate`, httpOptions)
  }

  public getToken(): string | null {
    return this.cookieService.get(TOKEN_KEY);
  }

  public getNewToken(): any {
    this.cookieService.set('state', 'refreshing')
    const body = { 
      "refresh_token": this.cookieService.get(REFRESH_KEY)
    }
    return this.http.post<any>(`${url}/api/permission/v1/authentication/user/refresh_token`, body)
  }

  public getRefreshToken(): string | null {
    return this.cookieService.get(REFRESH_KEY);
  }

  public getState(): string | null {
    return this.cookieService.get('state')
  }

  public removeState() {
    this.cookieService.delete('state')
  }
  
}
