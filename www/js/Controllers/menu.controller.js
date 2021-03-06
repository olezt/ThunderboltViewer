angular
    .module('app')
    .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.inject = ['CityService'];
                
    function MenuCtrl(CityService) {
            var vm = this;
            vm.City = [];
            vm.updatedCityName = updatedCityName;
            vm.updatedCheckbox = updatedCheckbox;
            
            for (var i = 0; i < 3; i++) {
                vm.City.push({name: CityService.getCity(i), checkbox: CityService.getCheckbox(i)});
                //console.log($scope.City[i].name);
            }

            //change city name on menu
            function updatedCityName (i) {
                vm.City[i].name = CityService.getCity(i);
                return vm.City[i].name;
            };

            //show-hide city name on menu, according to checkbox on settings
            function updatedCheckbox (i) {
                vm.City[i].checkbox = CityService.getCheckbox(i);
                if (vm.City[i].checkbox == "true" || vm.City[i].checkbox == true) {
                    return true;
                } else {
                    return false;
                }
            };

        }
