'use strict';
import * as _ from 'lodash';
<%_ if(filters.ts) { _%>
import {IAuth} from './auth.service';

export function routerDecorator($rootScope: ng.IRootScopeService<% if(filters.ngroute) { %>, $location: ng.ILocationService<% } if(filters.uirouter) { %>, $state<% } %>, Auth: IAuth) {<%_ } else { _%>
export function routerDecorator($rootScope<% if(filters.ngroute) { %>, $location<% } if(filters.uirouter) { %>, $state<% } %>, Auth) {<%_ } _%>
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
  $rootScope.$on(<% if(filters.ngroute) { %>'$routeChangeStart'<% } %><% if(filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {
    if (!next.authenticate) {
      return;
    }

    if (typeof next.authenticate === 'string') {
      <%_ if(filters.ts) { _%>
      (<ng.IPromise<any>>Auth.hasRole(next.authenticate, _.noop)).then(has => {<% } else { %>
      Auth.hasRole(next.authenticate, _.noop).then(has => {<% } %>
        if (has) {
          return;
        }

        event.preventDefault();
        <%_ if(filters.ts) { _%>
        return (<ng.IPromise<any>>Auth.isLoggedIn(_.noop)).then(is => {<%_ } else { _%>
        return Auth.isLoggedIn(_.noop).then(is => {<%_ } _%>
          <%_ if(filters.ngroute) { _%>
          $location.path(is ? '/' : '/login');<% } %>
          <%_ if(filters.uirouter) { _%>
          $state.go(is ? 'main' : 'login');<% } %>
        });
      });
    } else {
      <%_ if(filters.ts) { _%>
      (<ng.IPromise<any>>Auth.isLoggedIn(_.noop)).then(is => {
      <%_ } else { _%>
      Auth.isLoggedIn(_.noop).then(is => {<%_ } _%>
        if (is) {
          return;
        }

        event.preventDefault();
        <%_ if(filters.ngroute) { _%>
        $location.path('/login');<% } %>
        <%_ if(filters.uirouter) { _%>
        $state.go('login');<% } %>
      });
    }
  });
};
