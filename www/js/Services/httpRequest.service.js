angular
    .module('app')
    .factory('HttpRequestService', HttpRequestService);

    HttpRequestService.inject = ['$http'];


    function HttpRequestService($http){
            var apiKey = "AIzaSyAdTE5a0IR28UAcHvf2XZGTix6dEgeMcpY";

            var service = {
                getCityLatLon: getCityLatLon,
                getAutocompleteAdrresses: getAutocompleteAdrresses,
                getTop3Cities: getTop3Cities
            };
            return service;
            
            function getCityLatLon(cityName) {
                return $http({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?key=" + apiKey + "&region=gr&bounds=31.458014039186203,12.47032852382813|44.20686993524687,33.73985977382813&address=" + cityName,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            
            function getAutocompleteAdrresses(userInput) {
                return $http({
                    url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" + apiKey + "&region=gr&bounds=31.458014039186203,12.47032852382813|44.20686993524687,33.73985977382813&input=" + userInput,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        
            function getTop3Cities(top3Api) {
                return $http({
                    url: top3Api,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
    }