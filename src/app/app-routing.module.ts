import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './modules/login/login.component'
import { ErrorComponent } from './modules/error/error.component';
import { BuscarComponent } from './modules/buscar/buscar.component';
import { BibliotecaComponent } from './modules/biblioteca/biblioteca.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardAdmin, AuthGuardLogin, AuthGuardUser } from './services/auth.guard';
import { LeerComponent } from './modules/leer/leer.component';
import { CpanelAdminComponent } from './modules/usuarios/admin/cpanel-admin/cpanel-admin.component';
import { CpanelUserComponent } from './modules/usuarios/user/cpanel-user/cpanel-user.component';
import { CapitulosComponent } from './modules/usuarios/admin/views/capitulos/capitulos.component';
import { LibrosComponent } from './modules/usuarios/admin/views/libros/libros.component';
import { EditCapituloComponent } from './modules/usuarios/admin/views/edit-capitulo/edit-capitulo.component';
import { EditLibroComponent } from './modules/usuarios/admin/views/edit-libro/edit-libro.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'biblioteca/:id', component: BibliotecaComponent },
    { path: 'leer/:id', component: LeerComponent },
    { path: '@admin', component: CpanelAdminComponent, children: [
        { path: 'capitulos', component: CapitulosComponent },
        { path: 'capitulos/:id', component: EditCapituloComponent },
        { path: 'libros', component: LibrosComponent },
        { path: 'libros/:id', component: EditLibroComponent },
        { path: '', redirectTo: 'capitulos', pathMatch: 'full' }
    ], canActivate: [AuthGuardAdmin] },
    { path: '@me', component: CpanelUserComponent, children: [

    ], canActivate: [AuthGuardUser] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
    { path: 'error', component: ErrorComponent },
    { path: 'buscar', component: BuscarComponent },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
    ],
    exports: [
        RouterModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        HomeComponent,
        LoginComponent,
        ErrorComponent,
        BuscarComponent,
        BibliotecaComponent,
        LeerComponent,
        CpanelAdminComponent,
        CpanelUserComponent,
        CapitulosComponent,
        LibrosComponent,
        EditCapituloComponent,
        EditLibroComponent
    ]
})
export class AppRoutingModule { }
