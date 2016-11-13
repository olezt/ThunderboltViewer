angular
    .module('app')
    .factory('CityService', CityService);

    function CityService(){
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
        }
        
         