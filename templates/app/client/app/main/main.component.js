import angular from 'angular';
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } _%>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } _%>

import routing from './main.routes';

export class MainController {
  <%_ if(filters.ts) { _%>
  $http: ng.IHttpService;
  socket;
  awesomeThings: IThing[];
  newThing: string;
  <%_ } _%>

  /*@ngInject*/
  constructor($http<%_ if(filters.ts) { _%>: ng.IHttpService<%_ } _%><% if(filters.socketio) { %>, $scope<%_ if(filters.ts) { _%>: ng.IScope<%_ } _%>, socket<% } %>) {
    this.$http = $http;<% if (filters.socketio) { %>
    this.socket = socket;<% } %>
    this.awesomeThings = [];
    <%_ if (filters.socketio) { _%>

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });<% } %>
  }

  $onInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = <% if(filters.ts) { %><IThing[]><% } %>response.data;<% if (filters.socketio) { %>
      this.socket.syncUpdates('thing', this.awesomeThings);<% } %>
    });
  }<% if (filters.models) { %>

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing<%_ if(filters.ts) { _%>: IThing<%_ } _%>) {
    this.$http.delete('/api/things/' + thing._id);
  }<% } %>
}

<%_ if(filters.ts) { _%>
interface IThing {
  _id: string;
  name: string;
  info: string;
}<% } _%>

export default angular.module('<%= scriptAppName %>.main', [
  <%_ if(filters.ngroute) { _%>
  ngRoute<% } _%>
  <%_ if(filters.uirouter) { _%>
  uiRouter<% } _%>
])
    .config(routing)
    .component('main', {
      template: require('./main.<%= templateExt %>'),
      controller: MainController
    })
    .name;
