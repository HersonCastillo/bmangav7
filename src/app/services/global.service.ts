import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class Globals {
    constructor() { }
    private _API_PATH_PRO = "/";
    private _API_PATH_DEV = "http://localhost:8081/";

    public get PATH(){
        if(environment.production) return this._API_PATH_PRO;
        return this._API_PATH_DEV;
    }
}
