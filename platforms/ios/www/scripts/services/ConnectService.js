(function () {
    "use strict";
    angular.module('TrafficLaws.connectService', ['ui.router', 'ngAnimate', 'TrafficLaws.databaseService', 'ngActivityIndicator'])
        .factory("connect", ['$rootScope',  '$q', '$timeout', '$window', '$filter', 'cordova', 'db', '$state', function ($rootScope, $q, $timeout, $window, $filter, cordova, db, $state) {            

            return {               
                getAllQuestion: function () {
                    var deferred = $q.defer();
                    var menuQuestionCount = new QuestionMenu();
                    if ($rootScope.language == 0) {
                        var menuQuestion = [
                            { name: $rootScope.Menu.vn.all_question, event: 1, number: "", percent: "", img: "img/icon2/allquestion.png" },
                            { name: $rootScope.Menu.vn.answered, event: 2, number: "", percent: "", img: "img/icon2/answered.png" },
                            { name: $rootScope.Menu.vn.answered_right, event: 3, number: "", percent: "", img: "img/icon2/icon_right.png" },
                            { name: $rootScope.Menu.vn.answered_wrong, event: 4, number: "", percent: "", img: "img/icon2/icon_wrong.png" },
                            { name: $rootScope.Menu.vn.hard_question, event: 5, number: "", percent: "", img: "img/icon2/question_hard.png" },
                            { name: $rootScope.Menu.vn.not_answered, event: 6, number: "", percent: "", img: "img/icon2/not_answered.png" },
                            { name: $rootScope.Menu.vn.number_question, event: 7, number: "", percent: "", img: "img/icon2/qnumber.png" },
                            { name: $rootScope.Menu.vn.variant_question, event: 8, number: "", percent: "", img: "img/icon2/variant.png" },
                            { name: $rootScope.Menu.vn.film_question, event: 9, number: "", percent: "", img: "img/icon2/qvideo.png" }
                        ];
                    }
                    else
                    {
                        var menuQuestion = [
                            { name: $rootScope.Menu.de.all_question, event: 1, number: "", percent: "", img: "img/icon2/allquestion.png" },
                            { name: $rootScope.Menu.de.answered, event: 2, number: "", percent: "", img: "img/icon2/answered.png" },
                            { name: $rootScope.Menu.de.answered_right, event: 3, number: "", percent: "", img: "img/icon2/icon_right.png" },
                            { name: $rootScope.Menu.de.answered_wrong, event: 4, number: "", percent: "", img: "img/icon2/icon_wrong.png" },
                            { name: $rootScope.Menu.de.hard_question, event: 5, number: "", percent: "", img: "img/icon2/question_hard.png" },
                            { name: $rootScope.Menu.de.not_answered, event: 6, number: "", percent: "", img: "img/icon2/not_answered.png" },
                            { name: $rootScope.Menu.de.number_question, event: 7, number: "", percent: "", img: "img/icon2/qnumber.png" },
                            { name: $rootScope.Menu.de.variant_question, event: 8, number: "", percent: "", img: "img/icon2/variant.png" },
                            { name: $rootScope.Menu.de.film_question, event: 9, number: "", percent: "", img: "img/icon2/qvideo.png" }
                        ];
                    }
                    
                    db.countQuestionAll().then(function (data) {
                        menuQuestionCount.countAllQuestion.number = data;
                        menuQuestionCount.countAllQuestion.percent = 100;
                        menuQuestion[0].number = data;
                        menuQuestion[0].percent = 100;

                        db.countAnsweredAll().then(function (data) {
                            menuQuestionCount.countAllAnswered.number = data;
                            menuQuestionCount.countAllAnswered.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                            menuQuestion[1].number = data;
                            menuQuestion[1].percent = menuQuestionCount.countAllAnswered.percent;
                            menuQuestionCount.countAllNotAnswer.number = menuQuestionCount.countAllQuestion.number - menuQuestionCount.countAllAnswered.number;
                            menuQuestionCount.countAllNotAnswer.percent = menuQuestionCount.countAllQuestion.percent - menuQuestionCount.countAllAnswered.percent;
                            menuQuestion[5].number = menuQuestionCount.countAllNotAnswer.number;
                            menuQuestion[5].percent = menuQuestionCount.countAllNotAnswer.percent;
                            db.countAnsweredRightAll().then(function (data) {
                                menuQuestionCount.countAllAnsweredRight.number = data;
                                menuQuestionCount.countAllAnsweredRight.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                menuQuestion[2].number = data;
                                menuQuestion[2].percent = menuQuestionCount.countAllAnsweredRight.percent;
                                db.countAnsweredWrongAll().then(function (data) {
                                    menuQuestionCount.countAllAnsweredWrong.number = data;
                                    menuQuestionCount.countAllAnsweredWrong.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                    menuQuestion[3].number = data;
                                    menuQuestion[3].percent = menuQuestionCount.countAllAnsweredWrong.percent;
                                    db.countQuestionHardAll().then(function (data) {
                                        menuQuestionCount.countAllQuestionHard.number = data;
                                        menuQuestionCount.countAllQuestionHard.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                        menuQuestion[4].number = data;
                                        menuQuestion[4].percent = menuQuestionCount.countAllQuestionHard.percent;
                                        db.countQuestionNumberAll().then(function (data) {
                                            menuQuestionCount.countAllQuestionNumber.number = data;
                                            menuQuestionCount.countAllQuestionNumber.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                            menuQuestion[6].number = data;
                                            menuQuestion[6].percent = menuQuestionCount.countAllQuestionNumber.percent;
                                            db.countQuestionVariantAll().then(function (data) {
                                                menuQuestionCount.countAllQuestionVariant.number = data;
                                                menuQuestionCount.countAllQuestionVariant.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                                menuQuestion[7].number = data;
                                                menuQuestion[7].percent = menuQuestionCount.countAllQuestionVariant.percent;
                                                db.countQuestionVideoAll().then(function (data) {
                                                    menuQuestionCount.countAllQuestionVideo.number = data;
                                                    menuQuestionCount.countAllQuestionVideo.percent = db.percentCalculation(data, menuQuestionCount.countAllQuestion.number);
                                                    menuQuestion[8].number = data;
                                                    menuQuestion[8].percent = menuQuestionCount.countAllQuestionVideo.percent;
                                                    deferred.resolve(menuQuestion);                                                    
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                    return deferred.promise;
                },
            };

        }])
})();