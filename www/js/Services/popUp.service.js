angular
    .module('app')
    .factory('PopUpService', PopUpService);

    PopUpService.inject = ['$location', '$ionicLoading', '$ionicPopup', 'LocationSwapService', '$timeout'];
    
        function PopUpService($location, $ionicLoading, $ionicPopup, LocationSwapService, $timeout) {
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
                                LocationSwapService.go('home');
                            }
                        }
                    }else{
                        if ($location.path() !== "/app/settings") {
                                LocationSwapService.go('home');
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

                                        LocationSwapService.go('map','gps');
                                    }, 4000);
                                }, function () {
                                    //alert("Error opening settings");
                                });
                            }
                                //settings opened and closed, retry for gps
                            } else if (gps == 'settings_opened') {
                                LocationSwapService.go('map','gps2');
                            }
                        }
                    }
                    });
                }
            }
        }
        
         