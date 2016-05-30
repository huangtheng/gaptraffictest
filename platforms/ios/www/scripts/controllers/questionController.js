(function () {
    "use strict";
    angular.module("TrafficLaws.QuestionController", ['ui.router', 'ngAnimate', 'TrafficLaws.databaseService'])
    .controller('QuestionItemCtrl', function ($scope, $rootScope, $q, $sce, $state, $window, db, $timeout, $http, $ionicLoading, $ionicModal) {
        $scope.count = 0;
        $scope.sum = 0;
        $scope.nextQuestion = 1;
        $scope.countPlayVideo = 5;
        var startPage = false;
        $scope.hardText = "";
        $scope.isShowBar = false;
        $scope.flipLeft = false;
        $scope.flipLeft_hidden = false;
        $scope.flipRight = false;
        $scope.flipRight_hidden = false;
        $scope.isNext = true;
        $scope.selectedIndex = 1;
        $scope.styleStatus = "background-color:transparent;";
        $scope.listQuestion = [];
        var utils = new Utils($http);
        $scope.titlePlayVideo = null;
        $scope.MenuQuestionItem = {
            klass: null, codeQuestion: null, point: null, back: null, previos: null, next: null, viewResult: null, filmStart: null,
            viewQuestion: null, titleCount1: null, titleCount2: null, yourAnswer: null, rightAnswer: null, statusRight: null, statusWrong: null,
            statusHard: null, statusUnHard: null, messageDialog: null, yes: null, no: null, go: null
        };
        $scope.isLanguage = $rootScope.language == 1 ? false : true;
        $scope.languageText = $scope.isLanguage ? "DE" : "VN";
        $scope.questionCurrent;
        $scope.countPlayVideoText = null;

        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true})

        var temp;
        var type;
        init();
        function init() {
            if ($rootScope.language == 0) {
                $scope.titlePlayVideo = $rootScope.Menu.vn.start_video;
                $scope.MenuQuestionItem.klass = $rootScope.Menu.vn.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.vn.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.vn.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.vn.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.vn.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.vn.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.vn.view_result;
                $scope.MenuQuestionItem.filmStart = $rootScope.Menu.vn.button_start_video;
                $scope.MenuQuestionItem.viewQuestion = $rootScope.Menu.vn.view_question_video;
                $scope.MenuQuestionItem.titleCount1 = $rootScope.Menu.vn.title_count_play1;
                $scope.MenuQuestionItem.titleCount2 = $rootScope.Menu.vn.title_count_play2;
                $scope.MenuQuestionItem.yourAnswer = $rootScope.Menu.vn.your_answer;
                $scope.MenuQuestionItem.rightAnswer = $rootScope.Menu.vn.right_answer;
                $scope.MenuQuestionItem.statusRight = $rootScope.Menu.vn.status_answer_right;
                $scope.MenuQuestionItem.statusWrong = $rootScope.Menu.vn.status_answer_wrong;
                $scope.MenuQuestionItem.statusHard = $rootScope.Menu.vn.status_answer_hard;
                $scope.MenuQuestionItem.statusUnHard = $rootScope.Menu.vn.status_answer_un_hard;
                $scope.MenuQuestionItem.messageDialog = $rootScope.Menu.vn.show_question;
                $scope.MenuQuestionItem.yes = $rootScope.Menu.vn.yes;
                $scope.MenuQuestionItem.no = $rootScope.Menu.vn.no;
                $scope.MenuQuestionItem.go = $rootScope.Menu.vn.go;
                $scope.MenuQuestionItem.hard = $rootScope.Menu.vn.hard;
            }
            else {
                $scope.titlePlayVideo = $rootScope.Menu.de.start_video;
                $scope.MenuQuestionItem.klass = $rootScope.Menu.de.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.de.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.de.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.de.cancel;
                $scope.MenuQuestionItem.previos = $rootScope.Menu.de.previos_question;
                $scope.MenuQuestionItem.next = $rootScope.Menu.de.next_question;
                $scope.MenuQuestionItem.viewResult = $rootScope.Menu.de.view_result;
                $scope.MenuQuestionItem.filmStart = $rootScope.Menu.de.button_start_video;
                $scope.MenuQuestionItem.viewQuestion = $rootScope.Menu.de.view_question_video;
                $scope.MenuQuestionItem.titleCount1 = $rootScope.Menu.de.title_count_play1;
                $scope.MenuQuestionItem.titleCount2 = $rootScope.Menu.de.title_count_play2;
                $scope.MenuQuestionItem.yourAnswer = $rootScope.Menu.de.your_answer;
                $scope.MenuQuestionItem.rightAnswer = $rootScope.Menu.de.right_answer;
                $scope.MenuQuestionItem.statusRight = $rootScope.Menu.de.status_answer_right;
                $scope.MenuQuestionItem.statusWrong = $rootScope.Menu.de.status_answer_wrong;
                $scope.MenuQuestionItem.statusHard = $rootScope.Menu.de.status_answer_hard;
                $scope.MenuQuestionItem.statusUnHard = $rootScope.Menu.de.status_answer_un_hard;
                $scope.MenuQuestionItem.messageDialog = $rootScope.Menu.de.show_question;
                $scope.MenuQuestionItem.yes = $rootScope.Menu.de.yes;
                $scope.MenuQuestionItem.no = $rootScope.Menu.de.no;
                $scope.MenuQuestionItem.go = $rootScope.Menu.de.go;
                $scope.MenuQuestionItem.hard = $rootScope.Menu.de.hard;
            }
        }        

        if (!$rootScope.questionRandom) {
            type = "Z_PK ASC";
        }
        else {
            type = "RANDOM()";
        }

        loadQuestion($state.params.LID, $state.params.THEME);

        function loadQuestion(eventId, theme) {
            var eid = parseInt(eventId);
            $scope.listQuestion = [];
            if (theme == null || theme.length == 0) {
                switch (eid) {
                    case 1:
                        console.log("Select all questions");
                        console.log(type);
                        $rootScope.$broadcast('choose_list', eventId, null);
                        db.selectAllQuestionRandom(type).then(callbackAllQuestion);
                        // if ($rootScope.isActive) {                            
                        //     db.selectAllQuestionRandom(type).then(callbackAllQuestion);
                        // }
                        // else {
                        //     db.selectAllQuestionFree(type).then(callbackAllQuestion);
                        // }
                        break;
                    case 2:
                        db.selectAllAnswered(type).then(callbackAllQuestion);
                        break;
                    case 3:
                        db.selectAllAnswerRight(type).then(callbackAllQuestion);
                        break;
                    case 4:
                        db.selectAllAnswerWrong(type).then(callbackAllQuestion);
                        break;
                    case 5:
                        db.selectAllQuestionHard(type).then(callbackAllQuestion);
                        break;
                    case 6:
                        if ($rootScope.isActive) {
                            db.selectAllNotAnswered(type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectAllNotAnsweredFree(type).then(callbackAllQuestion);
                        }
                        break;
                    case 7:
                        if ($rootScope.isActive) {
                            db.selectAllQuestionNumber(type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectAllQuestionNumberFree(type).then(callbackAllQuestion);
                        }
                        break;
                    case 8:
                        if ($rootScope.isActive) {
                            db.selectAllQuestionVariant(type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectAllQuestionVariantFree(type).then(callbackAllQuestion);
                        }
                        break;
                    case 9:
                        if ($rootScope.isActive) {
                            db.selectAllQuestionVideo(type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectAllQuestionVideoFree(type).then(callbackAllQuestion);
                        }
                        break;
                }
            }
            else {
                switch (eid) {
                    case 1:
                        if ($rootScope.isActive) {
                            db.selectQuestionByTheme(theme + ".", type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectQuestionByThemeFree(theme + ".", type).then(callbackAllQuestion);
                        }
                        break;
                    case 2:
                        db.selectAllAnsweredByTheme(theme + ".", type).then(callbackAllQuestion);
                        break;
                    case 3:
                        db.selectAllAnswerRightByTheme(theme + ".", type).then(callbackAllQuestion);
                        break;
                    case 4:
                        db.selectAllAnswerWrongByTheme(theme + ".", type).then(callbackAllQuestion);
                        break;
                    case 5:
                        db.selectQuestionHardByTheme(theme + ".", type).then(callbackAllQuestion);
                        break;
                    case 6:
                        if ($rootScope.isActive) {
                            db.selectAllNotAnsweredByTheme(theme + ".", type).then(callbackAllQuestion);
                        }
                        else {
                            db.selectAllNotAnsweredByThemeFree(theme + ".", type).then(callbackAllQuestion);
                        }                        
                        break;
                }
            }
        }  
        
        function callbackAllQuestion(data) {
            $scope.listQuestion = data;
            $scope.sum = $scope.listQuestion.length;
            $scope.questionCurrent = new QuestionModel();
            $scope.questionItem1 = new QuestionModel();
            $scope.questionItem2 = new QuestionModel();
            $scope.questionItem3 = new QuestionModel();
            $scope.questionCurrent = $scope.listQuestion[$scope.count];
            if ($scope.questionCurrent.ZISVIDEO) {
                // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                $scope.questionCurrent.ZVARIANT = true;
            }
            if ($scope.sum > 2) {
                $scope.questionItem1 = $scope.listQuestion[$scope.sum - 1];
                $scope.questionItem2 = $scope.listQuestion[$scope.count];
                $scope.questionItem3 = $scope.listQuestion[$scope.count + 1];               
            }
            else if ($scope.sum > 1) {
                $scope.questionItem1 = $scope.listQuestion[$scope.count + 1];
                $scope.questionItem2 = $scope.listQuestion[$scope.count];
               
            }
            else if ($scope.sum > 0) {                
                $scope.questionItem2 = $scope.listQuestion[$scope.count];
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
            init();
            initChangeLanguage();
            $ionicLoading.hide();
        }           

        $scope.changeLanguage = function () {
            $scope.isLanguage = !$scope.isLanguage;
            $scope.languageText = $scope.isLanguage ? "DE" : "VN";
            if ($rootScope.questionChild == 1) {
                init();
                initChangeLanguage();
            }
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "lang");
        }

        $scope.$on("changeLanguage", function (event) {
            if ($rootScope.questionChild == 1) {
                init();
                initChangeLanguage();
            }
        });
                 

        function initChangeLanguage() {
            //set answer
            if ($rootScope.language == 0) {
                $scope.questionCurrent.ZQUESTIONTEMP = $scope.questionCurrent.ZQUESTIONVN;
                $scope.questionCurrent.ZANSWER[0].ZANSWER = $scope.questionCurrent.ZANSWER[0].vn.ZANSWER;
                $scope.questionCurrent.ZANSWER[1].ZANSWER = $scope.questionCurrent.ZANSWER[1].vn.ZANSWER;
                $scope.questionCurrent.ZANSWER[2].ZANSWER = $scope.questionCurrent.ZANSWER[2].vn.ZANSWER;
                $scope.questionItem1.ZQUESTIONTEMP = $scope.questionItem1.ZQUESTIONVN;
                $scope.questionItem1.ZANSWER[0].ZANSWER = $scope.questionItem1.ZANSWER[0].vn.ZANSWER;
                $scope.questionItem1.ZANSWER[1].ZANSWER = $scope.questionItem1.ZANSWER[1].vn.ZANSWER;
                $scope.questionItem1.ZANSWER[2].ZANSWER = $scope.questionItem1.ZANSWER[2].vn.ZANSWER;
                $scope.questionItem2.ZQUESTIONTEMP = $scope.questionItem2.ZQUESTIONVN;
                $scope.questionItem2.ZANSWER[0].ZANSWER = $scope.questionItem2.ZANSWER[0].vn.ZANSWER;
                $scope.questionItem2.ZANSWER[1].ZANSWER = $scope.questionItem2.ZANSWER[1].vn.ZANSWER;
                $scope.questionItem2.ZANSWER[2].ZANSWER = $scope.questionItem2.ZANSWER[2].vn.ZANSWER;
                $scope.questionItem3.ZQUESTIONTEMP = $scope.questionItem3.ZQUESTIONVN;
                $scope.questionItem3.ZANSWER[0].ZANSWER = $scope.questionItem3.ZANSWER[0].vn.ZANSWER;
                $scope.questionItem3.ZANSWER[1].ZANSWER = $scope.questionItem3.ZANSWER[1].vn.ZANSWER;
                $scope.questionItem3.ZANSWER[2].ZANSWER = $scope.questionItem3.ZANSWER[2].vn.ZANSWER;

                $scope.questionItem1.ZPRETEXTTEMP = $scope.questionItem1.ZPRETEXTVN;
                $scope.questionItem2.ZPRETEXTTEMP = $scope.questionItem2.ZPRETEXTVN;
                $scope.questionItem3.ZPRETEXTTEMP = $scope.questionItem3.ZPRETEXTVN;

                $scope.questionItem1.ANSWERINPUTSTRING1TEMP = $scope.questionItem1.ANSWERINPUTSTRING1VN;
                $scope.questionItem2.ANSWERINPUTSTRING1TEMP = $scope.questionItem2.ANSWERINPUTSTRING1VN;
                $scope.questionItem3.ANSWERINPUTSTRING1TEMP = $scope.questionItem3.ANSWERINPUTSTRING1VN;

                $scope.questionItem1.ANSWERINPUTSTRING2TEMP = $scope.questionItem1.ANSWERINPUTSTRING2VN;
                $scope.questionItem2.ANSWERINPUTSTRING2TEMP = $scope.questionItem2.ANSWERINPUTSTRING2VN;
                $scope.questionItem3.ANSWERINPUTSTRING2TEMP = $scope.questionItem3.ANSWERINPUTSTRING2VN;

                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }

            }
            else {
                $scope.questionCurrent.ZQUESTIONTEMP = $scope.questionCurrent.ZQUESTION;
                $scope.questionCurrent.ZANSWER[0].ZANSWER = $scope.questionCurrent.ZANSWER[0].de.ZANSWER;
                $scope.questionCurrent.ZANSWER[1].ZANSWER = $scope.questionCurrent.ZANSWER[1].de.ZANSWER;
                $scope.questionCurrent.ZANSWER[2].ZANSWER = $scope.questionCurrent.ZANSWER[2].de.ZANSWER;
                $scope.questionItem1.ZQUESTIONTEMP = $scope.questionItem1.ZQUESTION;
                $scope.questionItem1.ZANSWER[0].ZANSWER = $scope.questionItem1.ZANSWER[0].de.ZANSWER;
                $scope.questionItem1.ZANSWER[1].ZANSWER = $scope.questionItem1.ZANSWER[1].de.ZANSWER;
                $scope.questionItem1.ZANSWER[2].ZANSWER = $scope.questionItem1.ZANSWER[2].de.ZANSWER;
                $scope.questionItem2.ZQUESTIONTEMP = $scope.questionItem2.ZQUESTION;
                $scope.questionItem2.ZANSWER[0].ZANSWER = $scope.questionItem2.ZANSWER[0].de.ZANSWER;
                $scope.questionItem2.ZANSWER[1].ZANSWER = $scope.questionItem2.ZANSWER[1].de.ZANSWER;
                $scope.questionItem2.ZANSWER[2].ZANSWER = $scope.questionItem2.ZANSWER[2].de.ZANSWER;
                $scope.questionItem3.ZQUESTIONTEMP = $scope.questionItem3.ZQUESTION;
                $scope.questionItem3.ZANSWER[0].ZANSWER = $scope.questionItem3.ZANSWER[0].de.ZANSWER;
                $scope.questionItem3.ZANSWER[1].ZANSWER = $scope.questionItem3.ZANSWER[1].de.ZANSWER;
                $scope.questionItem3.ZANSWER[2].ZANSWER = $scope.questionItem3.ZANSWER[2].de.ZANSWER;

                $scope.questionItem1.ZPRETEXTTEMP = $scope.questionItem1.ZPRETEXT;
                $scope.questionItem2.ZPRETEXTTEMP = $scope.questionItem2.ZPRETEXT;
                $scope.questionItem3.ZPRETEXTTEMP = $scope.questionItem3.ZPRETEXT;

                $scope.questionItem1.ANSWERINPUTSTRING1TEMP = $scope.questionItem1.ANSWERINPUTSTRING1;
                $scope.questionItem2.ANSWERINPUTSTRING1TEMP = $scope.questionItem2.ANSWERINPUTSTRING1;
                $scope.questionItem3.ANSWERINPUTSTRING1TEMP = $scope.questionItem3.ANSWERINPUTSTRING1;

                $scope.questionItem1.ANSWERINPUTSTRING2TEMP = $scope.questionItem1.ANSWERINPUTSTRING2;
                $scope.questionItem2.ANSWERINPUTSTRING2TEMP = $scope.questionItem2.ANSWERINPUTSTRING2;
                $scope.questionItem3.ANSWERINPUTSTRING2TEMP = $scope.questionItem3.ANSWERINPUTSTRING2;

                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "<br /><b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }
            }
        }

        $scope.blurInput1 = function () {
            var element = document.getElementById("flip1");

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];

            if (ipAnswer1 == null && ipAnswer != null) {
                if (!ipAnswer.value.match(/[a-z]/i)) {
                    ipAnswer.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
            else {
                var ipAnswer2 = element.getElementsByClassName("ipAnswer2")[0];
                if (!ipAnswer1.value.match(/[a-z]/i)) {
                    ipAnswer1.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
                if (!ipAnswer2.value.match(/[a-z]/i)) {
                    ipAnswer2.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
        }

        $scope.blurInput2 = function () {
            var element = document.getElementById("flip2");

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];

            if (ipAnswer1 == null && ipAnswer != null) {
                if (!ipAnswer.value.match(/[a-z]/i)) {
                    ipAnswer.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
            else {
                var ipAnswer2 = element.getElementsByClassName("ipAnswer2")[0];
                if (!ipAnswer1.value.match(/[a-z]/i)) {
                    ipAnswer1.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
                if (!ipAnswer2.value.match(/[a-z]/i)) {
                    ipAnswer2.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
        }

        $scope.blurInput3 = function () {
            var element = document.getElementById("flip3");

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];

            if (ipAnswer1 == null && ipAnswer != null) {
                if (!ipAnswer.value.match(/[a-z]/i)) {
                    ipAnswer.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
            else {
                var ipAnswer2 = element.getElementsByClassName("ipAnswer2")[0];
                if (!ipAnswer1.value.match(/[a-z]/i)) {
                    ipAnswer1.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
                if (!ipAnswer2.value.match(/[a-z]/i)) {
                    ipAnswer2.blur();
                }
                else {
                    navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                }
            }
        }

        function endedVideo(e) {
            if ($scope.listQuestion[$scope.count].countPlayVideo == 0) {
                 $scope.listQuestion[$scope.count].questionCurrent.ZISVIDEO = false;
                 $scope.listQuestion[$scope.count].countPlayVideo = 5;
            }
        }

        function playVideo() {
            var filename = $scope.questionCurrent.ZFRAGENKATALOG.split('.').join('_');
            var videoPath = $rootScope.assetsPath + "videos/iOS/WVGA/" + filename.replace(/-/g, '_') + ".mp4";
            var options = {
                successCallback: function() {
                    window.plugins.streamingMedia.stop();
                    console.log("Player closed without error.");
                    endedVideo();
                },
                errorCallback: function(errMsg) {
                    console.log("Error! " + errMsg);
                }
            };
            window.plugins.streamingMedia.playVideo(videoPath, options);
            $scope.countPlayVideo -= 1;            

            $scope.questionCurrent.ZIMAGE = $scope.questionCurrent.ZBIGIMAGE;
            if ($scope.countPlayVideo == 0) {
                $scope.questionCurrent.ZISVIDEO = false;
                $scope.countPlayVideo = 5;
            }

            if ($rootScope.language == 0) {
                $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
            }
            else {
                $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "<br /><b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
            }
        }

        $scope.playVideo = function () {
            playVideo();
        };

        $scope.hideVideo = function () {
            window.plugins.streamingMedia.stopAudio();
        };

        $scope.showQuestion = function () {
            alertCloseVideo($scope.MenuQuestionItem.messageDialog, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
        }

        function alertCloseVideo(message,yes,no) {
            navigator.notification.confirm(
                message, // message
                 onConfirm,            // callback to invoke with index of button pressed
                '',           // title
                [yes, no]     // buttonLabels
            );
        }

        function onConfirm(buttonIndex) {
            if (buttonIndex != 2) {
                $scope.questionCurrent.ZISVIDEO = false;
                $scope.countPlayVideo = 5;
                if (!$scope.$$phase) {
                    $scope.$apply();
                } else {
                    $timeout(function () { $scope.$apply(); }, 500);
                }
            }            
        }

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
      
        $scope.open = function (event) {
            switch (event) {
                case 2:
                    $state.go('question', {}, {});
                    break
            }                       
        };

        $scope.check = function (item) {
            item.checkAnswer = !item.checkAnswer;
        };
        $scope.val = "";
        $scope.rotateLeft = function () {
            var element = null;
            if ($scope.selectedIndex == 0) {
                element = document.getElementById("flip1");
            }
            else if ($scope.selectedIndex == 1) {
                element = document.getElementById("flip2");
            }
            else if ($scope.selectedIndex == 2) {
                element = document.getElementById("flip3");
            }

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer")[0].value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer1")[0].value + element.getElementsByClassName("ipAnswer2")[0].value;
            }
            $scope.countPlayVideo = 5;
            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {               

                $scope.listQuestion[$scope.count].ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[0].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[1].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[2].checkAnswer = false;
                resetInputNext();
                if ($scope.count == $scope.sum - 1) {
                    $scope.count = 0;
                }
                else {
                    $scope.count += 1;
                }
                $scope.nextQuestion = $scope.count + 1;

                if (ipAnswer != null) {
                    ipAnswer.value = "";
                    ipAnswer.style.backgroundColor = "#bdbdbd";
                    ipAnswer.readOnly = false;
                }
                if (ipAnswer1 != null) {
                    ipAnswer1.value = "";
                    ipAnswer1.style.backgroundColor = "#bdbdbd";
                    ipAnswer1.readOnly = false;
                }
                if (element.getElementsByClassName("ipAnswer2")[0] != null) {
                    element.getElementsByClassName("ipAnswer2")[0].value = "";
                    element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#bdbdbd";
                    element.getElementsByClassName("ipAnswer2")[0].readOnly = false;
                }

                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';               
                $scope.questionCurrent.ISANSWERED = false;
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                if ($scope.questionCurrent.ZISVIDEO) {
                    // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                    $scope.questionCurrent.ZVARIANT = true;
                }
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = $scope.count == 0 ? 1 : 0;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }
                if ($scope.sum > 2) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            $scope.questionItem3 = $scope.listQuestion[next];
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipRight");
                            flip3.classList.remove("flipLeft");
                            flip3.classList.add("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 2;
                            $scope.questionItem1 = $scope.listQuestion[next];
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            flip2.classList.add("flipLeft");
                            flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            flip3.classList.remove("flipRight");
                            break;
                        case 2:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem3 = $scope.listQuestion[prev];
                            flip3.classList.add("flipLeft");
                            flip1.classList.remove("flipRight");
                            flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            break;
                    }
                }
                else if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            break;
                    }
                }
                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        }

        $scope.rotateRight = function () {    
            var element = null;
            if ($scope.selectedIndex == 0) {
                element = document.getElementById("flip1");
            }
            else if ($scope.selectedIndex == 1) {
                element = document.getElementById("flip2");
            }
            else if ($scope.selectedIndex == 2) {
                element = document.getElementById("flip3");
            }

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer")[0].value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer1")[0].value + element.getElementsByClassName("ipAnswer2")[0].value;
            }
            $scope.countPlayVideo = 5;
            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {
                $scope.isNext = false;
                
                $scope.listQuestion[$scope.count].ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[0].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[1].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[2].checkAnswer = false;
                resetInputNext();

                if ($scope.count > 0) {
                    $scope.count -= 1;
                }
                else $scope.count = $scope.sum - 1;

                if (ipAnswer != null) {
                    ipAnswer.value = "";
                    ipAnswer.style.backgroundColor = "#bdbdbd";
                    ipAnswer.readOnly = false;
                }
                if (ipAnswer1 != null) {
                    ipAnswer1.value = "";
                    ipAnswer1.style.backgroundColor = "#bdbdbd";
                    ipAnswer1.readOnly = false;
                }
                if (element.getElementsByClassName("ipAnswer2")[0] != null) {
                    element.getElementsByClassName("ipAnswer2")[0].value = "";
                    element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#bdbdbd";
                    element.getElementsByClassName("ipAnswer2")[0].readOnly = false;
                }

                $scope.nextQuestion = $scope.count + 1;
                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';               
                $scope.questionCurrent.ISANSWERED = false;

                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                if ($scope.questionCurrent.ZISVIDEO) {
                    // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                    $scope.questionCurrent.ZVARIANT = true;
                }
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");

                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = $scope.count == 0 ? 1 : 0;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }
                if ($scope.sum > 2) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 2;
                            $scope.questionItem1 = $scope.listQuestion[next];
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            flip1.classList.add("flipRight");
                            flip2.classList.remove("flipRight");
                            flip2.classList.add("flipLeft");
                            flip3.classList.remove("flipLeft");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem3 = $scope.listQuestion[prev];
                            flip2.classList.add("flipRight");
                            flip1.classList.remove("flipLeft");
                            flip3.classList.remove("flipRight");
                            flip3.classList.add("flipLeft");
                            break;
                        case 2:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            $scope.questionItem3 = $scope.listQuestion[next];
                            flip3.classList.add("flipRight");
                            flip1.classList.remove("flipRight");
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipLeft");
                            break;
                    }
                }
                else if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            if (!flip2.classList.contains("flipLeft")) flip2.classList.add("flipLeft");
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            break;
                    }
                }
                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        }

        $scope.onPrevios = function () {
            var element = null;
            if ($scope.selectedIndex == 0) {
                element = document.getElementById("flip1");
            }
            else if ($scope.selectedIndex == 1) {
                element = document.getElementById("flip2");
            }
            else if ($scope.selectedIndex == 2) {
                element = document.getElementById("flip3");
            }

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer")[0].value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer1")[0].value + element.getElementsByClassName("ipAnswer2")[0].value;
            }
            $scope.countPlayVideo = 5;
            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {
                $scope.isNext = false;
                $scope.listQuestion[$scope.count].ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[0].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[1].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[2].checkAnswer = false;
                resetInputNext();
                if ($scope.count > 0) {
                    $scope.count -= 1;
                }
                else $scope.count = $scope.sum - 1;

                if (ipAnswer != null) {
                    ipAnswer.value = "";
                    ipAnswer.style.backgroundColor = "#bdbdbd";
                    ipAnswer.readOnly = false;
                }
                if (ipAnswer1 != null) {
                    ipAnswer1.value = "";
                    ipAnswer1.style.backgroundColor = "#bdbdbd";
                    ipAnswer1.readOnly = false;
                }
                if (element.getElementsByClassName("ipAnswer2")[0] != null) {
                    element.getElementsByClassName("ipAnswer2")[0].value = "";
                    element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#bdbdbd";
                    element.getElementsByClassName("ipAnswer2")[0].readOnly = false;
                }

                $scope.nextQuestion = $scope.count + 1;
                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.countPlayVideo = 5;
                $scope.questionCurrent.ISANSWERED = false;
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                if ($scope.questionCurrent.ZISVIDEO) {
                    // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                    $scope.questionCurrent.ZVARIANT = true;
                }
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = $scope.count == 0 ? 1 : 0;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }

                if ($scope.sum > 2) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 2;
                            $scope.questionItem1 = $scope.listQuestion[next];
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            flip1.classList.add("flipRight");
                            flip2.classList.remove("flipRight");
                            flip2.classList.add("flipLeft");
                            flip3.classList.remove("flipLeft");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem3 = $scope.listQuestion[prev];
                            flip2.classList.add("flipRight");
                            flip1.classList.remove("flipLeft");
                            flip3.classList.remove("flipRight");
                            flip3.classList.add("flipLeft");
                            break;
                        case 2:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            $scope.questionItem3 = $scope.listQuestion[next];
                            flip3.classList.add("flipRight");
                            flip1.classList.remove("flipRight");
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipLeft");
                            break;
                    }
                }
                else if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            if (!flip2.classList.contains("flipLeft")) flip2.classList.add("flipLeft");
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            break;
                    }
                }

                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        };

        $scope.onNextItem = function () {
            var element = null;
            if ($scope.selectedIndex == 0) {
                element = document.getElementById("flip1");
            }
            else if ($scope.selectedIndex == 1) {
                element = document.getElementById("flip2");
            }
            else if ($scope.selectedIndex == 2) {
                element = document.getElementById("flip3");
            }

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer")[0].value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = element.getElementsByClassName("ipAnswer1")[0].value + element.getElementsByClassName("ipAnswer2")[0].value;
            }
            $scope.countPlayVideo = 5;
            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {
                $scope.isNext = true;
                $scope.listQuestion[$scope.count].ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.listQuestion[$scope.count].ZANSWER[0].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[1].checkAnswer = false;
                $scope.listQuestion[$scope.count].ZANSWER[2].checkAnswer = false;
                resetInputNext();
                if ($scope.count == $scope.sum - 1) {
                    $scope.count = 0;
                }
                else {
                    $scope.count += 1;
                }

                if (ipAnswer != null) {
                    ipAnswer.value = "";
                    ipAnswer.style.backgroundColor = "#bdbdbd";
                    ipAnswer.readOnly = false;
                }
                if (ipAnswer1 != null) {
                    ipAnswer1.value = "";
                    ipAnswer1.style.backgroundColor = "#bdbdbd";
                    ipAnswer1.readOnly = false;
                }
                if (element.getElementsByClassName("ipAnswer2")[0] != null) {
                    element.getElementsByClassName("ipAnswer2")[0].value = "";
                    element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#bdbdbd";
                    element.getElementsByClassName("ipAnswer2")[0].readOnly = false;
                }


                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.countPlayVideo = 5;
                $scope.questionCurrent.ISANSWERED = false;
                $scope.nextQuestion = $scope.count + 1;
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                if ($scope.questionCurrent.ZISVIDEO) {
                    // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                    $scope.questionCurrent.ZVARIANT = true;
                }
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = $scope.count == 0 ? 1 : 0;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }
                if ($scope.sum > 2) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            $scope.questionItem3 = $scope.listQuestion[next];
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipRight");
                            flip3.classList.remove("flipLeft");
                            flip3.classList.add("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 2;
                            $scope.questionItem1 = $scope.listQuestion[next];
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            flip2.classList.add("flipLeft");
                            flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            flip3.classList.remove("flipRight");
                            break;
                        case 2:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem3 = $scope.listQuestion[prev];
                            flip3.classList.add("flipLeft");
                            flip1.classList.remove("flipRight");
                            flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            break;
                    }
                }
                else if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            $scope.questionItem1 = $scope.listQuestion[prev];
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            if (flip1.classList.contains("flipLeft")) flip1.classList.remove("flipLeft");
                            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                            break;
                    }
                }
                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        };

        $scope.onBack = function () {
            $scope.count = 0;
            $scope.sum = 0;
            $scope.nextQuestion = 1;
            $scope.countPlayVideo = 5;
            $scope.listQuestion = [];
            $scope.questionCurrent = new QuestionModel();
            $scope.questionItem1 = new QuestionModel();
            $scope.questionItem2 = new QuestionModel();
            $scope.questionItem3 = new QuestionModel();
            startPage = false;
            if ($rootScope.questionChildOld == 2) {                
                document.getElementById("questionByTheme").style.opacity = "1";
            }
            else {
                document.getElementById("mainQuestion").style.opacity = "1";
            }

            var element = null;
            if ($scope.selectedIndex == 0) {
                element = document.getElementById("flip1");
            }
            else if ($scope.selectedIndex == 1) {
                element = document.getElementById("flip2");
            }
            else if ($scope.selectedIndex == 2) {
                element = document.getElementById("flip3");
            }

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];

            if (ipAnswer != null) {
                ipAnswer.value = "";
                ipAnswer.style.backgroundColor = "#bdbdbd";
                ipAnswer.readOnly = false;
            }
            if (ipAnswer1 != null) {
                ipAnswer1.value = "";
                ipAnswer1.style.backgroundColor = "#bdbdbd";
                ipAnswer1.readOnly = false;
            }
            if (element.getElementsByClassName("ipAnswer1")[0] != null) {
                element.getElementsByClassName("ipAnswer1")[0].value = "";
                element.getElementsByClassName("ipAnswer1")[0].style.backgroundColor = "#bdbdbd";
                element.getElementsByClassName("ipAnswer1")[0].readOnly = false;
                element.getElementsByClassName("ipAnswer2")[0].value = "";
                element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#bdbdbd";
                element.getElementsByClassName("ipAnswer2")[0].readOnly = false;
            }

            var flip1 = document.getElementById("flip1");
            var flip2 = document.getElementById("flip2");
            var flip3 = document.getElementById("flip3");        
            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
            if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
            if (flip3.classList.contains("flipLeft")) flip3.classList.remove("flipLeft");
            if (!flip3.classList.contains("flipRight")) flip3.classList.add("flipRight");
            $scope.selectedIndex == 1;
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
            
        };


        var promise;
        $scope.onSetHard = function () {
            if (promise != null) {
                $timeout.cancel(promise);
                $scope.isShowBar = false;
            }
            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                if (data == $scope.questionCurrent.ZID) {
                    if (!$scope.questionCurrent.ISHARD)
                    {
                        db.updateQuestionHard($scope.questionCurrent.ZID).then(function () {
                            $rootScope.$broadcast("reload");
                            if ($rootScope.questionChild == 2) {
                                $rootScope.$broadcast("reloadTheme");
                            }
                            $scope.questionCurrent.ISHARD = true;
                            $scope.hardText = $scope.MenuQuestionItem.statusHard;
                            $scope.isShowBar = true;
                            promise = $timeout(function () {
                                $scope.isShowBar = false;
                            }, 3000);
                        });
                    }
                    else {
                        db.updateQuestionUnHard($scope.questionCurrent.ZID).then(function () {
                            $rootScope.$broadcast("reload");
                            if ($rootScope.questionChild == 2) {
                                $rootScope.$broadcast("reloadTheme");
                            }
                            $scope.hardText = $scope.MenuQuestionItem.statusUnHard;
                            $scope.isShowBar = true;
                            promise = $timeout(function () {
                                $scope.isShowBar = false;
                                $scope.questionCurrent.ISHARD = false;
                            }, 3000);
                        });
                    }
                }
                else {
                    db.addQuestionHard($scope.questionCurrent.ZID).then(function () {
                        $rootScope.$broadcast("reload");
                        if ($rootScope.questionChild == 2) {
                            $rootScope.$broadcast("reloadTheme");
                        }
                        $scope.questionCurrent.ISHARD = true;
                        $scope.hardText = $scope.MenuQuestionItem.statusHard;
                        $scope.isShowBar = true;
                        promise = $timeout(function () {
                            $scope.isShowBar = false;
                        }, 3000);
                    });
                }                
            });
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "hard");
        };

        $scope.onCheckValid = function () {
            checkValid();
        };

        function checkValid() {
            if (promise != null) {
                $timeout.cancel(promise);
                $scope.isShowBar = false;
            }            
            if (!$scope.questionCurrent.ZISINPUT) {
                $scope.questionCurrent.ISANSWERED = true;
                if ($scope.questionCurrent.ZANSWER[0].checkAnswer) {
                    if ($scope.questionCurrent.ZVALID1 == 1) {
                        $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_right.png';
                        $scope.questionCurrent.ZANSWER[0].isRight = true;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_wrong1.png';
                        $scope.questionCurrent.ZANSWER[0].isRight = false;
                    }
                }
                else {
                    if ($scope.questionCurrent.ZVALID1 == 1) {
                        $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_right1.png';
                        $scope.questionCurrent.ZANSWER[0].isRight = false;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_wrong.png';
                        $scope.questionCurrent.ZANSWER[0].isRight = true;
                    }
                }

                if ($scope.questionCurrent.ZANSWER[1].checkAnswer) {
                    if ($scope.questionCurrent.ZVALID2 == 1) {
                        $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_right.png';
                        $scope.questionCurrent.ZANSWER[1].isRight = true;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_wrong1.png';
                        $scope.questionCurrent.ZANSWER[1].isRight = false;
                    }
                }
                else {
                    if ($scope.questionCurrent.ZVALID2 == 1) {
                        $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_right1.png';
                        $scope.questionCurrent.ZANSWER[1].isRight = false;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_wrong.png';
                        $scope.questionCurrent.ZANSWER[1].isRight = true;
                    }
                }

                if ($scope.questionCurrent.ZANSWER[2].checkAnswer) {
                    if ($scope.questionCurrent.ZVALID3 == 1) {
                        $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_right.png';
                        $scope.questionCurrent.ZANSWER[2].isRight = true;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_wrong1.png';
                        $scope.questionCurrent.ZANSWER[2].isRight = false;
                    }
                }
                else {
                    if ($scope.questionCurrent.ZVALID3 == 1) {
                        $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_right1.png';
                        $scope.questionCurrent.ZANSWER[2].isRight = false;
                    }
                    else {
                        $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_wrong.png';
                        $scope.questionCurrent.ZANSWER[2].isRight = true;
                    }
                }

                if ($scope.questionCurrent.ZANSWER[0].isRight && $scope.questionCurrent.ZANSWER[1].isRight && $scope.questionCurrent.ZANSWER[2].isRight) {
                    $scope.questionCurrent.ANSWERRIGHT = true;
                    db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                        if (data == $scope.questionCurrent.ZID) {
                            db.updateAnswerRight($scope.questionCurrent.ZID).then(function () {
                                $rootScope.$broadcast("reload");
                                if ($rootScope.questionChild == 2) {
                                    $rootScope.$broadcast("reloadTheme");
                                }
                                $scope.isShowBar = true;
                                promise = $timeout(function () {
                                    $scope.isShowBar = false;
                                }, 3000);
                            });
                        }
                        else {
                            db.addAnswerRight($scope.questionCurrent.ZID).then(function () {
                                $rootScope.$broadcast("reload");
                                if ($rootScope.questionChild == 2) {
                                    $rootScope.$broadcast("reloadTheme");
                                }
                                $scope.isShowBar = true;
                                promise = $timeout(function () {
                                    $scope.isShowBar = false;
                                }, 3000);
                            });
                        }
                    });
                    if ($rootScope.audio) $rootScope.$broadcast("playaudio", "right");
                }
                else {
                    $scope.questionCurrent.ANSWERRIGHT = false;
                    db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                        if (data == $scope.questionCurrent.ZID) {
                            db.updateAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                $rootScope.$broadcast("reload");
                                if ($rootScope.questionChild == 2) {
                                    $rootScope.$broadcast("reloadTheme");
                                }
                                $scope.isShowBar = true;
                                promise = $timeout(function () {
                                    $scope.isShowBar = false;
                                }, 3000);
                            });
                        }
                        else {
                            db.addAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                $rootScope.$broadcast("reload");
                                if ($rootScope.questionChild == 2) {
                                    $rootScope.$broadcast("reloadTheme");
                                }
                                $scope.isShowBar = true;
                                promise = $timeout(function () {
                                    $scope.isShowBar = false;
                                }, 3000);
                            });
                        }
                    });
                    if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
                }
            }
            else {

                var element = null;
                if ($scope.selectedIndex == 0) {
                    element = document.getElementById("flip1");
                }
                else if ($scope.selectedIndex == 1) {
                    element = document.getElementById("flip2");
                }
                else if ($scope.selectedIndex == 2) {
                    element = document.getElementById("flip3");
                }                

                if (element.getElementsByClassName("ipAnswer1")[0] == null) {
                    element.getElementsByClassName("ipAnswer")[0].blur();
                    var yourAnswer = element.getElementsByClassName("ipAnswer")[0].value;
                    var rightAnswer = element.getElementsByClassName("ipValid")[0].value;

                    if (!yourAnswer.match(/[a-z]/i)) {
                        $scope.questionCurrent.ISANSWERED = true;
                        $scope.questionCurrent.ZINPUTANSWER1 = yourAnswer;

                        if (yourAnswer == rightAnswer) {
                            $scope.questionCurrent.ANSWERRIGHT = true;
                            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                                if (data == $scope.questionCurrent.ZID) {
                                    db.updateAnswerRight($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                                else {
                                    db.addAnswerRight($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                            });
                            element.getElementsByClassName("ipAnswer")[0].style.backgroundColor = "#3db707";
                            element.getElementsByClassName("ipAnswer")[0].readOnly = true;
                            resetInput();

                            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "right");
                        }
                        else {
                            $scope.questionCurrent.ANSWERRIGHT = false;
                            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                                if (data == $scope.questionCurrent.ZID) {
                                    db.updateAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                                else {
                                    db.addAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                            });
                            element.getElementsByClassName("ipAnswer")[0].style.backgroundColor = "#cd2630";
                            element.getElementsByClassName("ipAnswer")[0].readOnly = true;
                            resetInput();
                            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
                        }
                    }
                    else {
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {

                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else {
                    var yourAnswer = element.getElementsByClassName("ipAnswer1")[0].value;
                    var yourAnswer1 = element.getElementsByClassName("ipAnswer2")[0].value;
                    var rightAnswer = element.getElementsByClassName("ipValid1")[0].value;
                    var rightAnswer1 = element.getElementsByClassName("ipValid2")[0].value;

                    element.getElementsByClassName("ipAnswer1")[0].blur();
                    element.getElementsByClassName("ipAnswer2")[0].blur();

                    if (!yourAnswer.match(/[a-z]/i) && !yourAnswer1.match(/[a-z]/i)) {
                        $scope.questionCurrent.ISANSWERED = true;
                        $scope.questionCurrent.ZINPUTANSWER1 = yourAnswer;
                        $scope.questionCurrent.ZINPUTANSWER2 = yourAnswer1;

                        if (yourAnswer == rightAnswer && yourAnswer1 == rightAnswer1) {
                            $scope.questionCurrent.ANSWERRIGHT = true;
                            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                                if (data == $scope.questionCurrent.ZID) {
                                    db.updateAnswerRight($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                                else {
                                    db.addAnswerRight($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                            });
                            element.getElementsByClassName("ipAnswer1")[0].style.backgroundColor = "#3db707";
                            element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#3db707";
                            element.getElementsByClassName("ipAnswer1")[0].readOnly = true;
                            element.getElementsByClassName("ipAnswer2")[0].readOnly = true;
                            resetInput();
                            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "right");
                        }
                        else {
                            $scope.questionCurrent.ANSWERRIGHT = false;
                            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                                if (data == $scope.questionCurrent.ZID) {
                                    db.updateAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                                else {
                                    db.addAnswerWrong($scope.questionCurrent.ZID).then(function () {
                                        $rootScope.$broadcast("reload");
                                        if ($rootScope.questionChild == 2) {
                                            $rootScope.$broadcast("reloadTheme");
                                        }
                                        $scope.isShowBar = true;
                                        promise = $timeout(function () {
                                            $scope.isShowBar = false;
                                        }, 3000);
                                    });
                                }
                            });
                            element.getElementsByClassName("ipAnswer1")[0].style.backgroundColor = "#cd2630";
                            element.getElementsByClassName("ipAnswer2")[0].style.backgroundColor = "#cd2630";
                            element.getElementsByClassName("ipAnswer1")[0].readOnly = true;
                            element.getElementsByClassName("ipAnswer2")[0].readOnly = true;
                            resetInput();
                            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
                        }
                    }
                    else {
                        // choan

                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                                
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
            }
        }
        
        function resetInput() {
            if ($scope.questionCurrent.ANSWERRIGHT) {
                if (true) {
                    var t1 = $scope.questionCurrent.ZANSWER1VN.indexOf('^');
                    var answer1 = $scope.questionCurrent.ZANSWER1VN.substring(0, t1);
                    var answer2 = $scope.questionCurrent.ZANSWER1VN.substring(t1 + 1);
                    var t2 = answer2.indexOf('^');
                    if (t2 > 0) {
                        var answer3 = answer2.substring(0, t2);
                        var answer4 = answer2.substring(t2 + 1);

                        if (answer3.length > 1) {
                            var valid1 = answer3.substring(0, answer3.indexOf(" "));
                            var text1 = answer3.substring(answer3.indexOf(" "));
                        } else {
                            var valid1 = answer3;
                            var text1 = answer3;
                        }

                        if (answer4.length > 1) {
                            var valid2 = answer4.substring(0, answer4.indexOf(" "));
                            var text2 = answer4.substring(answer4.indexOf(" "));
                        } else {
                            var valid2 = answer4;
                            var text2 = answer4;
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#3db707' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='text' style='background-color:#3db707' readonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='text' style='background-color:#3db707' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    }
                }

                var t1 = $scope.questionCurrent.ZANSWER1.indexOf('^');
                var answer1 = $scope.questionCurrent.ZANSWER1.substring(0, t1);
                var answer2 = $scope.questionCurrent.ZANSWER1.substring(t1 + 1);
                var t2 = answer2.indexOf('^');
                if (t2 > 0) {
                    var answer3 = answer2.substring(0, t2);
                    var answer4 = answer2.substring(t2 + 1);

                    if (answer3.length > 1) {
                        var valid1 = answer3.substring(0, answer3.indexOf(" "));
                        var text1 = answer3.substring(answer3.indexOf(" "));
                    } else {
                        var valid1 = answer3;
                        var text1 = answer3;
                    }

                    if (answer4.length > 1) {
                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                        var text2 = answer4.substring(answer4.indexOf(" "));
                    } else {
                        var valid2 = answer4;
                        var text2 = answer4;
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#3db707' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='text' style='background-color:#3db707' readonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                }
                else {
                    if (answer2.length > 1) {
                        var valid = answer2.substring(0, answer2.indexOf(" "));
                        var text = answer2.substring(answer2.indexOf(" "));
                    } else {
                        var valid = answer2;
                        var text = "";
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='text' style='background-color:#3db707' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                }
            }
            else {
                if (true) {
                    var t1 = $scope.questionCurrent.ZANSWER1VN.indexOf('^');
                    var answer1 = $scope.questionCurrent.ZANSWER1VN.substring(0, t1);
                    var answer2 = $scope.questionCurrent.ZANSWER1VN.substring(t1 + 1);
                    var t2 = answer2.indexOf('^');
                    if (t2 > 0) {
                        var answer3 = answer2.substring(0, t2);
                        var answer4 = answer2.substring(t2 + 1);

                        if (answer3.length > 1) {
                            var valid1 = answer3.substring(0, answer3.indexOf(" "));
                            var text1 = answer3.substring(answer3.indexOf(" "));
                        } else {
                            var valid1 = answer3;
                            var text1 = answer3;
                        }

                        if (answer4.length > 1) {
                            var valid2 = answer4.substring(0, answer4.indexOf(" "));
                            var text2 = answer4.substring(answer4.indexOf(" "));
                        } else {
                            var valid2 = answer4;
                            var text2 = answer4;
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#cd2630' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='text' style='background-color:#cd2630' readonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='text' style='background-color:#cd2630' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    }
                }

                var t1 = $scope.questionCurrent.ZANSWER1.indexOf('^');
                var answer1 = $scope.questionCurrent.ZANSWER1.substring(0, t1);
                var answer2 = $scope.questionCurrent.ZANSWER1.substring(t1 + 1);
                var t2 = answer2.indexOf('^');
                if (t2 > 0) {
                    var answer3 = answer2.substring(0, t2);
                    var answer4 = answer2.substring(t2 + 1);

                    if (answer3.length > 1) {
                        var valid1 = answer3.substring(0, answer3.indexOf(" "));
                        var text1 = answer3.substring(answer3.indexOf(" "));
                    } else {
                        var valid1 = answer3;
                        var text1 = answer3;
                    }

                    if (answer4.length > 1) {
                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                        var text2 = answer4.substring(answer4.indexOf(" "));
                    } else {
                        var valid2 = answer4;
                        var text2 = answer4;
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#cd2630' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='text' style='background-color:#cd2630' readonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                }
                else {
                    if (answer2.length > 1) {
                        var valid = answer2.substring(0, answer2.indexOf(" "));
                        var text = answer2.substring(answer2.indexOf(" "));
                    } else {
                        var valid = answer2;
                        var text = "";
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='text' style='background-color:#cd2630' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                }
            }
        }


        function resetInputNext() {
            if ($scope.listQuestion[$scope.count].ZISINPUT) {
                if (true) {
                    var t1 = $scope.listQuestion[$scope.count].ZANSWER1VN.indexOf('^');
                    var answer1 = $scope.listQuestion[$scope.count].ZANSWER1VN.substring(0, t1);
                    var answer2 = $scope.listQuestion[$scope.count].ZANSWER1VN.substring(t1 + 1);
                    var t2 = answer2.indexOf('^');
                    if (t2 > 0) {
                        var answer3 = answer2.substring(0, t2);
                        var answer4 = answer2.substring(t2 + 1);

                        if (answer3.length > 1) {
                            var valid1 = answer3.substring(0, answer3.indexOf(" "));
                            var text1 = answer3.substring(answer3.indexOf(" "));
                        } else {
                            var valid1 = answer3;
                            var text1 = answer3;
                        }

                        if (answer4.length > 1) {
                            var valid2 = answer4.substring(0, answer4.indexOf(" "));
                            var text2 = answer4.substring(answer4.indexOf(" "));
                        } else {
                            var valid2 = answer4;
                            var text2 = answer4;
                        }
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' style='background-color:#bdbdbd'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' style='background-color:#bdbdbd'/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' style='background-color:#bdbdbd'/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    }
                }

                var t1 = $scope.listQuestion[$scope.count].ZANSWER1.indexOf('^');
                var answer1 = $scope.listQuestion[$scope.count].ZANSWER1.substring(0, t1);
                var answer2 = $scope.listQuestion[$scope.count].ZANSWER1.substring(t1 + 1);
                var t2 = answer2.indexOf('^');
                if (t2 > 0) {
                    var answer3 = answer2.substring(0, t2);
                    var answer4 = answer2.substring(t2 + 1);

                    if (answer3.length > 1) {
                        var valid1 = answer3.substring(0, answer3.indexOf(" "));
                        var text1 = answer3.substring(answer3.indexOf(" "));
                    } else {
                        var valid1 = answer3;
                        var text1 = answer3;
                    }

                    if (answer4.length > 1) {
                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                        var text2 = answer4.substring(answer4.indexOf(" "));
                    } else {
                        var valid2 = answer4;
                        var text2 = answer4;
                    }
                    $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' style='background-color:#bdbdbd'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' style='background-color:#bdbdbd'/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                    $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                }
                else {
                    if (answer2.length > 1) {
                        var valid = answer2.substring(0, answer2.indexOf(" "));
                        var text = answer2.substring(answer2.indexOf(" "));
                    } else {
                        var valid = answer2;
                        var text = "";
                    }
                    $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' style='background-color:#bdbdbd'/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                }
            }            
        }

        $scope.onBlurNextQ = function (event) {
            if ($scope.nextQuestion < 1 || $scope.nextQuestion > $scope.sum) {
                $scope.nextQuestion = 1;
            }

            $scope.nextQuestion = $scope.nextQuestion != null ? $scope.nextQuestion : 1;
            $scope.count = $scope.nextQuestion - 1;
            $scope.listQuestion[$scope.count].ZANSWER[0].isValid = 'img/answer_uncheck.png';
            $scope.listQuestion[$scope.count].ZANSWER[1].isValid = 'img/answer_uncheck.png';
            $scope.listQuestion[$scope.count].ZANSWER[2].isValid = 'img/answer_uncheck.png';
            $scope.listQuestion[$scope.count].ISANSWERED = false;

            $scope.questionCurrent = $scope.listQuestion[$scope.count];
            if ($scope.questionCurrent.ZISVIDEO) {
                // setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                $scope.questionCurrent.ZVARIANT = true;
            }
            if ($scope.nextQuestion > $scope.count) {              
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = prev;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }
                switch ($scope.selectedIndex) {
                    case 0:
                        $scope.selectedIndex = 1;
                        $scope.questionItem1 = $scope.listQuestion[prev];
                        $scope.questionItem2 = $scope.listQuestion[$scope.count];
                        $scope.questionItem3 = $scope.listQuestion[next];
                        flip1.classList.add("flipLeft");
                        flip2.classList.remove("flipRight");
                        flip3.classList.remove("flipLeft");
                        flip3.classList.add("flipRight");
                        break;
                    case 1:
                        $scope.selectedIndex = 2;
                        $scope.questionItem1 = $scope.listQuestion[next];
                        $scope.questionItem2 = $scope.listQuestion[prev];
                        $scope.questionItem3 = $scope.listQuestion[$scope.count];
                        flip2.classList.add("flipLeft");
                        flip1.classList.remove("flipLeft");
                        flip1.classList.add("flipRight");
                        flip3.classList.remove("flipRight");
                        break;
                    case 2:
                        $scope.selectedIndex = 0;
                        $scope.questionItem1 = $scope.listQuestion[$scope.count];
                        $scope.questionItem2 = $scope.listQuestion[next];
                        $scope.questionItem3 = $scope.listQuestion[prev];
                        flip3.classList.add("flipLeft");
                        flip1.classList.remove("flipRight");
                        flip2.classList.remove("flipLeft");
                        flip2.classList.add("flipRight");
                        break;
                }
            }
            else {                
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                if ($scope.sum > 2) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                }
                else if ($scope.sum > 1) {
                    var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                    var next = prev;
                }
                else if ($scope.sum > 0) {
                    var prev = $scope.count;
                    var next = prev;
                }
                switch ($scope.selectedIndex) {
                    case 0:
                        $scope.selectedIndex = 2;
                        $scope.questionItem1 = $scope.listQuestion[next];
                        $scope.questionItem2 = $scope.listQuestion[prev];
                        $scope.questionItem3 = $scope.listQuestion[$scope.count];
                        flip1.classList.add("flipRight");
                        flip2.classList.remove("flipRight");
                        flip2.classList.add("flipLeft");
                        flip3.classList.remove("flipLeft");
                        break;
                    case 1:
                        $scope.selectedIndex = 0;
                        $scope.questionItem1 = $scope.listQuestion[$scope.count];
                        $scope.questionItem2 = $scope.listQuestion[next];
                        $scope.questionItem3 = $scope.listQuestion[prev];
                        flip2.classList.add("flipRight");
                        flip1.classList.remove("flipLeft");
                        flip3.classList.remove("flipRight");
                        flip3.classList.add("flipLeft");
                        break;
                    case 2:
                        $scope.selectedIndex = 1;
                        $scope.questionItem1 = $scope.listQuestion[prev];
                        $scope.questionItem2 = $scope.listQuestion[$scope.count];
                        $scope.questionItem3 = $scope.listQuestion[next];
                        flip3.classList.add("flipRight");
                        flip1.classList.remove("flipRight");
                        flip1.classList.add("flipLeft");
                        flip2.classList.remove("flipLeft");
                        break;
                }
            }

            initChangeLanguage();
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
        }     

        $ionicModal.fromTemplateUrl('full-image-modal.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.imageModal = modal;
        });


        $scope.fullImage = function () {
            if (!$scope.questionCurrent.ZISVIDEO) {
                $scope.imageModal.show();
            }
            else {
                playVideo();
            }
        };

        $scope.hide = function () {
            $scope.imageModal.hide();
        };
    })
    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    .directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
})();
