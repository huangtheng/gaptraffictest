(function () {
    "use strict";
    angular.module("TrafficLaws.HomeController", ['ui.router','TrafficLaws.connectService', 'TrafficLaws.databaseService'])
    .controller('HomeCtrl', function ($scope, $rootScope, $q, db, $state,$window, $timeout, $ionicLoading, connect) {
        //$scope.pageClass = 'page-about';
        $scope.menuQuestionCount = new QuestionMenu();     
        
        if (cordova.platformId == 'android') {
            $rootScope.assetsPath = cordova.file.externalDataDirectory + "/fahrschul/assets/";
        }
        else {
            $rootScope.assetsPath = cordova.file.applicationDirectory + "/www/";
        }

        init();
        function init() {
            // StatusBar.hide();
            if ($rootScope.language == 0) {
                $scope.appName = $rootScope.Menu.vn.app_name + ($rootScope.isActive ? $rootScope.Menu.vn.version_full : $rootScope.Menu.vn.version_free);                 
                $scope.version = $rootScope.Menu.vn.version;
                $scope.licenceApp = $rootScope.Menu.vn.licence;
                $scope.listMenu = [                    
                    { name: $rootScope.Menu.vn.question, event: 2, icon: 'fa-tasks' },
                    { name: $rootScope.Menu.vn.test, event: 3, icon: 'fa-clock-o' },
                    { name: $rootScope.Menu.vn.search, event: 4, icon: 'fa-search' },
                    { name: $rootScope.Menu.vn.statistic, event: 5, icon: 'fa-pie-chart' },
                    { name: $rootScope.Menu.vn.setting, event: 6, icon: 'fa-cog' }
                ];
                if ($window.upgradeEnabled) {
                    $scope.listMenu.push( { name: $rootScope.Menu.vn.buy_pro, event: 7, icon: 'fa-star' })
                }
            }
            else {
                $scope.appName = $rootScope.Menu.de.app_name + ($rootScope.isActive ? $rootScope.Menu.de.version_full : $rootScope.Menu.de.version_free);
                $scope.version = $rootScope.Menu.de.version;
                $scope.licenceApp = $rootScope.Menu.de.licence;
                $scope.listMenu = [                    
                    { name: $rootScope.Menu.de.question, event: 2, icon: 'fa-tasks'  },
                    { name: $rootScope.Menu.de.test, event: 3, icon: 'fa-clock-o' },
                    { name: $rootScope.Menu.de.search, event: 4, icon: 'fa-search' },
                    { name: $rootScope.Menu.de.statistic, event: 5, icon: 'fa-pie-chart' },
                    { name: $rootScope.Menu.de.setting, event: 6, icon: 'fa-cog' }
                ];
                if ($window.upgradeEnabled) {
                    $scope.listMenu.push( { name: $rootScope.Menu.de.buy_pro, event: 7, icon: 'fa-star' })
                }
            }
           
            if (!$scope.$$phase) {
                $scope.$apply();
            } else {
                $timeout(function () { $scope.$apply(); }, 500);
            }

            //$timeout(function () { 
            //    var scroller = new TouchScroll(document.querySelector("#listHome"), { elastic: true });
            //}, 400);
        }       

        $scope.$on("changeLanguage", function (event) {
            $scope.isLanguage = $rootScope.language;
            init();
        });

        $scope.$on("active", function (event) {
            if ($rootScope.language == 0) {
                $scope.appName = $rootScope.Menu.vn.app_name + ($rootScope.isActive ? $rootScope.Menu.vn.version_full : $rootScope.Menu.vn.version_free);
            }
            else {
                $scope.appName = $rootScope.Menu.de.app_name + ($rootScope.isActive ? $rootScope.Menu.de.version_full : $rootScope.Menu.de.version_free);
            }
        });

        $scope.open = function (event) {
            switch (event) {
                case 2:
                    $state.go('categories', {}, {});
                    // $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true})
                    // connect.getAllQuestion().then(function (data) {
                    //     $state.go('categories', { menuQuestion: JSON.stringify(data)}, {});
                    //     $ionicLoading.hide();
                    // });
                    break;
                case 3:
                    $state.go('test', {}, {});                                  
                    break;
                case 4:
                    $state.go('search', {}, {});
                    break;
                case 5:
                    $state.go('statistic', {}, {});
                    break;
                case 6:
                    $state.go('setting', {}, {});                    
                    break;
                case 7:
                    // cordova.plugins.market.open('id1111527349');  
                    cordova.plugins.market.open('eu.vietplus.fahrschulpro')          
                    break;
            }                       
        };

        

    })
})();
