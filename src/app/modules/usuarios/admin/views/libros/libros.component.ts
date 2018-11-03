import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Includes } from 'src/app/utils/Includes';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Libro } from '../../../../../interfaces/libro';
import { SelectionModel } from '@angular/cdk/collections';
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
    public displayedColumns: string[] = ['select', 'nombre', 'estado', 'usuario', 'opciones'];
    public selection = new SelectionModel<Libro>(true, []);
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
    public separatorKeysCodes: number[] = [ENTER, COMMA];
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

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.libros.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.libros.forEach(row => this.selection.select(row));
    }
    getBooks(): void {
        this.showIsLoad = true;
        this.libroProvider.obtener().subscribe(libros => {
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
    deleteBooks(): void{
        
    }
    ngOnInit() {
        this.getBooks(); 
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
                    Validators.maxLength(250)
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
                        this.isLoad = true;
                        this.libroProvider.guardar(dataToSend).subscribe(l => {
                            if (l.success) {
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
                            Includes.saveErrorLog(errLibro);
                            this.includes.simple("¡Ups!", "Ocurrió un error al guardar el libro. Intente más tarde.");
                        });
                    } else {
                        if (r.error) this.includes.simple("¡Ocurrió un error!", r.error);
                        else this.includes.simple("¡Ups!", "No se puede guardar la imagen aún.");
                    }
                }, err => {
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
            this.includes.makeSnack("Ya hay un género similar incluido.");
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
