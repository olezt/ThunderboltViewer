angular
    .module('app')
    .factory('CityService', CityService);

    function CityService(){
            var serviceCity = [];
            initServiceCity ();
            
            var service = {
                getCities: getCities,
                getCity: getCity,
                setCity: setCity,
                getlat: getlat,
                setlat: setlat,
                getlon: getlon,
                setlon: setlon,
                gethours: gethours,
                sethours: sethours,
                getCheckbox: getCheckbox,
                setCheckbox: setCheckbox
            };
            return service;
               
                // Initialize settings' options from phone's memory
                function initServiceCity () {
                    for (var i = 0; i < 3; i++) {
                        serviceCity.push({name:window.localStorage['city' + i],lat:window.localStorage['lat' + i],lon:window.localStorage['lon' + i],checkbox:window.localStorage['checkbox' + i] ,hours:window.localStorage['hours' + i]});
                    }
                }
            
                function getCities () {
                    return serviceCity;
                };

                function getCity (i) {
                    if(!serviceCity[i]){
                        return null;
                    }
                    return serviceCity[i].name;
                }
                
                function setCity (name, i) {
                    if(!serviceCity[i]){
                        serviceCity[i]={};
                    }
                    // Simple index lookup
                    serviceCity[i].name = name;
                    window.localStorage['city' + i] = name;

                }
                
                function getlat (i) {
                    return serviceCity[i].lat;
                }
                
                function setlat (lat, i) {
                    serviceCity[i].lat = lat;
                    window.localStorage['lat' + i] = lat;
                }
                
                function getlon (i) {
                    return serviceCity[i].lon;
                }
                
                function setlon (lon, i) {
                    serviceCity[i].lon = lon;
                    window.localStorage['lon' + i] = lon;
                }
                
                function gethours (i) {
                    return serviceCity[i].hours;
                }
                
                function sethours (hours, i) {
                    serviceCity[i].hours = hours;
                    window.localStorage['hours' + i] = hours;
                }
                
                function getCheckbox  (i) {
                    return serviceCity[i].checkbox;
                }

                function setCheckbox (checkbox, i) {
                    serviceCity[i].checkbox = checkbox;
                    window.localStorage['checkbox' + i] = checkbox;
                }

        }
        
         