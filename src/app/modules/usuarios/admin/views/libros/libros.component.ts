import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Includes } from 'src/app/utils/Includes';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Libro } from '../../../../../interfaces/libro';
import { LibrosService } from '../../../../../services/libros.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
@Component({
    selector: 'app-libros',
    templateUrl: './libros.component.html',
    styleUrls: ['./libros.component.scss']
})
export class LibrosComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private libroProvider: LibrosService,
        private includes: Includes
    ) { }
    public pageEvent: PageEvent;
    public displayedColumns: string[] = ['nombre', 'estado', 'usuario', 'opciones'];
    public visible = true;
    public selectable = true;
    public removable = true;
    public addOnBlur = true;
    public lengthData: number = 0;
    public pageSize: number = 5;
    public form: FormGroup;
    public libros: Libro[];
    public status: string = "A";
    public file: File;
    public isLoad: boolean = false;
    public showIsLoad: boolean = false;
    public isDeleting: boolean = false;
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

    getBooks(val: boolean): void {
        this.showIsLoad = true;
        this.libroProvider.obtener(val).subscribe(libros => {
            this.libros = libros;
            this.showIsLoad = false;
            this.lengthData = libros.length;
        }, err => {
            this.showIsLoad = false;
            Includes.saveErrorLog(err);
            this.includes.makeSnack("No se puede obtener la lista de libros.");
        });
    }
    getData(): Array<Libro> {
        try{
            let books: Libro[] = [];
            if(this.pageEvent){
                let index = this.pageEvent.pageIndex;
                let dataInit = this.pageSize * index;
                let dataLast = this.pageSize * (index + 1);
                books = this.libros.slice(dataInit, dataLast);
            } else books = this.libros.slice(0, 5);
            return books;
        }catch(ex){
            return [];
        }
    }
    getStatus(driv: string): string{
        return Includes.getStatus(driv);
    }
    ngOnInit() {
        this.getBooks(true); 
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
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
            ],
            image: [
                "",
                [Validators.required]
            ]
        });
    }
    changeFile(event): any {
        this.file = event.target.files[0];
    }
    saveBook(): void {
        if (this.form.valid) {
            if (this.fruits.length > 0) {
                this.isLoad = true;
                this.libroProvider.saveImage(this.file).subscribe(r => {
                    if (r.success) {
                        let dataToSend: Libro = {
                            book_name: this.form.value.titulo,
                            genders_type: this.fruits.join(' '),
                            _id_user: undefined,
                            status: this.status,
                            description: this.form.value.descripcion,
                            image: r.imageName
                        }
                        this.libroProvider.guardar(dataToSend).subscribe(l => {
                            this.isLoad = false;
                            if (l.success) {
                                this.getBooks(false);
                                this.includes.simple("¡Bien hecho!", l.success || "Registro guardado con éxito.");
                                this.form.reset();
                                this.status = "A";
                                this.file = null;
                                this.fruits = [];
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
            } else this.includes.makeSnack("El libro necesita tener al menos un género.");
        } else this.includes.makeSnack("Faltan campos por completar.");
    }
    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                this.fruits.push(value.trim());
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
    copiarlink(val: Libro): void{
        let url = `${Includes.URL_SITE}biblioteca/${val.book_name}`;
        if(Includes.copy(url)) this.includes.makeSnack("URL copiado en el portapapeles");
        else this.includes.makeSnack("No se puede copiar la URL");
    }
    eliminar(val: Libro): void{
        this.includes.confirm("¡Un momento!", "¿Estás seguro de que quieres eliminar este libro?", () => {
            this.includes.makeSnack("Eliminando...", 1000);
            this.isDeleting = true;
            this.libroProvider.eliminar(val).subscribe(s => {
                if(s.success) this.includes.makeSnack(s.success);
                else if(s.error) this.includes.makeSnack(s.error);
                else this.includes.makeSnack("Ocurrió un error al eliminar");
                this.isDeleting = false;
                this.getBooks(false);
            }, err => {
                this.isDeleting = false;
                Includes.saveErrorLog(err);
                this.includes.simple("Mmm...", "No se puede borrar el libro en el servidor.");
            });
        });
    }
}
