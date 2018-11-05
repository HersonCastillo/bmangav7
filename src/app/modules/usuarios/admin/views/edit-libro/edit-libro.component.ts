import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { Libro } from '../../../../../interfaces/libro';
import { Includes } from '../../../../../utils/Includes';
import { LibrosService } from 'src/app/services/libros.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'app-edit-libro',
    templateUrl: './edit-libro.component.html',
    styleUrls: ['./edit-libro.component.scss']
})
export class EditLibroComponent implements OnInit {

    constructor(
        private libroProvider: LibrosService,
        private route: ActivatedRoute,
        private includes: Includes,
        private _formBuilder: FormBuilder
    ) { }
    private bandImage: boolean = false;
    private imageName: string = "";
    public libro: Libro;
    public imageData: string = "";
    public isLoad: boolean = false;
    public form: FormGroup;
    public file: File;
    public status: string = "A";
    public selectable = true;
    public removable = true;
    public addOnBlur = true;
    public separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    public fruitCtrl = new FormControl();
    public filteredFruits: Observable<string[]>;
    public fruits: string[] = [];
    public allFruits: string[] = [
        'Acción',
        'Ficción',
        'Romance',
        'Escolar',
        'Horror',
        'Supervivencia',
        'Yaoi',
        'Yuri',
        'Soft-hentai',
        'Trajedia',
        'Misterio',
        'Drama',
        'Suspenso',
        'Ecchi',
        'Deportes',
        'Comedia',
        'Fantasía'
    ];
    @ViewChild('fruitInput')
    public fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto')
    public matAutocomplete: MatAutocomplete;
    ngOnInit() {
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
        this.route.params.subscribe(val => {
            let id = val['id'];
            this.isLoad = true;
            this.libroProvider.Obtener(id).subscribe(b => {
                this.isLoad = false;
                this.libro = b;
                this.imageName = b.image;
                this.status = b.status;
                this.fruits = b.genders_type.split(" ");
                this.form.controls['titulo'].setValue(b.book_name);
                this.form.controls['descripcion'].setValue(b.description);
                if (!Includes.requestImage(b.image)) {
                    this.imageData = b.image;
                    this.bandImage = false;
                }
                else {
                    this.bandImage = true;
                    this.libroProvider.getImage(b.image).subscribe(r => {
                        let extension = b.image.split('-')[2];
                        this.imageData = `data:image/${extension};base64,${r.success}`;
                    });
                }
            }, err => {
                Includes.saveErrorLog(err);
                this.includes.simple("¡Ups!", "No se puede cargar la información de este libro.");
                this.includes.goTo(['/@admin', 'libros']);
            });
        });
        this.form = this._formBuilder.group({
            titulo: [
                "",
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(250)
                ]
            ],
            descripcion: [
                "",
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(10000)
                ]
            ]
        });
    }
    edit() {
        if (this.form.valid) {
            if (this.fruits.length > 0) {
                this.isLoad = true;
                if (this.file == null) {
                    let dataToSend: Libro = {
                        book_name: this.form.value.titulo,
                        genders_type: this.fruits.join(' '),
                        status: this.status,
                        description: this.form.value.descripcion,
                        image: this.imageName,
                        _id: this.libro._id
                    }
                    this.libroProvider.editar(dataToSend).subscribe(r => {
                        this.isLoad = false;
                        this.file = null;
                        if (r.success) {
                            this.includes.simple("¡Bien hecho!", r.success || "Registro guardado con éxito.");
                            this.includes.goTo(['/@admin', 'libros']);
                        } else {
                            if (r.error) this.includes.simple("¡Ocurrió un error!", r.error);
                            else this.includes.simple("¡Ups!", "No se puede guardar el capítulo aún.");
                        }
                    }, e => {
                        this.isLoad = false;
                        Includes.saveErrorLog(e);
                        this.includes.simple("¡Ups!", "Ocurrió un error al guardar el libro. Intente más tarde.");
                    });
                } else {
                    if(this.bandImage){
                        this.libroProvider.updateImage(this.file, this.imageName).subscribe(r => {
                            if(r.success){
                                let dataToSend: Libro = {
                                    book_name: this.form.value.titulo,
                                    genders_type: this.fruits.join(' '),
                                    status: this.status,
                                    description: this.form.value.descripcion,
                                    image: r.imageName,
                                    _id: this.libro._id
                                }
                                this.libroProvider.editar(dataToSend).subscribe(l => {
                                    this.isLoad = false;
                                    this.file = null;
                                    if (l.success) {
                                        this.includes.simple("¡Bien hecho!", l.success || "Registro guardado con éxito.");
                                        this.includes.goTo(['/@admin', 'libros']);
                                    } else {
                                        if (r.error) this.includes.simple("¡Ocurrió un error!", l.error);
                                        else this.includes.simple("¡Ups!", "No se puede guardar el capítulo aún.");
                                    }
                                }, err => {
                                    this.isLoad = false;
                                    Includes.saveErrorLog(err);
                                    this.includes.simple("¡Ups!", "Ocurrió un error al guardar el libro. Intente más tarde.");
                                });
                            } else {
                                this.isLoad = false;
                                if (r.error) this.includes.simple("¡Ocurrió un error!", r.error);
                                else this.includes.simple("¡Ups!", "No se puede guardar la imagen aún.");
                            }
                        }, e => {
                            this.isLoad = false;
                            Includes.saveErrorLog(e);
                            this.includes.simple("¡Ups!", "Ocurrió un error al guardar la imagen. Intente más tarde.");
                        });
                    } else {
                        this.libroProvider.saveImage(this.file).subscribe(r => {
                            if (r.success) {
                                let dataToSend: Libro = {
                                    book_name: this.form.value.titulo,
                                    genders_type: this.fruits.join(' '),
                                    status: this.status,
                                    description: this.form.value.descripcion,
                                    image: r.imageName,
                                    _id: this.libro._id
                                }
                                this.libroProvider.editar(dataToSend).subscribe(l => {
                                    this.isLoad = false;
                                    if (l.success) {
                                        this.includes.simple("¡Bien hecho!", l.success || "Registro guardado con éxito.");
                                        this.includes.goTo(['/@admin', 'libros']);
                                    } else {
                                        if (l.error) this.includes.simple("¡Ocurrió un error!", l.error);
                                        else this.includes.simple("¡Ups!", "No se puede guardar el capítulo aún.");
                                    }
                                }, errLibro => {
                                    this.isLoad = false;
                                    Includes.saveErrorLog(errLibro);
                                    this.includes.simple("¡Ups!", "Ocurrió un error al guardar el libro. Intente más tarde.");
                                });
                            } else {
                                this.isLoad = false;
                                if (r.error) this.includes.simple("¡Ocurrió un error!", r.error);
                                else this.includes.simple("¡Ups!", "No se puede guardar la imagen aún.");
                            }
                        }, err => {
                            this.isLoad = false;
                            Includes.saveErrorLog(err);
                            this.includes.simple("¡Ups!", "Ocurrió un error al guardar la imagen. Intente más tarde.");
                        });
                    }
                }
            } else this.includes.makeSnack("El libro necesita tener al menos un género.");
        } else this.includes.makeSnack("Faltan campos por completar.");
    }
    changeFile(event): any {
        this.file = event.target.files[0];
    }
    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                let val = value;
                let concurrences = this.fruits.filter(r => r.toLowerCase().includes(val.trim().toLowerCase()));
                if (concurrences.length > 0) {
                    this.includes.makeSnack("Ya hay un género similar incluido");
                } else {
                    this.fruits.push(val);
                }
            }
            if (input) {
                input.value = '';
            }
            this.fruitCtrl.setValue(null);
        }
    }
    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);
        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }
    selected(event: MatAutocompleteSelectedEvent): void {
        let val = event.option.viewValue;
        let concurrences = this.fruits.filter(r => r.toLowerCase().includes(val.trim().toLowerCase()));
        if (concurrences.length > 0) {
            this.includes.makeSnack("Ya hay un género similar incluido");
        } else {
            this.fruits.push(event.option.viewValue);
        }
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }
}
