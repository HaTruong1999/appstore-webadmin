import { Injectable, OnDestroy } from "@angular/core";
import Swal from 'sweetalert2/dist/sweetalert2.min.js';

@Injectable({
	providedIn: 'root'
})

export class Sweetalert2  {

  constructor() { }
  confirmButtonText = 'ĐỒNG Ý';

  alert(title: string){
    Swal.fire(title);
  }

  success(title: string){
    Swal.fire({
      timer: 3000,
      title: title,
      icon: 'success',
      confirmButtonText: this.confirmButtonText,
    });
  }
  
  error(title: string){
    Swal.fire({
      title: title,
      icon: 'error',
      confirmButtonText: this.confirmButtonText,
    });
  }

  warn(title: string){
    Swal.fire({
      title: title,
      icon: 'warning',
      confirmButtonText: this.confirmButtonText,
    });
  }
}
