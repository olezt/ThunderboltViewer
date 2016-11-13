angular
    .module('app')
    .controller('Top3Ctrl', Top3Ctrl);
    
    Top3Ctrl.inject = ['$rootScope', '$http', '$location', 'ConnectionService', 'LocationSwapService'];

    function Top3Ctrl($rootScope, $http, $location, ConnectionService, LocationSwapService) {
        var vm = this;
        
            vm.locationSwap = LocationSwapService;
            vm.title = '<img src="img/top3_logo.png"  height=100%>';
            ConnectionService.init(false);
            vm.top3 = [];
            getTop3Cities();

            function getTop3Cities() {
                var top3Api = "http://195.251.31.119/~strikes/api/index.php/ClustersController/gettop?number=3";
                $http({
                    url: top3Api,
                    dataType: "json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (response) {
                    vm.top3 = response;
                    for (var i = 0; i < response.features.length; i++) {
                        if (vm.top3.features[i].properties.name == '') {
                            vm.top3.features[i].properties.name = "No named area";
                        }
                    }
                }).error(function (error) {
                    //alert("Error");
                });
            }

            //retry after internet is enabled again
            $rootScope.$on('$locationChangeSuccess', function () {
                var internet = $location.search().internet;
                if (internet == 'true') {
                    console.log("get again");
                    getTop3Cities();

                }
            });
        }