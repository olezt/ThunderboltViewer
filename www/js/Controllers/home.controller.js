angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.inject = ['$scope', '$ionicSideMenuDelegate', 'LocationSwapService', '$timeout', '$translate', 'LanguageService', 'CityService'];
            function HomeCtrl($scope, $ionicSideMenuDelegate, LocationSwapService, $timeout, $translate, LanguageService, CityService) {
            
            var vm = this;
            vm.onTouch = onTouch;
            vm.locationSwap = LocationSwapService;
            vm.title = 'img/thunderbolts_logo.png';
            vm.thunderbolt = 0;
            vm.updateLang = vm.updateLang;
            vm.initLang = initLang;
            vm.City = [];
            vm.updatedCityName = updatedCityName;
            vm.updatedCheckbox = updatedCheckbox;
            
            for (var i = 0; i < 3; i++) {
                vm.City.push({name: CityService.getCity(i), checked: CityService.getCheckbox(i)});
                //console.log($scope.City[i].name);
            }
            
            $ionicSideMenuDelegate.canDragContent(false);
            
            $scope.$watch('vm.lang', function() {
                updateLang();
            });
            
            //change city name on menu
            function updatedCityName (i) {
                vm.City[i].name = CityService.getCity(i);
                return vm.City[i].name;
            };

            //show-hide city name on menu, according to checkbox on settings
            function updatedCheckbox (i) {
                vm.City[i].checked = CityService.getCheckbox(i);
                if (vm.City[i].checked == "true") {
                    return true;
                } else if (vm.City[i].checked == true) {
                    return true;
                } else {
                    return false;
                }
            };
            
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