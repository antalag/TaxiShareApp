app.factory('chatSocket', function (socketFactory,$rootScope) {
//    var myIoSocket = io.connect('http://localhost:9615');

    return socketFactory(
            {
                ioSocket:io.connect('http://localhost:9615'),
        prefix:'broadcast'
    }
            )
//    socket.forward('broadcast:'+$rootScope.user);
//    return socket;
});
app.value('messageFormatter', function (date, nick, message) {
    return {hora:date.toLocaleTimeString(),nick:nick,msg:message};
});