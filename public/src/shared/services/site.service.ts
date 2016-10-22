import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SiteService {
  constructor (private http: Http) {}

  private _createUrl = 'api/sites/create';
  private _reloadUrl = 'api/sites/reload';
  private _sitemapUrl = 'api/sites/sitemap';
  private _migrateUrl = 'api/sites/migrate';

  /**
   * Login to the application
   *
   * @param {string} id The site id
   * @param {string} email The user's login email
   * @param {string} password The user's login password
   * @return {Observable}
   */
  create (name: string, theme: string, email: string, password: string, passcode: string) {

    let body = JSON.stringify({ name, theme, email, password, passcode });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._createUrl, body, options)
                    .map((res:Response) => res.json());

  }

  /**
   * Reloads the system files
   *
   * @return {Observable}
   */
  reload () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._reloadUrl, options);

  }

  /**
   * Republishes the sitemap
   *
   * @return {Observable}
   */
  sitemap () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._sitemapUrl, options);

  }

  /**
   * Migrates a R5 site to R6
   *
   * @return {Observable}
   */
  migrate () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._migrateUrl, options);

  }


}