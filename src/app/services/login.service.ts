import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Respuesta, Usuario } from '../interfaces/interfaces';
import { Globals } from './global.service';
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
            this.http.post<Respuesta>(`${this.globals.PATH}/auth/login`, data)
            .subscribe(r => rs(r), e => rj(e));
        });
    }
    validateToken(): Promise<Respuesta>{
        return new Promise<Respuesta>((rs, rj) => {
            this.http.get<Respuesta>(`${this.globals.PATH}/auth/validate`)
            .subscribe(r => rs(r), e => rj(e));
        });
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
