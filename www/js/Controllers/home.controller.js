angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.inject = ['$scope', '$ionicSideMenuDelegate', 'LocationSwapService', '$timeout', '$translate', 'LanguageService'];
            function HomeCtrl($scope, $ionicSideMenuDelegate, LocationSwapService, $timeout, $translate, LanguageService) {
            
            var vm = this;
            vm.onTouch = onTouch;
            vm.locationSwap = LocationSwapService;
            vm.title = '<img src="img/thunderbolts_logo.png"  height=100%>';
            vm.thunderbolt = 0;
            vm.updateLang = vm.updateLang;
            vm.initLang = initLang;
            
            $ionicSideMenuDelegate.canDragContent(false);
            
            $scope.$watch('vm.lang', function() {
                updateLang();
            });
            
            
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
            
            function updateLang () {
            	$translate.use(vm.lang);
            	LanguageService.setLang(vm.lang);
            }
            
            function initLang(){
            	vm.lang = LanguageService.getLang();
            	$translate.use(vm.lang);
            }
            
        }