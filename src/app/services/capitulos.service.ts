import { Injectable } from '@angular/core';
import { Globals } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Respuesta, Capitulo } from '../interfaces/interfaces';
@Injectable({
    providedIn: 'root'
})
export class CapitulosService {
    constructor(
        private globals: Globals,
        private http: HttpClient
    ) {}
    public indexUpdates(): Promise<Respuesta>{
        return new Promise<Respuesta>((rs, rj) => {
            this.http.get<Respuesta>(`${this.globals.PATH}/api/public/index`)
            .subscribe(r => rs(r), e => rj(e));
        });
    }
}
