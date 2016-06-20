'use strict';
<%_ if(filters.ts) { _%>
export function authInterceptor($rootScope: ng.IRootScopeService, $q: ng.IQService, $cookies<% if (filters.ngroute) { %>, $location: ng.ILocationService<% } if (filters.uirouter) { %>, $injector<% } %>, Util) {<%_ } else { _%>
export function authInterceptor($rootScope, $q, $cookies<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>, Util) {<%_ } _%>
  'ngInject';
  <%_ if (filters.uirouter) { _%>
  var state;<% } %>
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401) {
        <%_ if (filters.ngroute) { _%>
        $location.path('/login');<% } %>
        <%_ if (filters.uirouter) { _%>
        (state || (state = $injector.get('$state'))).go('login');<% } %>
        // remove any stale tokens
        $cookies.remove('token');
      }
      return $q.reject(response);
    }
  };
}
