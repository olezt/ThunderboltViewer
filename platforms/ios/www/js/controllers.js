angular.module('starter.controllers', [])


        .controller('MapCtrl', function ($scope, $location, City, Connection, LocationSwap) {
            $scope.locationSwap = LocationSwap;
            Connection.init(false);
            //set name of city for placeholder
            $scope.title = City.getCity($location.search().i);
            
            //refresh map when change city option
            $scope.$on('$locationChangeSuccess', function () {
                //trigger only when map is asked
                if ($location.path() === "/app/map") {
                    Connection.init(true);
                    $scope.title = City.getCity($location.search().i);//$location.search().name;
                }
            });
        })

        .controller('Top3Ctrl', function ($scope, $http, $location, Connection, LocationSwap) {
            $scope.locationSwap = LocationSwap;
            $scope.title = '<img src="img/top3_logo.png"  height=100%>';
            Connection.init(false);
            $scope.top3 = [];
            getTop3Cities();

            function getTop3Cities() {
                var top3Api = "http://195.251.31.119/~strikes/api/index.php/ClustersController/gettop?number=3";
                $http({
                    url: top3Api,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (response) {
                    $scope.top3 = response;
                    for (var i = 0; i < response.features.length; i++) {
                        if ($scope.top3.features[i].properties.name == '') {
                            $scope.top3.features[i].properties.name = "No named area";
                        }
                    }
                }).error(function (error) {
                    //alert("Error");
                });
            }

//retry after internet is enabled again
            $scope.$on('$locationChangeSuccess', function () {
                var internet = $location.search().internet;
                if (internet == 'true') {
                    console.log("get again");
                    getTop3Cities();

                }
            });
        })

        .controller('SettingsCtrl', function ($scope, City, $http, $location, Connection, LocationSwap) {
            var apiKey = "APIKEY";
            Connection.init(false);

            $scope.title = '<img src="img/settings_logo.png"   height=100%>';
            $scope.searchtitle = '<img src="img/search_logo.png"  height=100%>';
            $scope.locationSwap = LocationSwap;
            $scope.i = $location.search().i;

            $scope.City = [];
            for (var i = 0; i < 3; i++) {
                $scope.City.push({name: City.getCity(i), lat: City.getlat(i), lon: City.getlon(i), checked: City.getCheckbox(i), selectedHours: City.gethours(i)});
            }

            $scope.order = [];
            //set order of cities in settings page, in case some are empty
            $scope.setOrder = function () {
                for (var i = 0; i < 3; i++) {
                    if (City.getCity(i) == null || City.getCity(i) == '') {
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
                } else if ((City.getCity(i - 1) === null || City.getCity(i - 1) === '') && (City.getCity(i) === '' || City.getCity(i) === null)) {
                    return true;
                } else if (i == 2) {
                    if ((City.getCity(i - 2) === null || City.getCity(i - 2) === '') && (City.getCity(i) === '' || City.getCity(i) === null)) {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            //delete a city
            $scope.clearCity = function (i) {
                $scope.City[i].name = null;
                City.setCity('', i);
                City.setlat(null, i);
                City.setlon(null, i);
                City.sethours('3', i);
                City.setCheckbox(false, i);
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
                City.setCheckbox($scope.City[i].checked, i);
            }

            //save new hours value
            $scope.assignHours = function (selectedHours, i) {
                City.sethours(selectedHours, i);
            }

            //update value of settings city name
            $scope.$on('$locationChangeSuccess', function () {
                var cityName = $location.search().name;
                var i = $location.search().i;
                if (cityName != null) {
                    City.setCity(cityName, i);
                    $scope.City[i].name = cityName;
                    $scope.assignLatLon(cityName, i);
                    $scope.searchAddresses = null;
                    $location.search('name', null);
                }
                $scope.setOrder();
            });

            //save lat lon of new city
            $scope.assignLatLon = function (cityName, i) {
                $http({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?key=" + apiKey + "&region=gr&bounds=31.458014039186203,12.47032852382813|44.20686993524687,33.73985977382813&address=" + cityName,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (response) {
                    if (cityName != null) {
                        var cities = [];
                        cities = response.results;
                        $scope.City[i].lat = cities[0].geometry.location.lat;
                        $scope.City[i].lon = cities[0].geometry.location.lng;
                        //save coordinates to memory
                        City.setlat($scope.City[i].lat, i);
                        City.setlon($scope.City[i].lon, i);
                    }
                }).error(function (error) {
                    $scope.error = error;
                });

            };

            //get addresses that match input of search
            $scope.findAddresses = function (i) {
                $http({
                    url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" + apiKey + "&region=gr&bounds=31.458014039186203,12.47032852382813|44.20686993524687,33.73985977382813&input=" + $scope.City[i].name,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (response) {
                    var address = [];
                    var id = [];
                    for (var j = 0; j < response.predictions.length; j++) {
                        address[j] = response.predictions[j].description;
                        id[j] = response.predictions[j].place_id;
                    }
                    $scope.searchAddresses = angular.fromJson(address);
                }).error(function (error) {
                    $scope.error = error;
                });
            };
        })

        .controller('HomeCtrl', function ($ionicSideMenuDelegate, $scope, LocationSwap, $timeout) {

            $ionicSideMenuDelegate.canDragContent(false);
            $scope.locationSwap = LocationSwap;
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
                    LocationSwap.go(id, i);
                }, 75);

            }
        })

        .controller('AppCtrl', function ($scope, City) {
            $scope.City = [];
            for (var i = 0; i < 3; i++) {
                $scope.City.push({name: City.getCity(i), checked: City.getCheckbox(i)});
                //console.log($scope.City[i].name);
            }

            //change city name on menu
            $scope.updatedCityName = function (i) {
                $scope.City[i].name = City.getCity(i);
                return $scope.City[i].name;
            };

            //show-hide city name on menu, according to checkbox on settings
            $scope.updatedCheckbox = function (i) {
                $scope.City[i].checked = City.getCheckbox(i);
                if ($scope.City[i].checked == "true") {
                    return true;
                } else if ($scope.City[i].checked == true) {
                    return true;
                } else {
                    return false;
                }
            };

        });
