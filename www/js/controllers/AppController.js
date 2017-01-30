app.controller('AppCtrl', function ($scope, $rootScope, chatSocket,$log, messageFormatter,$state, $cordovaGeolocation, Users) {
    _initController = function () {
        $rootScope.mensajeria={};
        $rootScope.mensajeria.messageLog=[];
        $rootScope.mensajeria.newMessage=0;
        $rootScope.mensajeria.message = '';
        if (!window.localStorage.userTaxi && !$rootScope.user) {
            $state.go('login');
        } else if(!$rootScope.user) {
            $rootScope.user = Users.get({_id: localStorage.userTaxi},function () {
                _updatePosition();
                _initListen();
            });
        }else{
                _initListen();
        }
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
    _initController();

})