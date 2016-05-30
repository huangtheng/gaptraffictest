(function () {
    "use strict";
    angular.module("TrafficLaws.QuestionSearchController", ['ui.router', 'TrafficLaws.databaseService'])
    .controller('QuestionSearchCtrl', function ($scope, $rootScope, $q, $sce, $state, $window, db, $timeout, $http, $ionicModal) {
        //$scope.pageClass = 'page-about';
        $scope.count = 0;
        $scope.sum = 0;
        $scope.selectedIndex = 1;
        $scope.nextQuestion = 1;
        $scope.countPlayVideo = 5;
        $scope.isShowBar = false;
        $scope.hardText = "";
        $scope.flipLeft = false;
        $scope.flipRight = false;
        var countNext = 0;
        $scope.listQuestion = [];
        var utils = new Utils($http);
        $scope.titlePlayVideo = $rootScope.Menu.vn.start_video;
        $scope.MenuQuestionItem = {
            klass: null, codeQuestion: null, point: null, back: null, previos: null, next: null, viewResult: null,filmStart: null,
            viewQuestion: null, titleCount1: null, titleCount2: null, yourAnswer: null, rightAnswer: null, statusRight: null, statusWrong: null,
            statusHard: null, messageDialog: null, yes: null, no: null, statusUnHard: null
        };
        $scope.isLanguage = $rootScope.language == 1 ? false : true;
        $scope.languageText = $scope.isLanguage ? "DE" : "VN";
        $scope.questionCurrent = new QuestionModel();
        $scope.countPlayVideoText = null;
        var Id = $state.params.ZId;
        var temp;
        var type;
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
                $scope.MenuQuestionItem.hard = $rootScope.Menu.de.hard;
            }
        }

        if (!$rootScope.questionRandom) {
            type = "Z_PK ASC";
        }
        else {
            type = "RANDOM()";
        }
        $scope.listQuestion.push(Id);
        $scope.sum = $scope.listQuestion.length;
        db.selectQuestionById(Id).then(callbackGetId);

        function callbackGetId(data) {
            $scope.questionCurrent = new QuestionModel();
            $scope.questionItem1 = new QuestionModel();
            $scope.questionItem2 = new QuestionModel();
            $scope.questionItem3 = new QuestionModel();
            $scope.questionCurrent.Z_PK = data.Z_PK;
            $scope.questionCurrent.Z_ENT = data.Z_ENT;
            $scope.questionCurrent.Z_OPT = data.Z_OPT;
            $scope.questionCurrent.ZID = data.ZID;
            $scope.questionCurrent.ZTESTIMAGE = data.ZTESTIMAGE;
            $scope.questionCurrent.ZUPDATE = data.ZUPDATE;
            $scope.questionCurrent.ZISHTML = data.ZISHTML;
            $scope.questionCurrent.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
            $scope.questionCurrent.ZOLDID = data.ZOLDID;
            $scope.questionCurrent.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
            $scope.questionCurrent.ZL = data.ZL;
            $scope.questionCurrent.ZPOINTS = data.ZPOINTS;
            $scope.questionCurrent.ZTHEMA = data.ZTHEMA;
            $scope.questionCurrent.ZQZG = data.ZQZG;
            $scope.questionCurrent.ZVALID1 = data.ZVALID1;
            $scope.questionCurrent.ZVALID2 = data.ZVALID2;
            $scope.questionCurrent.ZVALID3 = data.ZVALID3;
            $scope.questionCurrent.ZISINPUT = data.ZISINPUT == 1 ? true : false;
            $scope.questionCurrent.ISHARD = data.ZDIFFICULT == 1 ? true : false;

            if ($scope.questionCurrent.ZISINPUT) {
                if ($rootScope.language == 0) {
                    var t1 = data.ZANSWER1VN.indexOf('^');
                    var answer1 = data.ZANSWER1VN.substring(0, t1);
                    var answer2 = data.ZANSWER1VN.substring(t1 + 1);
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
                            var valid2 = utils.convertText(answer4.substring(0, answer4.indexOf(" ")));
                            var text2 = answer4.substring(answer4.indexOf(" "));
                        } else {
                            var valid2 = answer4;
                            var text2 = answer4;
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='' class='ipAnswer' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='' type='number' class='ipAnswer' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' class='ipAnswer' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' class='ipAnswer' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input id='ipAnswer' value='' type='number' class='ipAnswer' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid' type='text' class='ipAnswer' value='" + valid + "'/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    }

                    $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1VN;
                    $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2VN;
                }
                else
                {
                    var t1 = data.ZANSWER1.indexOf('^');
                    var answer1 = data.ZANSWER1.substring(0, t1);
                    var answer2 = data.ZANSWER1.substring(t1 + 1);
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
                            var valid2 = utils.convertText(answer4.substring(0, answer4.indexOf(" ")));
                            var text2 = answer4.substring(answer4.indexOf(" "));
                        } else {
                            var valid2 = answer4;
                            var text2 = answer4;
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='' class='ipAnswer' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='' type='number' class='ipAnswer' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' class='ipAnswer' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' class='ipAnswer' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input id='ipAnswer' value='' type='number' class='ipAnswer' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid' type='text' class='ipAnswer' value='" + valid + "'/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    }    
                    
                    $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1;
                    $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2;
                }                                              
            }

            if (data.ZPRETEXT != null) {
                data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
            }

            $scope.questionCurrent.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
            $scope.questionCurrent.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
            $scope.questionCurrent.ZIMAGE = "img/" + data.ZIMAGE;
            $scope.questionCurrent.ZISIMAGE = data.ZIMAGE != null ? true : false;
            $scope.questionCurrent.ZWBMP = data.ZWBMP;

            if (data.ZQUESTION != null) {
                data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
            }

            $scope.questionCurrent.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION + "&nbsp" + (data.ZKOMENTAR != null ? data.ZKOMENTAR : "")));
            $scope.questionCurrent.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
            $scope.questionCurrent.ZTIP = data.ZTIP;
            $scope.questionCurrent.ZKOMENTAR = data.ZKOMENTAR;
            $scope.questionCurrent.ZSETNAME = data.ZSETNAME;
            $scope.questionCurrent.ZNOTUSED = data.ZNOTUSED;
            $scope.questionCurrent.ZTYPE = data.ZTYPE;
            $scope.questionCurrent.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
            $scope.questionCurrent.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
            $scope.questionCurrent.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
            $scope.questionCurrent.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
            $scope.questionCurrent.ZCOMMENTZ = data.ZCOMMENTZ;
            $scope.questionCurrent.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
            $scope.questionCurrent.ZQUESTIONVN = data.ZQUESTIONVN != null ? $sce.trustAsHtml(data.ZQUESTIONVN) : null;

            if (data.ZANSWER1 != null) {
                data.ZANSWER1 = data.ZANSWER1.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER1 = data.ZANSWER1.replace(/(]\})/g, "</b>");
            }
            if (data.ZANSWER2 != null) {
                data.ZANSWER2 = data.ZANSWER2.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER2 = data.ZANSWER2.replace(/(]\})/g, "</b>");
            }
            if (data.ZANSWER3 != null) {
                data.ZANSWER3 = data.ZANSWER3.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER3 = data.ZANSWER3.replace(/(]\})/g, "</b>");
            }

            if (data.ZANSWER1VN != null) {
                data.ZANSWER1VN = data.ZANSWER1VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER1VN = data.ZANSWER1VN.replace(/(]\})/g, "</b>");
            }
            if (data.ZANSWER2VN != null) {
                data.ZANSWER2VN = data.ZANSWER2VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER2VN = data.ZANSWER2VN.replace(/(]\})/g, "</b>");
            }
            if (data.ZANSWER3VN != null) {
                data.ZANSWER3VN = data.ZANSWER3VN.replace(/({\[)/g, "<b style='color: #e50000;'>");
                data.ZANSWER3VN = data.ZANSWER3VN.replace(/(]\})/g, "</b>");
            }

            $scope.questionCurrent.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
            $scope.questionCurrent.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
            $scope.questionCurrent.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
            $scope.questionCurrent.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
            $scope.questionCurrent.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
            $scope.questionCurrent.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
            $scope.questionCurrent.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
            $scope.questionCurrent.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
            $scope.questionCurrent.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
            $scope.questionCurrent.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
            $scope.questionCurrent.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
            $scope.questionCurrent.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
            $scope.questionCurrent.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
            $scope.questionCurrent.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
            $scope.questionCurrent.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
            $scope.questionCurrent.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
            $scope.questionCurrent.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
            $scope.questionCurrent.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
            $scope.questionCurrent.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
            $scope.questionCurrent.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
            $scope.questionCurrent.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;            

            $scope.questionCurrent.ZANSWER[0].checkAnswer = false;
            $scope.questionCurrent.ZANSWER[1].checkAnswer = false;
            $scope.questionCurrent.ZANSWER[2].checkAnswer = false;
            if ($scope.questionCurrent.ZISVIDEO) {
                setSourceVideo($scope.questionCurrent.ZFRAGENKATALOG);
                $scope.questionCurrent.ZVARIANT = true;
            }
            
            $scope.questionItem2 = $scope.questionCurrent;
            
            initChangeLanguage();
        }
       

        $scope.changeLanguage = function () {
            $scope.isLanguage = !$scope.isLanguage;
            $scope.languageText = $scope.isLanguage ? "DE" : "VN";
            init();
            initChangeLanguage();
            if ($rootScope.audio) $rootScope.$broadcast("playaudio", "lang");
        }

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

                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "&nbsp;<b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }
                $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1VN;
                $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2VN;
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

                if ($scope.questionCurrent.ZISVIDEO) {
                    $scope.countPlayVideoText = $sce.trustAsHtml("<p id='pSie'>" + $scope.MenuQuestionItem.titleCount1 + "<br /><b style='color: #e50000;'>" + $scope.countPlayVideo + "</b>&nbsp;" + $scope.MenuQuestionItem.titleCount2 + "</p>");
                }

                $scope.questionCurrent.ANSWERINPUTSTRING1TEMP = $scope.questionCurrent.ANSWERINPUTSTRING1;
                $scope.questionCurrent.ANSWERINPUTSTRING2TEMP = $scope.questionCurrent.ANSWERINPUTSTRING2;
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

        function alertCloseVideo(message, yes, no) {
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

        $scope.rotateLeft = function () {
            var ipAnswer1 = document.getElementById("ipAnswer1");
            var ipAnswer = document.getElementById("ipAnswer");
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = document.getElementById("ipAnswer").value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = document.getElementById("ipAnswer1").value + document.getElementById("ipAnswer2").value;
            }

            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {               

                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[0].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[1].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[2].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ISANSWERED = false;
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");               
                 var prev = $scope.count;
                 var next = prev;
                 if ($scope.sum > 1) {
                     switch ($scope.selectedIndex) {
                         case 0:
                             $scope.selectedIndex = 1;
                             flip1.classList.add("flipLeft");
                             flip2.classList.remove("flipRight");
                             flip3.classList.remove("flipLeft");
                             flip3.classList.add("flipRight");
                             break;
                         case 1:
                             $scope.selectedIndex = 2;
                             flip2.classList.add("flipLeft");
                             flip1.classList.remove("flipLeft");
                             flip1.classList.add("flipRight");
                             flip3.classList.remove("flipRight");
                             break;
                         case 2:
                             $scope.selectedIndex = 0;
                             flip3.classList.add("flipLeft");
                             flip1.classList.remove("flipRight");
                             flip2.classList.remove("flipLeft");
                             flip2.classList.add("flipRight");
                             break;
                     }
                 }                
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        }

        $scope.rotateRight = function () {
            var ipAnswer1 = document.getElementById("ipAnswer1");
            var ipAnswer = document.getElementById("ipAnswer");
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = document.getElementById("ipAnswer").value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = document.getElementById("ipAnswer1").value + document.getElementById("ipAnswer2").value;
            }

            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {                

                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[0].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[1].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[2].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ISANSWERED = false;

                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");

                var prev = $scope.count;
                var next = prev;
                if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 2;
                            flip1.classList.add("flipRight");
                            flip2.classList.remove("flipRight");
                            flip2.classList.add("flipLeft");
                            flip3.classList.remove("flipLeft");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            flip2.classList.add("flipRight");
                            flip1.classList.remove("flipLeft");
                            flip3.classList.remove("flipRight");
                            flip3.classList.add("flipLeft");
                            break;
                        case 2:
                            $scope.selectedIndex = 1;
                            flip3.classList.add("flipRight");
                            flip1.classList.remove("flipRight");
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipLeft");
                            break;
                    }
                }

                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        }

        $scope.onBack = function () {                       
            $window.history.back();

            $rootScope.$broadcast("backFromSearch");
        };
        var promise;
        $scope.onSetHard = function () {
            if (promise != null) {
                $timeout.cancel(promise);
                $scope.isShowBar = false;
            }
            db.checkIfExistsQuestion($scope.questionCurrent.ZID).then(function (data) {
                if (data == $scope.questionCurrent.ZID) {
                    if (!$scope.questionCurrent.ISHARD) {
                        db.updateQuestionHard($scope.questionCurrent.ZID).then(function () {
                            $scope.questionCurrent.ISHARD = true;
                            $rootScope.$broadcast("reload");                          
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
                            $scope.hardText = $scope.MenuQuestionItem.statusUnHard;
                            $scope.isShowBar = true;
                            promise = $timeout(function () {
                                $scope.questionCurrent.ISHARD = false;
                                $scope.isShowBar = false;
                            }, 3000);
                        });
                    }
                }
                else {
                    db.addQuestionHard($scope.questionCurrent.ZID).then(function () {
                        $rootScope.$broadcast("reload");
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

        $scope.onPrevios = function () {
            var ipAnswer1 = document.getElementById("ipAnswer1");
            var ipAnswer = document.getElementById("ipAnswer");
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = document.getElementById("ipAnswer").value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = document.getElementById("ipAnswer1").value + document.getElementById("ipAnswer2").value;
            }

            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {               

                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[0].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[1].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[2].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.countPlayVideo = 5;
                $scope.questionCurrent.ISANSWERED = false;
                
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");

                var prev = $scope.count;
                var next = prev;
                if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 2;
                            flip1.classList.add("flipRight");
                            flip2.classList.remove("flipRight");
                            flip2.classList.add("flipLeft");
                            flip3.classList.remove("flipLeft");
                            break;
                        case 1:
                            $scope.selectedIndex = 0;
                            flip2.classList.add("flipRight");
                            flip1.classList.remove("flipLeft");
                            flip3.classList.remove("flipRight");
                            flip3.classList.add("flipLeft");
                            break;
                        case 2:
                            $scope.selectedIndex = 1;
                            flip3.classList.add("flipRight");
                            flip1.classList.remove("flipRight");
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipLeft");
                            break;
                    }
                }
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        };

        $scope.onNextItem = function () {
            var ipAnswer1 = document.getElementById("ipAnswer1");
            var ipAnswer = document.getElementById("ipAnswer");
            var yourAnswer = "";
            if (ipAnswer1 == null && ipAnswer != null) {
                yourAnswer = document.getElementById("ipAnswer").value;
            }
            else if (ipAnswer1 != null) {
                yourAnswer = document.getElementById("ipAnswer1").value + document.getElementById("ipAnswer2").value;
            }

            if ($scope.questionCurrent.ISANSWERED || ($scope.questionCurrent.ZISINPUT && yourAnswer == "") || (!$scope.questionCurrent.ZANSWER[0].checkAnswer && !$scope.questionCurrent.ZANSWER[1].checkAnswer && !$scope.questionCurrent.ZANSWER[2].checkAnswer && !$scope.questionCurrent.ZISINPUT)) {                
                $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
                $scope.questionCurrent.ZANSWER[0].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[1].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[2].checkAnswer = false;
                $scope.questionCurrent.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.questionCurrent.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                $scope.countPlayVideo = 5;
                $scope.questionCurrent.ISANSWERED = false;                
                var flip1 = document.getElementById("flip1");
                var flip2 = document.getElementById("flip2");
                var flip3 = document.getElementById("flip3");
                var prev = $scope.count;
                var next = prev;
                if ($scope.sum > 1) {
                    switch ($scope.selectedIndex) {
                        case 0:
                            $scope.selectedIndex = 1;
                            flip1.classList.add("flipLeft");
                            flip2.classList.remove("flipRight");
                            flip3.classList.remove("flipLeft");
                            flip3.classList.add("flipRight");
                            break;
                        case 1:
                            $scope.selectedIndex = 2;
                            flip2.classList.add("flipLeft");
                            flip1.classList.remove("flipLeft");
                            flip1.classList.add("flipRight");
                            flip3.classList.remove("flipRight");
                            break;
                        case 2:
                            $scope.selectedIndex = 0;
                            flip3.classList.add("flipLeft");
                            flip1.classList.remove("flipRight");
                            flip2.classList.remove("flipLeft");
                            flip2.classList.add("flipRight");
                            break;
                    }
                }
                if ($rootScope.audio) $rootScope.$broadcast("playaudio", "next");
            }
            else if ($scope.questionCurrent.ZISINPUT || $scope.questionCurrent.ZANSWER[0].checkAnswer || $scope.questionCurrent.ZANSWER[1].checkAnswer || $scope.questionCurrent.ZANSWER[2].checkAnswer) {
                checkValid();
            }
        };

        $scope.onCheckValid = function () {
            checkValid();
        };
        
        function checkValid() {
            if (promise != null) {
                $timeout.cancel(promise);
                $scope.isShowBar = false;
            }
            $scope.questionCurrent.ISANSWERED = true;
            if (!$scope.questionCurrent.ZISINPUT) {
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
                if (document.getElementById("ipAnswer1") == null) {
                    var yourAnswer = document.getElementById("ipAnswer").value;
                    var rightAnswer = document.getElementById("ipValid").value;
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
                                    $timeout(function () {
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
                        document.getElementById("ipAnswer").style.backgroundColor = "#3db707";
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
                        document.getElementById("ipAnswer").style.backgroundColor = "#cd2630";
                        resetInput();
                        if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
                    }
                }
                else {
                    var yourAnswer = document.getElementById("ipAnswer").value;
                    var yourAnswer1 = document.getElementById("ipAnswer1").value;
                    var rightAnswer = document.getElementById("ipValid").value;
                    var rightAnswer1 = document.getElementById("ipValid1").value;

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
                        document.getElementById("ipAnswer").style.backgroundColor = "#3db707";
                        document.getElementById("ipAnswer1").style.backgroundColor = "#3db707";
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
                        document.getElementById("ipAnswer").style.backgroundColor = "#cd2630";
                        document.getElementById("ipAnswer1").style.backgroundColor = "#cd2630";
                        resetInput();
                        if ($rootScope.audio) $rootScope.$broadcast("playaudio", "error");
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
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#3db707' roadonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='number' style='background-color:#3db707' roadonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='number' style='background-color:#3db707' roadonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
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
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#3db707' roadonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='number' style='background-color:#3db707' roadonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                }
                else {
                    if (answer2.length > 1) {
                        var valid = answer2.substring(0, answer2.indexOf(" "));
                        var text = answer2.substring(answer2.indexOf(" "));
                    } else {
                        var valid = answer2;
                        var text = "";
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='number' style='background-color:#3db707' roadonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
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
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#cd2630' roadonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='number' style='background-color:#cd2630' roadonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                        $scope.questionCurrent.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                    }
                    else {
                        if (answer2.length > 1) {
                            var valid = answer2.substring(0, answer2.indexOf(" "));
                            var text = answer2.substring(answer2.indexOf(" "));
                        } else {
                            var valid = answer2;
                            var text = "";
                        }
                        $scope.questionCurrent.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='number' style='background-color:#cd2630' roadonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
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
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input id='ipAnswer1' type='number' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' style='background-color:#cd2630' roadonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipAnswer2' value='" + $scope.questionCurrent.ZINPUTANSWER2 + "' type='number' style='background-color:#cd2630' roadonly/>" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input id='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input id='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                }
                else {
                    if (answer2.length > 1) {
                        var valid = answer2.substring(0, answer2.indexOf(" "));
                        var text = answer2.substring(answer2.indexOf(" "));
                    } else {
                        var valid = answer2;
                        var text = "";
                    }
                    $scope.questionCurrent.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='" + $scope.questionCurrent.ZINPUTANSWER1 + "' type='number' style='background-color:#cd2630' roadonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                    $scope.questionCurrent.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                }
            }
        }

        $scope.onBlurNextQ = function (event) {
            if ($scope.nextQuestion < 1 || $scope.nextQuestion > $scope.sum) {
                $scope.nextQuestion = 1;
            }
            $scope.nextQuestion = $scope.nextQuestion != null ? $scope.nextQuestion : 1;
            $scope.count = $scope.nextQuestion - 1;
            $scope.questionCurrent.ZANSWER[0].isValid = 'img/answer_uncheck.png';
            $scope.questionCurrent.ZANSWER[1].isValid = 'img/answer_uncheck.png';
            $scope.questionCurrent.ZANSWER[2].isValid = 'img/answer_uncheck.png';
            $scope.questionCurrent.ISANSWERED = false;
            db.selectQuestionById($scope.listQuestion[$scope.count]).then(callbackGetId);
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
})();