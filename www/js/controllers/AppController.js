app.controller('AppCtrl', function ($scope, $ionicPopup, $sails, $rootScope, Chat, $translate, messageFormatter, $state, $cordovaGeolocation, Users) {
    _initController = function () {
        $rootScope.mensajeria = {};
        $rootScope.mensajeria.messageLog = [];
        $rootScope.mensajeria.newMessage = 0;
        $rootScope.mensajeria.message = {};
        if (!window.localStorage.userTaxi && !$rootScope.user) {
            $state.go('login');
        } else if (!$rootScope.user) {

//            $ionicPush.register().then(function (t) {
//                return $ionicPush.saveToken(t);
//            }).then(function (t) {
//                console.log('Token saved:', t.token);
//            });
            $rootScope.user = Users.get({id: localStorage.userTaxi}, function (res) {
                _updatePosition();
                _initListen();
            },function(error){
                localStorage.removeItem('userTaxi');
                $state.go('login')
            });
        } else {
            _initListen();
        }
        gapi.load('auth2', function () {
            gapi.auth2.init();
        });
    }
    _updatePosition = function () {
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            $rootScope.user.location = [pos.coords.longitude, pos.coords.latitude]
            Users.update({id: $rootScope.user.id}, $rootScope.user);
        });
    }
    _initListen = function () {
        if ($rootScope.user.group) {
        console.log($rootScope.user.group);
            Chat.getGroup({group: $rootScope.user.group.id}, function (result) {
                angular.forEach(result, function (msg) {
                    $rootScope.mensajeria.messageLog.push(messageFormatter(msg));
                    $rootScope.$broadcast('mensajes.cargados');
                });
                $sails.get('/chat/connect', {group: $rootScope.user.group.id});
                $sails.on($rootScope.user.group.id, function (message) {
                    console.log(message);
                    if (message.verb === "created") {
                        $rootScope.newMessage += 1;
                        $rootScope.mensajeria.messageLog.push(messageFormatter(
                                new Date(), message.data.from,
                                message.data.message, message.data.to));
                    }
                });
                $sails.on('chat', function (message) {
                    $rootScope.newMessage += 1;
                    $rootScope.mensajeria.messageLog.push(messageFormatter(message));
                    $rootScope.$broadcast('nuevo.mensaje.chat');
                });
            });
        }
//        chatSocket.on('broadcast:' + $rootScope.user.email, function (data) {
//            if (!data.payload) {
//                $log.error('invalid message',
//                        'data', JSON.stringify(data));
//                return;
//            }
//            $rootScope.$apply(function () {
//                $rootScope.newMessage += 1;
//                $rootScope.mensajeria.messageLog.push(messageFormatter(
//                        new Date(), data.source,
//                        data.payload));
//            });
//        });
    }
    $scope.logOut = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('exit_title'),
            template: $translate.instant('exit_body'),
            okText: $translate.instant('ok_text'),
            okType: 'button-positive',
            cancelText: $translate.instant('cancel_text'),
            cancelType: 'button-assertive'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if ($rootScope.user.googleId) {
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut().then(function () {
                        window.localStorage.removeItem('userTaxi');
                        $state.go('login')
                    });
                } else {
                    window.localStorage.removeItem('userTaxi');
                    $state.go('login')
                }
            } else {
                console.log('You are not sure');
            }
        });
    }
    _initController();

})