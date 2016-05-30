(function () {
    "use strict";
    angular.module("TrafficLaws", ['ionic', 'ui.router', 'TrafficLaws.cordovaService', 'TrafficLaws.databaseService', 'TrafficLaws.HomeController', "TrafficLaws.SearchController", "TrafficLaws.CategoriesController", 'TrafficLaws.QuestionController', 'TrafficLaws.SettingController', 'TrafficLaws.QuestionSearchController', 'TrafficLaws.connectService', "TrafficLaws.TestController", "TrafficLaws.ThemeController"])
    
    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if (ionic.Platform.isAndroid()) {
            window.downloadAssets();
        }

        var changeLanguageEnabled = JSON.parse(window.localStorage.getItem("CHANGE_LANGUAGE_ENABLED"));
        if (changeLanguageEnabled != true && changeLanguageEnabled != false) {
            window.localStorage.setItem("CHANGE_LANGUAGE_ENABLED", false);
            changeLanguageEnabled = false;
        }

        if (window.adsEnabled && !changeLanguageEnabled) {
            window.initAds();
            var clickCount = 0;
            document.addEventListener("click", function(){
                clickCount++;
                if (clickCount%10 == 0 && !changeLanguageEnabled) {
                    initInterstitialAds();
                }
            });
        }
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          // cordova.plugins.Keyboard.disableScroll(true);
        }

        if( window.plugins && window.plugins.NativeAudio) {
            window.plugins.NativeAudio.preloadSimple("error",
                                                         "audio/error.wav",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });
            window.plugins.NativeAudio.preloadSimple("hard",
                                                         "audio/hard.wav",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });
            window.plugins.NativeAudio.preloadSimple("next",
                                                         "audio/next.wav",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });
            window.plugins.NativeAudio.preloadSimple("right",
                                                         "audio/right.wav",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });
            window.plugins.NativeAudio.preloadSimple("lang",
                                                         "audio/lang.mp3",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });
            window.plugins.NativeAudio.preloadSimple("flap",
                                                         "audio/flap.mp3",
                                                         function (msg) { console.info(msg) },
                                                         function (msg) { console.error('Error: ' + msg); });

            //var scroller = new TouchScroll(document.querySelector("#wrapAll"), { elastic: true });
        }
        
        if(window.StatusBar) {
          StatusBar.styleLightContent();
        }

        if (navigator.splashscreen) {
            console.warn('Hiding splash screen');
            // We're done initializing, remove the splash screen
            navigator.splashscreen.hide();
        }
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#181B3D");
        }


        ionic.Platform.isFullScreen = true
      });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'pages/home.html',
                controller: 'HomeCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'pages/search.html',
                controller: 'SearchCtrl'
            })  
            .state('categories', {
                url: '/categories',
                templateUrl: 'pages/categories.html',
                controller: 'CategoriesCtrl'
            })                
            .state('test', {
                url: '/test',
                templateUrl: 'pages/test.html',
                controller: 'TestCtrl'
            })
            .state('statistic', {
                url: '/statistic',
                templateUrl: 'pages/statistic.html',
                controller: 'StatisticCtrl'
            })
            .state('statistic2', {
                url: '/statistic2',
                templateUrl: 'pages/statistic2.html',
                controller: 'Statistic2Ctrl'
            })
            .state('listQuestion', {
                url: '/listQuestion/:LID/:THEME',
                templateUrl: 'pages/listQuestion.html',
                controller: 'QuestionItemCtrl'
            })   
            .state('question', {
                url: '/question/:menuQuestion',
                templateUrl: 'pages/question.html',
                controller: 'QuestionCtrl'
            })          
            .state('questionSearch', {
                url: '/questionSearch/:ZId',
                templateUrl: 'pages/questionItem.html',
                controller: 'QuestionSearchCtrl'
            })           
            .state('setting', {
                url: '/setting',
                templateUrl: 'pages/setting.html',
                controller: 'SettingCtrl'
            });
    })   
    .controller('MasterCtrl', function ($scope, $rootScope, $ionicPopup, $window, $q, $state, $sce, cordova, db, $timeout, $http, $ionicLoading, connect) {
        $rootScope.language = 1; 
        $rootScope.showChangeLanguageBtn = true
        $rootScope.changeLanguageEnabled = false;
        $rootScope.Menu = MENU;
        $scope.backApp = false;
        $rootScope.isBack = false;
        $rootScope.isSearch = false;
        $rootScope.isClear = false;
        $rootScope.isSetting = false;
        $rootScope.question = false;
        $rootScope.questionTheme = false;
        $rootScope.statistic1 = false;
        $rootScope.statistic2 = false;
        $rootScope.versionApp = null;
        $rootScope.isActive = false;
        $rootScope.yearApp = new Date().getUTCFullYear();
        $rootScope.appSite = $rootScope.Menu.vn.app;
        $rootScope.appDidLoad = false;
        $rootScope.startApp = JSON.parse($window.localStorage.getItem("START_APP"));
        $rootScope.assetsPath = "";
        $rootScope.isWideScreen = window.screen.width > 641

        if ($rootScope.startApp == null || $rootScope.startApp == undefined) {
            $rootScope.startApp = 1;
            $window.localStorage.setItem("START_APP", $rootScope.startApp);
        }

        db.ready().then(function () {
            db.getVersion().then(function (version) {
                $rootScope.versionApp = version.versionApp;
                db.checkIsActive().then(function (data) {                    
                    $rootScope.isActive = data.isActive;
                    $rootScope.isActive = true;
                    $rootScope.$broadcast("active");
                    db.updateUserActive().then(function () {
                        // db.updateUserName("Pro").then(function () {
                        // });
                    });
                    switch ($rootScope.startApp) {
                        case 1:
                            $state.go('home', {}, {});
                            break;
                        case 2:
                            connect.getAllQuestion().then(function (data) {
                                $state.go('question', { menuQuestion: JSON.stringify(data) }, {});
                            });
                            break;
                        case 3:
                            $state.go('test', {}, {});
                            break;
                    }
                });                
            })            
        });       
        $rootScope.questionRandom = JSON.parse($window.localStorage.getItem("QUESTION_RANDOM"));
        $rootScope.answeredRandom = JSON.parse($window.localStorage.getItem("ANSWERED_RANDOM"));
        $rootScope.audio = JSON.parse($window.localStorage.getItem("AUDIO"));
        $scope.languageText = $rootScope.language == 0 ? "DE" : "VN";
        if ($rootScope.questionRandom == null) {
            $window.localStorage.setItem("QUESTION_RANDOM", false);
            $rootScope.questionRandom = false;
        }
        if ($rootScope.answeredRandom == null) {
            $window.localStorage.setItem("ANSWERED_RANDOM", false);
            $rootScope.answeredRandom = false;
        }
        if ($rootScope.audio == null) {
            $window.localStorage.setItem("AUDIO", true);
            $rootScope.audio = true;
        }

        $rootScope.changeLanguageEnabled = JSON.parse($window.localStorage.getItem("CHANGE_LANGUAGE_ENABLED"));
        if ($rootScope.changeLanguageEnabled == null) {
            $window.localStorage.setItem("CHANGE_LANGUAGE_ENABLED", false);
            $rootScope.changeLanguageEnabled = false;
        }

        document.addEventListener("offline", function() {
            $scope.netwokPopup = $ionicPopup.show({
                cssClass: 'center',
                template: '<i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i><br><br>Network not available',
                title: 'Error'
            });
        }, false);

        document.addEventListener("online", function() {
            if ($scope.netwokPopup) {
                $scope.netwokPopup.close();
            }
        }, false);

        document.addEventListener("backbutton", onBackKey, false);

        function onBackKey(event) {
            event.preventDefault();
        }

        $scope.setting = function (event) {
            onBack();
        }

        function onBack() {
            if (!$rootScope.isSetting && !$rootScope.isBack) {
                $state.go('setting', {}, {});
            }
            else if ($rootScope.isBack) {
                if ($rootScope.isSearch) {
                    $rootScope.isSearch = false;
                    $state.go('home', {}, { location: 'replace' });
                }
                else if ($rootScope.startApp != 1 && !$rootScope.questionTheme && !$rootScope.isClear) {
                    $state.go('home', {}, { location: 'replace' });
                    $rootScope.isBack = false;
                    $rootScope.isSearch = false;
                    $rootScope.question = false;
                }
                else {
                    if (!$rootScope.questionTheme && !$rootScope.statistic1 && !$rootScope.statistic2)
                    {
                        $window.history.back();
                    }
                    if (!$rootScope.question && !$rootScope.isClear && !$rootScope.statistic2) {
                        $rootScope.isBack = false;
                        $rootScope.titleAll = "";
                    }
                    else if ($rootScope.isClear && !$rootScope.statistic1 && !$rootScope.statistic2) {
                        $rootScope.isBack = false;
                        $rootScope.isClear = false;
                        $rootScope.titleAll = "";
                    }
                    else if ($rootScope.isBack && $rootScope.question && !$rootScope.questionTheme) {
                        $rootScope.question = false;
                        $rootScope.isBack = false;
                        $rootScope.titleAll = "";
                    }
                    else if ($rootScope.questionTheme) {
                        $window.history.back();
                        $rootScope.questionTheme = false;
                    }
                    else if ($rootScope.statistic1) {
                        $rootScope.statistic1 = false;
                        $rootScope.$broadcast("backStastic");
                    }
                    if ($rootScope.statistic2) {
                        $window.history.back();
                        $rootScope.statistic2 = false;
                    }

                    if ($rootScope.isSetting) {
                        if ($rootScope.isSearch) {
                            $rootScope.isBack = true;
                        }
                        else {
                            $rootScope.isSetting = false;                        }
                    }

                    $rootScope.isSearch = false;
                }
            }
        }

        $scope.changeLanguage = function () {
            $rootScope.changeLanguageEnabled = JSON.parse($window.localStorage.getItem("CHANGE_LANGUAGE_ENABLED"));
            if (!$rootScope.changeLanguageEnabled)
            {
                showActivePopup();
            }
            else
            {
                if ($rootScope.language == 0) {
                    $rootScope.language = 1;
                }
                else {
                    $rootScope.language = 0;
                }
                $scope.languageText = $rootScope.language == 0 ? "DE" : "VN";
                $rootScope.$broadcast("changeLanguage");
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "lang");
            }
        }

        var showActivePopup = function() {
            $scope.data = {};
            // An elaborate, custom popup
            $scope.activePopup = $ionicPopup.show({
                template: '<input type="text" placeholder="Nhập code" ng-enter="codeInputEnter()" ng-model="data.code">',
                title: 'Nâng cấp',
                subTitle: 'Mở gói tiếng Việt',
                scope: $scope,
                buttons: [
                    { 
                        text: 'Hủy',
                        type: 'button-stable'
                    },
                    {
                        text: 'OK',
                        type: 'button-dark',
                        onTap: function(e) {
                            if (!$scope.data.code) {
                                e.preventDefault();
                            } else {
                                return $scope.data.code;
                            }
                        }
                    }
                ]
            });

            $scope.activePopup.then(function(res) {
                console.log('Tapped!', res);
                if (res != undefined) {
                    activeCode();
                }
            });
        }

        $scope.codeInputEnter = function() {
            $window.cordova.plugins.Keyboard.close();
            $scope.activePopup.close();
            activeCode();
        }

        var activeCode = function() {
            $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
            var url = "http://thilaixe.de/check_code?code=" + $scope.data.code;
            $http.get(url).success( function(response) {
                if (response.success) {
                    $window.localStorage.setItem("CHANGE_LANGUAGE_ENABLED", true);
                    $rootScope.changeLanguageEnabled = true;
                    $ionicPopup.alert({
                        title: 'Thông báo',
                        cssClass: 'center',
                        template: 'Bạn đã nâng cấp thành công',
                        okType: "button-dark"
                    });
                }
                else
                {
                    $window.localStorage.setItem("CHANGE_LANGUAGE_ENABLED", false);
                    $rootScope.changeLanguageEnabled = false;
                    $ionicPopup.alert({
                        title: 'Thông báo',
                        cssClass: 'center',
                        template: "Code không hợp lệ.<br>Vui lòng kiểm tra lại",
                        okType: "button-dark"
                    });
                }
                $ionicLoading.hide();
            });
        }

        $scope.openSearch = function () {
            if (!$rootScope.isSearch && !$rootScope.isClear)
            {
                $state.go('search', {}, {});
            }
            else if ($rootScope.isClear) {
                $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true});
                if ($rootScope.statistic2) {
                    db.clearTest().then(function () {
                        $rootScope.$broadcast("reloadStatistic");
                    });
                }
                if ($rootScope.statistic1) {
                    db.clearQuestion().then(function () {
                        $rootScope.$broadcast("reloadStatistic1");
                    });
                }
                if (!$rootScope.statistic1 && !$rootScope.statistic2) {
                    db.clearTest().then(function () {                        
                    });
                    db.clearQuestion().then(function () {                        
                    });
                }
                $timeout(function () {
                    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true});
                }, 1000);
            }
        }

        //login
        $rootScope.isShowAlertVersion = false;
        $rootScope.isShowAlertVersionTest = true;
        $rootScope.showActiveTest = false;
        $rootScope.showActiveQuestion = false;

        $scope.$on("playaudio", function (event, src) {
            window.plugins.NativeAudio.play(src,
                                               function (msg) { console.info(msg) },
                                               function (msg) { console.error('Error: ' + msg); },
                                               function (msg) { console.error('Complete: ' + msg); });
        })
    })
})();
