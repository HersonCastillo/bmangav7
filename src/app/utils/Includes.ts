import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SimpleComponent } from '../modals/simple/simple.component';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class Includes {
    constructor(
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private router: Router
    ){}
    static saveErrorLog(error: any): void{
        sessionStorage.setItem('logger', JSON.stringify(error));
    }
    static shortName(txt: string, n?: number): string{
        let num: number = n || 11;
        if(txt.length <= num) return txt;
        return txt.slice(0, num - 1).concat("...");
    }
    makeSnack(txt: string, t?: number): void{
        this.snack.open(txt, null, { duration: t || 1500 });
    }
    simple(title: string, message: string): void{
        SimpleComponent.title = title;
        SimpleComponent.message = message;
        SimpleComponent.close = () => {
            this.dialog.closeAll();
        }
        this.dialog.open(SimpleComponent);
    }
    goTo(path: string[]): void{
        this.router.navigate(path);
    }
    static views(type_id: number): string{
        switch(type_id){
            case 1: return "@admin";
            case 2: return "@me";
            default: return "error";
        }
    }
}