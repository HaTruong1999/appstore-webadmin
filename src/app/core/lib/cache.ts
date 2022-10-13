import { Constant } from '../Constant';

export class CacheAll {

    public static COOKIE:number = 1;
    public static SESSION:number = 2;
    public static STORAGE:number = 3;

    public static map = new Map();

    public static getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;
  
        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }
  
    public static deleteCookie(name) {
        this.setCookie(name, '', -1);
    }
  
    public static setCookie(name: string, value: string, expiresTime: number, path: string = '/') {
        let d:Date = new Date();
        d.setTime(d.getTime() + expiresTime);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }

    public static addCache(key:string, value:string,type:number=CacheAll.SESSION,expires:number=24*60*60*1000){
        switch (type) {
            case CacheAll.COOKIE:
                CacheAll.setCookie(key,value,expires);
                break;
            case CacheAll.SESSION:
                sessionStorage.setItem(key,value);
            break;
            case CacheAll.STORAGE:
                    localStorage.setItem(key,value);
                break;
            default:

                break;
        }
    }

    public static getCache(key:string,storage:number=1000):string{
        switch (storage) {
            case CacheAll.COOKIE:
                return CacheAll.getCookie(key);

            case CacheAll.SESSION:
                return sessionStorage.getItem(key);
            
            case CacheAll.STORAGE:
                return localStorage.getItem(key);
            
            default :
                let data:string = sessionStorage.getItem(key);
                if(!data || data ===''){
                    data = localStorage.getItem(key);
                    if(!data || data ===''){
                        data = CacheAll.getCookie(key);
                    }
                }
                return data;
        }
        
    }

    public static deleteCache(key,storage:number=1000){
        switch (storage) {
            case CacheAll.COOKIE:
                CacheAll.deleteCookie(key);
                 break;
            case CacheAll.SESSION:
                 sessionStorage.removeItem(key);
                 break;
            case CacheAll.STORAGE:
                 localStorage.removeItem(key);
                 break;

            default:
                sessionStorage.removeItem(key);
                localStorage.removeItem(key);
                CacheAll.deleteCookie(key);
                
        }
    }
}

export class Cache {
    public static deleteCacheUser(){
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
    }

    public static deleteCacheUrl(){
        localStorage.removeItem("url");
    }

    public static cache(key, value){
        localStorage.setItem(key, value);
    }
    public static getCache(key){
        return localStorage.getItem(key);
    }
}

