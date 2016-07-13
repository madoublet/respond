import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {GalleryImageService} from '/app/shared/services/gallery-image.service';

@Component({
    selector: 'respond-edit-caption',
    templateUrl: './app/shared/components/galleries/edit-caption/edit-caption.component.html',
    providers: [GalleryImageService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class EditCaptionComponent {

  // model to store
  model = {
    caption: ''
  };

  // visible input
  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  // image input
  @Input() image;

  // index
  @Input() index;

  // item input
  @Input()
  set image(image){

    // set item
    this.model = image;

  }

  // gallery input
  @Input() gallery;

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _galleryImageService: GalleryImageService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      caption: ''
    };

  }

  /**
   * Hides the add modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the gallery image
   */
  submit() {

    this._galleryImageService.edit(this.model.id, this.model.caption, this.gallery.id)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful add
   */
  success() {

    toast.show('success');

    this._visible = false;
    this.onAdd.emit(null);

  }

}