angular
    .module('app')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.inject = ['$scope', '$location', 'CityService', 'ConnectionService', 'LocationSwapService'];

        
        function MapCtrl($scope, $location, CityService, ConnectionService, LocationSwapService) {
            $scope.locationSwap = LocationSwapService;
            ConnectionService.init(false);
            //set name of city for placeholder
            $scope.title = CityService.getCity($location.search().i);
            
            //refresh map when change city option
            $scope.$on('$locationChangeSuccess', function () {
                //trigger only when map is asked
                if ($location.path() === "/app/map") {
                    ConnectionService.init(true);
                    $scope.title = CityService.getCity($location.search().i);//$location.search().name;
                }
            });
        }