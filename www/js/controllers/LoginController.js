
app.controller('loginCtrl', function ($scope, $rootScope, Users, $state, $ionicPopup, $cordovaGooglePlus, server) {
    $scope.data = {email: '', password: '', hostname: server.hostname}
    $scope.login = function (form) {
        if (form.$valid) {
            Users.login($scope.data).$promise.then(function (user) {
                localStorage.setItem('userTaxi', user._id);
                $state.go('app.dash')
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: error.data
                });
            });
        }
    }
    gapi.load('auth2', function () {
        gapi.auth2.init();
    });
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        console.log(authResult);
        var profile = authResult.getBasicProfile();
        Users.googleLogin({
            email: profile.getEmail(),
            name: profile.getName(),
            image: profile.getImageUrl(),
            ID: profile.getId()
        }).$promise.then(function (user) {
            localStorage.setItem('userTaxi', user._id);
            $state.go('app.dash')
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: error.data
            });
        });
    })
    $scope.googlePlusLogin = function () {
        if (window.plugins) {
            $cordovaGooglePlus.login({})
                    .then(function (res) {
                        console.log('good');
                        console.log(JSON.stringify(res));
                        //{"email":"antalag@gmail.com","userId":"105135634634599122733","displayName":"Angel Talaverón","familyName":"Talaverón","givenName":"Angel","imageUrl":"https://lh6.googleusercontent.com/-NIA3of4tWtA/AAAAAAAAAAI/AAAAAAAAAFU/2qIF7QAW5gY/photo.jpg"}
                        this.userData = res;
                    }, function (err) {
                        console.log('error');
                        console.log(err);
                    });
        } else {

            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signIn().then(function (authResult) {
                var profile = authResult.getBasicProfile();
                Users.googleLogin({
                    email: profile.getEmail(),
                    name: profile.getName(),
                    image: profile.getImageUrl(),
                    ID: profile.getId()
                }).$promise.then(function (user) {
                    localStorage.setItem('userTaxi', user._id);
                    $state.go('app.dash')
                }, function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: error.data
                    });
                });
            });
        }
    }
})