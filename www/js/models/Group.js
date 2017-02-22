angular.module('starter.groups', ['ngResource', 'constants.server'])
        .factory('Groups', [
            '$resource', 'server', function ($resource, server) {
                return $resource('http://' + server.host() + ':' + server.port + '/group/', {
                    id: '@id',
                    description: '@description',
                }, {
                    'update': {
                        method: 'PUT',
                        url: 'http://' + server.host() + ':' + server.port + '/group/:id',
                    },
                    getNear: {
                        method: 'get',
                        url: 'http://' + server.host() + ':' + server.port + '/group/near/',
                        params: {lat: '@lat', lng: '@lng'},
                        isArray: true
                    },
                });
            }
        ]);