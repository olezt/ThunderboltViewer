angular
    .module('app')
    .controller('Top3Ctrl', Top3Ctrl);
    
    Top3Ctrl.inject = ['$scope', '$http', '$location', 'ConnectionService', 'LocationSwapService'];

    function Top3Ctrl($scope, $http, $location, ConnectionService, LocationSwapService) {
            $scope.locationSwap = LocationSwapService;
            $scope.title = '<img src="img/top3_logo.png"  height=100%>';
            ConnectionService.init(false);
            $scope.top3 = [];
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
                    $scope.top3 = response;
                    for (var i = 0; i < response.features.length; i++) {
                        if ($scope.top3.features[i].properties.name == '') {
                            $scope.top3.features[i].properties.name = "No named area";
                        }
                    }
                }).error(function (error) {
                    //alert("Error");
                });
            }

//retry after internet is enabled again
            $scope.$on('$locationChangeSuccess', function () {
                var internet = $location.search().internet;
                if (internet == 'true') {
                    console.log("get again");
                    getTop3Cities();

                }
            });
        }