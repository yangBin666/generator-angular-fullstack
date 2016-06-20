'use strict';
<%_ if(filters.ts) { _%>

import {IUser, IUserResource} from './user.service';

export interface IAuth {
  login(user, callback?: Function): ng.IPromise<any>;
  logout();
  createUser(user, callback?: Function): ng.IPromise<any>;
  changePassword(oldPassword: string, newPassword: string, callback?: Function): ng.IPromise<any>;
  getCurrentUser(callback?: Function): Object|ng.IPromise<any>;
  isLoggedIn(callback?: Function): boolean|ng.IPromise<any>;
  hasRole(role: string, callback?: Function): boolean|ng.IPromise<any>;
  isAdmin(): boolean|ng.IPromise<any>;
  getToken(): string;
}

export function AuthService($location: ng.ILocationService, $http: ng.IHttpService, $cookies,
    $q: ng.IQService, appConfig, Util, User: IUserResource) {
  <%_ } else { _%>
export function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {<%_ } _%>
  'ngInject';
  var safeCb = Util.safeCb;
  var currentUser<% if(filters.ts) { %>: IUser|Object<% } %> = {};
  var userRoles = appConfig.userRoles || [];

  if ($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth<% if(filters.ts) { %>: IAuth<% } %> = {

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    login({email, password}, callback: Function)<% if(filters.ts) { %>: ng.IPromise<any><% } %> {
      return $http.post('/auth/local', {
        email: email,
        password: password
      })
        .then(res => {
          <%_ if(filters.ts) { _%>
          $cookies.put('token', (<any>res.data).token);
          <%_ } else { _%>
          $cookies.put('token', res.data.token);<%_ } _%>
          currentUser = User.get();
          <%_ if(filters.ts) { _%>
          return (<IUser>currentUser).$promise;
          <%_ } else { _%>
          return currentUser.$promise;<%_ } _%>
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $cookies.remove('token');
      currentUser = {};
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    <%_ if(filters.ts) { _%>
    createUser(user: IUser, callback: Function): ng.IPromise<any> {
    <%_ } else { _%>
    createUser(user, callback) {<%_ } _%>
      return User.save(user,
        function(data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        },
        function(err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
    },

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional, function(error, user)
     * @return {Promise}
     */
    <%_ if(filters.ts) { _%>
    changePassword(oldPassword: string, newPassword: string, callback: Function): ng.IPromise<any> {
    <%_ } else { _%>
    changePassword(oldPassword, newPassword, callback) {<%_ } _%>
      let passwordChange = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };
      return User.changePassword(
        <%_ if(filters.ts) { _%>
        { id: (<IUser>currentUser)._id },
        <%_ } else { _%>
        { id: currentUser._id },<%_ } _%>
        passwordChange,
        function() {
          return safeCb(callback)(null);
        }, function(err) {
          return safeCb(callback)(err);
        }).$promise;
      },

    /**
     * Gets all available info on a user
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(user)
     * @return {Object|Promise}
     */
    <%_ if(filters.ts) { _%>
    getCurrentUser(callback: Function): Object|ng.IPromise<any> {
    <%_ } else { _%>
    getCurrentUser(callback) {<%_ } _%>
      if (arguments.length === 0) {
        return currentUser;
      }

      var value = (currentUser.hasOwnProperty('$promise')) ?
        <%_ if(filters.ts) { _%>
        (<IUser>currentUser).$promise : currentUser;
        <%_ } else { _%>
        currentUser.$promise : currentUser;<%_ } _%>
      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    <%_ if(filters.ts) { _%>
    isLoggedIn(callback: Function): boolean|ng.IPromise<any> {
    <%_ } else { _%>
    isLoggedIn(callback) {<%_ } _%>
      if (arguments.length === 0) {
        return currentUser.hasOwnProperty('role');
      }
      <%_ if(filters.ts) { _%>
      return (<ng.IPromise<any>>Auth.getCurrentUser(null))
      <%_ } else { _%>
      return Auth.getCurrentUser(null)<%_ } _%>
        .then(user => {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
    },

     /**
      * Check if a user has a specified role or higher
      *   (synchronous|asynchronous)
      *
      * @param  {String}     role     - the role to check against
      * @param  {Function|*} callback - optional, function(has)
      * @return {Bool|Promise}
      */
    <%_ if(filters.ts) { _%>
    hasRole(role: string, callback: Function): boolean|ng.IPromise<any> {
    <%_ } else { _%>
    hasRole(role, callback) {<%_ } _%>
      var hasRole = function(r, h) {
        return userRoles.indexOf(r) >= userRoles.indexOf(h);
      };

      if (arguments.length < 2) {
        <%_ if(filters.ts) { _%>
        return hasRole((<IUser>currentUser).role, role);
        <%_ } else { _%>
        return hasRole(currentUser.role, role);<%_ } _%>
      }
      <%_ if(filters.ts) { _%>
      return (<ng.IPromise<any>>Auth.getCurrentUser(null))
      <%_ } else { _%>
      return Auth.getCurrentUser(null)<%_ } _%>
        .then(user => {
          var has = (user.hasOwnProperty('role')) ?
            hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
    },

     /**
      * Check if a user is an admin
      *   (synchronous|asynchronous)
      *
      * @param  {Function|*} callback - optional, function(is)
      * @return {Bool|Promise}
      */
    isAdmin()<% if(filters.ts) { %>: boolean|ng.IPromise<any><% } %> {
      return Auth.hasRole
        .apply(Auth, [].concat.apply(['admin'], arguments));
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken()<% if(filters.ts) { %>: string<% } %> {
      return $cookies.get('token');
    }
  };

  return Auth;
}
