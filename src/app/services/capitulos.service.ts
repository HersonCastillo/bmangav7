import { Injectable } from '@angular/core';
import { Globals } from './global.service';
import { HttpClient } from '@angular/common/http';
import { Respuesta, Capitulo } from '../interfaces/interfaces';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class CapitulosService {
    constructor(
        private globals: Globals,
        private http: HttpClient
    ) {}
    private indexValues: Respuesta = null;
    public indexUpdates(): Observable<Respuesta>{
        if(this.indexValues != null) return of(this.indexValues);
        return this.http.get<Respuesta>(`${this.globals.PATH}/api/public/index`)
            .pipe(map(d => d), tap(list => this.indexValues = list));
    }
}
