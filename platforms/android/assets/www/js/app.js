
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'ui.router', 'starter.services', 'autofocus'])

        .factory('GoogleMaps', function ($cordovaGeolocation, $location, City, $ionicLoading, PopUp) {
            var listenerHandle;
            var marker = null;
            var map = null;
            var latLng;
            var mapOptions;
            var count = 0;
            var bounds;
            var top3 = null;
            
            //set style for map and footer
            function footerMapSettings(zoom, visibility, height, markervisible) {
                map.setZoom(zoom);
                document.getElementById('footer').style.display = visibility;
                document.getElementById('map').style.height = height;
                marker.setVisible(markervisible);
            }

            function createMap(refresh) {
                //window.L_DISABLE_3D = true;
                //if top3 map is asked,footer is not displayed
                if ($location.search().top3 == null) {
                    document.getElementById('footer').onclick = function () {
                        updateGeoJson();
                    };
                }
                //create new map
                if (refresh === false) {
                    mapOptions = {
                        center: latLng,
                        zoom: 10, //10
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false
                    };
                    map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    new google.maps.Circle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillOpacity: 0,
                        map: map,
                        center: new google.maps.LatLng(37.960990, 23.707768),
                        radius: 650000 //650km radius from harokopio
                    });

                    // Add the city marker to the map
                    marker = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.DROP,
                        position: latLng,
                        icon: './img/marker.png'
                    });
                    //refresh map center
                } else if (refresh === true) {
                    map.setCenter(latLng);
                    marker.setPosition(latLng);
                }
                //disable footer if top 3 cities are displayed
                if (top3 != null) {
                    footerMapSettings(4, "none", "100%", false);
                } else {
                    footerMapSettings(10, "inline", "86%", true);
                }
                //refresh thunderbolts / load top cities inside map boundaries
                getMapBounds();
                //wait until map is ready
                google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                    updateGeoJson();
                });
            }

            //get bounds of map every time they change
            function getMapBounds() {
                google.maps.event.addListener(map, 'bounds_changed', function () {
                    bounds = map.getBounds();
                });
            }

            //remove previous markers
            function clearMarkers() {
                setfooter('clear');
                //set marker counter to 0
                count = 0;
                //clear possible previous markers
                map.data.forEach(function (feature) {
                    map.data.remove(feature);
                });
                //clear possible previous listeners, such as infowindows
                google.maps.event.removeListener(listenerHandle);
            }

            //set map footer text
            function setfooter(clear) {
                var count;
                if (clear == 'clear') {
                    count = 0
                } else {
                    count = window.localStorage['counter'];
                }
                //display how many thunderbolts are on map 
                if ($location.search().top3 == null) {
                    if ($location.search().i != null) {
                        document.getElementById("count").innerHTML = count + " thundebolts, last " + City.gethours($location.search().i) + " hours <i class=\"icon ion-refresh\"></i>";
                        //if map with current location is used
                    } else {
                        document.getElementById("count").innerHTML = count + " thundebolts, last 2 hours <i class=\"icon ion-refresh\"></i>";
                    }
                }
            }

            //set thunderbolts' icons
            function setThunderStyle(top3) {
                if (top3 == false) {
                    window.localStorage['counter'] = 0;
                    //get current date time
                    var date = new Date();
                    //get hours until 23.00
                    var hoursTo23 = 23 - date.getHours();
                    //style the icon of the thunder on the map
                    map.data.setStyle(function (feature) {
                        count = count + 1;
                        window.localStorage['counter'] = count;
                        setfooter(false);
                        //convert HH format of thunder's time to integer and add hours remaining until 23.00
                        var pngName = parseInt(feature.getProperty('date').substring(11, 13).valueOf(), 10) + hoursTo23;
                        //newest 23.png=red to oldest 00=blue
                        if (pngName > 23) {
                            pngName = pngName - 23;
                        }
                        //get HH format
                        pngName = (pngName < 10 ? "0" : "") + pngName;

                        return {
                            icon: './img/thunder_icons/' + pngName + '.png',
                        };
                    });
                } else {
                    map.data.setStyle(function (feature) {
                        return {
                            icon: './img/marker.png'
                        };
                    });
                }
            }

            //set thunderbolts' or clusters' info window
            function createInfoWindow() {
                var infowindow = new google.maps.InfoWindow();

                //variable listenerHandle is used to delete listener at clearMarkers
                listenerHandle = map.data.addListener('click', function (event) {
                    var date = event.feature.getProperty("date");
                    var name = event.feature.getProperty("name");
                    var parts = event.feature.getProperty("parts");

                    //thunderbolts' infowindow
                    if (top3 == null) {
                        infowindow.setContent("<div style='width:150px; text-align: center;'>" + date + "</div>");
                        //clusters' infowindow
                    } else {
                        if (name == '') {
                            name = "No named area";
                        }
                        infowindow.setContent("<div style='width:150px; text-align: center;'>" + parts + ": " + name + "</div>");
                    }
                    infowindow.setPosition(event.feature.getGeometry().get());
                    infowindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
                    infowindow.open(map);
                });
            }

            //update data on map
            function updateGeoJson() {
                loadingThunderboltsTemplate();
                var apiUrl;
                clearMarkers();
                //set api for clusters
                if (top3 != null) {
                    apiUrl = "http://195.251.31.119/~strikes/api/index.php/ClustersController/gettop?number=3";
                    setThunderStyle(true);
                    //set api for thunderbolts
                } else {
                    var i = $location.search().i;
                    apiUrl = "http://195.251.31.119/~strikes/api/index.php/ThunderboltsController";
                    //set map bounds to get thunderbolts only in between
                    var params = '&nelat=' + bounds.getNorthEast().lat() + '&nelng=' + bounds.getNorthEast().lng() + '&swlat=' + bounds.getSouthWest().lat() + '&swlng=' + bounds.getSouthWest().lng();
                    //if specific city is used
                    if (i != null) {
                        apiUrl = apiUrl + '?hours=' + City.gethours(i) + params;
                        //if current location is used, last 2 hours by default
                    } else {
                        apiUrl = apiUrl + '?hours=2' + params;
                    }
                    setThunderStyle(false);
                }
                //load data on map
                map.data.loadGeoJson(apiUrl, null, function () {
                    createInfoWindow();
                    $ionicLoading.hide();
                });
            }

            //message that location is loading
            loadingLocationTemplate = function () {
                $ionicLoading.show({
                    template: 'Loading Location...'
                });
            };

            //message that thunderbolts are loading
            loadingThunderboltsTemplate = function () {
                $ionicLoading.show({
                    template: 'Loading Thunderbolts...',
                    duration: 3000
                });
            };

            //to do if gps found the device location
            var gpsOnsuccess = function (position, refresh) {
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                createMap(refresh, function () {
                    $ionicLoading.hide();
                });
            };

            //to do if gps did not find the device location
            var gpsError = function (refresh, error, gps) {
                //set map center at Athens center
                latLng = new google.maps.LatLng(37.9837155, 23.7293097);
                createMap(refresh, function () {
                    $ionicLoading.hide();
                });
                //if gps was disabled
                if (error == "PositionError.PERMISSION_DENIED" || error.message == "User denied Geolocation" || error.message == "The last location provider was disabled") {
                    //if user opened gps-location settings
                    if (gps[0] == 'true') {
                        PopUp.createGpsPopUp('settings_opened', error);
                    } else {
                        PopUp.createGpsPopUp(false, error);
                    }
                    //if gps was enabled but location not found
                } else {
                    PopUp.createGpsPopUp(true, error);
                }
            };


            return {
                initMap: function (refresh) {
                    count = 0;
                    var gpsOptions = {timeout: 4000, enableHighAccuracy: true};
                    var i = $location.search().i;
                    top3 = $location.search().top3;
                    var gps = [$location.search().gps, $location.search().gps2];
                    loadingLocationTemplate();
                    //create map for selected city
                    if (i != null) {
                        latLng = new google.maps.LatLng(City.getlat(i), City.getlon(i));
                        createMap(refresh, function () {
                            $ionicLoading.hide();
                        });
                        //create map for current location
                    } else if (i == null && top3 == null || gps[0] == 'true' || gps[1] == 'true') {
                        //createmap is called inside each case because of the delay of finding location
                        loadingLocationTemplate();
                        $cordovaGeolocation.getCurrentPosition(gpsOptions).then(function (position) {
                            gpsOnsuccess(position, refresh);
                            //location was not retrieved
                        }, function (error) {
                            gpsError(refresh, error, gps);
                        });
                        //create map for clusted thunderbolts
                    } else if (top3 != null) {
                        //Center at Harokopio
                        latLng = new google.maps.LatLng(37.9837155, 23.7293097);
                        createMap(refresh, function () {
                            $ionicLoading.hide();
                        });
                    }
                }
            };
        })

        .factory('Connection', function ($cordovaNetwork, $location, $rootScope, GoogleMaps, PopUp) {
            var alertPopup = null;

            //refresh or initialize map in case of corrupted map
            function checkLoaded(refresh) {
                //check if google maps javascript api is loaded
                if (google.maps) {
                    if (typeof google === 'object' && typeof google.maps === 'object' && GoogleMaps.mapOptions !== null && GoogleMaps.map !== null) {
                        google.maps.event.addDomListener(window, 'load', GoogleMaps.initMap(refresh));
                    } else {
                        GoogleMaps.initMap(false);
                    }
                //reload google maps javascript api
                } else {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.onload = function () {
                        // Cleanup onload handler
                        script.onload = null;
                        GoogleMaps.initMap(false);
                    }
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1RlpsPiVY1X4AR5l2xPKD3A9bRkf3oq4";
                    // Add the script to the DOM
                    (document.getElementsByTagName("head")[ 0 ]).appendChild(script);
                }
            };

            function doWhenOffline() {
                if (alertPopup === null) {
                    PopUp.createPopUp();
                }
            }

            function doWhenOnline(refresh) {
                PopUp.hidePopUp();
                if ($location.path() === "/app/map") {
                    checkLoaded(refresh);
                }
            }

            function addConnectivityListeners() {
//                //Running on a device 
                if (ionic.Platform.isWebView()) {
                    $rootScope.$on('$cordovaNetwork:online', function () {
                        console.log("online cordova");
                        doWhenOnline(false);
                        if ($location.path() !== "/app/map") {
                            $location.search('internet', 'true');
                        }
                    });

                    $rootScope.$on('$cordovaNetwork:offline', function () {
                        console.log("offline cordova");
                        doWhenOffline();
                    });
//                    //Running on browser
                } else {
                    window.addEventListener("online", function (e) {
                        console.log("online");
                        doWhenOnline();
                        if ($location.path() !== "/app/map") {
                            $location.search('internet', 'true');
                        }
                    }, false);

                    window.addEventListener("offline", function (e) {
                        console.log("offline");
                        doWhenOffline();
                    }, false);
                }
            }

            return {
                init: function (refresh) {
                    //device                  
                    if (ionic.Platform.isWebView()) {
                        if ($cordovaNetwork.isOnline()) {
                            doWhenOnline(refresh);
                        } else {
                            doWhenOffline();
                        }
                        //browser
                    } else {
                        if (navigator.onLine) {
                            doWhenOnline(refresh);
                        } else {
                            doWhenOffline();
                        }
                    }
                    addConnectivityListeners(refresh);
                }
            };
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'AppCtrl'
                    })

                    .state('app.top3', {
                        url: "/top3",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/top3.html",
                                controller: 'Top3Ctrl'
                            }
                        }
                    })

                    .state('app.map', {
                        url: '/map',
                        views: {
                            'menuContent': {
                                templateUrl: "templates/map.html",
                                controller: 'MapCtrl'
                            }
                        }
                    })

                    .state('app.home', {
                        url: "/home",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/home.html",
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('app.settings', {
                        url: "/settings",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/settings.html",
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

                    .state('app.search', {
                        url: "/search",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/search.html",
                                controller: 'SettingsCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        });
