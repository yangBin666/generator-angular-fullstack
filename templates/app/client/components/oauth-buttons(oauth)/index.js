'use strict';

export function OauthButtonsController($window<%_ if(filters.ts) { _%>: ng.IWindowService<%_ } _%>) {
  this.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
}

export default angular.module('<%= scriptAppName %>.oauthButtons', [])
  .directive('oauthButtons', function() {
    return {
      template: require('./oauth-buttons.<%= templateExt %>'),
      restrict: 'EA',
      controller: OauthButtonsController,
      controllerAs: 'OauthButtons',
      scope: {
        classes: '@'
      }
    };
  })
  .name;
