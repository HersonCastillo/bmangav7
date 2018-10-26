import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules,
        useHash: false
    })],
    exports: [
        RouterModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class AppRoutingModule { }
