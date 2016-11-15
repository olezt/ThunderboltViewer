angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['$rootScope', '$location', 'CityService', 'ConnectionService', 'LocationSwapService'];

        
        function MapCtrl($rootScope, $location, CityService, ConnectionService, LocationSwapService) {
            var vm = this;
            vm.locationSwap = LocationSwapService;
            ConnectionService.init(false);
            //set name of city for placeholder
            vm.title = CityService.getCity($location.search().i);
            
            //refresh map when change city option
            $rootScope.$on('$locationChangeSuccess', function () {
                //trigger only when map is asked
                if ($location.path() === "/app/map") {
                    ConnectionService.init(true);
                    vm.title = CityService.getCity($location.search().i);//$location.search().name;
                }
            });
        }