app.controller('UsersCtrl', function ($scope, $cordovaGeolocation, Users) {
    $scope.loadUsers = function () {
        $scope.users = [];
        $cordovaGeolocation.getCurrentPosition().then(function(pos){
            var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            Users.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.users = results;
                results.forEach(function (user) {
                    var marker = new google.maps.Marker({
                        position: {lat: user.location[1], lng: user.location[0]},
                        label: user.name,
                        map: $scope.map,
                        url: '#/tab/users/' + user._id
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        window.location.href = this.url;
                    });
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