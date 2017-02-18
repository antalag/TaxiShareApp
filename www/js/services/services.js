angular.module('starter.services', ['ngResource','constants.server'])
 .factory('Users', [
    '$resource','server', function($resource,server) {
      return $resource('http://'+server.host()+':'+server.port+'/api/users/:_id', {
        _id: '@_id'
      },{
          'update': { method:'PUT' },
      getNear:{
          method:'get',
          url:'http://'+server.host()+':'+server.port+'/api/users/near/:lat/:lng',
          params: {lat:'@lat',lng:'@lng'},
          isArray: true
      },
      login:{
          method:'get',
          url:'http://'+server.host()+':'+server.port+'/api/users/login/:email/:password',
          params: {email:'@email',password:'@password'},
          isArray: false
      },
      googleLogin:{
          method:'post',
          url:'http://'+server.host()+':'+server.port+'/api/users/googleLogin/:email',
          params:{
              email:'@email',
          },
          data: {
              name:'@name',
              image:'@image',
              ID:'@ID'
          },
          isArray: false
      },
  });
    }
  ]
  
      );
//.factory('Users', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  '$resource', function($resource) {
//      return $resource('http://blog.agresebe.com/api/users/:username', {
//        username: '@username'
//      });
//        }
//
//  return {
//    all: function() {
//        return $resource.query().$promise.then(function(results) {
//          return users = results;
//        });
//    },
//    remove: function(user) {
//      users.splice(users.indexOf(user), 1);
//    },
//    get: function(userId) {
//      for (var i = 0; i < users.length; i++) {
//        if (users[i].id === parseInt(userId)) {
//          return users[i];
//        }
//      }
//      return null;
//    }
//  };
//});
