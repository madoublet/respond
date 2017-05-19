import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SiteService {
  constructor (private http: Http) {}

  private _createUrl = 'api/sites/create';
  private _subscribeUrl = 'api/sites/subscribe';
  private _reloadUrl = 'api/sites/reload';
  private _reindexUrl = 'api/sites/reindex';
  private _sitemapUrl = 'api/sites/sitemap';
  private _migrateUrl = 'api/sites/migrate';
  private _templateUrl = 'api/sites/republish/templates';
  private _listTemplatesUrl = 'api/templates/list';
  private _listPluginsUrl = 'api/plugins/list';
  private _updateUrl = 'api/sites/update/plugins';
  private _removePluginUrl = 'api/plugins/remove';

  /**
   * Login to the application
   *
   * @param {string} id The site id
   * @param {string} email The user's login email
   * @param {string} password The user's login password
   * @return {Observable}
   */
  create (name: string, theme: string, email: string, password: string, passcode: string, recaptchaResponse: string) {

    let body = JSON.stringify({ name, theme, email, password, passcode, recaptchaResponse });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._createUrl, body, options)
                    .map((res:Response) => res.json());

  }

  /**
   * Subscribes a site
   *
   * @param {string} token
   * @param {string} email
   * @return {Observable}
   */
  subscribe (token: string, email: string) {

    let body = JSON.stringify({ token, email });

    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._subscribeUrl, body, options);

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
   * Reindexes pages in the site
   *
   * @return {Observable}
   */
  reindex () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._reindexUrl, options);

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

  /**
   * Republishes templates
   *
   * @return {Observable}
   */
  republishTemplates () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._templateUrl, options);

  }

  /**
   * Lists templates
   *
   */
  listTemplates () {
    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listTemplatesUrl, options).map((res:Response) => res.json());
  }

  /**
   * Lists plugins
   *
   */
  listPlugins () {
    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listPluginsUrl, options).map((res:Response) => res.json());
  }

  /**
   * Updates plugins
   *
   * @return {Observable}
   */
  updatePlugins () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._updateUrl, options);

  }

  /**
   * Removes the plugin
   *
   * @param {string} selector
   * @return {Observable}
   */
  removePlugin (selector: string) {

    let body = JSON.stringify({ selector });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removePluginUrl, body, options);

  }


}