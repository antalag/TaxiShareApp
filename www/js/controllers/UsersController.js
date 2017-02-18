app.controller('UsersCtrl', function ($rootScope,$ionicNavBarDelegate, $scope, $cordovaGeolocation, Users) {
    $scope.loadUsers = function () {
        $ionicNavBarDelegate.showBackButton(true);
        $scope.users = [];
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            console.log($rootScope);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            Users.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.users = results;
                results.forEach(function (user) {
                    if (user._id != $rootScope.user._id) {
                        var marker = new google.maps.Marker({
                            position: {lat: user.location[1], lng: user.location[0]},
                            label: user.name,
                            map: $scope.map,
                            url: '#/app/users/' + user._id
                        });
                        google.maps.event.addListener(marker, 'click', function () {
                            window.location.href = this.url;
                        });
                    }
                });
            });
        });
    };
    $scope.remove = function (user) {
        console.debug(user);
        return user.$delete().then($scope.loadUsers);
    };
    $scope.loadUsers();
});