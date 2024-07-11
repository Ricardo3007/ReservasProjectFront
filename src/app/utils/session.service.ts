import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageItems } from '../enums/localstorage.enum';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


    constructor(private router:Router) { }

    setSesion(loginData: any) {
        if (loginData == null) {
            return;
        }
        this.setTokens(loginData);
    }

    setTokens(token: string) {
        if(token) {
            localStorage.setItem(LocalStorageItems.TOKEN, this.encode(token));
        }
    }

    limpiarSesion() {
        localStorage.removeItem(LocalStorageItems.TOKEN);
    }

    sesionActiva(): boolean {
        let tokenLocal = localStorage.getItem(LocalStorageItems.TOKEN);
        if (tokenLocal == null ) {
            return false;
        }
        return true;
    }

    token(): string {
        let token = localStorage.getItem(LocalStorageItems.TOKEN);
        if (token == null) {
            return "";
        }
        return this.decode(token);
    }




    private encode(value: any): string {
        return btoa(value);
    }

    private decode(value: any): string {
        return atob(value);
    }
}
