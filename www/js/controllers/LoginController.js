
app.controller('loginCtrl', function ($scope, $rootScope, Users, $state, $ionicPopup) {
    $scope.data = {email: '', password: ''}
    $scope.login = function (form) {
        if (form.$valid) {
            Users.login($scope.data).$promise.then(function (user) {
                localStorage.setItem('userTaxi',user._id);
                $state.go('tab.dash')
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: error.data
                });
            });
        }
    }
})