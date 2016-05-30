(function () {
    "use strict";
    angular.module("TrafficLaws.ThemeController", ['ui.router', 'TrafficLaws.databaseService'])  
    .controller('QuestionByThemeCtrl', function ($scope, $rootScope, $timeout, $q, $state, db) {
        //$scope.pageClass = 'page-about';
        $scope.menuQuestionCount = new QuestionMenu();
        var themeQuestion = null;
        $scope.titleThemeVn = null;
        $scope.titleThemeDe = null;
        $scope.MenuQuestionItem = { klass: null, codeQuestion: null, point: null, back: null, previos: null, next: null, viewResult: null };
        $rootScope.modalTitle = "";
        initListMenu();
        function initListMenu() {
            if ($rootScope.language == 0) {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.vn.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.vn.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.vn.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.vn.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.vn.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.vn.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.vn.view_result;
                $scope.divider1 = $rootScope.Menu.vn.klass;
                $scope.divider2 = $rootScope.Menu.vn.basic_divider;
                $scope.divider3 = $rootScope.Menu.vn.advanced_divider;
                $scope.menuQuestion = [
                    { name: $rootScope.Menu.vn.all_question, event: 1, number: "", percent: "",icon: 'fa-folder-open-o' },
                    { name: $rootScope.Menu.vn.answered, event: 2, number: "", percent: "", icon: 'fa-file-text-o' },
                    { name: $rootScope.Menu.vn.answered_right, event: 3, number: "", percent: "", icon: 'fa-calendar-check-o' },
                    { name: $rootScope.Menu.vn.answered_wrong, event: 4, number: "", percent: "", icon: 'fa-calendar-times-o' },
                    { name: $rootScope.Menu.vn.hard_question, event: 5, number: "", percent: "", icon: 'fa-bookmark-o' },
                    { name: $rootScope.Menu.vn.not_answered, event: 6, number: "", percent: "", icon: 'fa-file-o' }
                ];
            }
            else {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.de.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.de.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.de.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.de.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.de.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.de.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.de.view_result;
                $scope.menuQuestion = [
                    { name: $rootScope.Menu.de.all_question, event: 1, number: "", percent: "", icon: 'fa-folder-open-o' },
                    { name: $rootScope.Menu.de.answered, event: 2, number: "", percent: "", icon: 'fa-file-text-o' },
                    { name: $rootScope.Menu.de.answered_right, event: 3, number: "", percent: "", icon: 'fa-calendar-check-o' },
                    { name: $rootScope.Menu.de.answered_wrong, event: 4, number: "", percent: "", icon: 'fa-calendar-times-o' },
                    { name: $rootScope.Menu.de.hard_question, event: 5, number: "", percent: "", icon: 'fa-bookmark-o' },
                    { name: $rootScope.Menu.de.not_answered, event: 6, number: "", percent: "", icon: 'fa-file-o' }
                ];
            }
        }

        function init() {
            if ($rootScope.language == 0) {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.vn.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.vn.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.vn.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.vn.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.vn.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.vn.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.vn.view_result;
                $scope.divider1 = $rootScope.Menu.vn.klass;
                $scope.divider2 = $rootScope.Menu.vn.basic_divider;
                $scope.divider3 = $rootScope.Menu.vn.advanced_divider;
                $scope.menuQuestion[0].name = $rootScope.Menu.vn.all_question;
                $scope.menuQuestion[1].name = $rootScope.Menu.vn.answered;
                $scope.menuQuestion[2].name = $rootScope.Menu.vn.answered_right;
                $scope.menuQuestion[3].name = $rootScope.Menu.vn.answered_wrong;
                $scope.menuQuestion[4].name = $rootScope.Menu.vn.hard_question;
                $scope.menuQuestion[5].name = $rootScope.Menu.vn.not_answered;              
            }
            else {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.de.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.de.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.de.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.de.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.de.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.de.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.de.view_result;
                $scope.menuQuestion[0].name = $rootScope.Menu.de.all_question;
                $scope.menuQuestion[1].name = $rootScope.Menu.de.answered;
                $scope.menuQuestion[2].name = $rootScope.Menu.de.answered_right;
                $scope.menuQuestion[3].name = $rootScope.Menu.de.answered_wrong;
                $scope.menuQuestion[4].name = $rootScope.Menu.de.hard_question;
                $scope.menuQuestion[5].name = $rootScope.Menu.de.not_answered;
            }
        }        

        $scope.$on("changeLanguage", function (event) {
            init();
            titleTheme();
            initListMenu();         
        });        

        function titleTheme() {
            if ($rootScope.language == 0) {
                $rootScope.modalTitle = $scope.titleThemeVn;
            }
            else {
                $rootScope.modalTitle = $scope.titleThemeDe;
            }
        }

        $rootScope.$on('choose_theme', function (event, theme, titleThemeVn, titleThemeDe) {
            $scope.titleThemeVn = titleThemeVn;
            $scope.titleThemeDe = titleThemeDe;
            titleTheme();
            $rootScope.questionTheme = true;
            themeQuestion = theme;
            //var scroller = new TouchScroll(document.querySelector("#questionByTheme"), { elastic: true });
            db.countQuestionByTheme(theme).then(function (data) {
                $scope.menuQuestionCount.countAllQuestion.number = data;
                $scope.menuQuestionCount.countAllQuestion.percent = 100;
                $scope.menuQuestion[0].number = data;
                $scope.menuQuestion[0].percent = 100;
                reloadTheme(theme);
            });
        });        

        $rootScope.$on("reloadTheme", reloadTheme);

        function reloadTheme(theme) {
            db.countAnsweredByTheme(theme).then(function (data) {
                $scope.menuQuestionCount.countAllAnswered.number = data;
                $scope.menuQuestionCount.countAllAnswered.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                $scope.menuQuestion[1].number = data;
                $scope.menuQuestion[1].percent = $scope.menuQuestionCount.countAllAnswered.percent;
                $scope.menuQuestionCount.countAllNotAnswer.number = $scope.menuQuestionCount.countAllQuestion.number - $scope.menuQuestionCount.countAllAnswered.number;
                $scope.menuQuestionCount.countAllNotAnswer.percent = $scope.menuQuestionCount.countAllQuestion.percent - $scope.menuQuestionCount.countAllAnswered.percent;
                $scope.menuQuestion[5].number = $scope.menuQuestionCount.countAllNotAnswer.number;
                $scope.menuQuestion[5].percent = $scope.menuQuestionCount.countAllNotAnswer.percent;
            });

            db.countAnsweredRightByTheme(theme).then(function (data) {
                $scope.menuQuestionCount.countAllAnsweredRight.number = data;
                $scope.menuQuestionCount.countAllAnsweredRight.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                $scope.menuQuestion[2].number = data;
                $scope.menuQuestion[2].percent = $scope.menuQuestionCount.countAllAnsweredRight.percent;
            });
            db.countAnsweredWrongByTheme(theme).then(function (data) {
                $scope.menuQuestionCount.countAllAnsweredWrong.number = data;
                $scope.menuQuestionCount.countAllAnsweredWrong.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                $scope.menuQuestion[3].number = data;
                $scope.menuQuestion[3].percent = $scope.menuQuestionCount.countAllAnsweredWrong.percent;
            });
            db.countQuestionHardByTheme(theme).then(function (data) {
                $scope.menuQuestionCount.countAllQuestionHard.number = data;
                $scope.menuQuestionCount.countAllQuestionHard.percent = db.percentCalculation(data, $scope.menuQuestionCount.countAllQuestion.number);
                $scope.menuQuestion[4].number = data;
                $scope.menuQuestion[4].percent = $scope.menuQuestionCount.countAllQuestionHard.percent;
            });
        }

        $scope.openQuestion = function (event) {
            $scope.modal.hide();
            if ($rootScope.isActive) {
                if ($scope.menuQuestion[event - 1].number > 0) {
                    $state.go('listQuestion', { LID: event, THEME: themeQuestion }, {});
                    // document.getElementById("questionByTheme").style.opacity = "0";
                    // document.getElementById("listQuestion").style.display = "block";
                    // $rootScope.$broadcast('choose_list', event, themeQuestion);
                    $rootScope.questionChildOld = 2;
                    $rootScope.questionChild = 1;
                }
            }
            else {
                db.countQuestionByThemeFree(themeQuestion).then(function (data) {
                    if (data > 0) {
                        document.getElementById("questionByTheme").style.opacity = "0";
                        document.getElementById("listQuestion").style.display = "block";
                        $rootScope.$broadcast('choose_list', event, themeQuestion);
                        $rootScope.questionChildOld = 2;
                        $rootScope.questionChild = 1;
                    }
                    else {
                        navigator.notification.confirm(
                           "Bản miễn phí không có những câu hỏi này.\n\r Bạn vui lòng mua bản đầy đủ!", // message
                            function (index) {
                                $scope.count = 0;
                                $scope.sum = 0;
                                $scope.nextQuestion = 1;
                                $scope.countPlayVideo = 5;
                                $scope.listQuestion = [];
                                startPage = false;
                                if ($rootScope.questionChildOld == 2) {
                                    document.getElementById("questionByTheme").style.opacity = "1";
                                }
                                else {
                                    document.getElementById("mainQuestion").style.opacity = "1";
                                }
                                $timeout(function (event) {
                                    document.getElementById("listQuestion").style.display = "none";
                                }, 100);
                                if ($rootScope.questionChildOld == 2) {
                                    $rootScope.questionChild = 2;
                                    $rootScope.questionChildOld = 0;
                                }
                                else {
                                    $rootScope.questionChild = 0;
                                }
                            },            // callback to invoke with index of button pressed
                           'Mua bản đầy đủ',           // title
                           ["Quay lại"]     // buttonLabels
                       );
                    }
                });
            }
        };
    })
})();