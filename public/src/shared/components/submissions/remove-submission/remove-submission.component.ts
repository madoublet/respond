import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {SubmissionService} from '../../../../shared/services/submission.service';

@Component({
    selector: 'respond-remove-submission',
    moduleId: __moduleName,
    templateUrl: '/app/shared/components/submissions/remove-submission/remove-submission.component.html',
    providers: [SubmissionService],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class RemoveSubmissionComponent {

  routes;

  // model to store
  model: {
    id: '',
    name: '',
    formId: ''
  };

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  @Input()
  set submission(submission){

    // set visible
    this.model = submission;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _submissionService: SubmissionService) {}

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

    this._submissionService.remove(this.model.id)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
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