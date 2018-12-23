import { Component, OnInit } from '@angular/core';
import { Libro } from '../../interfaces/libro';
import { Includes } from '../../utils/Includes';
import { LibrosService } from '../../services/libros.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material';
import * as $ from 'jquery';

@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.scss'],
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
export class BuscarComponent implements OnInit {
    constructor(
        private librosProvider: LibrosService,
        private includes: Includes
    ) { }
    public search: string;
    public inOffert: any = {};
    public control = new FormControl();
    public data: Array<Libro> = [];
    public filteredOptions: Observable<any>;
    public isAllLoaded: boolean = false;
    public errorData: boolean = false;
    public selected: string;
    public pageEvent: PageEvent;
    public pageSizeOptions: number[] = [8, 16, 64, 100];

    public arrayImages: any[] = [];
    
    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
    getData(): Array<Libro>{
        let d = this.data;
        let nArr: Array<any> = [];
        if(this.pageEvent)
            for(let i = (this.pageEvent.pageIndex * this.pageEvent.pageSize), j = 0; i < (this.pageEvent.pageIndex * this.pageEvent.pageSize) + this.pageEvent.pageSize; i++, j++)
                if(d[i]) nArr[j] = d[i];
                else break;
        else for(let i = 0, j = 0; i <  8; i++, j++) nArr[j] = d[i];
        return nArr;
    }
    ngOnInit(){
        $("body, html").on('contextmenu', function(){
            return false;
        });
        $("title").text('Buscar manga en BMANGA');
        this.filteredOptions = this.control.valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filter(value) : this.data.slice())
        );
        this.librosProvider.obtener(false).subscribe(r => {
            this.data = r;
            r.forEach(el => {
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
            this.isAllLoaded = true;
        }, () => {
            this.errorData = true;
            this.isAllLoaded = true;
        });
    }
    private _filter(value: string): Libro[] {
        const filterValue = value.toLowerCase();
        return this.data.filter(option => option.book_name.toLowerCase().includes(filterValue));
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
    change(): void{
        this.search = this.selected;
        let nArr;
        this.data.forEach(el => {
            if(el.book_name == this.search) nArr = el;
        });
        this.inOffert = nArr;
    }
    reduce(str: string, n: number): string{
        if(str == undefined) return "Recurso no recuperado.";
        if(str.length <= n) return str;
        else return str.slice(0, n - 1) + "...";
    }
}
