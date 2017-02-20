app.controller('UserDetailCtrl', function ($scope, $ionicScrollDelegate, $timeout, $stateParams, $sails, Users, Chat, $log, $rootScope) {
    _loadUser = function () {
        $scope.user = {};
        Users.get({id: $stateParams.userId}).$promise.then(function (ActualUser) {
            $scope.ActualUser = ActualUser;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom();
              });
        });
    }
    $scope.sendMessage = function (message, to) {
        $sails.post('/chat/addconv/', {from: $rootScope.user.email, message: $rootScope.mensajeria.message, to: to});
        $rootScope.mensajeria.message = '';
    };
    _loadUser();
})