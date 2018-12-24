import { Component, OnInit } from '@angular/core';
import { CapitulosService } from '../../services/capitulos.service';
import { LibrosService } from '../../services/libros.service';
import { Respuesta } from 'src/app/interfaces/respuesta';
import { trigger, transition, style, animate, state } from '@angular/animations';
import * as $ from 'jquery';
import { Includes } from 'src/app/utils/Includes';
import { Libro } from 'src/app/interfaces/libro';
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
    ]), trigger('showDataShared', [
        state('show', style({
          opacity: 1,
          transform: 'scale(1, 1)'
        })),
        state('hide',   style({
          opacity: 0,
          display: 'none',
          transform: 'scale(.95, .95)'
        })),
        transition('show => hide', animate('100ms ease-out')),
        transition('hide => show', animate('200ms ease-in'))
    ])]
})
export class HomeComponent implements OnInit {
    constructor(
        private capitulosProvider: CapitulosService,
        private librosProvider: LibrosService
    ) {}
    public isError: boolean = false;
    public isLoad: boolean = false;
    public indexUpdates: Respuesta;

    public arrayImages: any[] = [];
    public coverImage: string = "";
    ngOnInit(){
        $("title").text("BMANGA");
        this.capitulosProvider.indexUpdates().subscribe(index => {
            this.indexUpdates = index;
            let img = index.random;
            if(Includes.requestImage(img.image)){
                this.librosProvider.getImage(img.image).subscribe(rr => {
                    this.coverImage = Includes.processImage(img.image, rr.success);
                }, () => this.coverImage = "assets/img/error_load_image.png");
            } else this.coverImage = img.image;
            this.covertImages(index.updates);
            this.isError = false;
            this.isLoad = true;
        }, error => {
            Includes.saveErrorLog(error);
            this.isError = true;
            this.isLoad = true;
        });
    }
    covertImages(arr: any[]): void {
        arr.forEach(el => {
            el = <Libro>el._id_book;
            if(Includes.requestImage(el.image)){
                this.librosProvider.getImage(el.image).subscribe(img => {
                    this.arrayImages.push({
                        id: el._id,
                        blob: Includes.processImage(el.image, img.success)
                    });
                }, () => this.arrayImages.push({
                    id: el.image,
                    blob: "assets/img/error_load_image.png"
                }));
            } else this.arrayImages.push({
                id: el._id,
                blob: el.image
            });
        });
    }
    getImage(id: number): string{
        try{
            let response: string = "";
            this.arrayImages.forEach(el => {
                if(el.id == id){
                    response = el.blob;
                    return;
                }
            })
            return response;
        }catch(ex){
            return "assets/img/error_load_image.png";
        }
    }
    acortar(txt: string, n?: number): string{
        if(txt) return Includes.shortName(txt, n || 12);
    }
}