angular
    .module('app')
    .factory('ConnectionService', ConnectionService);

           ConnectionService.inject = ['$cordovaNetwork', '$location', '$rootScope', 'GoogleMapsService', 'PopUpService'];
                   
            function ConnectionService($cordovaNetwork, $location, $rootScope, GoogleMapsService, PopUpService) {
            var alertPopup = null;

            var service = {
                init: init
            };
            
            return service;

            //refresh or initialize map in case of corrupted map
            function checkLoaded(refresh) {
                //check if google maps javascript api is loaded
                if (google.maps) {
                    if (typeof google === 'object' && typeof google.maps === 'object' && GoogleMapsService.mapOptions !== null && GoogleMapsService.map !== null) {
                        google.maps.event.addDomListener(window, 'load', GoogleMapsService.initMap(refresh));
                    } else {
                        GoogleMapsService.initMap(false);
                    }
                //reload google maps javascript api
                } else {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.onload = function () {
                        // Cleanup onload handler
                        script.onload = null;
                        GoogleMapsService.initMap(false);
                    }
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1RlpsPiVY1X4AR5l2xPKD3A9bRkf3oq4";
                    // Add the script to the DOM
                    (document.getElementsByTagName("head")[ 0 ]).appendChild(script);
                }
            };

            function doWhenOffline() {
                if (alertPopup === null) {
                    //PopUpService.createPopUp();
                }
            }

            function doWhenOnline(refresh) {
                //PopUpService.hidePopUp();
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


                function init (refresh) {
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
        }
