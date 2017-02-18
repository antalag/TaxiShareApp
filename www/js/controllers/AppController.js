app.controller('AppCtrl', function ($scope, $ionicPush, $ionicPopup, $rootScope,$translate, chatSocket, $log, messageFormatter, $state, $cordovaGeolocation, Users) {
    _initController = function () {
        $rootScope.mensajeria = {};
        $rootScope.mensajeria.messageLog = [];
        $rootScope.mensajeria.newMessage = 0;
        $rootScope.mensajeria.message = '';
        if (!window.localStorage.userTaxi && !$rootScope.user) {
            $state.go('login');
        } else if (!$rootScope.user) {

            $ionicPush.register().then(function (t) {
                return $ionicPush.saveToken(t);
            }).then(function (t) {
                console.log('Token saved:', t.token);
            });
            $rootScope.user = Users.get({_id: localStorage.userTaxi}, function () {
                _updatePosition();
                _initListen();
            });
        } else {
            _initListen();
        }
        gapi.load('auth2', function() {
            gapi.auth2.init();
        });
    }
    _updatePosition = function () {
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            $rootScope.user.location = [pos.coords.longitude, pos.coords.latitude]
            Users.update({_id: $rootScope.user._id}, $rootScope.user);
        });
    }
    _initListen = function () {
        chatSocket.on('broadcast:' + $rootScope.user.email, function (data) {
            if (!data.payload) {
                $log.error('invalid message',
                        'data', JSON.stringify(data));
                return;
            }
            $rootScope.$apply(function () {
                $rootScope.newMessage += 1;
                $rootScope.mensajeria.messageLog.push(messageFormatter(
                        new Date(), data.source,
                        data.payload));
            });
        });
    }
    $scope.logOut = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('exit_title'),
            template: $translate.instant('exit_body'),
            okText: $translate.instant('ok_text'),
            okType:'button-positive',
            cancelText: $translate.instant('cancel_text'),
            cancelType:'button-assertive'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if($rootScope.user.googleId){
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut().then(function () {
                        window.localStorage.removeItem('userTaxi');
                        $state.go('login')
                    });
                }else{
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