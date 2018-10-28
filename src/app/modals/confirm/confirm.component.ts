import { Component } from '@angular/core';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
    constructor(){}
    private static __title: string;
    private static __message: string;
    private static __close: Function;
    private static __confirm: Function;
    public get title(): string{
        return ConfirmComponent.__title;
    }
    public get message(): string{
        return ConfirmComponent.__message;
    }
    public static set title(str: string){
        ConfirmComponent.__title = str;
    }
    public static set message(str: string){
        ConfirmComponent.__message = str;
    }
    public static set close(f: Function){
        ConfirmComponent.__close = f;
    }
    public static set confirm(f: Function){
        ConfirmComponent.__confirm = f;
    }
    cancel(): void{
        ConfirmComponent.__close();
    }
    confirm(): void{
        ConfirmComponent.__confirm();
    }
}
