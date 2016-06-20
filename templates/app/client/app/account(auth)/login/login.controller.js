'use strict';
<%_ if(filters.ts) { _%>

import {IAuth} from '../../../components/auth/auth.service';
<%_ } _%>

export default class LoginController {
  <%_ if(filters.ts) { _%>
  user;
  errors;
  submitted;
  Auth: IAuth;<% if (filters.ngroute) { %>
  $location: ng.ILocationService;<% } %><% if (filters.uirouter) { %>
  $state;<% } %>
  <%_ } _%>

  /*@ngInject*/
  constructor(Auth<%_ if(filters.ts) { _%>: IAuth<%_ } _%><% if (filters.ngroute) { %>, $location<%_ if(filters.ts) { _%>: ng.ILocationService<%_ } _%><% } %><% if (filters.uirouter) { %>, $state<% } %>) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;<% if (filters.ngroute) { %>
    this.$location = $location;<% } if (filters.uirouter) { %>
    this.$state = $state;<% } %>
  }

  login(form<%_ if(filters.ts) { _%>: ng.IFormController<%_ } _%>) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        <% if (filters.ngroute) { %>this.$location.path('/');<% } %><% if (filters.uirouter) { %>this.$state.go('main');<% } %>
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}
