angular
    .module('app')
    .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.inject = ['$rootScope', 'CityService', '$location', 'ConnectionService', 'LocationSwapService', 'HttpRequestService'];

        
        function SettingsCtrl($rootScope, CityService, $location, ConnectionService, LocationSwapService, HttpRequestService) {
            ConnectionService.init(false);
            var vm = this;
            vm.title = 'img/settings_logo.png';
            vm.searchtitle = '<img src="img/search_logo.png"  height=100%>';
            vm.locationSwap = LocationSwapService;
            vm.i = $location.search().i;
            vm.setOrder = setOrder;
            vm.clearInput = clearInput;
            vm.hide = hide;
            vm.clearCity = clearCity;
            vm.checkboxChecked = checkboxChecked;
            vm.assignCheckbox = assignCheckbox;
            vm.assignHours = assignHours;
            vm.assignLatLon = assignLatLon;
            vm.findAddresses = findAddresses;
            
            vm.City = [];
            for (var i = 0; i < 3; i++) {
                vm.City.push({name: CityService.getCity(i), lat: CityService.getlat(i), lon: CityService.getlon(i), checked: CityService.getCheckbox(i), selectedHours: CityService.gethours(i)});
            }

            vm.order = [];
            //set order of cities in settings page, in case some are empty
            function setOrder () {
                for (var i = 0; i < 3; i++) {
                    if (CityService.getCity(i) == null || CityService.getCity(i) == '') {
                        if (vm.order[2] == null) {
                            vm.order[2] = i;
                        } else if (vm.order[1] == null) {
                            vm.order[1] = i;
                        } else {
                            vm.order[0] = i;
                        }
                    } else {
                        if (vm.order[0] == null) {
                            vm.order[0] = i;
                        } else if (vm.order[1] == null) {
                            vm.order[1] = i;
                        } else {
                            vm.order[2] = i;
                        }
                    }
                }
            }
            vm.setOrder();

            //clear input at search page
            function clearInput (i) {
                vm.City[i].name = null;
                vm.searchAddresses = null;
                document.getElementById("searchPlace").focus();
            }

            //hide empty cities from user
            function hide (i) {
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
            function clearCity (i) {
                vm.City[i].name = null;
                CityService.setCity('', i);
                CityService.setlat(null, i);
                CityService.setlon(null, i);
                CityService.sethours('3', i);
                CityService.setCheckbox(false, i);
            }

            //set value of each city's checkbox
            function checkboxChecked (i) {
                if (vm.City[i].checked == "true") {
                    return true;
                } else if (vm.City[i].checked == true) {
                    return true;
                } else {
                    return false;
                }
            }

            //save new checkbox value
            function assignCheckbox (i) {
                CityService.setCheckbox(vm.City[i].checked, i);
            }

            //save new hours value
            function assignHours (selectedHours, i) {
                CityService.sethours(selectedHours, i);
            }

            //update value of settings city name
            $rootScope.$on('$locationChangeSuccess', function () {
                var cityName = $location.search().name;
                var i = $location.search().i;
                if (cityName != null) {
                    CityService.setCity(cityName, i);
                    vm.City[i].name = cityName;
                    vm.assignLatLon(cityName, i);
                    vm.searchAddresses = null;
                    $location.search('name', null);
                }
                vm.setOrder();
            });

            //save lat lon of new city
            function assignLatLon (cityName, i) {
                HttpRequestService.getCityLatLon(cityName)
                .success(function (response) {
                    if (cityName != null) {
                        vm.City[i].name=cityName;
                        var cities = [];
                        cities = response.results;
                        vm.City[i].lat = cities[0].geometry.location.lat;
                        vm.City[i].lon = cities[0].geometry.location.lng;
                        //save coordinates to memory
                        CityService.setlat(vm.City[i].lat, i);
                        CityService.setlon(vm.City[i].lon, i);
                    }
                })
                .error(function (error) {
                    vm.error = error;
                });

            };

            //get addresses that match input of search
            function findAddresses (i) {
                HttpRequestService.getAutocompleteAdrresses(vm.City[i].name)
                .success(function (response) {
                    var address = [];
                    var id = [];
                    for (var j = 0; j < response.predictions.length; j++) {
                        address[j] = response.predictions[j].description;
                        id[j] = response.predictions[j].place_id;
                    }
                    vm.searchAddresses = angular.fromJson(address);
                })
                .error(function (error) {
                    vm.error = error;
                });
            };
        }