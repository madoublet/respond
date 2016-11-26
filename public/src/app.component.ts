import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import 'rxjs/add/operator/map';

@Component({
    selector: 'respond-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(private _translate: TranslateService) {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';

         // this language will be used as a fallback when a translation isn't found in the current language
        _translate.setDefaultLang('en');

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        _translate.use(userLang);
    }

}