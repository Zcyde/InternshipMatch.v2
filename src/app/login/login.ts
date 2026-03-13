import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Login {

  isAdmin = signal<boolean>(false);
  isUser = signal<boolean>(false);

  logout(){
    this.isAdmin.set(false);
    this.isUser.set(false);
  }

}