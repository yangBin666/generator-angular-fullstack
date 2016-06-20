'use strict';

<%_ if(filters.ts) { _%>
//typings partially inspired from gist: https://gist.github.com/scottmcarthur/9005953
export interface IUser extends ng.resource.IResource<IUser> {
  _id: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
}

interface IPasswordChange {
  oldPassword: string;
  newPassword: string;
}

/**Allow specify more resource methods
 * No need to add duplicates for all four overloads.
 * Definitly Typed angular resource 1.5 interface with
 * added generic "U" to get typed data. 
 */
interface IResourceMethod<T, U> {
  (): T;
  (params: Object): T;
  (success: Function, error?: Function): T;
  (params: Object, success: Function, error?: Function): T;
  (params: Object, data: U, success?: Function, error?: Function): T;
}

export interface IUserResource extends ng.resource.IResourceClass<IUser> {
  changePassword: IResourceMethod<IUser, IPasswordChange>;
  get: IResourceMethod<IUser, Object>;
}
<%_ } _%>
export function UserResource($resource<%_ if(filters.ts) { _%>: ng.resource.IResourceService<%_ } _%>) {
  'ngInject';

  var changePassword<% if(filters.ts) { %>: ng.resource.IActionDescriptor<% } %> = {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    };

  var get<%_ if(filters.ts) { %>: ng.resource.IActionDescriptor<%_ } %> = {
      method: 'GET',
      params: {
        id: 'me'
      }
    };

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: changePassword,
    get: get
  });
}
