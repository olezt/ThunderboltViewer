angular
    .module('app')
    .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.inject = ['$scope', 'CityService', '$http', '$location', 'ConnectionService', 'LocationSwapService', 'HttpRequestService'];

        
        function SettingsCtrl($scope, CityService, $http, $location, ConnectionService, LocationSwapService, HttpRequestService) {
            ConnectionService.init(false);

            $scope.title = '<img src="img/settings_logo.png"   height=100%>';
            $scope.searchtitle = '<img src="img/search_logo.png"  height=100%>';
            $scope.locationSwap = LocationSwapService;
            $scope.i = $location.search().i;

            $scope.City = [];
            for (var i = 0; i < 3; i++) {
                $scope.City.push({name: CityService.getCity(i), lat: CityService.getlat(i), lon: CityService.getlon(i), checked: CityService.getCheckbox(i), selectedHours: CityService.gethours(i)});
            }

            $scope.order = [];
            //set order of cities in settings page, in case some are empty
            $scope.setOrder = function () {
                for (var i = 0; i < 3; i++) {
                    if (CityService.getCity(i) == null || CityService.getCity(i) == '') {
                        if ($scope.order[2] == null) {
                            $scope.order[2] = i;
                        } else if ($scope.order[1] == null) {
                            $scope.order[1] = i;
                        } else {
                            $scope.order[0] = i;
                        }
                    } else {
                        if ($scope.order[0] == null) {
                            $scope.order[0] = i;
                        } else if ($scope.order[1] == null) {
                            $scope.order[1] = i;
                        } else {
                            $scope.order[2] = i;
                        }
                    }
                }
            }
            $scope.setOrder();

            //clear input at search page
            $scope.clearInput = function (i) {
                $scope.City[i].name = null;
                $scope.searchAddresses = null;
                document.getElementById("searchPlace").focus();
            }

            //hide empty cities from user
            $scope.hide = function (i) {
                if (i == 0) {
                    return false;
                } else if ((CityService.getCity(i - 1) === null || CityService.getCity(i - 1) === '') && (CityService.getCity(i) === '' || CityService.getCity(i) === null)) {
                    return true;
                } else if (i == 2) {
                    if ((CityService.getCity(i - 2) === null || CityService.getCity(i - 2) === '') && (CityService.getCity(i) === '' || CityService.getCity(i) === null)) {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            //delete a city
            $scope.clearCity = function (i) {
                $scope.City[i].name = null;
                CityService.setCity('', i);
                CityService.setlat(null, i);
                CityService.setlon(null, i);
                CityService.sethours('3', i);
                CityService.setCheckbox(false, i);
            }

            //set value of each city's checkbox
            $scope.checkboxChecked = function (i) {
                if ($scope.City[i].checked == "true") {
                    return true;
                } else if ($scope.City[i].checked == true) {
                    return true;
                } else {
                    return false;
                }
            }

            //save new checkbox value
            $scope.assignCheckbox = function (i) {
                CityService.setCheckbox($scope.City[i].checked, i);
            }

            //save new hours value
            $scope.assignHours = function (selectedHours, i) {
                CityService.sethours(selectedHours, i);
            }

            //update value of settings city name
            $scope.$on('$locationChangeSuccess', function () {
                var cityName = $location.search().name;
                var i = $location.search().i;
                if (cityName != null) {
                    CityService.setCity(cityName, i);
                    $scope.City[i].name = cityName;
                    $scope.assignLatLon(cityName, i);
                    $scope.searchAddresses = null;
                    $location.search('name', null);
                }
                $scope.setOrder();
            });

            //save lat lon of new city
            $scope.assignLatLon = function (cityName, i) {
                HttpRequestService.getCityLatLon(cityName)
                .success(function (response) {
                    if (cityName != null) {
                        var cities = [];
                        cities = response.results;
                        $scope.City[i].lat = cities[0].geometry.location.lat;
                        $scope.City[i].lon = cities[0].geometry.location.lng;
                        //save coordinates to memory
                        CityService.setlat($scope.City[i].lat, i);
                        CityService.setlon($scope.City[i].lon, i);
                    }
                })
                .error(function (error) {
                    $scope.error = error;
                });

            };

            //get addresses that match input of search
            $scope.findAddresses = function (i) {
                HttpRequestService.getAutocompleteAdrresses($scope.City[i].name)
                .success(function (response) {
                    var address = [];
                    var id = [];
                    for (var j = 0; j < response.predictions.length; j++) {
                        address[j] = response.predictions[j].description;
                        id[j] = response.predictions[j].place_id;
                    }
                    $scope.searchAddresses = angular.fromJson(address);
                })
                .error(function (error) {
                    $scope.error = error;
                });
            };
        }