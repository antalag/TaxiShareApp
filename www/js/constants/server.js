angular.module('constants.server', [])
        .constant('server', {
            hostname:window.location.hostname,
            host: function () {
                if (window.location.hostname == 'localhost' || window.location.hostname == '192.168.0.12') {
                    return 'localhost';
                } else if (window.location.hostname == 'angeltalaveron.no-ip.org') {
                    return 'angeltalaveron.no-ip.org';
                } else
                    return '192.168.0.12';
            },
            port: '9615'
        })