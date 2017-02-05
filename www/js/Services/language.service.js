angular
    .module('app')
    .factory('LanguageService', LanguageService);

    function LanguageService(){
            var lang;

            // Initialize language from phone's memory
//            lang = window.localStorage['lang'] ?window.localStorage['lang']:'en'; //|| null


            return {
                getLang: function () {
                    return window.localStorage['lang']?window.localStorage['lang']:'en';
                },
                setLang: function (newLang) {
                    window.localStorage['lang'] = newLang;
                }
            };
        }
        
         