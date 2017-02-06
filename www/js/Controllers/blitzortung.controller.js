angular
    .module('app')
    .controller('BlitzortungCtrl', BlitzortungCtrl);
    
BlitzortungCtrl.inject = ['$rootScope', '$http', '$interval', '$location', 'ConnectionService', 'LocationSwapService', 'HttpRequestService'];

    function BlitzortungCtrl($rootScope, $http, $interval, $location, ConnectionService, LocationSwapService, HttpRequestService) {
        var vm = this;
        
            vm.locationSwap = LocationSwapService;
            vm.refreshBlitzortungMap = refreshBlitzortungMap;
//            vm.title = 'img/blitzortung_logo.png';
            vm.title = 'Blitzortung';
            vm.blitzortungMapUrl = "https://murmuring-tundra-79115.herokuapp.com/images.blitzortung.org/Images/image_b_gr.png?t=1";
            $interval(refreshBlitzortungMap, 63000);
            ConnectionService.init(false);

            function refreshBlitzortungMap() {
            	if(vm.blitzortungMapUrl.substr(vm.blitzortungMapUrl.length - 1) == "1"){
            		vm.blitzortungMapUrl = vm.blitzortungMapUrl.replace("1","2");
            	}else{
            		vm.blitzortungMapUrl = vm.blitzortungMapUrl.replace("2","1");
            	}
            }

            //retry after internet is enabled again
            $rootScope.$on('$locationChangeSuccess', function () {
                var internet = $location.search().internet;
                if (internet == 'true') {
                    console.log("get again");
                    refreshBlitzortungMap();
                }
            });
        }
