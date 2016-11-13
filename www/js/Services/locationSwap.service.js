angular
    .module('app')
    .factory('LocationSwapService', LocationSwapService);
    
    LocationSwapService.inject = ['$location'];

    function LocationSwapService($location) {
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
        }