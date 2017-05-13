app.controller('GroupCtrl', function ($scope, $ionicScrollDelegate, $timeout, $stateParams, $sails, Groups, $rootScope) {
    _loadUser = function () {
            Groups.get({id: $stateParams.groupId}).$promise.then(function (group) {
                $scope.group = group;
                $rootScope.user.group=group;
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom();
                },100);
            });
//            $scope.message={}
            $rootScope.mensajeria.message=''
    }
    $scope.$on('mensajes.cargados',function(){
        $ionicScrollDelegate.scrollBottom();
    })
    $scope.$on('nuevo.mensaje.chat',function(){
        $ionicScrollDelegate.scrollBottom(true);
    })
    $scope.sendMessage = function (message, to) {
        $sails.post('/chat/addconv/', {from: $rootScope.user.id, message: $rootScope.mensajeria.message, to: $scope.group.id});
        $rootScope.mensajeria.message=''
    };
    _loadUser();
})