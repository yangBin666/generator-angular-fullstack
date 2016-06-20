'use strict';
<%_ if(filters.ts) { _%>
import {IAuth} from '../../components/auth/auth.service';
<%_ } _%>
<%_ if (filters.uirouter) { _%>
export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
      .state('login', {
        url: '/login',
        template: require('./login/login.<%= templateExt %>'),
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth<%_ if(filters.ts) { _%>: IAuth<%_ } _%>) {
          'ngInject';
          var referrer = $state.params.referrer
                        || $state.current.referrer
                        || 'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        template: require('./signup/signup.<%= templateExt %>'),
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        template: require('./settings/settings.<%= templateExt %>'),
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
}<% } %>
<%_ if (filters.ngroute) { _%>
export default function routes($routeProvider) {
    'ngInject';
    $routeProvider
      .when('/login', {
        template: require('./login/login.<%= templateExt %>'),
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .when('/logout', {
        name: 'logout',
        referrer: '/',
        template: '',
        controller: function($location<%_ if(filters.ts) { _%>: ng.ILocationService<%_ } _%>, $route, Auth<%_ if(filters.ts) { _%>: IAuth<%_ } _%>) {
          var referrer = $route.current.params.referrer ||
                          $route.current.referrer ||
                          '/';
          Auth.logout();
          $location.path(referrer);
        }
      })
      .when('/signup', {
        template: require('./signup/signup.<%= templateExt %>'),
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .when('/settings', {
        template: require('./settings/settings.<%= templateExt %>'),
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
}<% } %>
