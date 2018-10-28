import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
    constructor() { }
    public valueWidthImage: number = 0;
    public static _close: Function;
    public static _val: Function;
    private static _vwi: number = 0;
    static setVal(val){
        ConfigComponent._vwi = val;
    }
    big(){
        $(".view").animate({
            'width':this.valueWidthImage + "%"
        }, "slow");
        ConfigComponent._val(this.valueWidthImage);
    }
    ngOnInit(){
        this.valueWidthImage = ConfigComponent._vwi;
    }
    restaurar(){
        $(".view").css({
            'width': "100%"
        });
        localStorage.removeItem('vwi');
        ConfigComponent._val(100);
        ConfigComponent._close();
    }
}
