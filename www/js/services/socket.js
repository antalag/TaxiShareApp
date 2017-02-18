app.factory('chatSocket', function (socketFactory, $rootScope, server) {
    return socketFactory(
            {
                ioSocket: io.connect('http://' + server.host() + ':1337'),
                prefix: 'broadcast'
            }
    )
});
app.value('messageFormatter', function (date, nick, message) {
    return {hora: date.toLocaleTimeString(), nick: nick, msg: message};
});