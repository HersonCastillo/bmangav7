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
        return this.http.get<Respuesta>(`${this.globals.PATH}api/public/index`)
            .pipe(map(d => d), tap(list => this.indexValues = list));
    }
    public saveImage(file: File): Observable<Respuesta>{
        let data = new FormData();
        data.append('image', file);
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/capitulo/images`, data);
    }
    public async saveImage2(file: File): Promise<Respuesta>{
        let data = new FormData();
        data.append('image', file);
        const r = await this.http.post<Respuesta>(`${this.globals.PATH}api/private/capitulo/images`, data).toPromise();
        return r;
    }
    public eliminarImagenes(images: string[]): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/capitulo/images/del`, {
            images: images
        });
    }
    /*public updateImage(file: File, idkey: string): Observable<Respuesta>{
        let data = new FormData();
        data.append('image', file);
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/capitulo/image/update?idkey=${idkey}`, data);
    }
    public getImage(code: string): Observable<Respuesta>{
        return this.http.get<Respuesta>(`${this.globals.PATH}api/public/capitulos/image/${code}`);
    }*/
    public crear(val: Capitulo): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/private/capitulo`, val);
    }
    public editar(val: Capitulo): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/private/capitulo`, val);
    }
    public eliminar(_id: string): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/private/capitulo/${_id}`);
    }
    public listar(): Observable<Capitulo[]>{
        return this.http.get<Capitulo[]>(`${this.globals.PATH}api/private/capitulo`);
    }
}
