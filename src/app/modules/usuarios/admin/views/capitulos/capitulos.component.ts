import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapitulosService } from '../../../../../services/capitulos.service';
import { Capitulo, Libro } from '../../../../../interfaces/interfaces';
import { LibrosService } from '../../../../../services/libros.service';
import { Includes } from '../../../../../utils/Includes';
import { PageEvent } from '@angular/material';
@Component({
    selector: 'app-capitulos',
    templateUrl: './capitulos.component.html',
    styleUrls: ['./capitulos.component.scss']
})
export class CapitulosComponent implements OnInit {
    constructor(
        private capituloProvider: CapitulosService,
        private libroProvider: LibrosService,
        private _form: FormBuilder,
        private includes: Includes
    ){}
    public showIsLoad: boolean = false;
    public isLoad: boolean = false;
    public isDeleting: Boolean = false;
    public lengthData: number = 0;
    public capitulos: Capitulo[] = [];
    public libros: Libro[] = [];
    public form: FormGroup;
    public files: File[] = [];
    public countImages: number = 0;
    public pageEvent: PageEvent;
    public pageSize: number = 5;
    private loggerImage: string = "";
    public displayedColumns: string[] = ['libro', 'titulo', 'capitulo', 'fecha', 'opciones'];
    ngOnInit(){
        this.getChapters();
        this.form = this._form.group({
            libro: ["", [Validators.required]],
            titulo: ["", [Validators.maxLength(150)]],
            capitulo: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
            joint: [[], [Validators.maxLength(150)]]
        });
        this.libroProvider.obtener(false).subscribe(r => this.libros = r);
    }
    getChapters(): void{
        this.showIsLoad = true;
        this.capituloProvider.listar().subscribe(r => {
            this.capitulos = r;
            this.lengthData = r.length;
            this.showIsLoad = false;
        }, () => {
            this.showIsLoad = false;
            this.includes.makeSnack("No se pueden listar los capítulos");
        });
    }
    getName(el: Capitulo): string{
        try{
            return el._id_book.book_name;
        }catch(ex){
            return "";
        }
    }
    async saveChapter(){
        if(this.form.valid){
            if(this.files.length > 0){
                this.isLoad = true;
                this.showIsLoad = true;
                let groups: string[] = this.getJointGroups(this.form.value.joint);
                let storage: string[] = [];
                for(let image of this.files){
                    await this.guardarImagen(image);
                    this.countImages++;
                    if(this.loggerImage.length > 0){
                        storage.push(this.loggerImage);
                        this.loggerImage = "";
                    }
                }
                this.countImages = 0;
                this.showIsLoad = false;
                this.capituloProvider.crear({
                    _id_book: this.form.value.libro,
                    chapter: this.form.value.capitulo,
                    storage: storage,
                    joint: groups,
                    views: 0
                }).subscribe(r => {
                    this.loggerImage = "";
                    this.isLoad = false;
                    if(r.success){
                        this.includes.simple("¡Bien!", r.success || "El capítulo se guardó.");
                        this.getChapters();
                        this.form.reset();
                    } else {
                        this.includes.simple("¡Mal!", r.error || "El capítulo no se pudo guardar.");
                        this.includes.makeSnack("Verifica los datos ingresado");
                        this.capituloProvider.eliminarImagenes(storage).subscribe(r => {
                            this.includes.makeSnack("Imagenes limpiadas");
                        });
                    }
                }, () => {
                    this.includes.simple("¡Mal!", "El capítulo no se pudo guardar.");
                    this.loggerImage = "";
                    this.isLoad = false;
                    this.capituloProvider.eliminarImagenes(storage).subscribe(r => {
                        this.includes.makeSnack("Imagenes limpiadas");
                    });;
                });
            } else this.includes.makeSnack("Las imagenes aún no han sido seleccionadas", 2500);
        }
    }
    async guardarImagen(file: File){
        const r = await this.capituloProvider.saveImage2(file);
        if(r.success){
            this.loggerImage = r.imageName;
        } else {
            this.includes.makeSnack(r.error || r.code || "Una imagen no se guardó");
        }
    }
    changeFile(event): any {
        this.files = event.target.files;
    }
    getJointGroups(str: string): Array<string>{
        try{
            if(str){
                let separate: string[] = str.trim().split("&");
                let nArr: string[] = [];
                separate.forEach(el => {
                    nArr.push(el.trim());
                });
                return nArr;
            }
            return [];
        }catch(ex){
            return [];
        }
    }
    getData(): Capitulo[] {
        try{
            let chapters: Capitulo[] = [];
            if(this.pageEvent){
                let index = this.pageEvent.pageIndex;
                let dataInit = this.pageSize * index;
                let dataLast = this.pageSize * (index + 1);
                chapters = this.capitulos.slice(dataInit, dataLast);
            } else chapters = this.capitulos.slice(0, 5);
            return chapters;
        }catch(ex){
            return [];
        }
    }
    copiarlink(val: Capitulo): void{
        let url = `${Includes.URL_SITE}leer/${val._id}`;
        if(Includes.copy(url)) this.includes.makeSnack("URL copiado en el portapapeles");
        else this.includes.makeSnack("No se puede copiar la URL");
    }
    eliminar(val: Capitulo): void{
        this.includes.confirm("¡Un momento!", "¿Estás seguro de que quieres eliminar este capítulo?", () => {
            this.includes.makeSnack("Eliminando...", 1000);
            this.isDeleting = true;
            this.capituloProvider.eliminar(val._id).subscribe(s => {
                if(s.success) this.includes.makeSnack(s.success);
                else if(s.error) this.includes.makeSnack(s.error);
                else this.includes.makeSnack("Ocurrió un error al eliminar");
                this.isDeleting = false;
                this.getChapters();
                this.capituloProvider.eliminarImagenes(val.storage).subscribe(r => {
                    console.info(r.success || r.error || r.code);
                });
            }, err => {
                this.isDeleting = false;
                Includes.saveErrorLog(err);
                this.includes.simple("Mmm...", "No se puede borrar el libro en el servidor.");
            });
        });
    }
}
