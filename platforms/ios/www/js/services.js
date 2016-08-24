
angular.module('starter.services', [])

        .factory('City', function () {
            var serviceCity = [];
            var serviceCheckbox = [];
            var servicelat = [];
            var servicelon = [];
            var servicehours = [];

            // Initialize settings' options from phone's memory
            for (var i = 0; i < 3; i++) {
                serviceCity[i] = window.localStorage['city' + i] || ''; //|| null
                servicelat[i] = window.localStorage['lat' + i];
                servicelon[i] = window.localStorage['lon' + i];
                serviceCheckbox[i] = window.localStorage['checkbox' + i] || false;
                servicehours[i] = window.localStorage['hours' + i] || 3;
            }

            return {
                getCity: function (i) {
                    return serviceCity[i];
                },
                setCity: function (city, i) {
                    // Simple index lookup
                    serviceCity[i] = city;
                    window.localStorage['city' + i] = city;

                },
                getlat: function (i) {
                    return servicelat[i];
                },
                setlat: function (lat, i) {
                    servicelat[i] = lat;
                    window.localStorage['lat' + i] = lat;
                },
                getlon: function (i) {
                    return servicelon[i];
                },
                setlon: function (lon, i) {
                    servicelon[i] = lon;
                    window.localStorage['lon' + i] = lon;
                },
                gethours: function (i) {
                    return servicehours[i];
                },
                sethours: function (hours, i) {
                    servicehours[i] = hours;
                    window.localStorage['hours' + i] = hours;

                },
                getCheckbox: function (i) {
                    return serviceCheckbox[i];
                },
                setCheckbox: function (checkbox, i) {
                    serviceCheckbox[i] = checkbox;
                    window.localStorage['checkbox' + i] = checkbox;
                }
            };
        })

        .factory('LocationSwap', function ($location) {
            return {
                go: function (page, i) {
                    switch (page) {
                        case 'settings':
                            $location.search('gps', null);
                            $location.search('gps2', null);
                            $location.path("app/settings");
                            break;
                        case 'home':
                            $location.search('gps', null);
                            $location.search('gps2', null);
                            $location.path("app/home");
                            break;
                        case 'search':
                            $location.search('gps', null);
                            $location.search('gps2', null);
                            $location.search('name', null);
                            $location.path("app/search").search('i', i);
                            break;
                        case 'top3':
                            $location.search('gps', null);
                            $location.search('gps2', null);
                            $location.path("app/top3");
                            break;
                        case 'map':
                            if (i == 'gps') {
                                $location.path("app/map").search('gps', 'true');
                                //$location.search('gps', null);
                                //no gps,settings opened and closed,retry
                            } else if (i == 'gps2') {
                                //$location.search('gps', null);
                                $location.path("app/map").search('gps2', 'true');
                                //$location.search('gps2', null);
                                //top3 map 
                            } else if (i == 'top3') {
                                $location.search('gps', null);
                            $location.search('gps2', null);
                                $location.path("app/map").search('top3', 'true');
                                //specific city map
                            } else {
                                $location.search('gps', null);
                            $location.search('gps2', null);
                                $location.search('top3', null);
                                $location.path("app/map").search('i', i); //no name needed, name would activate assigncity
                            }
                            break;
                        default:
                             $location.path("app/home");
                    }
                }
            }
        })

        .factory('PopUp', function ($location, $ionicLoading, $ionicPopup, LocationSwap, $timeout) {
            var alertPopup = null;
            var GPSalertPopup = null;
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "ios" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "ios" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : "null";
            //console.log(navigator.userAgent);
            //alert(deviceType);
            return {
                //close any pop up
                hidePopUp: function () {
                    $ionicLoading.hide();
                    if (alertPopup != null) {
                        console.log("hidepopup");
                        alertPopup.close();
                        alertPopup = null;
                    }
                    //at settings page enable placeholder and button
                    if ($location.path() === "/app/settings") {
                        angular.element(document).ready(function () {
                            for (var i = 0; i < 3; i++) {
                                document.getElementById("cityPlaceHolder" + i).disabled = false;
                                document.getElementById("mapButton" + i).style.display = 'inline';
                            }
                        });
                    }
                },
                //create internet pop up
                createPopUp: function () {
                    if (alertPopup == null) {
                        $ionicLoading.hide();
                        if (deviceType != 'ios') {
                        alertPopup = $ionicPopup.confirm({
                            title: 'No internet connection',
                            template: '<center><ion-spinner icon="ripple"></ion-spinner>Open settings?</center>'
                        });
                    }else{
                        alertPopup = $ionicPopup.alert({
                            title: 'No internet connection',
                        });
                    }
                    }

                    //at settings page disable placeholder and button
                    if ($location.path() === "/app/settings") {
                        angular.element(document).ready(function () {
                            for (var i = 0; i < 3; i++) {
                                document.getElementById("cityPlaceHolder" + i).disabled = true;
                                document.getElementById("mapButton" + i).style.display = 'none';
                            }
                        });
                    }

                    alertPopup.then(function (res) {
                        if (alertPopup != null) {
                            console.log("hidepopup");
                            alertPopup.close();
                            alertPopup = null;
                        }
                        //ok button
                        if (deviceType != 'ios') {
                        if (res) {
                            //open settings
                            cordova.plugins.settings.openSetting("settings", function () {
                                console.log("opened settings")
                                //reload page
                                $timeout(function () {
                                    $location.search('internet', 'true');
                                }, 1000);
                            }, function () {
                                alert("Error opening settings");
                            });
                            //cancel button
                        } else if (res === false) {
                            if ($location.path() !== "/app/settings") {
                                LocationSwap.go('home');
                            }
                        }
                    }else{
                        if ($location.path() !== "/app/settings") {
                                LocationSwap.go('home');
                            }
                    }
                    });
                },
                //create gps pop up if it disabled or location not found
                createGpsPopUp: function (gps, error) {
                    if (GPSalertPopup == null) {
                        $ionicLoading.hide();
                        console.log("createGPSpopup");
                        var popUpTitle = null;
                        var popUpTemplate = null;
                        //gps is disabled
                        if (gps == false) {
                            popUpTitle = 'GPS is not activated';
                            popUpTemplate = '<center>Open location settings?</center>';
                            //user opened gps settings
                        } else if (gps == 'settings_opened' && $location.search().gps2==null) {
                            popUpTitle = 'Location not found';
                            popUpTemplate = '<center>Try again?</center>';
                            //gps is enabled but location not found
                        } else {
                            popUpTitle = 'Location not found'
                        }
                        if (deviceType != 'ios') {
                        GPSalertPopup = $ionicPopup.confirm({
                            title: popUpTitle,
                            template: popUpTemplate
                        });
                        }else{
                            alertPopup = $ionicPopup.alert({
                                title: popUpTitle
                        });
                        }
                    }
                    
                    GPSalertPopup.then(function (res) { //user reacts to po up
                        //close pop up
                        if (GPSalertPopup != null) {
                            console.log("hideGPSpopup");
                            GPSalertPopup.close();
                            GPSalertPopup = null;
                        }
                         if (deviceType != 'ios') {   
                        if (res) { //user presses ok button                            
                            if (gps == false) { //gps is disabled
                            //open gps-location settings
                            if(typeof cordova.plugins.settings.openSetting != undefined){
                                cordova.plugins.settings.openSetting("location_source", function () {
                                    console.log("opened location_source settings");
                                    $timeout(function () { //wait 5 sec
                                        //reload page with param gps="settings_opened"

                                        LocationSwap.go('map','gps');
                                    }, 4000);
                                }, function () {
                                    //alert("Error opening settings");
                                });
                            }
                                //settings opened and closed, retry for gps
                            } else if (gps == 'settings_opened') {
                                LocationSwap.go('map','gps2');
                            }
                        }
                    }
                    });
                }
            }
        })
        
         