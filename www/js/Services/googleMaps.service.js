angular
    .module('app')
    .factory('GoogleMapsService', GoogleMapsService);
    
    GoogleMapsService.inject = ['$cordovaGeolocation', '$location', 'CityService', '$ionicLoading', 'PopUpService', '$translate'];
        
        function GoogleMapsService($cordovaGeolocation, $location, CityService, $ionicLoading, PopUpService, $translate){
        
            var listenerHandle;
            var marker = null;
            var map = null;
            var latLng;
            var mapOptions;
            var count = 0;
            var bounds;
            var top3 = null;
            
            var service = {
                initMap: initMap
            };
            
            return service;
            
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
                    var hours;
                    if ($location.search().i != null) {
                        hours = CityService.gethours($location.search().i);
                    }else{
                        hours = 2;
                    }
                    $translate('thunderbolts_last_hours_msg', { count: count, hours: hours }).then(function (translation) {
                        document.getElementById("count").innerHTML = translation;
                    },function (translationId) {
                        document.getElementById("count").innerHTML = "Refresh <i class=\"icon ion-refresh\"></i>";
                    });
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
                    apiUrl = "https://murmuring-tundra-79115.herokuapp.com/http://195.251.31.119/~strikes/api/index.php/ClustersController/gettop?number=3";
                    setThunderStyle(true);
                    //set api for thunderbolts
                } else {
                    var i = $location.search().i;
                    apiUrl = "https://murmuring-tundra-79115.herokuapp.com/http://195.251.31.119/~strikes/api/index.php/ThunderboltsController";
                    //set map bounds to get thunderbolts only in between
                    var params = '&nelat=' + bounds.getNorthEast().lat() + '&nelng=' + bounds.getNorthEast().lng() + '&swlat=' + bounds.getSouthWest().lat() + '&swlng=' + bounds.getSouthWest().lng();
                    //if specific city is used
                    if (i != null) {
                        apiUrl = apiUrl + '?hours=' + CityService.gethours(i) + params;
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
            function loadingLocationTemplate() {
                $ionicLoading.show({
                    template: 'Loading Location...'
                });
            };

            //message that thunderbolts are loading
            function loadingThunderboltsTemplate() {
                $ionicLoading.show({
                    template: 'Loading Thunderbolts...',
                    duration: 3000
                });
            };

            //to do if gps found the device location
            function gpsOnsuccess (position, refresh) {
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                createMap(refresh, function () {
                    $ionicLoading.hide();
                });
            };

            //to do if gps did not find the device location
            function gpsError (refresh, error, gps) {
                //set map center at Athens center
                latLng = new google.maps.LatLng(37.9837155, 23.7293097);
                createMap(refresh, function () {
                    $ionicLoading.hide();
                });
                //if gps was disabled
                if (error == "PositionError.PERMISSION_DENIED" || error.message == "User denied Geolocation" || error.message == "The last location provider was disabled") {
                    //if user opened gps-location settings
                    if (gps[0] == 'true') {
                        PopUpService.createGpsPopUp('settings_opened', error);
                    } else {
                        PopUpService.createGpsPopUp(false, error);
                    }
                    //if gps was enabled but location not found
                } else {
                    PopUpService.createGpsPopUp(true, error);
                }
            };


            
                function initMap(refresh) {
                    count = 0;
                    var gpsOptions = {timeout: 4000, enableHighAccuracy: true};
                    var i = $location.search().i;
                    top3 = $location.search().top3;
                    var gps = [$location.search().gps, $location.search().gps2];
                    //loadingLocationTemplate();
                    //create map for selected city
                    if (i != null) {
                        latLng = new google.maps.LatLng(CityService.getlat(i), CityService.getlon(i));
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
                
            };
        }
