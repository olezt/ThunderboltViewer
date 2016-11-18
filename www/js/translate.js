angular
    .module('app')
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            'home_msg': 'Home',
            'settings_msg': 'Settings',
            'my_location_msg': 'My location',
            'top_3_on_thunderbolts_msg': 'Top 3 on thunderbolts'
        });
  
        $translateProvider.translations('gr', {
            'home_msg': 'Home',
            'settings_msg': 'Settings',
            'my_location_msg': 'My location',
            'top_3_on_thunderbolts_msg': 'Top 3 on thunderbolts'
        });
        
        $translateProvider.preferredLanguage('en');
    
        $translateProvider.forceAsyncReload(true);

    }]);