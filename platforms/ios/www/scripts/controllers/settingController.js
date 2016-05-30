(function () {
    "use strict";
    angular.module("TrafficLaws.SettingController", ['ui.router'])
    .controller('SettingCtrl', function ($scope, $rootScope, $timeout,$q,$state, $window) {
        //$scope.pageClass = 'page-about';
        $rootScope.isBack = true;
        $rootScope.isSetting = true;
        // $rootScope.imgIconLeft = "img/back_white.png";
        // document.getElementById("toolbar1").style.display = "block";
        $scope.questionTheme1 = new Array();
        $scope.questionTheme2 = new Array();
        $scope.menuQuestion = [{
            setting_start: [],
            setting_question: []
        }];
        init();
        function init() {
            if ($rootScope.language == 0) {
                $rootScope.titleAll = $rootScope.Menu.vn.setting;
                $scope.divider1 = $rootScope.Menu.vn.screen_start;
                $scope.divider2 = $rootScope.Menu.vn.setting_question;
                $scope.divider3 = $rootScope.Menu.vn.advanced_divider;
                $scope.divider4 = $rootScope.Menu.vn.change_all_question;
                $scope.question_time = $rootScope.Menu.vn.question_from;
                var start_setting = [
                    { name: $rootScope.Menu.vn.start, event: 1, choosed: $rootScope.startApp == 1? true: false},
                    { name: $rootScope.Menu.vn.question, event: 2, choosed: $rootScope.startApp == 2 ? true : false },
                    { name: $rootScope.Menu.vn.test, event: 3, choosed: $rootScope.startApp == 3? true: false },
                ];
                $scope.menuQuestion.setting_start = start_setting;
                
                $scope.questionRandom = $rootScope.Menu.vn.question + " " + $rootScope.Menu.vn.random;
                $scope.isQuestionRandom = $rootScope.questionRandom;

                $scope.answerRandom = $rootScope.Menu.vn.answer + " " + $rootScope.Menu.vn.random;
                $scope.isAnswerRandom = $rootScope.answeredRandom;

                $scope.audio = $rootScope.Menu.vn.audio;
                $scope.isAudio = $rootScope.audio;
            }
            else {
                $rootScope.titleAll = $rootScope.Menu.de.setting;
                $scope.divider1 = $rootScope.Menu.de.screen_start;
                $scope.divider2 = $rootScope.Menu.de.setting_question;
                $scope.divider3 = $rootScope.Menu.de.advanced_divider;
                $scope.divider4 = $rootScope.Menu.de.change_all_question;
                $scope.question_time = $rootScope.Menu.de.question_from;
                var start_setting = [
                   { name: $rootScope.Menu.de.start, event: 1, choosed: $rootScope.startApp == 1 ? true : false },
                    { name: $rootScope.Menu.de.question, event: 2, choosed: $rootScope.startApp == 2 ? true : false },
                    { name: $rootScope.Menu.de.test, event: 3, choosed: $rootScope.startApp == 3 ? true : false },
                ];
                $scope.menuQuestion.setting_start = start_setting;

                $scope.questionRandom = $rootScope.Menu.de.question_setting + " " + $rootScope.Menu.de.random;
                $scope.isQuestionRandom = $rootScope.questionRandom;

                $scope.answerRandom = $rootScope.Menu.de.answer + " " + $rootScope.Menu.de.random;
                $scope.isAnswerRandom = $rootScope.answeredRandom;

                $scope.audio = $rootScope.Menu.de.audio;
                $scope.isAudio = $rootScope.audio;
            }
                if (!$scope.$$phase) {
                $scope.$apply();
                } else {
                $timeout(function () { $scope.$apply(); }, 500);
                }
                
                //$timeout(function () {
                //         var scroller = new TouchScroll(document.querySelector("#scrollSetting"), { elastic: true });
                //         }, 200);
        }        
         
        $scope.$on("changeLanguage", function (event) {
            $scope.isLanguage = $rootScope.language;
            init();
        });

        $scope.chooseStart = function (event) {
            $scope.menuQuestion.setting_start[0].choosed = false;
            $scope.menuQuestion.setting_start[1].choosed = false;
            $scope.menuQuestion.setting_start[2].choosed = false;
            $scope.menuQuestion.setting_start[event - 1].choosed = true;
            $window.localStorage.setItem("START_APP", event);
        };

        $scope.settingQuestion = function () {        
            $window.localStorage.setItem("QUESTION_RANDOM", $scope.isQuestionRandom);
            $rootScope.questionRandom = JSON.parse($window.localStorage.getItem("QUESTION_RANDOM"));
        };

        $scope.settingAnswer = function () {
            $window.localStorage.setItem("ANSWERED_RANDOM", $scope.isAnswerRandom);
            $rootScope.answeredRandom = JSON.parse($window.localStorage.getItem("ANSWERED_RANDOM"));         
        };

        $scope.settingAudio = function () {
            console.log($scope.isAudio);
            $window.localStorage.setItem("AUDIO", $scope.isAudio);
            $rootScope.audio = JSON.parse($window.localStorage.getItem("AUDIO"));
        };
    })
})();
