import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Includes } from '../../../../utils/Includes';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
    selector: 'app-cpanel-admin',
    templateUrl: './cpanel-admin.component.html',
    styleUrls: ['./cpanel-admin.component.scss'],
})
export class CpanelAdminComponent implements OnInit{
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
    constructor(
        private breakpointObserver: BreakpointObserver,
        private includes: Includes
    ) { }
    public nick: string = "Administrador";
    ngOnInit(): void{
        let data = localStorage.getItem('data');
        if(data){
            try{
                let info = <Usuario>JSON.parse(atob(data));
                this.nick = info.usernick;
            }catch(ex){
                this.includes.simple("¡Ups!", "Se encontró información dañada.");
                setTimeout(() => window.location.reload(), 2e3);
            }
        } else {
            this.includes.simple("¡Ups!", "Se encontró una formación equivocada de información.");
            setTimeout(() => window.location.reload(), 2e3);
        }
    }
    closeSession(){
        this.includes.confirm('¡Espera un momento!', '¿Estas seguro de que quieres cerrar sesión ahora?', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('data');
            this.includes.goTo(['/']);
            this.includes.makeSnack("¡Esperamos verte pronto otra vez!");
        });
    }
}
