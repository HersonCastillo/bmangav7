import { Component } from '@angular/core';
@Component({
    selector: 'app-simple',
    templateUrl: './simple.component.html',
    styleUrls: ['./simple.component.scss']
})
export class SimpleComponent {
    constructor(){}
    private static __title: string;
    private static __message: string;
    private static __close: Function;
    public get title(): string{
        return SimpleComponent.__title;
    }
    public get message(): string{
        return SimpleComponent.__message;
    }
    public static set title(str: string){
        SimpleComponent.__title = str;
    }
    public static set message(str: string){
        SimpleComponent.__message = str;
    }
    public static set close(f: Function){
        SimpleComponent.__close = f;
    }
    closeWindow(): void{
        SimpleComponent.__close();
    }
}
