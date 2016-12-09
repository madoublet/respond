import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SiteService } from '../../../../shared/services/site.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-plugin',
    templateUrl: 'remove-plugin.component.html',
    providers: [SiteService]
})

export class RemovePluginComponent {

  errorMessage;

  // model to store
  model: {
    title: '',
    selector: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set plugin(plugin){

    // set visible
    this.model = plugin;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _siteService: SiteService) {}

  /**
   * Init
   */
  ngOnInit() {

  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  submit() {

    this._siteService.removePlugin(this.model.selector)
                     .subscribe(
                       data => { this.success(); },
                       error => { this.onError.emit(<any>error) }
                      );

  }

  /**
   * Handles a successful submission
   */
  success() {

    this._visible = false;
    this.onUpdate.emit(null);

  }


}