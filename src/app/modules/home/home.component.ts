import { Component, OnInit } from '@angular/core';
import { CapitulosService } from '../../services/capitulos.service';
import { Respuesta } from 'src/app/interfaces/respuesta';
import { trigger, transition, style, animate, state } from '@angular/animations';
import * as $ from 'jquery';
import { Includes } from 'src/app/utils/Includes';
import { AppComponent } from 'src/app/app.component';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [trigger('showAndroidMode', [
        state('show', style({
          opacity: 1
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('250ms ease-in'))
    ])]
})
export class HomeComponent implements OnInit {
    constructor(
        private capitulosProvider: CapitulosService
    ) {
        //AppComponent.SubTitleBar = "Últimas actualizaciones";
    }
    public positionTooltip: string = "above";
    public isError: boolean = false;
    public isLoad: boolean = false;
    public indexUpdates: Respuesta;
    ngOnInit(){
        this.capitulosProvider.indexUpdates().then(index => {
            this.indexUpdates = index;
            this.isError = false;
            this.isLoad = true;
        }).catch(error => {
            Includes.saveErrorLog(error);
            this.isError = true;
            this.isLoad = true;
        });
    }
    acortar(txt: string): string{
        return Includes.shortName(txt, 12);
    }
}