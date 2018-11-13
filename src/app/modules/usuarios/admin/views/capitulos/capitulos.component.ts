import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapitulosService } from '../../../../../services/capitulos.service';
import { Capitulo, Libro } from '../../../../../interfaces/interfaces';
import { LibrosService } from '../../../../../services/libros.service';
import { Includes } from '../../../../../utils/Includes';
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
    public capitulos: Capitulo[] = [];
    public libros: Libro[] = [];
    public form: FormGroup;
    public files: File[] = [];
    public countImages: number = 0;
    
    private loggerImage: string = "";
    ngOnInit(){
        this.form = this._form.group({
            libro: ["", [Validators.required]],
            titulo: ["", [Validators.maxLength(150)]],
            capitulo: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
            joint: [[], [Validators.maxLength(150)]]
        });
        this.libroProvider.obtener(false).subscribe(r => this.libros = r);
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
}
