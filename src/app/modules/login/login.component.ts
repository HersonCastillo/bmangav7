import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Includes } from '../../utils/Includes';
import * as $ from 'jquery';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    constructor(
        private loginProvider: LoginService,
        private includes: Includes
    ){}
    public credentials = {
        user: "",
        pass: ""
    }
    public isLoading: boolean = false;
    ngOnInit() {
        $("title").text('Inicia sesión en tu cuenta de BMANGA');
    }
    login(): void{
        if(this.credentials.user && this.credentials.pass){
            this.isLoading = true;
            this.loginProvider.iniciarSesion({
                usernick: this.credentials.user,
                pass: this.credentials.pass
            }).then(r => {
                if(r.token){
                    this.includes.makeSnack(`Bienvenido ${this.credentials.user}`, 3500);
                    this.includes.goTo(['/@admin']);
                    localStorage.setItem('token', r.token);
                    this.isLoading = false;
                } else if(r.error){
                    this.includes.simple('¡Muy mal!', r.error || 'No se puede iniciar sesión en estos momentos.');
                    this.isLoading = false;
                } else{
                    this.includes.simple('Mmmm...', 'Se encontró un error, pronto lo solucionaremos');
                    this.isLoading = false;
                }
            }).catch(() => {
                this.isLoading = false;
                this.includes.simple('¡Ups!', 'No se pudo iniciar sesión debido a un error en la aplicación.');
            });
        } else this.includes.makeSnack("Campos vacíos.");
    }
}
