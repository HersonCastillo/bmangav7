import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Globals {
    constructor() { }
    //private _PATH = "/";
    private _PATH = "http://localhost:80/";

    public get PATH(){
        return this._PATH;
    }
}
