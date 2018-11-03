import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ConfigComponent } from './modals/config/config.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { SimpleComponent } from './modals/simple/simple.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function Token(): string {
    return localStorage.getItem('token');
}

@NgModule({
    declarations: [
        AppComponent,
        ConfigComponent,
        ConfirmComponent,
        SimpleComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: Token,
                whitelistedDomains: [
                    'localhost:8081'
                ],
                skipWhenExpired: true
            }
        }),
        BrowserAnimationsModule
    ],
    providers: [],
    entryComponents: [
        ConfigComponent,
        ConfirmComponent,
        SimpleComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
