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
                vm.City.push({name: CityService.getCity(i), checked: CityService.getCheckbox(i)});
                //console.log($scope.City[i].name);
            }

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

        }
