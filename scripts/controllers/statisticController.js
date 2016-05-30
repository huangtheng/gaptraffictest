(function () {
    "use strict";
    angular.module("TrafficLaws.StatisticController", ['ngMaterial', "chart.js", 'ui.router', 'ngAnimate', 'TrafficLaws.databaseService'])
    .controller('StatisticCtrl', function ($scope, $rootScope, $timeout, $q, $state, $window, db) {
        $rootScope.isBack = true;
        $rootScope.isClear = true;
        $rootScope.imgIconLeft = "img/back_white.png";
        $rootScope.imgIconRight = "img/clear.png";
        $scope.questionAll = { title: null, number: 0, percent: 0 };
        $scope.questionNotAnswered = { title: null, number: 0, percent: 0 };
        $scope.answeredRight = { title: null, number: 0, percent: 0 };
        $scope.answeredWrong = { title: null, number: 0, percent: 0 };
        $scope.answeredHard = { title: null, number: 0, percent: 0 };
        $scope.menuQuestionCount = new QuestionMenu();
        $scope.selectedIndex = 0;

        $scope.data = [];
        var options = {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: "#fff",

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps: 5,

            //String - Animation easing effect
            animationEasing: "easeOutBounce",

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale: false,

        };
        init();
        function init() {
            if ($rootScope.language == 0) {
                $rootScope.titleAll = $rootScope.Menu.vn.statistic;
                $scope.divider1 = $rootScope.Menu.vn.question_b;
                $scope.questionAll.title = $rootScope.Menu.vn.all_question;
                $scope.questionNotAnswered.title = $rootScope.Menu.vn.not_answer;
                $scope.answeredRight.title = $rootScope.Menu.vn.answer_yes;
                $scope.answeredWrong.title = $rootScope.Menu.vn.answer_no;
                $scope.answeredHard.title = $rootScope.Menu.vn.hard_question;
                $scope.menuQuestion = [
                    { title: $rootScope.Menu.vn.result_question, img: "img/4.png", event: 1 },
                    { title: $rootScope.Menu.vn.result_test, img: "img/test1.png", event: 2 }
                ];
            }
            else {
                $rootScope.titleAll = $rootScope.Menu.de.statistic;
                $scope.divider1 = $rootScope.Menu.de.question_b;
                $scope.questionAll.title = $rootScope.Menu.de.all_question;
                $scope.questionNotAnswered.title = $rootScope.Menu.de.not_answer;
                $scope.answeredRight.title = $rootScope.Menu.de.answer_yes;
                $scope.answeredWrong.title = $rootScope.Menu.de.answer_no;
                $scope.answeredHard.title = $rootScope.Menu.de.hard_question;
                $scope.menuQuestion = [
                    { title: $rootScope.Menu.de.result_question, img: "img/4.png", event: 1 },
                    { title: $rootScope.Menu.de.result_test, img: "img/test1.png", event: 2 }
                ];
            }
        }        

        $scope.$on("changeLanguage", function (event) {
            $scope.isLanguage = $rootScope.language;
            init();
        });

        $scope.openStatistic = function (event) {
            if (event == 1) {
                $rootScope.statistic1 = true;
                $scope.selectedIndex = 1;
                reloadStatistic1();
            }
            else {
                $state.go('statistic2', {}, {});
            }
        }

        $rootScope.$on("backStastic", function (event) {
            $scope.selectedIndex = 0;
        });

        $rootScope.$on("reloadStatistic1", function (event) {
            reloadStatistic1();
        });

        function reloadStatistic1() {
            db.countQuestionAll().then(function (data) {
                $scope.menuQuestionCount.countAllQuestion.number = data;
                $scope.menuQuestionCount.countAllQuestion.percent = 100;
                $scope.questionAll.number = data;
                $scope.questionAll.percent = 100;

                db.countAnsweredAll().then(function (data) {
                    $scope.menuQuestionCount.countAllAnswered.number = data;
                    $scope.menuQuestionCount.countAllAnswered.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                    $scope.menuQuestionCount.countAllNotAnswer.number = $scope.menuQuestionCount.countAllQuestion.number - $scope.menuQuestionCount.countAllAnswered.number;
                    $scope.menuQuestionCount.countAllNotAnswer.percent = $scope.menuQuestionCount.countAllQuestion.percent - $scope.menuQuestionCount.countAllAnswered.percent;
                    $scope.questionNotAnswered.number = $scope.menuQuestionCount.countAllNotAnswer.number;
                    $scope.questionNotAnswered.percent = $scope.menuQuestionCount.countAllNotAnswer.percent;

                    db.countAnsweredRightAll().then(function (data) {
                        $scope.menuQuestionCount.countAllAnsweredRight.number = data;
                        $scope.menuQuestionCount.countAllAnsweredRight.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                        $scope.answeredRight.number = data;
                        $scope.answeredRight.percent = $scope.menuQuestionCount.countAllAnsweredRight.percent;

                        db.countAnsweredWrongAll().then(function (data) {
                            $scope.menuQuestionCount.countAllAnsweredWrong.number = data;
                            $scope.menuQuestionCount.countAllAnsweredWrong.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                            $scope.answeredWrong.number = data;
                            $scope.answeredWrong.percent = $scope.menuQuestionCount.countAllAnsweredWrong.percent;

                            db.countQuestionHardAll().then(function (data) {
                                $scope.menuQuestionCount.countAllQuestionHard.number = data;
                                $scope.menuQuestionCount.countAllQuestionHard.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                                $scope.answeredHard.number = data;
                                $scope.answeredHard.percent = $scope.menuQuestionCount.countAllQuestionHard.percent;

                                var ctx = document.getElementById("myChart").getContext("2d");
                                var data = [
                                    {
                                        value: $scope.answeredRight.percent,
                                        color: "#71bf38",
                                    },
                                    {
                                        value: $scope.answeredWrong.percent,
                                        color: "#cd2630",
                                    },
                                    {
                                        value: $scope.answeredHard.percent,
                                        color: "#ffbf15",
                                    },
                                    {
                                        value: $scope.questionNotAnswered.percent,
                                        color: "#00827a",
                                    }
                                ];
                                var myPieChart = new Chart(ctx).Pie(data, options);

                            });
                        });
                    });
                });

            });
        }

    })
})();