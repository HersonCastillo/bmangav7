import { Component, OnInit } from '@angular/core';
import { LibrosService } from 'src/app/services/libros.service';
import { ActivatedRoute } from '@angular/router';
import { Includes } from '../../../../../utils/Includes';
@Component({
    selector: 'app-edit-capitulo',
    templateUrl: './edit-capitulo.component.html',
    styleUrls: ['./edit-capitulo.component.scss']
})
export class EditCapituloComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private includes: Includes
    ) {}
    ngOnInit() {
        this.route.params.subscribe(val => {
            let id = val['id'];
            
        });
    }
}
