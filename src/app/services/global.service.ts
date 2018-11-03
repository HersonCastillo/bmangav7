import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Globals {
    constructor() { }
    //private _PATH = "/";
    private _PATH = "http://localhost:8081/";

    public get PATH(){
        return this._PATH;
    }
}
