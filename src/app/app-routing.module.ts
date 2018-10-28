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

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'biblioteca/:id', component: BibliotecaComponent },
    { path: '@admin', component: CpanelAdminComponent, children: [

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
        ReactiveFormsModule
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
        CpanelUserComponent
    ]
})
export class AppRoutingModule { }
