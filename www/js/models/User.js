angular.module('starter.users', ['ngResource', 'constants.server'])
        .factory('Users', [
            '$resource', 'server', function ($resource, server) {
                return $resource('http://' + server.host() + ':' + server.port + '/user/', {
                    id: '@id'
                }, {
                    'update': {
                        method: 'PUT',
                        url: 'http://' + server.host() + ':' + server.port + '/user/update/:id',
                    },
                    getNear: {
                        method: 'get',
                        url: 'http://' + server.host() + ':' + server.port + '/user/near/',
                        params: {lat: '@lat', lng: '@lng'},
                        isArray: true
                    },
                    login: {
                        method: 'get',
                        url: 'http://' + server.host() + ':' + server.port + '/user/login/:email/:password',
                        params: {email: '@email', password: '@password'},
                        isArray: false
                    },
                    googleLogin: {
                        method: 'post',
                        url: 'http://' + server.host() + ':' + server.port + '/user/googleLogin/',
                        params: {
                            email: '@email',
                        },
                        data: {
                            name: '@name',
                            image: '@image',
                            ID: '@ID'
                        },
                        isArray: false
                    },
                });
            }
        ]
                );