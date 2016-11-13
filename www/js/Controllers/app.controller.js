angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

    AppCtrl.inject = ['$scope', 'CityService'];
                
    function AppCtrl($scope, CityService) {
            $scope.City = [];
            for (var i = 0; i < 3; i++) {
                $scope.City.push({name: CityService.getCity(i), checked: CityService.getCheckbox(i)});
                //console.log($scope.City[i].name);
            }

            //change city name on menu
            $scope.updatedCityName = function (i) {
                $scope.City[i].name = CityService.getCity(i);
                return $scope.City[i].name;
            };

            //show-hide city name on menu, according to checkbox on settings
            $scope.updatedCheckbox = function (i) {
                $scope.City[i].checked = CityService.getCheckbox(i);
                if ($scope.City[i].checked == "true") {
                    return true;
                } else if ($scope.City[i].checked == true) {
                    return true;
                } else {
                    return false;
                }
            };

        }
