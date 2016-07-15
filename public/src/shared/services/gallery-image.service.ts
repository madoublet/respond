import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt/angular2-jwt';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GalleryImageService {
  constructor (private http: Http, private authHttp: AuthHttp, private authConfig: AuthConfig) {}

  private _listUrl = 'api/galleries/images/list';
  private _addUrl = 'api/galleries/images/add';
  private _editUrl = 'api/galleries/images/edit';
  private _removeUrl = 'api/galleries/images/remove';
  private _updateOrderUrl = 'api/galleries/images/order';

  /**
   * Lists images
   *
   */
  list (galleryId: string) {

    var url = this._listUrl + '/' + encodeURI(galleryId);

    return this.authHttp.get(url).map((res:Response) => res.json());
  }

  /**
   * Adds an image
   *
   * @param {string} name
   * @param {string} url
   * @param {string} caption
   * @param {string} galleryId
   * @return {Observable}
   */
  add (name: string, url: string, thumb: string, caption: string, galleryId: string) {

    let body = JSON.stringify({ name, url, thumb, caption, galleryId });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let _options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._addUrl, body, _options);

  }

  /**
   * Edits an image
   *
   * @param {string} id
   * @param {string} caption
   * @param {string} galleryId
   * @return {Observable}
   */
  edit (id: string, caption: string, galleryId: string) {

    let body = JSON.stringify({ id, caption, galleryId });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let _options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._editUrl, body, _options);

  }

  /**
   * Removes an image
   *
   * @param {string} id
   * @return {Observable}
   */
  remove (id: string, galleryId: string) {

    let body = JSON.stringify({ id, galleryId });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._removeUrl, body, options);

  }

  /**
   * Updates the order of images
   *
   * @param {string} id
   * @param {array} images
   * @return {Observable}
   */
  updateOrder (images, galleryId: string) {

    let body = JSON.stringify({ images, galleryId });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.authHttp.post(this._updateOrderUrl, body, options);

  }

}