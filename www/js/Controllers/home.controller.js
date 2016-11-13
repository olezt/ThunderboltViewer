angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.inject = ['$ionicSideMenuDelegate', 'LocationSwapService', '$timeout'];
            function HomeCtrl($ionicSideMenuDelegate, LocationSwapService, $timeout) {
            
            var vm = this;
            vm.onTouch = onTouch;
            vm.locationSwap = LocationSwapService;
            vm.title = '<img src="img/thunderbolts_logo.png"  height=100%>';
            vm.thunderbolt = 0;
            
            $ionicSideMenuDelegate.canDragContent(false);
            
            //create effect and redirect when user choose an option at home page
            function onTouch (id, i) {
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