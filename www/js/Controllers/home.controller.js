angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.inject = ['$ionicSideMenuDelegate', '$scope', 'LocationSwapService', '$timeout'];
            function HomeCtrl($ionicSideMenuDelegate, $scope, LocationSwapService, $timeout) {

            $ionicSideMenuDelegate.canDragContent(false);
            $scope.locationSwap = LocationSwapService;
            $scope.title = '<img src="img/thunderbolts_logo.png"  height=100%>';
            $scope.thunderbolt = 0;
            
            //create effect and redirect when user choose an option at home page
            $scope.onTouch = function (id, i) {
                var option = id;
                if (id == "map" && i != null) {
                    option = "map" + i;
                }
                document.getElementById(option + "Btn").src = "img/" + option + "Btn2.png";
                $timeout(function () {
                    LocationSwapService.go(id, i);
                }, 75);

            }
        }