angular
    .module('app')
    .config(['$translateProvider', function ($translateProvider) {
        
        $translateProvider.translations('en', {
            'home_msg': 'Home',
            'settings_msg': 'Settings',
            'my_location_msg': 'My location',
            'top_3_on_thunderbolts_msg': 'Top 3 on thunderbolts',
            'button_lang_EN': 'English',
            'button_lang_GR': 'Greek'
        });
  
        $translateProvider.translations('de', {
            'home_msg': 'Home',
            'settings_msg': 'Settings',
            'my_location_msg': 'My location',
            'top_3_on_thunderbolts_msg': 'Top 3 on thunderbolts',
            'button_lang_EN': 'English',
            'button_lang_GR': 'Greek'
        });
        
        $translateProvider.preferredLanguage('en');
    
        $translateProvider.forceAsyncReload(true);

    }]);