angular
    .module('app')
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.translations('en', {
            'home_msg': 'Home',
            'settings_msg': 'Settings',
            'my_location_msg': 'My location',
            'top_3_on_thunderbolts_msg': 'Top 3 on thunderbolts',
            'button_lang_EN': 'English',
            'button_lang_GR': 'Greek',
            'choose_a_city_msg': 'Choose a city',
            'top_3_places_msg': "Top 3 places",
            'see_map_msg': 'See map',
            'Not_enough_thounderbolts_msg': 'Not enough thunderbolts. Please try again later',
            'hours_msg': 'Hours',
            'thunderbolts_last_hours_msg' : '{{count}} thundebolts, last {{hours}} hours <i class="icon ion-refresh"></i>'

        });
  
        $translateProvider.translations('gr', {
            'home_msg': 'Αρχική',
            'settings_msg': 'Ρυθμίσεις',
            'my_location_msg': 'Η τοποθεσίας μου',
            'top_3_on_thunderbolts_msg': 'Τοπ 3 περιοχές σε κεραυνούς',
            'button_lang_EN': 'English',
            'button_lang_GR': 'Greek',
            'choose_a_city_msg': 'Επιλέξτε μία περιοχή',
            'top_3_places_msg': "Τοπ 3 περιοχές",
            'see_map_msg': 'Δείτε τον χάρτη',
            'Not_enough_thounderbolts_msg': 'Δεν υπάρχουν αρκετοί κεραυνοί. Δοκιμάστε ξανά αργότερα.',
            'hours_msg': 'Ώρες',
            'thunderbolts_last_hours_msg' : '{{count}} κεραυνοί, τις τελευταίες {{hours}} ώρες <i class="icon ion-refresh"></i>'
        });
        
        $translateProvider.preferredLanguage('en');
    
        $translateProvider.forceAsyncReload(true);

        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    }]);