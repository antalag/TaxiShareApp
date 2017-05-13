app.controller('UsersCtrl', function ($rootScope, $state,$sails, Users, $ionicNavBarDelegate,Chat,messageFormatter, $ionicPopup, $translate, $scope, $cordovaGeolocation, Groups) {
    _loadGroups = function () {
        $ionicNavBarDelegate.showBackButton(true);
        $scope.groups = [];
        $scope.join = $translate.instant('join_text')
        $scope.newgroup={}
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            $scope.location = pos.coords.latitude+','+ pos.coords.longitude;
            Groups.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.groups = results;
            });
        },function(err){
            var pos = {coords:{latitude:37.3962732,longitude:-5.9686537}};
            $scope.location = '37.3962732,-5.9686537';
            Groups.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.groups = results;
            });
            console.log(err);
        });
    };
    $scope.gotoGroup = function (group) {
        // TODO: Meter al usuario en el grupo 
        // TODO: Generar vista de usuario
        if (!$rootScope.user.group) {
            _joinGroup(group);
        } else if ($rootScope.user.group.id != group) {
            $ionicPopup.confirm({
                title: $translate.instant('title_change_group'),
                template: $translate.instant('text_change_group')
            }).then(function (res) {
                if (res) {
                    _joinGroup(group);
                }
            })
        } else {
            $state.go('app.group', {groupId: group});

        }
    }
    $scope.newGroup=function(){
        if (!$rootScope.user.group) {
            _createGroup();
        } else if ($rootScope.user.group) {
            $ionicPopup.confirm({
                title: $translate.instant('title_change_group'),
                template: $translate.instant('text_change_group')
            }).then(function (res) {
                if (res) {
                    var oldGroup=$rootScope.user.group.id;
                    $rootScope.user.group = null;
                    Users.update({id: $rootScope.user.id}, $rootScope.user).$promise.then(function (user) {
                        $sails.off(oldGroup);
                        _createGroup();
                    });
                }
            })
        }
    }
    _createGroup = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" id="newgroup_description" ng-model="newgroup.description">',
            title: $translate.instant('title_newgroup'),
            subTitle: $translate.instant('text_newgroup'),
            scope: $scope,
            buttons: [
                {text: $translate.instant('btn_cancel')},
                {
                    text: $translate.instant('btn_create'),
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log($scope);
                        if (!$scope.newgroup.description) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.newgroup.description;
                        }
                    }
                }
            ]
        }).then(function (res) {
            Groups.save({'description':res,'location':$rootScope.user.location}).$promise.then(function(group){
                _joinGroup(group);
            });
        });
    }
    _joinGroup = function (group) {
        $rootScope.user.group = group;
        Users.update({id: $rootScope.user.id}, $rootScope.user).$promise.then(function (user) {
            $rootScope.user=user;
            Chat.getGroup({group: $rootScope.user.group.id}, function (result) {
                angular.forEach(result, function (msg) {
                    $rootScope.mensajeria.messageLog.push(messageFormatter(msg));
                });
                $sails.get('/chat/connect', {group: $rootScope.user.group.id});
                $sails.on($rootScope.user.group.id, function (message) {
                    console.log(message);
                    if (message.verb === "created") {
                        $rootScope.newMessage += 1;
                        $rootScope.mensajeria.messageLog.push(messageFormatter(
                                new Date(), message.data.from,
                                message.data.message, message.data.to));
                    }
                });
                $sails.on('chat', function (message) {
                    $rootScope.newMessage += 1;
                    $rootScope.mensajeria.messageLog.push(messageFormatter(message));
                    $rootScope.$broadcast('nuevo.mensaje.chat');
                });
                $state.go('app.group', {groupId: $rootScope.user.group.id});
            });
        })
    }
    _loadGroups();
});