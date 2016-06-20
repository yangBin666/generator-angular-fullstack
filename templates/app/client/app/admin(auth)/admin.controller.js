'use strict';
<%_ if(filters.ts) { _%>

import {IUser, IUserResource} from '../../components/auth/user.service';
<%_ } _%>

export default class AdminController {
  <%_ if(filters.ts || filters.flow) { _%>
  users: IUser[];

  <%_ } _%>
  /*@ngInject*/
  constructor(User<%_ if(filters.ts) { _%>: IUserResource<%_ } _%>) {
    // Use the User $resource to fetch all users
    this.users = User.query();
  }

  delete(user<%_ if(filters.ts) { _%>: IUser<%_ } _%>) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
