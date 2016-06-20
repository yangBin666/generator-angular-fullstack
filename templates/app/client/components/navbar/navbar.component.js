'use strict';
<%_ if(filters.ts) { _%>
import {IAuth} from './../auth/auth.service';
<%_ } _%>

export class NavbarComponent {
  <%_ if(filters.ts) { _%>
  $location: ng.ILocationService;
  isLoggedIn;
  isAdmin;
  getCurrentUser;
  <%_ } _%>
  //start-non-standard
  menu = [{
    'title': 'Home',
    <% if (filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>
  }];

  isCollapsed = true;
  //end-non-standard
  <%_ if(filters.ngroute || filters.auth) { _%>

  constructor(<% if(!filters.uirouter) { %>$location<%_ if(filters.ts) { _%>: ng.ILocationService<%_ } _%><% } if(!filters.uirouter && filters.auth) { %>, <% } if (filters.auth) { %>Auth<%_ if(filters.ts) { _%>: IAuth<%_ } _%><% } %>) {
    'ngInject';
    <%_ if(!filters.uirouter) { _%>
    this.$location = $location;
    <%_ } _%>
    <%_ if (filters.auth) { _%>
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    <%_ } _%>
  }<% } %>
  <%_ if(!filters.uirouter) { _%>

  isActive(route) {
    return route === this.$location.path();
  }<% } %>
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.<%= templateExt %>'),
    controller: NavbarComponent
  })
  .name;
