import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Includes } from '../../../../../utils/Includes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LibrosService } from '../../../../../services/libros.service';
import { CapitulosService } from '../../../../../services/capitulos.service';
import { Libro, Capitulo } from '../../../../../interfaces/interfaces';
@Component({
    selector: 'app-edit-capitulo',
    templateUrl: './edit-capitulo.component.html',
    styleUrls: ['./edit-capitulo.component.scss']
})
export class EditCapituloComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private includes: Includes,
        private _form: FormBuilder,
        private capituloProvider: CapitulosService,
        private libroProvider: LibrosService
    ) { }
    public isLoad: boolean = false;
    public form: FormGroup;
    public libros: Libro[] = [];
    private chapter: Capitulo = {
        _id: null,
        views: undefined,
        chapter: undefined,
        storage: null,
        joint: null,
        title: null,
        status: null
    };
    public images: Array<any> = [];
    private originalStorage: string[] = [];
    private loggerImage: string = "";
    public files: File[] = [];
    public blackList: string[] = [];
    public countImages: number = 0;
    ngOnInit() {
        this.images = [];
        this.originalStorage = [];
        this.form = this._form.group({
            libro: ["", [Validators.required]],
            titulo: ["", [Validators.maxLength(150)]],
            capitulo: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
            joint: [[], [Validators.maxLength(150)]]
        });
        this.route.params.subscribe(val => {
            let id = val['id'];
            this.libroProvider.obtener(false).subscribe(l => {
                this.libros = l;
                this.capituloProvider.obtener(id).subscribe(r => {
                    this.chapter = r;
                    this.form.controls['libro'].setValue(r._id_book._id);
                    this.form.controls['titulo'].setValue(r.title);
                    this.form.controls['capitulo'].setValue(r.chapter);
                    this.form.controls['joint'].setValue(r.joint.join(" & ").trim());
                    this.originalStorage = r.storage;
                    for (let img of this.toSort(r.storage)) {
                        try {
                            this.capituloProvider.getImage(img.data).subscribe(r => {
                                let extension = img.data.split('-')[2];
                                if (r.success) {
                                    this.images.push({
                                        id: img.id,
                                        name: img.data,
                                        data: `data:image/${extension};base64,${r.success}`
                                    });
                                    this.images = this.sortInClient(this.images);
                                }
                            });
                        } catch (ex) { }
                    }
                }, err => {
                    Includes.saveErrorLog(err);
                    this.includes.simple("¡Ups!", "No se puede cargar la información de este capítulo.");
                    this.includes.goTo(['/@admin', 'capitulos']);
                });
            }, errl => {
                Includes.saveErrorLog(errl);
                this.includes.simple("¡Ups!", "No se puede cargar la información de los libros.");
                this.includes.goTo(['/@admin', 'capitulos']);
            });
        });
    }
    saveChapter(storage?: string[], callback?: Function): void {
        this.isLoad = true;
        this.capituloProvider.editar({
            _id: this.chapter._id,
            chapter: this.form.value.capitulo,
            storage: storage ? storage : this.chapter.storage,
            joint: this.getJointGroups(this.form.value.joint),
            views: this.chapter.views,
            title: this.form.value.titulo,
            _id_book: this.form.value.libro
        }).subscribe(r => {
            if(callback) callback();
            this.isLoad = false;
            if (r.success) {
                this.includes.simple("¡Bien hecho!", r.success || "Registro editar con éxito.");
            } else {
                if (r.error) this.includes.simple("¡Ocurrió un error!", r.error);
                else this.includes.simple("¡Ups!", "No se puede editar el capítulo aún.");
            }
        }, err => {
            this.isLoad = false;
            Includes.saveErrorLog(err);
            this.includes.simple("¡Ups!", "No se puede guardar el capítulo");
        });
    }
    edit(): void {
        if (this.form.valid) {
            this.saveChapter();
        }
    }
    sortInClient(arr: Array<any>): Array<any> {
        let nArr: Array<string> = [];
        let objectArr: Array<any> = [];
        arr.forEach(el => {
            nArr.push(el.id);
        });
        nArr.sort();
        nArr.forEach(el => {
            objectArr.push({
                id: el,
                data: this.getOriginalBlob(arr, el),
                name: this.getImageName(el)
            });
        });
        return objectArr;
    }
    getOriginalBlob(arr: Array<any>, pre: string): string {
        let blob: string = "";
        arr.forEach(el => {
            if (el.id == pre) blob = el.data;
        });
        return blob;
    }
    toSort(arr: Array<string>): Array<any> {
        let nArr: Array<string> = [];
        let objectArr: Array<any> = [];
        arr.forEach(el => {
            nArr.push(el.split('-')[3]);
        });
        nArr.sort();
        nArr.forEach(el => {
            objectArr.push({
                id: el,
                data: this.getOriginalName(arr, el)
            });
        });
        return objectArr;
    }
    getOriginalName(arr: Array<string>, pre: string): string {
        let name: string = "";
        arr.forEach(el => {
            if (el.split('-')[3] == pre) name = el;
        });
        return name;
    }
    getJointGroups(str: string): Array<string> {
        try {
            if (str) {
                let separate: string[] = str.trim().split("&");
                let nArr: string[] = [];
                separate.forEach(el => {
                    nArr.push(el.trim());
                });
                return nArr;
            }
            return [];
        } catch (ex) {
            return [];
        }
    }
    deleteImage(image: any): void {
        let nStorage = this.originalStorage.filter(r => r != image.name);
        this.includes.confirm('¡Espera un momento!', '¿Seguro de que quieres eliminar la imagen?', () => {
            this.isLoad = true;
            this.capituloProvider.eliminarImagenes([image.name]).subscribe(r => {
                this.isLoad = false;
                this.includes.makeSnack("Imagen eliminada.");
                this.saveChapter(nStorage, () => {
                    this.includes.makeSnack("Aplicando cambios...");
                    setTimeout(() => window.location.reload(), 2500);
                });
            }, err => {
                this.isLoad = false;
                Includes.saveErrorLog(err);
                this.includes.simple("¡Ups!", "No se puede eliminar la imagen");
            });
        });
    }
    removeFromOrigin(exclude: string[]): string[]{
        let nArr: string[] = [];
        this.originalStorage.forEach(el => {
            let r: boolean = false;
            exclude.forEach(al => {
                if(el == al) r = true;
            });
            if(!r) nArr.push(el);
        });
        return nArr;
    }
    deleteManyImages(): void {
        let nStorage = this.removeFromOrigin(this.blackList);
        if(nStorage.length > 0){
            this.includes.confirm('¡Espera un momento!', '¿Seguro de que quieres eliminar las imagenes?', () => {
                this.isLoad = true;
                this.capituloProvider.eliminarImagenes(this.blackList).subscribe(r => {
                    this.isLoad = false;
                    this.includes.makeSnack("Imagenes eliminadas.");
                    this.saveChapter(nStorage, () => {
                        this.blackList = [];
                        this.includes.makeSnack("Aplicando cambios...");
                        setTimeout(() => window.location.reload(), 2500);
                    });
                }, err => {
                    this.isLoad = false;
                    Includes.saveErrorLog(err);
                    this.includes.simple("¡Ups!", "No se puede eliminar la imagen");
                });
            });
        }
    }
    getImageName(imageKey: string): string {
        return this.originalStorage.filter(r => r.includes(imageKey))[0];
    }
    changeFile(event): any {
        this.files = event.target.files;
    }
    async saveImages() {
        if (this.files.length > 0) {
            this.includes.makeSnack("Subiendo imagenes, espere un momento...");
            this.isLoad = true;
            let storage: string[] = [];
            for (let image of this.files) {
                await this.guardarImagen(image);
                this.countImages++;
                if (this.loggerImage.length > 0) {
                    storage.push(this.loggerImage);
                    this.loggerImage = "";
                }
            }
            this.countImages = 0;
            storage.forEach(el => {
                this.originalStorage.push(el);
            });
            this.isLoad = false;
            this.saveChapter(this.originalStorage, () => {
                this.includes.makeSnack("Aplicando cambios...");
                setTimeout(() => window.location.reload(), 2500);
            });
        } else this.includes.simple('¡Ups!', 'No hay imagenes para subir');
    }
    async guardarImagen(file: File) {
        const r = await this.capituloProvider.saveImage2(file);
        if (r.success) {
            this.loggerImage = r.imageName;
        } else {
            this.includes.makeSnack(r.error || r.code || "Una imagen no se guardó");
        }
    }
    addDeleteList(event: any): void {
        if(event.checked) this.searchAndAdd(event.source.value);
        else this.searchAndRemove(event.source.value);
    }
    searchAndAdd(val: string): void {
        this.blackList.push(val);
    }
    searchAndRemove(val: string): void {
        this.blackList = this.blackList.filter(d => d != val);
    }
}
