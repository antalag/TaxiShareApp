app.controller('UserDetailCtrl', function ($scope, $stateParams, Users,$log,chatSocket,$rootScope) {
    _loadUser = function () {
        $scope.user = {};
        Users.get({_id: $stateParams.userId}).$promise.then(function (ActualUser) {
            $scope.ActualUser = ActualUser;
        });
        console.log($scope);
    }
    $scope.sendMessage = function (message,to) {
        chatSocket.emit('message', $rootScope.user.email, $rootScope.mensajeria.message,to);
        $rootScope.mensajeria.message = '';
    };
    _loadUser();
})