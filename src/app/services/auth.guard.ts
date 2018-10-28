import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { Includes } from '../utils/Includes';
@Injectable({
    providedIn: 'root'
})
export class AuthGuardLogin implements CanActivate {
    constructor(
        private loginProvider: LoginService,
        private includes: Includes
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs) => {
                let token = localStorage.getItem('token');
                if (token == null) rs(true);
                else {
                    this.loginProvider.validateToken().subscribe(r => {
                        if (r) {
                            rs(false);
                            this.includes.goTo([Includes.views(r.type_user)]);
                        } else {
                            rs(true);
                            localStorage.removeItem('token');
                        }
                    }, () => {
                        rs(true);
                        localStorage.removeItem('token');
                    });
                }
            });
        } catch (ex) {
            return new Promise<boolean>((rs) => {
                rs(true);
                localStorage.removeItem('token');
            });
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
    constructor(
        private loginProvider: LoginService,
        private includes: Includes
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs) => {
                let token = localStorage.getItem('token');
                if (token == null) {
                    rs(false);
                    this.includes.goTo(['/login']);
                } else {
                    this.loginProvider.validateToken().subscribe(r => {
                        if(r && r.type_user == 1) rs(true);
                        else {
                            rs(false);
                            this.includes.goTo(['/login']);
                        }
                    }, () => {
                        rs(false);
                            this.includes.goTo(['/login']);
                    });
                }
            });
        } catch (ex) {
            return new Promise<boolean>((rs) => {
                rs(false);
                this.includes.goTo(['/login']);
            });
        }
    }
}


@Injectable({
    providedIn: 'root'
})
export class AuthGuardUser implements CanActivate {
    constructor(
        private loginProvider: LoginService,
        private includes: Includes
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs) => {
                let token = localStorage.getItem('token');
                if (token == null) {
                    rs(false);
                    this.includes.goTo(['/login']);
                } else {
                    this.loginProvider.validateToken().subscribe(r => {
                        if(r && r.type_user == 2) rs(true);
                        else {
                            rs(false);
                            this.includes.goTo(['/login']);
                        }
                    }, () => {
                        rs(false);
                            this.includes.goTo(['/login']);
                    });
                }
            });
        } catch (ex) {
            return new Promise<boolean>((rs) => {
                rs(false);
                this.includes.goTo(['/login']);
            });
        }
    }
}
