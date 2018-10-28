import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class Includes {
    constructor(
        private snack: MatSnackBar
    ){
        Includes.snackBarInstance = this.snack;
    }
    static snackBarInstance: MatSnackBar;
    static makeSnack(txt: string, t?: number): void{
        this.snackBarInstance.open(txt, null, { duration: t || 1500 });
    }
    static saveErrorLog(error: any): void{
        sessionStorage.setItem('logger', JSON.stringify(error));
    }
    static shortName(txt: string, n?: number): string{
        let num: number = n || 11;
        if(txt.length <= num) return txt;
        return txt.slice(0, num - 1).concat("...");
    }
}