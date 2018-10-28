import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer} from '@angular/cdk/overlay';
import * as $ from 'jquery';
@Component({
    selector: 'bmanga',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        public overlayContainer: OverlayContainer
    ){}
    @HostBinding('class') componentCssClass;

    public changeTheme: boolean = false;
    private static subTitleBar: string = "";
    get SubTitleBar(){
        return AppComponent.subTitleBar;
    }
    static set SubTitleBar(value: string){
        this.subTitleBar = value;
    }
    eventChangeTheme(event: any): void{
        let theme = this.changeTheme ? 'dark-theme' : 'light-theme';
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.setLetterColor(theme);
        localStorage.setItem('theme', theme);
    }
    ngOnInit(): void{
        $("body, html").on('contextmenu', function(){
            return false;
        });
        let theme = localStorage.getItem('theme') || 'light-theme';
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.setLetterColor(theme);
    }
    setLetterColor(theme: string): void{
        setTimeout(() => {
            switch(theme){
                case "light-theme":{
                    $(".title-static").css("color", "#363636");
                    $("body").css("background-color", "#efefef");
                    $("meta[name='theme-color']").attr("content", "#efefef");
                    this.changeTheme = false;
                    break;
                }
                case "dark-theme":{
                    $(".title-static").css("color", "white");
                    $("body").css("background-color", "#393939");
                    $("meta[name='theme-color']").attr("content", "#393939");
                    this.changeTheme = true;
                    break;
                }
            }
        }, 1);
    }
}
