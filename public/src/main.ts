///<reference path="../../typings/main.d.ts"/>
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule)

declare var toast: any;