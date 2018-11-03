import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../interfaces/libro';
import { Globals } from './global.service';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Respuesta } from '../interfaces/respuesta';
@Injectable({
    providedIn: 'root'
})
export class LibrosService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) {}
    private libros: Libro[] = null;
    public obtener(): Observable<Libro[]>{
        if(this.libros != null) return of(this.libros);
        return this.http.get<Libro[]>(`${this.globals.PATH}api/public/libros`).pipe(map(r => r), tap(list => this.libros = list));
    }
    public saveImage(file: File): Observable<Respuesta>{
        let data = new FormData();
        data.append('image', file);
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/libro/image`, data);
    }
    public guardar(val: Libro): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/libro`, val);
    }
    public editar(val: Libro): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/private/libro`, val);
    }
    public eliminar(val: Libro): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/private/libro/${val._id}`);
    }
}
