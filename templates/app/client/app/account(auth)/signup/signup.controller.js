'use strict';
<%_ if(filters.ts) { _%>

import {IAuth} from '../../../components/auth/auth.service';
import {IUser} from '../../../components/auth/user.service';
<%_ } _%>

export default class SignupController {
  <%_ if(filters.ts) { _%>
  Auth: IAuth;<% if (filters.ngroute) { %>
  $location: ng.ILocationService;<% } %><% if (filters.uirouter) { %>
  $state;<% } %>
  <%_ } _%>
  //start-non-standard
  user<%_ if(filters.ts) { _%>: IUser|Object<%_ } _%> = {};
  errors = {};
  submitted = false;
  //end-non-standard

  /*@ngInject*/
  constructor(Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %>) {
    this.Auth = Auth;<% if (filters.ngroute) { %>
    this.$location = $location;<% } if (filters.uirouter) { %>
    this.$state = $state;<% } %>
  }

  <%_ if(filters.ts) { _%>
  isValidUser(user: IUser|Object, form: ng.IFormController): user is IUser {<%_ } else { _%>
  isValidUser(user, form) {<%_ } _%>
    if (form.$valid) {
      return true;
    } else {
      return false;
    }
  }

  register(form<%_ if(filters.ts) { _%>: ng.IFormController<%_ } _%>) {
    this.submitted = true;

    let user = this.user;
    if (this.isValidUser(user, form)) {
      this.Auth.createUser({
        name: user.name,
        email: user.email,
        password: user.password
      })
      .then(() => {
        // Account created, redirect to home
        <% if (filters.ngroute) { %>this.$location.path('/');<% } %><% if (filters.uirouter) { %>this.$state.go('main');<% } %>
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
<% if (filters.mongooseModels) { %>
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });<% }
if (filters.sequelizeModels) { %>
        // Update validity of form fields that match the sequelize errors
        if (err.name) {
          angular.forEach(err.fields, field => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = err.message;
          });
        }<% } %>
      });
    }
  }
}
