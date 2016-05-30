(function () {
    "use strict";
    angular.module("TrafficLaws.TestController", ['ngMaterial', 'ui.router', 'ngAnimate', 'TrafficLaws.databaseService', 'ngActivityIndicator'])
    .controller('TestCtrl', function ($scope, $rootScope, $q, $sce, $state, $window, db, $interval, $timeout, $http,$activityIndicator, $ionicModal, $ionicLoading) {
        //$scope.pageClass = 'page-about';
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>', hideOnStateChange: true, noBackdrop: true})
        $scope.count = 0;
        $scope.sum = 0;
        $scope.testId = 0;
        $scope.isTestEnd = false;
        $scope.timeStamp = 0;
        $scope.selectedIndex = 1;
        $scope.count_ticked = 0;
        $scope.countPlayVideo = 5;
        $scope.pointsError = 0;
        $scope.pointsBasicError = 0;
        $scope.pointsAdvancedError = 0;
        //input
        $scope.changes = 0;
        $scope.changes1 = 0;
        $scope.changes2 = 0;

        $scope.listIdGrunt = [];
        $scope.listIdB = [];
        $scope.listQuestion = [];
        $scope.listBasic = [];
        $scope.listAdvanced = [];
        $rootScope.isBack = true;
        $rootScope.searchDisabled = true;
        $scope.listTheme1_1 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme1_2 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme1_3 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme1_4 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme1_5 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme1_7 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_1 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_2 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_4 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_5 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_6 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_7 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.listTheme2_8 = {
            title_vn: null,
            title_de: null,
            count: 0,
            title: null,
            rightCount: 0,
            wrongCount: 0,
            listItem: []
        };
        $scope.ZTNO = 0;
        $scope.timerCount = "59:59 ";
        $scope.isShowBar = false;
        $scope.hardText = "";
        $scope.flipLeft = false;
        $scope.flipRight = false;
        var isNext = true;
        var timer = 60 * 60 - 1;
        var interval;
        var countQuestion = 0;
        var utils = new Utils($http);
        
        $scope.MenuQuestionItem = {
            klass: null, codeQuestion: null, point: null, back: null, submit: null, next: null, ticked: null, noch: null, grundstoft: null,
            aufgaben: null, filmStart: null, viewQuestion: null, titleCount1: null, titleCount2: null, yourAnswer: null, rightAnswer: null, messageDialog: null,
            statusHard: null,yes: null, no: null, messageSubmit: null, statusUnHard: null, backMessage: null, alertSubmit1: null, alertSubmit2: null, causeTion: null
        };
        $scope.MenuQuestionResult = {
            klass: null, title: null, backtest: null, advanced: null, pointsError: null, basicTest: null, notbestanden: null, bestanden: null
        };
        $scope.isLanguage = $rootScope.language == 1 ? false : true;
        $scope.isLanguageResult = true;
        $scope.languageText = $scope.isLanguage ? "DE" : "VN";
        $scope.languageTextResult = $scope.isLanguageResult ? "DE" : "VN";        
        $scope.questionCurrent = new QuestionModel();
        $scope.questionItem1 = new QuestionModel();
        $scope.questionItem2 = new QuestionModel();
        $scope.questionItem3 = new QuestionModel();
        var type;        
        init();
        function init() {
            if ($rootScope.language == 0) {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.vn.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.vn.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.vn.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.vn.cancel;
                $scope.MenuQuestionItem.submit = $rootScope.Menu.vn.submit;
                $scope.MenuQuestionItem.next = $rootScope.Menu.vn.next_question;
                $scope.MenuQuestionItem.ticked = $rootScope.Menu.vn.ticked;
                $scope.MenuQuestionItem.noch = $rootScope.Menu.vn.count_ticked_1;
                $scope.MenuQuestionItem.aufgaben = $rootScope.Menu.vn.count_ticked_2;               
                $scope.MenuQuestionItem.filmStart = $rootScope.Menu.vn.button_start_video;
                $scope.MenuQuestionItem.viewQuestion = $rootScope.Menu.vn.view_question_video;
                $scope.MenuQuestionItem.titleCount1 = $rootScope.Menu.vn.title_count_play1;
                $scope.MenuQuestionItem.titleCount2 = $rootScope.Menu.vn.title_count_play2;
                $scope.MenuQuestionItem.yourAnswer = $rootScope.Menu.vn.your_answer;
                $scope.MenuQuestionItem.rightAnswer = $rootScope.Menu.vn.right_answer;
                $scope.MenuQuestionItem.messageSubmit = $rootScope.Menu.vn.submit_check;
                $scope.MenuQuestionItem.messageDialog = $rootScope.Menu.vn.show_question;
                $scope.MenuQuestionItem.yes = $rootScope.Menu.vn.yes;
                $scope.MenuQuestionItem.no = $rootScope.Menu.vn.no;
                $scope.MenuQuestionItem.statusHard = $rootScope.Menu.vn.status_answer_hard;
                $scope.MenuQuestionItem.statusUnHard = $rootScope.Menu.vn.status_answer_un_hard;
                $scope.MenuQuestionItem.backMessage = $rootScope.Menu.vn.back_check;
                $scope.MenuQuestionItem.alertSubmit1 = $rootScope.Menu.vn.alert_submit;
                $scope.MenuQuestionItem.alertSubmit2 = $rootScope.Menu.vn.alert_submit_1;
                $scope.MenuQuestionItem.causeTion = $rootScope.Menu.vn.cause_tion;
                $scope.titlePlayVideo = $rootScope.Menu.vn.start_video;
                $scope.MenuQuestionItem.grundstoft = $rootScope.Menu.vn.basic_test;
            }
            else {
                $scope.MenuQuestionItem.klass = $rootScope.Menu.de.klass;
                $scope.MenuQuestionItem.codeQuestion = $rootScope.Menu.de.code_question;
                $scope.MenuQuestionItem.point = $rootScope.Menu.de.point;
                $scope.MenuQuestionItem.back = $rootScope.Menu.de.cancel;
                $scope.MenuQuestionItem.submit = $rootScope.Menu.de.submit;
                $scope.MenuQuestionItem.next = $rootScope.Menu.de.next_question;
                $scope.MenuQuestionItem.ticked = $rootScope.Menu.de.ticked;
                $scope.MenuQuestionItem.noch = $rootScope.Menu.de.count_ticked_1;
                $scope.MenuQuestionItem.aufgaben = $rootScope.Menu.de.count_ticked_2;            
                $scope.MenuQuestionItem.filmStart = $rootScope.Menu.de.button_start_video;
                $scope.MenuQuestionItem.viewQuestion = $rootScope.Menu.de.view_question_video;
                $scope.MenuQuestionItem.titleCount1 = $rootScope.Menu.de.title_count_play1;
                $scope.MenuQuestionItem.titleCount2 = $rootScope.Menu.de.title_count_play2;
                $scope.MenuQuestionItem.yourAnswer = $rootScope.Menu.de.your_answer;
                $scope.MenuQuestionItem.rightAnswer = $rootScope.Menu.de.right_answer;
                $scope.MenuQuestionItem.messageSubmit = $rootScope.Menu.de.submit_check;
                $scope.MenuQuestionItem.messageDialog = $rootScope.Menu.de.show_question;
                $scope.MenuQuestionItem.yes = $rootScope.Menu.de.yes;
                $scope.MenuQuestionItem.no = $rootScope.Menu.de.no;
                $scope.MenuQuestionItem.statusHard = $rootScope.Menu.de.status_answer_hard;
                $scope.MenuQuestionItem.statusUnHard = $rootScope.Menu.de.status_answer_un_hard;
                $scope.MenuQuestionItem.backMessage = $rootScope.Menu.de.back_check;
                $scope.MenuQuestionItem.alertSubmit1 = $rootScope.Menu.de.alert_submit;
                $scope.MenuQuestionItem.alertSubmit2 = $rootScope.Menu.de.alert_submit_1;
                $scope.MenuQuestionItem.causeTion = $rootScope.Menu.de.cause_tion;
                $scope.titlePlayVideo = $rootScope.Menu.de.start_video;
                $scope.MenuQuestionItem.grundstoft = $rootScope.Menu.de.basic_test;
            }
        }

        initResult();
        function initResult() {
            if ($rootScope.language == 0) {
                $scope.MenuQuestionResult.klass = $rootScope.Menu.vn.klass;
                $scope.MenuQuestionResult.title = $rootScope.Menu.vn.result_title;
                $scope.MenuQuestionResult.backtest = $rootScope.Menu.vn.back_test;
                $scope.MenuQuestionResult.advanced = $rootScope.Menu.vn.advanced;
                $scope.MenuQuestionResult.pointsError = $rootScope.Menu.vn.point_error;
                $scope.MenuQuestionResult.basicTest = $rootScope.Menu.vn.basic_test;
                $scope.MenuQuestionResult.notbestanden = $rootScope.Menu.vn.not_bestanden;
                $scope.MenuQuestionResult.bestanden = $rootScope.Menu.vn.bestanden;                
            }
            else {
                $scope.MenuQuestionResult.klass = $rootScope.Menu.de.klass;
                $scope.MenuQuestionResult.title = $rootScope.Menu.de.result_title;
                $scope.MenuQuestionResult.backtest = $rootScope.Menu.de.back_test;
                $scope.MenuQuestionResult.advanced = $rootScope.Menu.de.advanced;
                $scope.MenuQuestionResult.pointsError = $rootScope.Menu.de.point_error;
                $scope.MenuQuestionResult.basicTest = $rootScope.Menu.de.basic_test;
                $scope.MenuQuestionResult.notbestanden = $rootScope.Menu.de.not_bestanden;
                $scope.MenuQuestionResult.bestanden = $rootScope.Menu.de.bestanden;                
            }
        }
       
        type = "RANDOM()";
        $scope.questionTheme1 = new Array();
        $scope.questionTheme2 = new Array();

        db.selectAllQuestionTheme().then(function (data) {
            for (var i = 0; i < data.length ; i++) {
                if (data[i].ZGROUP == 1) {
                    $scope.questionTheme1.push(data[i]);
                }
                else if (data[i].ZGROUP == 2) {
                    $scope.questionTheme2.push(data[i]);
                }
            }
            $scope.listTheme1_1.title_vn = $scope.questionTheme1[0].ZNAMEVN;
            $scope.listTheme1_1.title_de = $scope.questionTheme1[0].ZNAMEDE;
            $scope.listTheme1_2.title_vn = $scope.questionTheme1[1].ZNAMEVN;
            $scope.listTheme1_2.title_de = $scope.questionTheme1[1].ZNAMEDE;
            $scope.listTheme1_3.title_vn = $scope.questionTheme1[2].ZNAMEVN;
            $scope.listTheme1_3.title_de = $scope.questionTheme1[2].ZNAMEDE;
            $scope.listTheme1_4.title_vn = $scope.questionTheme1[3].ZNAMEVN;
            $scope.listTheme1_4.title_de = $scope.questionTheme1[3].ZNAMEDE;
            $scope.listTheme1_5.title_vn = $scope.questionTheme1[4].ZNAMEVN;
            $scope.listTheme1_5.title_de = $scope.questionTheme1[4].ZNAMEDE;
            $scope.listTheme1_7.title_vn = $scope.questionTheme1[5].ZNAMEVN;
            $scope.listTheme1_7.title_de = $scope.questionTheme1[5].ZNAMEDE;

            $scope.listTheme2_1.title_vn = $scope.questionTheme2[0].ZNAMEVN;
            $scope.listTheme2_1.title_de = $scope.questionTheme2[0].ZNAMEDE;
            $scope.listTheme2_2.title_vn = $scope.questionTheme2[1].ZNAMEVN;
            $scope.listTheme2_2.title_de = $scope.questionTheme2[1].ZNAMEDE;
            $scope.listTheme2_4.title_vn = $scope.questionTheme2[2].ZNAMEVN;
            $scope.listTheme2_4.title_de = $scope.questionTheme2[2].ZNAMEDE;
            $scope.listTheme2_5.title_vn = $scope.questionTheme2[3].ZNAMEVN;
            $scope.listTheme2_5.title_de = $scope.questionTheme2[3].ZNAMEDE;
            $scope.listTheme2_6.title_vn = $scope.questionTheme2[4].ZNAMEVN;
            $scope.listTheme2_6.title_de = $scope.questionTheme2[4].ZNAMEDE;
            $scope.listTheme2_7.title_vn = $scope.questionTheme2[5].ZNAMEVN;
            $scope.listTheme2_7.title_de = $scope.questionTheme2[5].ZNAMEDE;
            $scope.listTheme2_8.title_vn = $scope.questionTheme2[6].ZNAMEVN;
            $scope.listTheme2_8.title_de = $scope.questionTheme2[6].ZNAMEDE;
            if ($rootScope.isActive) {
                db.selectTestPackage(type).then(callbackAllQuestion);
            }
            else {
                db.selectTestPackageFree(type).then(callbackAllQuestion);
            }
        });

        function callbackAllQuestion(data) {
            $scope.ZTNO = data.ZTNO;
            $scope.testId = data.ZID;            
            db.selectQuestionByIdByTest(data.ZCOMBINATION).then(callbackGetId);            
            startTimer(timer);  
            $ionicLoading.hide();                 
        }

        function callbackGetId(data) {
            $scope.sum = data.length;
            $scope.count_ticked = data.length;
            for (var i = 0; i < data.length; i++) {
                var questionItem = new QuestionModel();
                questionItem.number = data[i].number + 1;
                questionItem.Z_PK = data[i].Z_PK;
                questionItem.Z_ENT = data[i].Z_ENT;
                questionItem.Z_OPT = data[i].Z_OPT;
                questionItem.ZID = data[i].ZID;
                questionItem.ZTESTIMAGE = data[i].ZTESTIMAGE;
                questionItem.ZUPDATE = data[i].ZUPDATE;
                questionItem.ZISHTML = data[i].ZISHTML;
                questionItem.ZISVIDEO = data[i].ZISVIDEO == 1 ? true : false;
                questionItem.ZISVIDEO_DEFAULT = questionItem.ZISVIDEO;
                questionItem.countPlayVideo = questionItem.ZISVIDEO ? 5 : 0;
                questionItem.ZOLDID = data[i].ZOLDID;
                questionItem.ZTESTBIGIMAGE = data[i].ZTESTBIGIMAGE;
                questionItem.ZL = data[i].ZL;
                questionItem.ZPOINTS = data[i].ZPOINTS;
                questionItem.ZTHEMA = data[i].ZTHEMA;
                questionItem.ZQZG = data[i].ZQZG;
                questionItem.ZVALID1 = data[i].ZVALID1;
                questionItem.ZVALID2 = data[i].ZVALID2;
                questionItem.ZVALID3 = data[i].ZVALID3;
                questionItem.ZISINPUT = data[i].ZISINPUT == 1 ? true : false;

                if (questionItem.ZISINPUT) {
                    if ($rootScope.language == 0) {
                        var t1 = data[i].ZANSWER1VN.indexOf('^');
                        var answer1 = data[i].ZANSWER1VN.substring(0, t1);
                        var answer2 = data[i].ZANSWER1VN.substring(t1 + 1);
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
                            questionItem.textip1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='";
                            questionItem.textip1_1VN = "' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='";
                            questionItem.textip1_2VN = "' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';

                            questionItem.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                            questionItem.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                            questionItem.ZINPUTRIGHT1 = valid1;
                            questionItem.ZINPUTRIGHT2 = valid2;
                        }
                        else {
                            if (answer2.length > 1) {
                                var valid = answer2.substring(0, answer2.indexOf(" "));
                                var text = answer2.substring(answer2.indexOf(" "));
                            } else {
                                var valid = answer2;
                                var text = "";
                            }

                            questionItem.textip1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='";
                            questionItem.textip1_1VN = "' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';

                            questionItem.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                            questionItem.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                            questionItem.ZINPUTRIGHT1 = valid;
                        }
                        questionItem.ANSWERINPUTSTRING1TEMP = questionItem.ANSWERINPUTSTRING1VN;
                        questionItem.ANSWERINPUTSTRING2TEMP = questionItem.ANSWERINPUTSTRING2VN;
                    }
                    var t1 = data[i].ZANSWER1.indexOf('^');
                    var answer1 = data[i].ZANSWER1.substring(0, t1);
                    var answer2 = data[i].ZANSWER1.substring(t1 + 1);
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
                        questionItem.textip1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='";
                        questionItem.textip1_1 = "' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='";
                        questionItem.textip1_2 = "' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';

                        questionItem.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        questionItem.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                        questionItem.ZINPUTRIGHT1 = valid1;
                        questionItem.ZINPUTRIGHT2 = valid2;
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }

                        questionItem.textip1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='";
                        questionItem.textip1_1 = "' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';

                        questionItem.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        questionItem.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        questionItem.ZINPUTRIGHT1 = valid;
                    }
                }                
                questionItem.ISHARD = data[i].ZDIFFICULT == 1 ? true : false;

                if (data[i].ZPRETEXT != null) {
                    data[i].ZPRETEXT = data[i].ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZPRETEXT = data[i].ZPRETEXT.replace(/(]\})/g, "</b>");
                }

                questionItem.ZPRETEXT = data[i].ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data[i].ZPRETEXT)) : null;
                questionItem.ZISPRETEXT = data[i].ZPRETEXT != null ? true : false;
                questionItem.ZIMAGE = "img/" + data[i].ZIMAGE;
                questionItem.ZISIMAGE = data[i].ZIMAGE != null ? true : false;
                questionItem.ZWBMP = data[i].ZWBMP;

                if (data[i].ZQUESTION != null) {
                    data[i].ZQUESTION = data[i].ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZQUESTION = data[i].ZQUESTION.replace(/(]\})/g, "</b>");
                }

                questionItem.ZQUESTION = $sce.trustAsHtml(utils.convertText(data[i].ZQUESTION + "&nbsp" + (data[i].ZKOMENTAR != null ? data[i].ZKOMENTAR : '')));
                questionItem.ZQUESTIONIMAGE = data[i].ZQUESTIONIMAGE;
                questionItem.ZTIP = data[i].ZTIP;
                questionItem.ZKOMENTAR = data[i].ZKOMENTAR;
                questionItem.ZSETNAME = data[i].ZSETNAME;
                questionItem.ZNOTUSED = data[i].ZNOTUSED;
                questionItem.ZTYPE = data[i].ZTYPE;
                questionItem.ZFRAGENKATALOG = data[i].ZFRAGENKATALOG;
                questionItem.ZVARIANT = (data[i].ZFRAGENKATALOG.indexOf("M") > 0 || data[i].ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                questionItem.ZBIGIMAGE = "img/" + data[i].ZBIGIMAGE;
                questionItem.ZCOMMENTMOFFA = data[i].ZCOMMENTMOFFA;
                questionItem.ZCOMMENTZ = data[i].ZCOMMENTZ;
                questionItem.ZPRETEXTVN = data[i].ZPRETEXTVN != null ? $sce.trustAsHtml(data[i].ZPRETEXTVN) : null;
                questionItem.ZQUESTIONVN = data[i].ZQUESTIONVN != null ? $sce.trustAsHtml(data[i].ZQUESTIONVN) : null;
                questionItem.ISCHECK = false;
                questionItem.ZICON = data[i].ZISVIDEO == 1 ? "img/answer_wrong_vd.png" : "img/answer_wrong.png";

                if (data[i].ZANSWER1 != null) {
                    data[i].ZANSWER1 = data[i].ZANSWER1.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER1 = data[i].ZANSWER1.replace(/(]\})/g, "</b>");
                }
                if (data[i].ZANSWER2 != null) {
                    data[i].ZANSWER2 = data[i].ZANSWER2.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER2 = data[i].ZANSWER2.replace(/(]\})/g, "</b>");
                }
                if (data[i].ZANSWER3 != null) {
                    data[i].ZANSWER3 = data[i].ZANSWER3.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER3 = data[i].ZANSWER3.replace(/(]\})/g, "</b>");
                }

                if (data[i].ZANSWER1VN != null) {
                    data[i].ZANSWER1VN = data[i].ZANSWER1VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER1VN = data[i].ZANSWER1VN.replace(/(]\})/g, "</b>");
                }
                if (data[i].ZANSWER2VN != null) {
                    data[i].ZANSWER2VN = data[i].ZANSWER2VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER2VN = data[i].ZANSWER2VN.replace(/(]\})/g, "</b>");
                }
                if (data[i].ZANSWER3VN != null) {
                    data[i].ZANSWER3VN = data[i].ZANSWER3VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                    data[i].ZANSWER3VN = data[i].ZANSWER3VN.replace(/(]\})/g, "</b>");
                }

                questionItem.ZANSWER[0].vn.ZANSWER = data[i].ZANSWER1VN != null ? $sce.trustAsHtml(data[i].ZANSWER1VN) : null;
                questionItem.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data[i].ZANSWER1IMAGE;
                questionItem.ZANSWER[0].de.ZANSWER = data[i].ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data[i].ZANSWER1)) : null;
                questionItem.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data[i].ZANSWER1IMAGE;
                questionItem.ZANSWER[0].isImage = data[i].ZANSWER1IMAGE != null ? true : false;
                questionItem.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                questionItem.ZANSWER[1].vn.ZANSWER = data[i].ZANSWER2VN != null ? $sce.trustAsHtml(data[i].ZANSWER2VN) : null;
                questionItem.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data[i].ZANSWER2IMAGE;
                questionItem.ZANSWER[1].de.ZANSWER = data[i].ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data[i].ZANSWER2)) : null;
                questionItem.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data[i].ZANSWER2IMAGE;
                questionItem.ZANSWER[1].isImage = data[i].ZANSWER2IMAGE != null ? true : false;
                questionItem.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                questionItem.ZANSWER[2].vn.ZANSWER = data[i].ZANSWER3VN != null ? $sce.trustAsHtml(data[i].ZANSWER3VN) : null;
                questionItem.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data[i].ZANSWER3IMAGE;
                questionItem.ZANSWER[2].de.ZANSWER = data[i].ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data[i].ZANSWER3)) : null;
                questionItem.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data[i].ZANSWER3IMAGE;
                questionItem.ZANSWER[2].isImage = data[i].ZANSWER3IMAGE != null ? true : false;
                questionItem.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                questionItem.ZANSWER[0].isAnswer = data[i].ZANSWER1 != null ? true : false;
                questionItem.ZANSWER[1].isAnswer = data[i].ZANSWER2 != null ? true : false;
                questionItem.ZANSWER[2].isAnswer = data[i].ZANSWER3 != null ? true : false;
                questionItem.ZANSWER[0].checkAnswer = false;
                questionItem.ZANSWER[1].checkAnswer = false;
                questionItem.ZANSWER[2].checkAnswer = false;
                $scope.pointsError += questionItem.ZPOINTS;

                if (data[i].number < 20) {
                    if (questionItem.ZFRAGENKATALOG.indexOf("1.1") > -1) { $scope.listTheme1_1.count += 1; $scope.listTheme1_1.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("1.2") > -1) { $scope.listTheme1_2.count += 1; $scope.listTheme1_2.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("1.3") > -1) { $scope.listTheme1_3.count += 1; $scope.listTheme1_3.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("1.4") > -1) { $scope.listTheme1_4.count += 1; $scope.listTheme1_4.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("1.5") > -1) { $scope.listTheme1_5.count += 1; $scope.listTheme1_5.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("1.7") > -1) { $scope.listTheme1_7.count += 1; $scope.listTheme1_7.listItem.push(questionItem); };
                    $scope.listIdGrunt.push(questionItem);
                    $scope.pointsBasicError += questionItem.ZPOINTS;
                }
                else {
                    if (questionItem.ZFRAGENKATALOG.indexOf("2.1") > -1) { $scope.listTheme2_1.count += 1; $scope.listTheme2_1.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.2") > -1) { $scope.listTheme2_2.count += 1; $scope.listTheme2_2.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.4") > -1) { $scope.listTheme2_4.count += 1; $scope.listTheme2_4.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.5") > -1) { $scope.listTheme2_5.count += 1; $scope.listTheme2_5.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.6") > -1) { $scope.listTheme2_6.count += 1; $scope.listTheme2_6.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.7") > -1) { $scope.listTheme2_7.count += 1; $scope.listTheme2_7.listItem.push(questionItem); }
                    else if (questionItem.ZFRAGENKATALOG.indexOf("2.8") > -1) { $scope.listTheme2_8.count += 1; $scope.listTheme2_8.listItem.push(questionItem); };
                    $scope.pointsAdvancedError += questionItem.ZPOINTS;
                    $scope.listIdB.push(questionItem);
                }
                if ($rootScope.language == 0) {
                    questionItem.ZQUESTIONTEMP = questionItem.ZQUESTIONVN;
                    questionItem.ZANSWER[0].ZANSWER = questionItem.ZANSWER[0].vn.ZANSWER;
                    questionItem.ZANSWER[1].ZANSWER = questionItem.ZANSWER[1].vn.ZANSWER;
                    questionItem.ZANSWER[2].ZANSWER = questionItem.ZANSWER[2].vn.ZANSWER;
                }
                else {
                    questionItem.ZQUESTIONTEMP = questionItem.ZQUESTION;
                    questionItem.ZANSWER[0].ZANSWER = questionItem.ZANSWER[0].de.ZANSWER;
                    questionItem.ZANSWER[1].ZANSWER = questionItem.ZANSWER[1].de.ZANSWER;
                    questionItem.ZANSWER[2].ZANSWER = questionItem.ZANSWER[2].de.ZANSWER;
                }
                $scope.listQuestion.push(questionItem);
                if ($scope.listQuestion.length == 30) {
                    // add list answer basic
                    if ($scope.listTheme1_1.count > 0) $scope.listBasic.push($scope.listTheme1_1);
                    if ($scope.listTheme1_2.count > 0) $scope.listBasic.push($scope.listTheme1_2);
                    if ($scope.listTheme1_3.count > 0) $scope.listBasic.push($scope.listTheme1_3);
                    if ($scope.listTheme1_4.count > 0) $scope.listBasic.push($scope.listTheme1_4);
                    if ($scope.listTheme1_5.count > 0) $scope.listBasic.push($scope.listTheme1_5);
                    if ($scope.listTheme1_7.count > 0) $scope.listBasic.push($scope.listTheme1_7);
                    // add list answer advanced
                    if ($scope.listTheme2_1.count > 0) $scope.listAdvanced.push($scope.listTheme2_1);
                    if ($scope.listTheme2_2.count > 0) $scope.listAdvanced.push($scope.listTheme2_2);
                    if ($scope.listTheme2_4.count > 0) $scope.listAdvanced.push($scope.listTheme2_4);
                    if ($scope.listTheme2_5.count > 0) $scope.listAdvanced.push($scope.listTheme2_5);
                    if ($scope.listTheme2_6.count > 0) $scope.listAdvanced.push($scope.listTheme2_6);
                    if ($scope.listTheme2_7.count > 0) $scope.listAdvanced.push($scope.listTheme2_7);
                    if ($scope.listTheme2_8.count > 0) $scope.listAdvanced.push($scope.listTheme2_8);
                    initChangeLanguageResult();
                    initChangeLanguage();
                    if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                        // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                        $scope.listQuestion[$scope.count].ZVARIANT = true;                        
                    }
                    $scope.questionCurrent = $scope.listQuestion[$scope.count];
                    $scope.questionItem1 = $scope.listQuestion[$scope.sum - 1];
                    $scope.questionItem2 = $scope.listQuestion[$scope.count];
                    $scope.questionItem3 = $scope.listQuestion[$scope.count + 1];

                    document.getElementById("toolbar3").style.display = "block";
                }
            }                       
        }

        function initChangeLanguage() {
            //set answer
            if ($rootScope.language == 0) {
                $scope.listQuestion[$scope.count].ZQUESTIONTEMP = $scope.listQuestion[$scope.count].ZQUESTIONVN;
                $scope.listQuestion[$scope.count].ZANSWER[0].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[0].vn.ZANSWER;
                $scope.listQuestion[$scope.count].ZANSWER[1].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[1].vn.ZANSWER;
                $scope.listQuestion[$scope.count].ZANSWER[2].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[2].vn.ZANSWER;
                $scope.listQuestion[$scope.count].ZPRETEXTTEMP = $scope.listQuestion[$scope.count].ZPRETEXTVN;
                $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1TEMP = $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1VN;
                $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2TEMP = $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2VN;
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    $scope.listQuestion[$scope.count].countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.listQuestion[$scope.count].countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }

                $scope.questionCurrent.ZQUESTIONTEMP = $scope.questionCurrent.ZQUESTIONVN;
                $scope.questionCurrent.ZANSWER[0].ZANSWER = $scope.questionCurrent.ZANSWER[0].vn.ZANSWER;
                $scope.questionCurrent.ZANSWER[1].ZANSWER = $scope.questionCurrent.ZANSWER[1].vn.ZANSWER;
                $scope.questionCurrent.ZANSWER[2].ZANSWER = $scope.questionCurrent.ZANSWER[2].vn.ZANSWER;
                $scope.questionCurrent.ZPRETEXTTEMP = $scope.questionCurrent.ZPRETEXTVN;
                $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1VN;
                $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2VN;
                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.questionCurrent.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.questionCurrent.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }
            }
            else {
                $scope.listQuestion[$scope.count].ZQUESTIONTEMP = $scope.listQuestion[$scope.count].ZQUESTION;
                $scope.listQuestion[$scope.count].ZANSWER[0].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[0].de.ZANSWER;
                $scope.listQuestion[$scope.count].ZANSWER[1].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[1].de.ZANSWER;
                $scope.listQuestion[$scope.count].ZANSWER[2].ZANSWER = $scope.listQuestion[$scope.count].ZANSWER[2].de.ZANSWER;
                $scope.listQuestion[$scope.count].ZPRETEXTTEMP = $scope.listQuestion[$scope.count].ZPRETEXT;
                $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1TEMP = $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1;
                $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2TEMP = $scope.listQuestion[$scope.count].ANSWERINPUTSTRING2;
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    $scope.listQuestion[$scope.count].countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "<br /><b style='color: #e50000;'>" + $scope.listQuestion[$scope.count].countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }

                $scope.questionCurrent.ZQUESTIONTEMP = $scope.questionCurrent.ZQUESTION;
                $scope.questionCurrent.ZANSWER[0].ZANSWER = $scope.questionCurrent.ZANSWER[0].de.ZANSWER;
                $scope.questionCurrent.ZANSWER[1].ZANSWER = $scope.questionCurrent.ZANSWER[1].de.ZANSWER;
                $scope.questionCurrent.ZANSWER[2].ZANSWER = $scope.questionCurrent.ZANSWER[2].de.ZANSWER;
                $scope.questionCurrent.ZPRETEXTTEMP = $scope.questionCurrent.ZPRETEXT;
                $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1;
                $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2;
                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.questionCurrent.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.questionCurrent.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }
            }
        }       

        $scope.changeLanguage = function () {
            $scope.isLanguage = !$scope.isLanguage;
            $scope.languageText = $scope.isLanguage? "DE" : "VN";
            init();
            initChangeLanguage();
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "lang");
        }

        $scope.$on("changeLanguage", function (event) {
            init();
            initChangeLanguage();
        });

        $scope.changeLanguageResults = function () {
            $scope.isLanguageResult = !$scope.isLanguageResult;
            $scope.languageTextResult = $scope.isLanguageResult ? "DE" : "VN";
            initResult();
            initChangeLanguageResult();
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "lang");
        }

        function initChangeLanguageResult() {
            for (var i = 0; i < $scope.listBasic.length; i++) {
                if ($rootScope.language == 0) {
                    $scope.listBasic[i].title = $scope.listBasic[i].title_vn;
                }
                else {
                    $scope.listBasic[i].title = $scope.listBasic[i].title_de;
                }
            }

            for (var i = 0; i < $scope.listAdvanced.length; i++) {
                if ($rootScope.language == 0) {
                    $scope.listAdvanced[i].title = $scope.listAdvanced[i].title_vn;
                }
                else {
                    $scope.listAdvanced[i].title = $scope.listAdvanced[i].title_de;
                }
            }
        }

        $scope.random = function () {
            if ($rootScope.answeredRandom) {
                return 0.5 - Math.random();
            }
            else {
                return null;
            }
        }

        $scope.blurInput1 = function () {
            var element = document.getElementById("flip1");           

            var ipAnswer1 = element.getElementsByClassName("ipAnswer1")[0];
            var ipAnswer = element.getElementsByClassName("ipAnswer")[0];            

            if (ipAnswer1 == null && ipAnswer != null) {
                if (!ipAnswer.value.match(/[a-z]/i)) {
                    if (ipAnswer.value != null) {                       
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                    }
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
            else{
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
                    if (ipAnswer1.value != null || ipAnswer2.value != null) {
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer1.value;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = ipAnswer2.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = "";
                    }
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
                    if (ipAnswer.value != null) {
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                    }
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
                    if (ipAnswer1.value != null || ipAnswer2.value != null) {
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer1.value;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = ipAnswer2.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = "";
                    }
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
                    if (ipAnswer.value != null) {
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                    }
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
                    if (ipAnswer1.value != null || ipAnswer2.value != null) {
                        $scope.count_ticked -= 1;
                        $scope.listQuestion[$scope.count].ISCHECK = true;
                        scope.listQuestion[$scope.count].ISCHECK = true;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer1.value;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = ipAnswer2.value;
                    }
                    else {
                        $scope.count_ticked += 1;
                        $scope.listQuestion[$scope.count].ISCHECK = false;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = "";
                    }
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
            $scope.listQuestion[$scope.count].countPlayVideo -= 1;
            $scope.questionCurrent.ZIMAGE = $scope.questionCurrent.ZBIGIMAGE;
            if ($scope.listQuestion[$scope.count].countPlayVideo == 0) {
                $scope.questionCurrent.ZISVIDEO = false;
                $scope.listQuestion[$scope.count].countPlayVideo = 5;
            }

            if ($rootScope.language == 0) {
                $scope.listQuestion[$scope.count].countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.listQuestion[$scope.count].countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
            }
            else {
                $scope.listQuestion[$scope.count].countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "<br /><b style='color: #e50000;'>" + $scope.listQuestion[$scope.count].countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
            }
        }

        $scope.playVideo = function () {
            playVideo();
        };

        $scope.hideVideo  = function () {
            window.plugins.streamingMedia.stopAudio();
        }

        $scope.showQuestion = function () {
            alertCloseVideo($scope.MenuQuestionItem.messageDialog, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
        }

        function alertCloseVideo(message, yes, no) {
            navigator.notification.confirm(
                message, // message
                 onConfirm,            // callback to invoke with index of button pressed
                $scope.MenuQuestionItem.causeTion,           // title
                [yes, no]     // buttonLabels
            );
        }

        function onConfirm(buttonIndex) {
            if (buttonIndex != 2) {
                $scope.questionCurrent.ZISVIDEO = false;
                $scope.listQuestion[$scope.count].countPlayVideo = 5;
            }
        }

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        function startTimer(duration) {
            var timer1 = duration, minutes, seconds;
            interval = $interval(function () {
                minutes = parseInt(timer1 / 60, 10)
                seconds = parseInt(timer1 % 60, 10);
                $scope.timeStamp = minutes * 60 + seconds;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;                 
                $scope.timerCount = minutes + ":" + seconds + " ";

                if (--timer1 < 0) {
                    $interval.cancel(interval);
                    $timeout(function () {
                        $activityIndicator.stopAnimating();
                        $scope.modal.show();
                        // document.getElementById("contentResult").style.top = "100%";
                        // document.getElementById("contentResult").style.display = "";
                        // document.getElementById("contentResult").style.top = "0";
                        // if (scrollerTestResult == null) scrollerTestResult = new TouchScroll(document.querySelector("#scrollTestResult"), { elastic: true });
                        checkAnswered();
                    }, 500);
                }
            }, 1000);
        }

        $scope.open = function (event) {
            switch (event) {
                case 2:
                    $state.go('question', {}, {});
                    break
            }
        };       

        $scope.check = function (item, tab) {
            item.checkAnswer = !item.checkAnswer;
            if (!tab.ZANSWER[0].checkAnswer && !tab.ZANSWER[1].checkAnswer && !tab.ZANSWER[2].checkAnswer) {
                $scope.count_ticked += 1;
                tab.ISCHECK = false;                
            }
            else if (!tab.ISCHECK) {
                $scope.count_ticked -= 1;
                tab.ISCHECK = true;
            }
        };

        $rootScope.onBack = function () {
            if (!$scope.isTestEnd) {
                alertBackTest($scope.MenuQuestionItem.backMessage, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
            }
            else {
                $scope.selectedIndex = 1;
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");              
                if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
                if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
                if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
                if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
                if (flip3.classList.contains("flipLeft")) flip3.classList.remove("flipLeft");
                if (!flip3.classList.contains("flipRight")) flip3.classList.add("flipRight");

                $timeout(function () {
                    $scope.modal.show();
                    // document.getElementById("contentResult").style.top = "100%";
                    // document.getElementById("contentResult").style.display = "";
                    // document.getElementById("contentResult").style.top = "0";                   
                }, 100);
            }
        };

        $scope.onBack_1 = function () {
            $window.history.back();
        };

        $scope.openAnswered = function (item) {
            $scope.isTestEnd = true;
            $scope.selectedIndex = 1;
            var flip1 = document.getElementById("flip1");
            var flip2 = document.getElementById("flip2");
            var flip3 = document.getElementById("flip3");
            $scope.questionCurrent = item;
            $scope.count = $scope.questionCurrent.number - 1;

            initChangeLanguage();

            if ($scope.count < 1) {
                $scope.questionItem1 = $scope.listQuestion[$scope.sum - 1];
                $scope.questionItem2 = item;
                $scope.questionItem3 = $scope.listQuestion[$scope.count + 1];
            }
            else if ($scope.count == $scope.sum - 1) {
                $scope.questionItem1 = $scope.listQuestion[$scope.count-1];
                $scope.questionItem2 = item;
                $scope.questionItem3 = $scope.listQuestion[0];
            }
            else {
                $scope.questionItem1 = $scope.listQuestion[$scope.count - 1];
                $scope.questionItem2 = item;
                $scope.questionItem3 = $scope.listQuestion[$scope.count + 1];
            }            

            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
            if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
            if (flip3.classList.contains("flipLeft")) flip3.classList.remove("flipLeft");
            if (!flip3.classList.contains("flipRight")) flip3.classList.add("flipRight");

            $timeout(function () {
                $scope.modal.hide();
                // document.getElementById("contentResult").style.display = "none";
            }, 300);
        }

        $ionicModal.fromTemplateUrl('results-modal.html', {
            scope: $scope,
            backdropClickToClose: true,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        function alertBackTest(message, yes, no) {
            navigator.notification.confirm(
                message, // message
                 onBackTest,            // callback to invoke with index of button pressed
                '',           // title
                [yes, no]     // buttonLabels
            );
        }

        function onBackTest(index) {
            if (index != 2) {
                $interval.cancel(interval);
                if ($rootScope.startApp == 3) {
                    $state.go('home', {}, { location: 'replace' });
                    $rootScope.isBack = false;
                    $rootScope.imgIconLeft = "img/setting_white.png";
                }
                else {
                    $window.history.back();
                }
            }
        }
        var promise;
        $scope.onSetHard = function (item) {
            if (promise != null) {
                $timeout.cancel(promise);
                $scope.isShowBar = false;
            }
            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                if (data == $scope.questionCurrent.ZID) {
                    if (!$scope.questionCurrent.ISHARD) {
                        db.updateQuestionHard($scope.questionCurrent.ZID).then(function () {
                            $scope.listQuestion[$scope.count].ISHARD = true;
                            item.ISHARD = true;
                            $scope.questionCurrent = $scope.listQuestion[$scope.count];
                            $scope.hardText = $scope.MenuQuestionItem.statusHard;
                            $scope.isShowBar = true;
                            promise = $timeout(function () {
                                $scope.isShowBar = false;
                            }, 3000);
                        });
                    }
                    else {
                        db.updateQuestionUnHard($scope.questionCurrent.ZID).then(function () {                            
                            $scope.hardText = $scope.MenuQuestionItem.statusUnHard;
                            $scope.isShowBar = true;
                            promise = $timeout(function () {
                                $scope.listQuestion[$scope.count].ISHARD = false;
                                item.ISHARD = false;
                                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                                $scope.isShowBar = false;
                            }, 3000);
                        });
                    }                    
                }
                else {
                    db.addQuestionHard($scope.questionCurrent.ZID).then(function () {
                        $scope.listQuestion[$scope.count].ISHARD = true;
                        item.ISHARD = true;
                        $scope.questionCurrent = $scope.listQuestion[$scope.count];
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
        
        var isTypeInput = true;

        $scope.onNextItem = function () {
            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $sce.trustAsHtml(utils.convertText($scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1));
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {                            
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {                                
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {

                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $sce.trustAsHtml(utils.convertText($scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2));
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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

            if (isTypeInput) {
                if ($scope.count == $scope.sum - 1) {
                    $scope.count = 0;
                }
                else {
                    $scope.count += 1;
                }
                initChangeLanguage();
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
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
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
        };

        $scope.rotateLeft = function () {

            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {

                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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
            if (isTypeInput) {
                if ($scope.count == $scope.sum - 1) {
                    $scope.count = 0;
                }
                else {
                    $scope.count += 1;
                }
                initChangeLanguage();
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
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
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
        }

        $scope.rotateRight = function () {
            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $sce.trustAsHtml(utils.convertText($scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1));
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {

                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $sce.trustAsHtml(utils.convertText($scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2));
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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

            if (isTypeInput) {
                if ($scope.count > 0) {
                    $scope.count -= 1;
                }
                else $scope.count = $scope.sum - 1;
                initChangeLanguage();
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
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
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
        }

        var isNext = false;
        $scope.openQuestion = function (item) {

            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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

            if (isTypeInput) {
                if ($scope.count < (item - 1)) isNext = true;
                else isNext = false;
                $scope.count = item - 1;
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }

                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
                if (isNext) {
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
                            $scope.questionItem3 = $scope.listQuestion[$scope.count];
                            $scope.questionItem2 = $scope.listQuestion[prev];

                            flip2.classList.add("flipLeft");
                            flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            flip3.classList.remove("flipRight");
                            break;
                        case 2:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem1 = $scope.listQuestion[$scope.count];
                            $scope.questionItem3 = $scope.listQuestion[prev];
                            flip3.classList.add("flipLeft");
                            flip1.classList.remove("flipRight");
                            flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            break;
                    }
                }
                else {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 2;
                            $scope.questionItem1 = $scope.listQuestion[next];
                            $scope.questionItem3 = $scope.listQuestion[$scope.count];
                            $scope.questionItem2 = $scope.listQuestion[prev];
                            flip1.classList.add("flipRight");
                            flip2.classList.remove("flipRight");
                            flip2.classList.add("flipLeft");
                            flip3.classList.remove("flipLeft");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            $scope.questionItem2 = $scope.listQuestion[next];
                            $scope.questionItem1 = $scope.listQuestion[$scope.count];
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
        }
        

        $scope.showQuestionGrun = function () {

            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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

            if (isTypeInput) {
                $scope.count = 0;
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }
                $scope.questionCurrent = $scope.listQuestion[$scope.count];

                document.getElementById("dv_menu_q1").style.display = "block";
                document.getElementById("dv_menu_q2").style.display = "none";
                document.getElementById("ip_type_b").style.backgroundColor = "#636363";
                document.getElementById("ip_grun").style.backgroundColor = "#00827a";

                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
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
                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
        }

        $scope.showQuestionB = function () {

            if ($scope.questionCurrent.ZISINPUT) {
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
                if (ipAnswer1 == null && ipAnswer != null) {
                    var valueInput = element.getElementsByClassName("ipAnswer")[0].value;
                    if (!valueInput.match(/[a-z]/i)) {
                        ipAnswer.blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput + $scope.listQuestion[$scope.count].textip1_1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput;
                        if (valueInput.length > 0 && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
                        navigator.notification.confirm(
                           "Bạn hãy nhập câu trả lời bằng số!", // message
                            function (index) {
                            },            // callback to invoke with index of button pressed
                           'Chú ý',           // title
                           ["Ok"]     // buttonLabels
                       );
                    }
                }
                else if (ipAnswer1 != null) {
                    var valueInput1 = element.getElementsByClassName("ipAnswer1")[0].value;
                    var valueInput2 = element.getElementsByClassName("ipAnswer2")[0].value;
                    if (!valueInput1.match(/[a-z]/i) && !valueInput2.match(/[a-z]/i)) {
                        ipAnswer1.blur();
                        element.getElementsByClassName("ipAnswer2")[0].blur();
                        isTypeInput = true;
                        $scope.listQuestion[$scope.count].ANSWERINPUTSTRING1 = $scope.listQuestion[$scope.count].textip1 + valueInput1 + $scope.listQuestion[$scope.count].textip1_1 + valueInput2 + $scope.listQuestion[$scope.count].textip1_2;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER1 = valueInput1;
                        $scope.listQuestion[$scope.count].ZINPUTANSWER2 = valueInput2;
                        if ((valueInput1.length > 0 || valueInput2.length > 0) && !$scope.listQuestion[$scope.count].ISCHECK) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                        }
                        else {
                            if (valueInput1.length == 0 && valueInput2.length == 0 && $scope.listQuestion[$scope.count].ISCHECK) {
                                $scope.count_ticked += 1;
                                $scope.listQuestion[$scope.count].ISCHECK = false;
                            }
                        }
                    }
                    else {
                        isTypeInput = false;
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

            if (isTypeInput) {
                $scope.count = 20;
                if ($scope.listQuestion[$scope.count].ZISVIDEO) {
                    // setSourceVideo($scope.listQuestion[$scope.count].ZFRAGENKATALOG);
                    $scope.listQuestion[$scope.count].ZVARIANT = true;
                }
                $scope.questionCurrent = $scope.listQuestion[$scope.count];
                document.getElementById("dv_menu_q1").style.display = "none";
                document.getElementById("dv_menu_q2").style.display = "block";
                document.getElementById("ip_grun").style.backgroundColor = "#636363";
                document.getElementById("ip_grun").style.borderBottomWidth = "1";
                document.getElementById("ip_type_b").style.backgroundColor = "#00827a";
                document.getElementById("ip_type_b").style.borderBottomWidth = "0";

                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = ($scope.count - 1) >= 0 ? $scope.count - 1 : $scope.sum - 1;
                var next = ($scope.count + 1) <= ($scope.sum - 1) ? ($scope.count + 1) : 0;
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
                initChangeLanguage();
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
        }

        var scroller = null;
        var scroller1 = null;
        $scope.showMenuQuestion = function () {
            document.getElementById("menu_question").style.display = "block";
            if(scroller == null){
               //scroller = new TouchScroll(document.querySelector("#dv_menu_q1"), { elastic: true });
               //scroller1 = new TouchScroll(document.querySelector("#dv_menu_q2"), { elastic: true });
            }
        }

        $ionicModal.fromTemplateUrl('full-image-modal.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.imageModal = modal;
        });

        $scope.hideMenuQuestion = function () {
            document.getElementById("menu_question").style.display = "none";
        }

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

        // test result                
        $scope.countRight = 0;
        $scope.result = 0;
        $scope.isBestanden = false;

        $scope.testBack = function () {
            $scope.pointsError = 0;
            $scope.pointsBasicError = 0;
            $scope.pointsAdvancedError = 0;
            for (var i = 0; i < $scope.listQuestion.length; i++) {
                $scope.listQuestion[i].ISCHECK = false;
                $scope.listQuestion[i].ZANSWER[0].checkAnswer = false;
                $scope.listQuestion[i].ZANSWER[1].checkAnswer = false;
                $scope.listQuestion[i].ZANSWER[2].checkAnswer = false;
                $scope.listQuestion[i].ZANSWER[0].isRight = false;
                $scope.listQuestion[i].ZANSWER[1].isRight = false;
                $scope.listQuestion[i].ZANSWER[2].isRight = false;
                $scope.listQuestion[i].ISANSWERED = false;
                
                $scope.pointsError += $scope.listQuestion[i].ZPOINTS;                
                                                                         
                if ($scope.listQuestion[i].ZISINPUT) {
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
                    if (ipAnswer1 == null && ipAnswer != null) {
                        $scope.listQuestion[i].ANSWERINPUTSTRING1 = $scope.listQuestion[i].textip1 + $scope.listQuestion[i].textip1_1;
                        $scope.listQuestion[i].ANSWERINPUTSTRING1VN = $scope.listQuestion[i].textip1VN + $scope.listQuestion[i].textip1_1VN;
                        $scope.listQuestion[i].ZINPUTANSWER1 = null;
                    }
                    else if (ipAnswer1 != null) {
                        $scope.listQuestion[i].ANSWERINPUTSTRING1 = $scope.listQuestion[i].textip1 + $scope.listQuestion[i].textip1_1 + $scope.listQuestion[i].textip1_2;
                        $scope.listQuestion[i].ANSWERINPUTSTRING1VN = $scope.listQuestion[i].textip1VN + $scope.listQuestion[i].textip1_1VN + $scope.listQuestion[i].textip1_2VN;
                        $scope.listQuestion[i].ZINPUTANSWER1 = null;
                        $scope.listQuestion[i].ZINPUTANSWER2 = null;
                    }
                }

                if ($scope.listQuestion[i].ZISVIDEO_DEFAULT) $scope.listQuestion[i].ZISVIDEO = true;
                $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO == 1 ? "img/answer_wrong_vd.png" : "img/answer_wrong.png";
                $scope.listQuestion[i].countPlayVideo = $scope.listQuestion[i].ZISVIDEO ? 5 : 0;

                $scope.listQuestion[i].ANSWERRIGHT = false;
                if (i < 20) {
                    loop1:
                        for (var j = 0; j < $scope.listBasic.length; j++) {
                            loop2:
                                for (var k = 0; k < $scope.listBasic[j].listItem.length; k++) {
                                    if ($scope.listBasic[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                        $scope.listBasic[j].listItem[k] = $scope.listQuestion[i];
                                        break loop1;
                                    }
                                }
                        }
                    $scope.pointsBasicError += $scope.listQuestion[i].ZPOINTS;
                }
                else {
                    loop1:
                        for (var j = 0; j < $scope.listAdvanced.length; j++) {
                            loop2:
                                for (var k = 0; k < $scope.listAdvanced[j].listItem.length; k++) {
                                    if ($scope.listAdvanced[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                        $scope.listAdvanced[j].listItem[k] = $scope.listQuestion[i];
                                        break loop1;
                                    }
                                }
                        }
                    $scope.pointsAdvancedError+= $scope.listQuestion[i].ZPOINTS;
                }                             
            }

            interval = null;
            startTimer(timer);
            document.getElementById("dvCountTicked").style.display = "";
            $scope.count_ticked = $scope.listQuestion.length;
            $scope.count = 0;            
            $scope.countRight = 0;            
            $scope.isBestanden = false;
            $scope.selectedIndex = 1;
            $scope.isTestEnd = false;

            var flip1 = document.getElementById("flip1");
            var flip2 = document.getElementById("flip2");
            var flip3 = document.getElementById("flip3");
            $scope.questionCurrent = $scope.listQuestion[$scope.count];
            initChangeLanguage();
            $scope.questionItem1 = $scope.listQuestion[$scope.sum - 1];
            $scope.questionItem2 = $scope.listQuestion[$scope.count];
            $scope.questionItem3 = $scope.listQuestion[$scope.count + 1];
            if (flip1.classList.contains("flipRight")) flip1.classList.remove("flipRight");
            if (!flip1.classList.contains("flipLeft")) flip1.classList.add("flipLeft");
            if (flip2.classList.contains("flipRight")) flip2.classList.remove("flipRight");
            if (flip2.classList.contains("flipLeft")) flip2.classList.remove("flipLeft");
            if (flip3.classList.contains("flipLeft")) flip3.classList.remove("flipLeft");
            if (!flip3.classList.contains("flipRight")) flip3.classList.add("flipRight");
;
            $timeout(function () {
                $scope.modal.hide();
                // document.getElementById("contentResult").style.display = "none";
            }, 500);
        }

        $scope.onSubmit = function () {

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

            if (ipAnswer1 == null && ipAnswer != null) {
                if ($scope.listQuestion[$scope.count].ZINPUTANSWER1 != ipAnswer.value)
                {
                    if (!ipAnswer.value.match(/[a-z]/i)) {
                        if (ipAnswer.value != null) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                            $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer.value;
                        }
                        else {
                            $scope.count_ticked += 1;
                            $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                            $scope.listQuestion[$scope.count].ISCHECK = false;
                        }
                        ipAnswer.blur();
                        alertSubmit($scope.MenuQuestionItem.messageSubmit, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
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
                    alertSubmit($scope.MenuQuestionItem.messageSubmit, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
                }
            }
            else if (ipAnswer1 != null) {
                if ($scope.listQuestion[$scope.count].ZINPUTANSWER1 == ipAnswer1.value) {
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
                        if (ipAnswer1.value != null || ipAnswer2.value != null) {
                            $scope.count_ticked -= 1;
                            $scope.listQuestion[$scope.count].ISCHECK = true;
                            $scope.listQuestion[$scope.count].ZINPUTANSWER1 = ipAnswer1.value;
                            $scope.listQuestion[$scope.count].ZINPUTANSWER2 = ipAnswer2.value;
                        }
                        else {
                            $scope.count_ticked += 1;
                            $scope.listQuestion[$scope.count].ISCHECK = false;
                            $scope.listQuestion[$scope.count].ZINPUTANSWER1 = "";
                            $scope.listQuestion[$scope.count].ZINPUTANSWER2 = "";
                        }
                        ipAnswer2.blur();
                        alertSubmit($scope.MenuQuestionItem.messageSubmit, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
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
                    alertSubmit($scope.MenuQuestionItem.messageSubmit, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
                }
            }
            else {
                alertSubmit($scope.MenuQuestionItem.messageSubmit, $scope.MenuQuestionItem.yes, $scope.MenuQuestionItem.no);
            }
        }

        function alertSubmit(message, yes, no) {
            navigator.notification.confirm(
                message + "\n\r" + $scope.MenuQuestionItem.alertSubmit1 + $scope.count_ticked + $scope.MenuQuestionItem.alertSubmit2, // message
                 onSubmit,            // callback to invoke with index of button pressed
                $scope.MenuQuestionItem.submit,           // title
                [yes, no]     // buttonLabels
            );
        }

        var scrollerTestResult = null;
        function onSubmit(index) {
            if (index != 2) {
                $interval.cancel(interval);
                $activityIndicator.startAnimating();
                $timeout(function () {
                    $activityIndicator.stopAnimating();
                    $scope.modal.show();
                    document.getElementById("dvCountTicked").style.display = "none";
                    // document.getElementById("contentResult").style.top = "100%";
                    // document.getElementById("contentResult").style.display = "";
                    // document.getElementById("contentResult").style.top = "0";
                    //if (scrollerTestResult == null) scrollerTestResult = new TouchScroll(document.querySelector("#scrollTestResult"), { elastic: true });
                    checkAnswered();
                }, 500);                
            }
        }

        function checkAnswered() {
            for (var i = 0; i < $scope.listQuestion.length; i++) {
                $scope.listQuestion[i].ISANSWERED = true;
                $scope.listQuestion[i].ZISVIDEO = false;

                if (!$scope.listQuestion[i].ZISINPUT) {
                    if ($scope.listQuestion[i].ZANSWER[0].checkAnswer) {
                        if ($scope.listQuestion[i].ZVALID1 == 1) {
                            $scope.listQuestion[i].ZANSWER[0].isValid = 'img/answer_right.png';
                            $scope.listQuestion[i].ZANSWER[0].isRight = true;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[0].isValid = 'img/answer_wrong1.png';
                            $scope.listQuestion[i].ZANSWER[0].isRight = false;
                        }
                    }
                    else {
                        if ($scope.listQuestion[i].ZVALID1 == 1) {
                            $scope.listQuestion[i].ZANSWER[0].isValid = 'img/answer_right1.png';
                            $scope.listQuestion[i].ZANSWER[0].isRight = false;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[0].isValid = 'img/answer_wrong.png';
                            $scope.listQuestion[i].ZANSWER[0].isRight = true;
                        }
                    }

                    if ($scope.listQuestion[i].ZANSWER[1].checkAnswer) {
                        if ($scope.listQuestion[i].ZVALID2 == 1) {
                            $scope.listQuestion[i].ZANSWER[1].isValid = 'img/answer_right.png';
                            $scope.listQuestion[i].ZANSWER[1].isRight = true;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[1].isValid = 'img/answer_wrong1.png';
                            $scope.listQuestion[i].ZANSWER[1].isRight = false;
                        }
                    }
                    else {
                        if ($scope.listQuestion[i].ZVALID2 == 1) {
                            $scope.listQuestion[i].ZANSWER[1].isValid = 'img/answer_right1.png';
                            $scope.listQuestion[i].ZANSWER[1].isRight = false;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[1].isValid = 'img/answer_wrong.png';
                            $scope.listQuestion[i].ZANSWER[1].isRight = true;
                        }
                    }

                    if ($scope.listQuestion[i].ZANSWER[2].checkAnswer) {
                        if ($scope.listQuestion[i].ZVALID3 == 1) {
                            $scope.listQuestion[i].ZANSWER[2].isValid = 'img/answer_right.png';
                            $scope.listQuestion[i].ZANSWER[2].isRight = true;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[2].isValid = 'img/answer_wrong1.png';
                            $scope.listQuestion[i].ZANSWER[2].isRight = false;
                        }
                    }
                    else {
                        if ($scope.listQuestion[i].ZVALID3 == 1) {
                            $scope.listQuestion[i].ZANSWER[2].isValid = 'img/answer_right1.png';
                            $scope.listQuestion[i].ZANSWER[2].isRight = false;
                        }
                        else {
                            $scope.listQuestion[i].ZANSWER[2].isValid = 'img/answer_wrong.png';
                            $scope.listQuestion[i].ZANSWER[2].isRight = true;
                        }
                    }
                    if ($scope.listQuestion[i].ZANSWER[0].isRight && $scope.listQuestion[i].ZANSWER[1].isRight && $scope.listQuestion[i].ZANSWER[2].isRight) {
                        $scope.listQuestion[i].ANSWERRIGHT = true;
                        $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_right_vd.png" : "img/answer_right.png";
                        $scope.countRight += 1;
                        $scope.pointsError -= $scope.listQuestion[i].ZPOINTS;
                        if (i < 20) {
                            $scope.pointsBasicError -= $scope.listQuestion[i].ZPOINTS;
                        }
                        else {
                            $scope.pointsAdvancedError -= $scope.listQuestion[i].ZPOINTS;
                        }

                        db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                            if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                db.updateAnswerRight($scope.listQuestion[data.number].ZID);
                            }
                            else {
                                db.addAnswerRight($scope.listQuestion[data.number].ZID);
                            }
                        });
                    }
                    else {
                        $scope.listQuestion[i].ANSWERRIGHT = false;
                        if ($scope.listQuestion[i].ISCHECK) {
                            $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_wrong1_vd.png" : "img/answer_wrong1.png";
                            db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                                if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                    db.updateAnswerWrong($scope.listQuestion[data.number].ZID);
                                }
                                else {
                                    db.addAnswerWrong($scope.listQuestion[data.number].ZID);
                                }
                            });
                        }
                    }                   

                    if (i < 20) {
                        loop1:
                            for (var j = 0; j < $scope.listBasic.length; j++) {
                                loop2:
                                    for (var k = 0; k < $scope.listBasic[j].listItem.length; k++) {
                                        if ($scope.listBasic[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                            $scope.listBasic[j].listItem[k] = $scope.listQuestion[i];
                                            break loop1;
                                        }
                                    }
                            }
                    }
                    else {
                        loop1:
                            for (var j = 0; j < $scope.listAdvanced.length; j++) {
                                loop2:
                                    for (var k = 0; k < $scope.listAdvanced[j].listItem.length; k++) {
                                        if ($scope.listAdvanced[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                            $scope.listAdvanced[j].listItem[k] = $scope.listQuestion[i];
                                            break loop1;
                                        }
                                    }
                            }
                    }
                }
                else {                   
                    if ($scope.listQuestion[i].ZINPUTANSWER2 == null) {
                        if ($scope.listQuestion[i].ZINPUTANSWER1 != null) $scope.listQuestion[i].ZINPUTANSWER1 = $scope.listQuestion[i].ZINPUTANSWER1.replace(".", ",");                        
                        $scope.listQuestion[i].ANSWERINPUTSTRING1 = $scope.listQuestion[i].textip1 + $scope.listQuestion[i].ZINPUTANSWER1 + $scope.listQuestion[i].textip1_1;
                        $scope.listQuestion[i].ANSWERINPUTSTRING1VN = $scope.listQuestion[i].textip1VN + $scope.listQuestion[i].ZINPUTANSWER1 + $scope.listQuestion[i].textip1_1VN;
                        if ($scope.listQuestion[i].ZINPUTANSWER1 == $scope.listQuestion[i].ZINPUTRIGHT1) {
                            $scope.listQuestion[i].ANSWERRIGHT = true;
                            $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_right_vd.png" : "img/answer_right.png";
                            $scope.countRight += 1;
                            $scope.pointsError -= $scope.listQuestion[i].ZPOINTS;
                            if (i < 20) {
                                $scope.pointsBasicError -= $scope.listQuestion[i].ZPOINTS;
                            }
                            else {
                                $scope.pointsAdvancedError -= $scope.listQuestion[i].ZPOINTS;
                            }

                            db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                                if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                    db.updateAnswerRight($scope.listQuestion[data.number].ZID);
                                }
                                else {
                                    db.addAnswerRight($scope.listQuestion[data.number].ZID);
                                }
                            });                                                        
                        }
                        else {
                            $scope.listQuestion[i].ANSWERRIGHT = false;
                            if ($scope.listQuestion[i].ISCHECK) {
                                $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_wrong1_vd.png" : "img/answer_wrong1.png";
                                db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                                    if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                        db.updateAnswerWrong($scope.listQuestion[data.number].ZID);
                                    }
                                    else {
                                        db.addAnswerWrong($scope.listQuestion[data.number].ZID);
                                    }
                                });
                            }
                        }

                        //
                        if (i < 20) {
                            loop1:
                                for (var j = 0; j < $scope.listBasic.length; j++) {
                                    loop2:
                                        for (var k = 0; k < $scope.listBasic[j].listItem.length; k++) {
                                            if ($scope.listBasic[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                                $scope.listBasic[j].listItem[k] = $scope.listQuestion[i];
                                                break loop1;
                                            }
                                        }
                                }
                        }
                        else {
                            loop1:
                                for (var j = 0; j < $scope.listAdvanced.length; j++) {
                                    loop2:
                                        for (var k = 0; k < $scope.listAdvanced[j].listItem.length; k++) {
                                            if ($scope.listAdvanced[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                                $scope.listAdvanced[j].listItem[k] = $scope.listQuestion[i];
                                                break loop1;
                                            }
                                        }
                                }
                        }
                    }
                    else {
                        if ($scope.listQuestion[i].ZINPUTANSWER1 != null) $scope.listQuestion[i].ZINPUTANSWER1 = $scope.listQuestion[i].ZINPUTANSWER1.replace(".", ",");
                        if ($scope.listQuestion[i].ZINPUTANSWER2 != null) $scope.listQuestion[i].ZINPUTANSWER2 = $scope.listQuestion[i].ZINPUTANSWER2.replace(".", ",");

                        $scope.listQuestion[i].ANSWERINPUTSTRING1VN = $scope.listQuestion[i].textip1VN + $scope.listQuestion[i].ZINPUTANSWER1 + 
                                                $scope.listQuestion[i].textip1_1VN + $scope.listQuestion[i].ZINPUTANSWER2 + $scope.listQuestion[i].textip1_2VN;
                        $scope.listQuestion[i].ANSWERINPUTSTRING1 = $scope.listQuestion[i].textip1 + $scope.listQuestion[i].ZINPUTANSWER1 +
                                                $scope.listQuestion[i].textip1_1 + $scope.listQuestion[i].ZINPUTANSWER2 + $scope.listQuestion[i].textip1_2;

                        if ($scope.listQuestion[i].ZINPUTANSWER1 == $scope.listQuestion[i].ZINPUTRIGHT1 && $scope.listQuestion[i].ZINPUTANSWER2 == $scope.listQuestion[i].ZINPUTRIGHT2) {
                            $scope.listQuestion[i].ANSWERRIGHT = true;
                            $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_right_vd.png" : "img/answer_right.png";
                            $scope.countRight += 1;
                            $scope.pointsError -= $scope.listQuestion[i].ZPOINTS;
                            if (i < 20) {
                                $scope.pointsBasicError -= $scope.listQuestion[i].ZPOINTS;
                            }
                            else {
                                $scope.pointsAdvancedError -= $scope.listQuestion[i].ZPOINTS;
                            }

                            db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                                if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                    db.updateAnswerRight($scope.listQuestion[data.number].ZID);
                                }
                                else {
                                    db.addAnswerRight($scope.listQuestion[data.number].ZID);
                                }
                            });
                        }
                        else {
                            $scope.listQuestion[i].ANSWERRIGHT = false;
                            if ($scope.listQuestion[i].ISCHECK) {
                                $scope.listQuestion[i].ZICON = $scope.listQuestion[i].ZISVIDEO ? "img/answer_wrong1_vd.png" : "img/answer_wrong1.png";
                                db.checkIfExistsQuestionTest($scope.listQuestion[i].ZID, i).then(function (data) {
                                    if (data.ZQUESTION == $scope.listQuestion[data.number].ZID) {
                                        db.updateAnswerWrong($scope.listQuestion[data.number].ZID);
                                    }
                                    else {
                                        db.addAnswerWrong($scope.listQuestion[data.number].ZID);
                                    }
                                });
                            }
                        }
                        if (i < 20) {
                            loop1:
                                for (var j = 0; j < $scope.listBasic.length; j++) {
                                    loop2:
                                        for (var k = 0; k < $scope.listBasic[j].listItem.length; k++) {
                                            if ($scope.listBasic[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                                $scope.listBasic[j].listItem[k] = $scope.listQuestion[i];
                                                break loop1;
                                            }
                                        }
                                }
                        }
                        else {
                            loop1:
                                for (var j = 0; j < $scope.listAdvanced.length; j++) {
                                    loop2:
                                        for (var k = 0; k < $scope.listAdvanced[j].listItem.length; k++) {
                                            if ($scope.listAdvanced[j].listItem[k].ZID == $scope.listQuestion[i].ZID) {
                                                $scope.listAdvanced[j].listItem[k] = $scope.listQuestion[i];
                                                break loop1;
                                            }
                                        }
                                }
                        }

                    }

                }
            }
            if ($scope.countRight >= 28) {
                $scope.isBestanden = true;
                $scope.result = 1;
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "flap");
            }
            else {
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
            }
            db.checkExistsTest($scope.testId).then(function (data) {
                if (data != undefined && data == $scope.testId) {
                    db.updateTestStart($scope.pointsBasicError, $scope.result, $scope.pointsAdvancedError, $scope.timeStamp, 1,$scope.testId);
                }
                else {
                    db.addTestStart($scope.pointsBasicError, $scope.result, $scope.pointsAdvancedError, $scope.timeStamp, 1, $scope.testId);
                }
            });           
        }
    })    
})();