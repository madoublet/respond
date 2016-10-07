import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {
  constructor (private http: Http) {}


  private _settingsUrl = 'api/app/settings';
  private _themesListUrl = 'api/themes/list';
  private _languagesListUrl = 'api/languages/list';

  // cache the settings
  private _settings;

  /**
   * Retrieve settings for the application
   *
   */
  retrieveSettings () {

    return this.http.get(this._settingsUrl).map((res:Response) => res.json());

  }

  /**
   * Lists themes in the application
   *
   */
  listThemes () {

    return this.http.get(this._themesListUrl).map((res:Response) => res.json());

  }

  /**
   * Lists languages available to the application
   *
   */
  listLanguages () {

    return this.http.get(this._languagesListUrl).map((res:Response) => res.json());

  }


}