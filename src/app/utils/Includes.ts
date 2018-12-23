import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SimpleComponent } from '../modals/simple/simple.component';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../modals/confirm/confirm.component';
@Injectable({
    providedIn: 'root'
})
export class Includes {
    constructor(
        private snack: MatSnackBar,
        private dialog: MatDialog,
        private router: Router
    ){}
    private static _URL_SITE = "http://localhost:4200/";
    static get URL_SITE(){
        return this._URL_SITE;
    }
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
    confirm(title: string, message: string, fs: Function, fe?: Function): void{
        ConfirmComponent.title = title;
        ConfirmComponent.message = message;
        ConfirmComponent.confirm = () => {
            fs();
            this.dialog.closeAll();
        };
        if(fe) ConfirmComponent.close = () => {
            fe();
            this.dialog.closeAll();
        }
        else ConfirmComponent.close = () => this.dialog.closeAll();
        this.dialog.open(ConfirmComponent);
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
    static getStatus(driv: string) : string{
        switch(driv){
            case 'A': return "Activo";
            case 'F': return "Finalizado";
            case 'D': return "Abandonado";
            case 'I': return "Irregular";
            case 'P': return "Pausa indefinida";
            default: return "Desconocido";
        }
    }
    static requestImage(imageName: string): boolean{
        let reg: string = 'coverid-';
        return imageName.includes(reg) && imageName.indexOf(reg) == 0;
    }
    static processImage(imageName: string, blob: any): string {
        let extension = imageName.split('-')[2];
        return `data:image/${extension};base64,${blob}`;
    }
    static copy(data: any): boolean {
        try{
            var aux = document.createElement("input");
            aux.setAttribute("value", data);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
            return true;
        }catch(ex){
            return false;
        }
    }
}