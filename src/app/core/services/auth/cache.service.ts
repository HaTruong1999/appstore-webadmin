import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor(){
  }
  public deleteCacheUser() {
    localStorage.removeItem("token");
  }

  public cache(key, value) {
    localStorage.setItem(key, value);
  }
  public getCache(key) {
    return localStorage.getItem(key);
  }

  public getEmployeeFromProfile(){
    const employee = {
      id: null,
      userId: this.getCache('userId'),
      fullname: this.getCache('userName')
    }
    return employee
  }

  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    return item.value;
  }
}
