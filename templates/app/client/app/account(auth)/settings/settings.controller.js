'use strict';
<%_ if(filters.ts) { _%>

import {IAuth} from '../../../components/auth/auth.service';
<%_ } _%>

export default class SettingsController {
  errors<%_ if(filters.ts) { _%>: IErrors<%_ } _%> = {};
  submitted = false;<%_ if(filters.ts) { _%>
  Auth: IAuth;
  message;
  user;
  <%_ } _%>  

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
  }

  changePassword(form<%_ if(filters.ts) { _%>: ISettingsForm<%_ } _%>) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}
<%_ if(filters.ts) { _%>

interface ISettingsForm extends ng.IFormController {
  password: ng.INgModelController;
}

interface IErrors {
  other?: string;
}
<%_ } _%>