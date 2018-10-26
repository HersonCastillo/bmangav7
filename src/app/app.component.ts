import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer} from '@angular/cdk/overlay';
import * as $ from 'jquery';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        public overlayContainer: OverlayContainer
    ){}
    @HostBinding('class') componentCssClass;

    public changeTheme: boolean = false;

    eventChangeTheme(event: any): void{
        let theme = this.changeTheme ? 'dark-theme' : 'light-theme';
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.setLetterColor(theme);
    }
    ngOnInit(): void{
        let theme = 'light-theme';
        this.overlayContainer.getContainerElement().classList.add(theme);
        this.componentCssClass = theme;
        this.setLetterColor(theme);
    }
    setLetterColor(theme: string): void{
        setTimeout(() => {
            switch(theme){
                case "light-theme":{
                    $(".title-static").css("color", "#363636");
                    break;
                }
                case "dark-theme":{
                    $(".title-static").css("color", "white");
                    break;
                }
            }
        }, 1);
    }
}
