import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Respuesta, Usuario } from '../interfaces/interfaces';
import { Globals } from './global.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    iniciarSesion(data: ILogin): Promise<Respuesta>{
        return new Promise<Respuesta>((rs, rj) => {
            this.http.post<Respuesta>(`${this.globals.PATH}auth/login`, data)
            .subscribe(r => rs(r), e => rj(e));
        });
    }
    validateToken(): Observable<Usuario>{
        return this.http.get<Usuario>(`${this.globals.PATH}auth/validate`);
    }
    /**@deprecated */
    registrar(): Promise<Respuesta>{
        return null;
    }
}

export interface ILogin {
    usernick: string,
    pass: string
}
