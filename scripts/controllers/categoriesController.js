(function () {
    "use strict";
    angular.module("TrafficLaws.CategoriesController", ['ui.router', 'ngAnimate', 'TrafficLaws.databaseService'])
    .controller('CategoriesCtrl', function ($scope, $rootScope, $timeout, $window,$q, $state, db, connect, $ionicLoading, $ionicModal) {
        //$scope.pageClass = 'page-about';
        $rootScope.isBack = true;
        $rootScope.question = true;
        $rootScope.questionChild = 0;
        $rootScope.questionChildOld = 0;
        $scope.questionTheme1 = new Array();
        $scope.questionTheme2 = new Array();       
        $scope.language = false;
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true})
        $scope.menuQuestion = {};
        $scope.dataLoadedCount = 0;
        connect.getAllQuestion().then(function (data) {
            $scope.menuQuestion = data; 
            init1();
            viewLoaded();
        });
        db.selectAllQuestionTheme().then(function (data) {
            for (var i = 0; i < data.length ; i++) {
                if (data[i].ZGROUP == 1) {
                    $scope.questionTheme1.push(data[i]);
                }
                else if (data[i].ZGROUP == 2) {
                    $scope.questionTheme2.push(data[i]);
                }
            }
            //var scroller = new TouchScroll(document.querySelector("#mainQuestion"), { elastic: true });
            if (!$scope.$$phase) {
                $scope.$apply();
            } else {
                $timeout(function () { $scope.$apply(); }, 500);
            }
            viewLoaded();
        });

        function viewLoaded() {
            $scope.dataLoadedCount++;
            if ($scope.dataLoadedCount >= 2) {
                $timeout(function () {
                    document.getElementById("mainQuestion").style.display = "block";
                    $ionicLoading.hide(); 
                }, 500);
            } 
        }

        // $scope.menuQuestion = JSON.parse($state.params.menuQuestion);        
        function init1() {
            if ($rootScope.language == 0) {
                $rootScope.titleAll = $rootScope.Menu.vn.question;
                $scope.divider1 = $rootScope.Menu.vn.klass;
                $scope.divider2 = $rootScope.Menu.vn.basic_divider;
                $scope.divider3 = $rootScope.Menu.vn.advanced_divider;
                $scope.menuQuestion[0].name = $rootScope.Menu.vn.all_question;
                $scope.menuQuestion[1].name = $rootScope.Menu.vn.answered;
                $scope.menuQuestion[2].name = $rootScope.Menu.vn.answered_right;
                $scope.menuQuestion[3].name = $rootScope.Menu.vn.answered_wrong;
                $scope.menuQuestion[4].name = $rootScope.Menu.vn.hard_question;
                $scope.menuQuestion[5].name = $rootScope.Menu.vn.not_answered;
                $scope.menuQuestion[6].name = $rootScope.Menu.vn.number_question;
                $scope.menuQuestion[7].name = $rootScope.Menu.vn.variant_question;
                $scope.menuQuestion[8].name = $rootScope.Menu.vn.film_question;          
            }
            else {
                $rootScope.titleAll = $rootScope.Menu.de.question;
                $scope.divider1 = $rootScope.Menu.de.klass;
                $scope.divider2 = $rootScope.Menu.de.basic_divider;
                $scope.divider3 = $rootScope.Menu.de.advanced_divider;
                $scope.menuQuestion[0].name = $rootScope.Menu.de.all_question;
                $scope.menuQuestion[1].name = $rootScope.Menu.de.answered;
                $scope.menuQuestion[2].name = $rootScope.Menu.de.answered_right;
                $scope.menuQuestion[3].name = $rootScope.Menu.de.answered_wrong;
                $scope.menuQuestion[4].name = $rootScope.Menu.de.hard_question;
                $scope.menuQuestion[5].name = $rootScope.Menu.de.not_answered;
                $scope.menuQuestion[6].name = $rootScope.Menu.de.number_question;
                $scope.menuQuestion[7].name = $rootScope.Menu.de.variant_question;
                $scope.menuQuestion[8].name = $rootScope.Menu.de.film_question;
            }
            $scope.language = $rootScope.language == 1 ? false : true;
        }        

        $scope.$on("changeTitle", function (event) {
            if ($scope.language) {
                $rootScope.titleAll = $rootScope.Menu.vn.question;
            }
            else {
                $rootScope.titleAll = $rootScope.Menu.de.question;
            }
        });

        $rootScope.$on("reload", function (event) {
            init();
        });

        var menuQuestionCount = new QuestionMenu();
        function init() {
            db.countQuestionAll().then(function (data) {
                menuQuestionCount.countAllQuestion.number = data;
                menuQuestionCount.countAllQuestion.percent = 100;
                $scope.menuQuestion[0].number = data;
                $scope.menuQuestion[0].percent = 100;

                db.countAnsweredAll().then(function (data) {
                    menuQuestionCount.countAllAnswered.number = data;
                    menuQuestionCount.countAllAnswered.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                    $scope.menuQuestion[1].number = data;
                    $scope.menuQuestion[1].percent = menuQuestionCount.countAllAnswered.percent;
                    menuQuestionCount.countAllNotAnswer.number = menuQuestionCount.countAllQuestion.number - menuQuestionCount.countAllAnswered.number;
                    menuQuestionCount.countAllNotAnswer.percent = menuQuestionCount.countAllQuestion.percent - menuQuestionCount.countAllAnswered.percent;
                    $scope.menuQuestion[5].number = menuQuestionCount.countAllNotAnswer.number;
                    $scope.menuQuestion[5].percent = menuQuestionCount.countAllNotAnswer.percent;
                    db.countAnsweredRightAll().then(function (data) {
                        menuQuestionCount.countAllAnsweredRight.number = data;
                        menuQuestionCount.countAllAnsweredRight.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                        $scope.menuQuestion[2].number = data;
                        $scope.menuQuestion[2].percent = menuQuestionCount.countAllAnsweredRight.percent;
                        db.countAnsweredWrongAll().then(function (data) {
                            menuQuestionCount.countAllAnsweredWrong.number = data;
                            menuQuestionCount.countAllAnsweredWrong.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                            $scope.menuQuestion[3].number = data;
                            $scope.menuQuestion[3].percent = menuQuestionCount.countAllAnsweredWrong.percent;
                            db.countQuestionHardAll().then(function (data) {
                                menuQuestionCount.countAllQuestionHard.number = data;
                                menuQuestionCount.countAllQuestionHard.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                $scope.menuQuestion[4].number = data;
                                $scope.menuQuestion[4].percent = menuQuestionCount.countAllQuestionHard.percent;
                                db.countQuestionNumberAll().then(function (data) {
                                    menuQuestionCount.countAllQuestionNumber.number = data;
                                    menuQuestionCount.countAllQuestionNumber.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                    $scope.menuQuestion[6].number = data;
                                    $scope.menuQuestion[6].percent = menuQuestionCount.countAllQuestionNumber.percent;
                                    db.countQuestionVariantAll().then(function (data) {
                                        menuQuestionCount.countAllQuestionVariant.number = data;
                                        menuQuestionCount.countAllQuestionVariant.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                        $scope.menuQuestion[7].number = data;
                                        $scope.menuQuestion[7].percent = menuQuestionCount.countAllQuestionVariant.percent;
                                        db.countQuestionVideoAll().then(function (data) {
                                            menuQuestionCount.countAllQuestionVideo.number = data;
                                            menuQuestionCount.countAllQuestionVideo.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                            $scope.menuQuestion[8].number = data;
                                            $scope.menuQuestion[8].percent = menuQuestionCount.countAllQuestionVideo.percent;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }

        $scope.$on("changeLanguage", function (event) {
            init1();
        });

        $scope.open = function (event) {
            if ($scope.menuQuestion[event - 1].number > 0) {
                $state.go('listQuestion', { LID: event }, {});
                $rootScope.questionChild = 1;
            }            
        };

        $ionicModal.fromTemplateUrl('theme-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        
        $scope.chooseTheme = function (prefix, ISSHOW, titleThemeVn, titleThemeDe) {
            if (ISSHOW) {
                $scope.modal.show();
                $rootScope.$broadcast('choose_theme', prefix, titleThemeVn, titleThemeDe);
                $rootScope.questionChild = 2;
            }                       
        };

    })
})();