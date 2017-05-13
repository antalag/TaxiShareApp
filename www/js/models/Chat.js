angular.module('starter.chat', ['ngResource', 'constants.server'])
        .factory('Chat', [
            '$resource', 'server', function ($resource, server) {
                return $resource('http://' + server.host() + ':' + server.port + '/chat/', {
                    id: '@id'
                },
                {
                    getUser:{
                        url: 'http://' + server.host() + ':' + server.port + '/chat/user/',
                        params: {
                            user: '@user',
                        },
                        isArray: true
                    },
                    getGroup:{
                        url: 'http://' + server.host() + ':' + server.port + '/chat/group/',
                        params: {
                            group: '@group',
                        },
                        isArray: true
                    }
                }
                );
            }
        ])
        ;