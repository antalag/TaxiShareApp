app.controller('UsersCtrl', function ($rootScope,$state, $ionicNavBarDelegate, $scope, $cordovaGeolocation, Groups) {
    _loadGroups = function () {
        $ionicNavBarDelegate.showBackButton(true);
        $scope.groups = [];
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            $scope.location = pos;
            Groups.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.groups = results;
            });
        });
    };
    $scope.gotoGroup=function(event,group){
        // TODO: Meter al usuario en el grupo 
        // TODO: Generar vista de usuario
        $state.go('app.users-detail',{userId:group});
    }
    _loadGroups();
});