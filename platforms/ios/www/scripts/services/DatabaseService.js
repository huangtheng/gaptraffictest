(function () {
    "use strict";
    angular.module('TrafficLaws.databaseService', ['TrafficLaws.cordovaService', 'ngAnimate' ])
        .factory("db", ['$q', 'cordova', '$sce', '$http', '$rootScope', '$window', function ($q, cordova, $sce, $http, $rootScope, $window) {
            function DatabaseManager() {
                // Define
                var DB_NAME = "auto.db";
                var mDB = null;
                var ORDER_BY = " ORDER BY ";
                var SELECT_INFO_B = "SELECT * FROM ZCLASS WHERE ZNAME ='B'";
                var COUNT_ALL_B = "SELECT COUNT() AS countQuestion FROM ZQUESTION WHERE (ZTYPE LIKE '%,3,%')";
                var COUNT_QUESTION_VIDEO_B = "SELECT COUNT() AS countQuestion From ZQUESTION WHERE (ZTYPE LIKE '%,3,%') AND ZISVIDEO ='1'";
                var COUNT_QUESTION_NUMBER_B = "SELECT COUNT() AS countQuestion From ZQUESTION WHERE (ZTYPE LIKE '%,3,%') AND ZISINPUT  ='1'";
                var COUNT_QUESTION_VARIANT_B = "SELECT COUNT() AS countQuestion From ZQUESTION WHERE (ZTYPE LIKE '%,3,%') AND ((ZFRAGENKATALOG like '%-%-M%') OR (ZFRAGENKATALOG like '%-%-B%'))";
                var COUNT_ANSWERED_B = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS  WHERE ZUSERID =1 AND ZLASTRESULT >'-1'";
                var COUNT_ANSWERED_RIGHT_B = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS  WHERE ZUSERID =1 AND (ZLASTRESULT = 1)";
                var COUNT_ANSWERED_WRONG_B = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS  WHERE ZUSERID =1 AND (ZLASTRESULT = 0)";
                var COUNT_QUESTION_HARD = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS  WHERE ZUSERID =1 AND (ZDIFFICULT = 1)";
                var COUNT_ANSWERED_B = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS";
                /*Danh sách ID tất cả các câu hỏi - random */
                var QUESTION_RANDOM = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZQUESTION.ZTYPE LIKE '%,3,%') ORDER BY ";
                var QUESTION_RANDOM_FREE = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE ZQUESTION.ZTEST=1 AND  (ZQUESTION.ZTYPE LIKE '%,3,%') ORDER BY ";
                var QUESTION_BY_ID = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE ZQUESTION.ZID = ";                
                /*Danh sách ID tất cả các câu hỏi về video ZISVIDEO - ZQUESTION  */
                var QUESTION_RANDOM_VIDEO = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZISVIDEO ='1' ORDER BY ";
                var QUESTION_RANDOM_NUMBER = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZISINPUT  ='1' ORDER BY ";
                /*Danh sách ID tất cả các câu hỏi biến  thể - ZQUESTION  */
                var QUESTION_RANDOM_VARIANT = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ((ZFRAGENKATALOG like '%-%-M%') OR (ZFRAGENKATALOG like '%-%-B%')) ORDER BY ";
                var QUESTION_RANDOM_ANSWERED = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND ZLASTRESULT >'-1' ORDER BY ";
                var QUESTION_NOT_ANSWERED = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZID NOT IN (SELECT ZQUESTIONSTATS.ZQUESTION From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION  WHERE ZUSERID =1 AND ZLASTRESULT >'-1') ORDER BY ";
                
                var QUESTION_NOT_ANSWERED_FREE = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE ZTEST=1 AND (ZTYPE LIKE '%,3,%') AND ZID NOT IN (SELECT ZQUESTIONSTATS.ZQUESTION From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION  WHERE ZUSERID =1 AND ZLASTRESULT >'-1') ORDER BY ";
                
                var QUESTION_RANDOM_ANSWERED_RIGHT = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 1)  ORDER BY ";
                var QUESTION_RANDOM_ANSWERED_WRONG = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 0)  ORDER BY ";
                var QUESTION_RANDOM_QUESTION_HARD = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZDIFFICULT = 1 )  ORDER BY ";
                /*select test*/
                var PACKAGE_TEST_B = "SELECT * FROM ZTEST WHERE ZKLASS = 'B' AND ZERSTEODERERWEITERUNG = '1' ORDER BY ";
                var SELECT_ALL_TEST = "SELECT * FROM ZQUESTION WHERE ZID IN ("               
                var COUNT_PACKAGE_TEST_B = "SELECT COUNT() AS countTest FROM ZTEST WHERE ZKLASS = 'B' AND ZERSTEODERERWEITERUNG = '1'";

                // FREE
                var QUESTION_RANDOM_VIDEO_FREE = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZISVIDEO ='1' AND ZTEST=1 ORDER BY ";
                var QUESTION_RANDOM_NUMBER_FREE = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZISINPUT  ='1' AND ZTEST=1 ORDER BY ";
                var QUESTION_RANDOM_VARIANT_FREE = "SELECT ZQUESTION.*, ZQUESTIONSTATS.ZDIFFICULT FROM ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ((ZFRAGENKATALOG like '%-%-M%') OR (ZFRAGENKATALOG like '%-%-B%')) AND ZTEST=1 ORDER BY ";
                var QUESTION_BY_THEME_FREE = "SELECT ZQUESTION.*, ZQUESTION.Z_PK,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTION LEFT OUTER JOIN  ZQUESTIONSTATS ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE (ZTYPE LIKE '%,3,%') AND ZTEST=1 AND ZFRAGENKATALOG LIKE ";
                var QUESTION_NOT_ANSWERED_THEME_FREE = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZQUESTION.ZTEST=1 AND ZID NOT IN (SELECT ZQUESTIONSTATS.ZQUESTION From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION  WHERE ZUSERID =1 AND ZLASTRESULT >'-1') and ZFRAGENKATALOG LIKE ";               
                var PACKAGE_TEST_B_FREE = "SELECT * FROM ZTEST WHERE ZKLASS = 'B' AND ZERSTEODERERWEITERUNG = '1' AND ZPRO=0 ORDER BY ";

                // update
                var UPDATE_QUESTION_HARD = "UPDATE ZQUESTIONSTATS SET ZDIFFICULT = 1 WHERE  ZQUESTION = ";
                var UPDATE_QUESTION_UN_HARD = "UPDATE ZQUESTIONSTATS SET ZDIFFICULT = 0 WHERE  ZQUESTION = ";
                var UPDATE_ANSWER_RIGHT = "UPDATE ZQUESTIONSTATS SET ZRIGHTCOUNT = ZRIGHTCOUNT+1, ZLASTRESULT = 1 WHERE  ZQUESTION = ";
                var UPDATE_ANSWER_WRONG = "UPDATE ZQUESTIONSTATS SET ZWRONGCOUNT =ZWRONGCOUNT+1, ZLASTRESULT= 0 WHERE  ZQUESTION = ";                
                var CHECK_QUESTION_HARD = "SELECT ZQUESTIONSTATS From ZQUESTIONSTATS "
                var DELETE_QUESTION_START = "DELETE FROM ZQUESTIONSTATS";
                // select list theme question
                var SELECT_THEME_QUESTION = "SELECT * FROM ZQUESTIONTHEME";
                var COUNT_QUESTION_BY_THEME = "SELECT COUNT() AS countQuestion FROM ZQUESTION WHERE  (ZTYPE LIKE '%,3,%')  and ZFRAGENKATALOG LIKE ";              
                //count answer theme
                var COUNT_ANSWERED_THEME = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND ZLASTRESULT >'-1' and ZFRAGENKATALOG LIKE ";
                var COUNT_ANSWERED_RIGHT_THEME = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 1) and ZFRAGENKATALOG LIKE ";
                var COUNT_ANSWERED_WRONG_THEME = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 0) and ZFRAGENKATALOG LIKE ";
                var COUNT_QUESTION_HARD_THEME = "SELECT COUNT() AS countQuestion From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZDIFFICULT = 1) and ZFRAGENKATALOG LIKE ";
                //  teststart
                var GET_TEST_START = "SELECT * From ZTESTSTATS";
                var COUNT_TEST_START = "SELECT COUNT() AS countTest,* From ZTESTSTATS";
                var COUNT_TEST_BESTANDEN = "SELECT COUNT() AS countTest From ZTESTSTATS WHERE ZRESULT = '1'";
                var DELETE_TEST_START = "DELETE FROM ZTESTSTATS";

                var QUESTION_BY_THEME = "SELECT ZQUESTION.*, ZQUESTION.Z_PK,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTION LEFT OUTER JOIN  ZQUESTIONSTATS ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE (ZTYPE LIKE '%,3,%') AND ZFRAGENKATALOG LIKE ";
                /*Danh sách ID tất cả các câu hỏi biến  thể - ZQUESTION  */                
                var QUESTION_ANSWERED_THEME = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND ZLASTRESULT >'-1' AND ZFRAGENKATALOG LIKE ";
                var QUESTION_NOT_ANSWERED_THEME = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTION LEFT JOIN ZQUESTIONSTATS ON ZQUESTIONSTATS.ZQUESTION = ZQUESTION.ZID WHERE (ZTYPE LIKE '%,3,%') AND ZID NOT IN (SELECT ZQUESTIONSTATS.ZQUESTION From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION  WHERE ZUSERID =1 AND ZLASTRESULT >'-1') and ZFRAGENKATALOG LIKE ";
                var QUESTION_ANSWERED_RIGHT_THEME = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 1) AND ZFRAGENKATALOG LIKE ";
                var QUESTION_ANSWERED_WRONG_THEME = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZLASTRESULT = 0) AND ZFRAGENKATALOG LIKE ";
                var QUESTION_QUESTION_HARD_THEME = "SELECT ZQUESTION.*,ZQUESTIONSTATS.ZDIFFICULT From ZQUESTIONSTATS LEFT OUTER JOIN  ZQUESTION ON ZQUESTION.ZID = ZQUESTIONSTATS.ZQUESTION WHERE ZUSERID =1 AND (ZDIFFICULT = 1 ) AND ZFRAGENKATALOG LIKE ";
                var VERSION_APP = "SELECT ZVALUE FROM ZSETTINGS WHERE ZKEY = 'DBVersion'";
                var CHECK_IS_ACTIVE = "SELECT ZVALUE FROM ZSETTINGS WHERE ZKEY = 'IsActive'";
                var UPDATE_USER_ACTIVE = "UPDATE ZSETTINGS SET ZVALUE = 1 WHERE ZKEY = 'IsActive'";
                //check free
                var UPDATE_ACTIVE_QUESTION = "UPDATE ZQUESTION SET ZTEST=0 WHERE ZTEST=0";
                var UPDATE_ACTIVE_TEST = "UPDATE ZTEST SET ZPRO=1 WHERE ZPRO=0";
                var utils = new Utils($http);

                // search
                function search(text, isActive) {
                    var deferred = $q.defer();
                    var SEARCH_QUERY;
                    if (isActive) {
                        SEARCH_QUERY = "SELECT ZQUESTION, ZQUESTIONVN, ZID, ZFRAGENKATALOG FROM ZQUESTION WHERE (ZQUESTIONVN LIKE '%" + text + "%') OR (ZQUESTION LIKE '%" + text + "%') OR (ZFRAGENKATALOG LIKE '%" + text + "%') LIMIT 10";
                    }
                    else {
                        SEARCH_QUERY = "SELECT ZQUESTION, ZQUESTIONVN,ZID, ZFRAGENKATALOG FROM ZQUESTION WHERE ((ZQUESTIONVN LIKE '%" + text + "%') OR (ZQUESTION LIKE '%" + text + "%') OR (ZFRAGENKATALOG LIKE '%" + text + "%')) AND ZTEST=1 LIMIT 10";
                    }
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(SEARCH_QUERY, [], function (tx, results) {                                                                
                                if (results != null && results.rows.item(0).ZID != null) {                                    
                                    deferred.resolve(results.rows);
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("search fail" + tx.message);                          
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                //add answer right
                function addAnswerRight(id) {
                    var deferred = $q.defer();
                    var ADD_ANSWER_RIGHT = "INSERT INTO 'main'.'ZQUESTIONSTATS' ('Z_ENT','Z_OPT','ZLASTRESULT','ZDIFFICULT','ZRIGHTCOUNT','ZUSERID','ZWRONGCOUNT','ZQUESTION') SELECT '1','1','1','0','0','1','0','" + id + "' WHERE NOT EXISTS (SELECT 1 FROM 'ZQUESTIONSTATS' WHERE ZQUESTION = " + id + ")";
                    mDB.transaction(function (tx) {
                        tx.executeSql(ADD_ANSWER_RIGHT);
                    }, function (tx, er) {
                        console.log("answer right Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("answer right Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //add answer wrong
                function addAnswerWrong(id) {
                    var deferred = $q.defer();
                    var ADD_ANSWER_RIGHT = "INSERT INTO 'main'.'ZQUESTIONSTATS' ('Z_ENT','Z_OPT','ZLASTRESULT','ZDIFFICULT','ZRIGHTCOUNT','ZUSERID','ZWRONGCOUNT','ZQUESTION') SELECT '1','1','0','0','0','1','0','" + id + "' WHERE NOT EXISTS (SELECT 1 FROM 'ZQUESTIONSTATS' WHERE ZQUESTION = " + id + ")";
                    mDB.transaction(function (tx) {
                        tx.executeSql(ADD_ANSWER_RIGHT);
                    }, function (tx, er) {
                        console.log("answer wrong Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("answer wrong Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //adđ question hard
                function addQuestionHard(id) {
                    var deferred = $q.defer();
                    var ADD_ANSWER_HARD = "INSERT INTO 'main'.'ZQUESTIONSTATS' ('Z_ENT','Z_OPT','ZLASTRESULT','ZDIFFICULT','ZRIGHTCOUNT','ZUSERID','ZWRONGCOUNT','ZQUESTION') SELECT '1','1','-1','1','0','1','0','" + id + "' WHERE NOT EXISTS (SELECT 1 FROM 'ZQUESTIONSTATS' WHERE ZQUESTION = " + id + ")";
                    mDB.transaction(function (tx) {
                        tx.executeSql(ADD_ANSWER_HARD);
                    }, function (tx, er) {
                        console.log("add question hard Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("add question hard Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                // check teststart
                function checkExistsTest(id) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql("SELECT ZTEST FROM ZTESTSTATS WHERE ZTEST=" + id, [], function (tx, results) {                                
                                if (results.rows.item(0).ZTEST != null) {
                                    deferred.resolve(results.rows.item(0).ZTEST);
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("check teststart if exists" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                //add teststart
                function addTestStart(basisErrorPoint, result, advancedErrorPoint, timestamp,userId, testId) {
                    var deferred = $q.defer();
                    var ADD_TEST_START = "INSERT INTO 'main'.'ZTESTSTATS' ('Z_ENT','Z_OPT','ZBASICERRORPOINTS','ZRESULT','ZEXTENDEDERRORPOINTS','ZTIMESTAMP','ZUSERID','ZTEST') SELECT '1','1','" + basisErrorPoint + "','" + result + "','" + advancedErrorPoint + "','" + timestamp + "','" + userId + "','" + testId + "' WHERE NOT EXISTS (SELECT 1 FROM 'ZTESTSTATS' WHERE ZTEST = " + testId + ")";
                    mDB.transaction(function (tx) {
                        tx.executeSql(ADD_TEST_START);
                    }, function (tx, er) {
                        console.log("add test start Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("add test start Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update answer right
                function updateAnswerRight(id) {
                    var deferred = $q.defer();                    
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_ANSWER_RIGHT + id);
                    }, function (tx, er) {
                        console.log("update answer right Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update answer right Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update answer wrong
                function updateAnswerWrong(id) {
                    var deferred = $q.defer();                    
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_ANSWER_WRONG + id);
                    }, function (tx, er) {
                        console.log("update answer wrong Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update answer wrong Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update question hard
                function updateQuestionHard(id) {
                    var deferred = $q.defer();                    
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_QUESTION_HARD + id);
                    }, function (tx, er) {
                        console.log("update question hard Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update question hard Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update question un hard
                function updateQuestionUnHard(id) {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_QUESTION_UN_HARD + id);
                    }, function (tx, er) {
                        console.log("update question un hard Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update question un hard Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update teststart
                function updateTestStart(basisErrorPoint, result, advancedErrorPoint, timestamp, userId, testId) {
                    var deferred = $q.defer();
                    var UPDATE_TEST_START = "UPDATE ZTESTSTATS SET ZBASICERRORPOINTS = '" + basisErrorPoint + "',ZRESULT = '" + result +
                        "',ZEXTENDEDERRORPOINTS = '" + advancedErrorPoint + "', ZTIMESTAMP = '" + timestamp + "',ZUSERID = '" + userId + "' WHERE  ZTEST = '"+ testId +"'";
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_TEST_START);
                    }, function (tx, er) {
                        console.log("update test start Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update test start Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }                

                // check exists answered
                function selectQuestionStart(id) {
                    var deferred = $q.defer();
                    var QUERY = "SELECT ZQUESTION FROM ZQUESTIONSTATS WHERE ZQUESTION = " + id;
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUERY, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).ZQUESTION);
                                } else {
                                    deferred.resolve(0);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("check if exits all question fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // check exists answered test
                function selectQuestionStartTest(id, i) {
                    var deferred = $q.defer();
                    var QUERY = "SELECT ZQUESTION FROM ZQUESTIONSTATS WHERE ZQUESTION = " + id;
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUERY, [], function (tx, results) {
                                var item = new Object();
                                item.ZQUESTION = null;
                                item.number = i;
                                if (results.rows.item(0).ZQUESTION != null) {
                                    item.ZQUESTION = results.rows.item(0).ZQUESTION;
                                    item.number = i;
                                    deferred.resolve(item);
                                } else {
                                    deferred.resolve(item);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("check if exits all question fail" + tx.message);
                            var item = new Object();
                            item.ZQUESTION = null;
                            item.number = i;
                            deferred.resolve(item);
                        }
                    );
                    return deferred.promise;
                }

                //select test
                function selectTest(type) {
                    var deferred = $q.defer();
                    var QUERY = PACKAGE_TEST_B + type + " LIMIT 1";
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUERY, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0));
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("select test" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                //select test
                function selectTestFree(type) {
                    var deferred = $q.defer();
                    var QUERY = PACKAGE_TEST_B_FREE + type + " LIMIT 1";
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUERY, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0));
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("select test" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // check question test
                function checkQuestionVideo(id, i) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql("SELECT ZISVIDEO,ZFRAGENKATALOG FROM ZQUESTION WHERE ZID=" + id, [], function (tx, results) {
                                var item = new Object();
                                if (results != null) {
                                    item.isVideo = results.rows.item(0).ZISVIDEO;
                                    item.number = i;
                                    item.prefix = results.rows.item(0).ZFRAGENKATALOG;
                                    deferred.resolve(item);
                                } else {
                                    deferred.resolve(item);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("check video if exists" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                function selectQuestionByIdByTest(ID) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(SELECT_ALL_TEST + ID + ") ORDER BY  ZFRAGENKATALOG", [], function (tx, results) {
                                var result = [];
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++)
                                    {
                                        var data = results.rows.item(i);
                                        var itemData = new Object();
                                        itemData.number = i;
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT;
                                        itemData.ZPRETEXT = data.ZPRETEXT;
                                        itemData.ZIMAGE = data.ZIMAGE;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER2 = data.ZANSWER2;
                                        itemData.ZANSWER3 = data.ZANSWER3;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;
                                        itemData.ZQUESTION = data.ZQUESTION;
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZBIGIMAGE = data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN;
                                        itemData.ZQUESTIONVN = data.ZQUESTIONVN;
                                        itemData.ZTIPVN = data.ZTIPVN;
                                        itemData.ZANSWER3VN = data.ZANSWER3VN;
                                        itemData.ZANSWER2VN = data.ZANSWER2VN;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        itemData.ZDIFFICULT = data.ZDIFFICULT;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;
                                        result.push(itemData);
                                    }                                    
                                    deferred.resolve(result);
                                } else {
                                    deferred.resolve(result);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all QuestType fail" + tx.message);
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }

                // count test start
                function countTestStart() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_TEST_START, [], function (tx, results) {
                                if (results.rows.item(0).countTest > 0) {
                                    deferred.resolve(results.rows.item(0).countTest);
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count test start fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count test start right
                function countTestStartRight() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_TEST_BESTANDEN, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countTest);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count test start right fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get All test start
                function selectAllTestStart() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(GET_TEST_START, [], function (tx, results) {
                                if (results.rows.length > 0) {                                  
                                    deferred.resolve(results.rows);
                                } else {
                                    deferred.resolve(null);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all test Start fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get All Question
                function selectAllQuestionB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }                                      

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;                                        
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;                                      
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        } 

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE =  "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;
                                      
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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {                                            
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {                            
                            console.log("Select all QuestType fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get All Question Free
                function selectAllQuestionFree(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_FREE + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }

                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all QuestType fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get All Answered
                function selectAllAnswerB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_ANSWERED + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answered fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get All not Answered
                function selectAllNotAnswerB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_NOT_ANSWERED + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answered fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get All not Answered
                function selectAllNotAnswerFree(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_NOT_ANSWERED_FREE + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;

                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answered fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }
                        
                // Get Question Video
                function selectQuestionVideoB(type, callBack) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_VIDEO + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question video fail" + tx.message);
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }

                // Get Question number
                function selectQuestionNumberB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_NUMBER + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question number fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get Question variant
                function selectQuestionVariantB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_VARIANT + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question variant fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get answer right
                function selectQuestionAnsweRightB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_ANSWERED_RIGHT + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question answer right fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get answer wrong
                function selectQuestionAnsweWrongB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_ANSWERED_WRONG + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);                                    
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question answer wrong fail" + tx.message);
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }

                // Get question hard
                function selectQuestionHardB(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_QUESTION_HARD + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }
                            })
                        },
                        function (tx, err) {
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }

                function selectQuestionByIdB(ZID) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_BY_ID + ZID, [], function (tx, results) {
                                var itemData = new Object();
                                if (results.rows.length > 0) {                                    
                                        var data = results.rows.item(0);                                        
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT;
                                        itemData.ZPRETEXT = data.ZPRETEXT;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = data.ZIMAGE;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER2 = data.ZANSWER2;
                                        itemData.ZANSWER3 = data.ZANSWER3;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;
                                        itemData.ZQUESTION = data.ZQUESTION;
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZBIGIMAGE = data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN;
                                        itemData.ZQUESTIONVN = data.ZQUESTIONVN;                                        
                                        itemData.ZTIPVN = data.ZTIPVN;
                                        itemData.ZANSWER3VN = data.ZANSWER3VN;                                        
                                        itemData.ZANSWER2VN = data.ZANSWER2VN;                                        
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        itemData.ZDIFFICULT = data.ZDIFFICULT;
                                        itemData.ZTEST = data.ZTEST == 1? true: false;
                                                                            
                                        deferred.resolve(itemData);
                                } else {
                                    deferred.resolve(itemData);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select question by id fail" + tx.message);
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }               

                // Get All Question theme
                function selectAllQuestionThemB() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(SELECT_THEME_QUESTION, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new Object();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZORDER = data.ZORDER;
                                        itemData.ZGROUP = data.ZGROUP;
                                        itemData.ZNAMEDE = data.ZNAME;
                                        itemData.ZNAMEVN = data.ZNAMEVN;
                                        itemData.ZICON = "./img/catalogs/" + data.ZICON;
                                        itemData.ZPREFIX = data.ZPREFIX;
                                        itemData.ISSHOW = data.ZNAME.indexOf("(nicht belegt)") > -1 ? false: true;
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);                                   
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all theme question fail" + tx.message);
                            deferred.resolve();
                        }
                    );
                    return deferred.promise;
                }              

                // count all question B
                function countQuestionB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ALL_B, [], function (tx, results) {                                                             
                                if (results != null) {                                    
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(0);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered all question B
                function countAnsweredB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(null);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered all fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered right all question B
                function countAnsweredRightB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_RIGHT_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered right fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered wrong all question B
                function countAnsweredWrongB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_WRONG_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered wrong fail" + tx.message);
                            deferred.resolve(null)
                        }
                    );
                    return deferred.promise;
                }

                // count question hard all question B
                function countQuestionHardB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_HARD, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question hard fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count question to number all B
                function countQuestionNumberB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_NUMBER_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question to number fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count question to variant all B
                function countQuestionVariantB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_VARIANT_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question to variant fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count question to video all B
                function countQuestionVideoB_All() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_VIDEO_B, [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question to video fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

// theme
                // count all question by theme
                function countQuestionByTheme(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_BY_THEME + "'%" + theme + "." + "%'", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question by theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all question by theme
                function countQuestionByThemeFree(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_BY_THEME + "'%" + theme + "." + "%'" + " AND ZTEST=1", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question by theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered all question theme
                function countAnsweredByTheme(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_THEME + "'%" + theme + "%'", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered all theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered right all question theme
                function countAnsweredRightByTheme(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_RIGHT_THEME + "'%" + theme + "%'", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered right theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count all answered wrong all question theme
                function countAnsweredWrongByTheme(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_ANSWERED_WRONG_THEME + "'%" + theme + "%'", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all answered wrong theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // count question hard all question theme
                function countQuestionHardByTheme(theme) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(COUNT_QUESTION_HARD_THEME + "'%" + theme + "%'", [], function (tx, results) {
                                if (results != null) {
                                    deferred.resolve(results.rows.item(0).countQuestion);
                                } else {
                                    deferred.resolve(results);
                                }
                            })
                        },
                        function (tx, err) {
                            console.log("Count all question hard theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }               

                // Get question by theme
                function selectQuestionByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_BY_THEME + "'%" + theme + "%'" + ORDER_BY +type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question by theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get question by theme free
                function selectQuestionByThemeFree(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_BY_THEME_FREE + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question by theme free fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get Question Video free
                function selectQuestionVideoFree(type, callBack) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_VIDEO_FREE + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question video fail" + tx.message);
                            deferred.resolve(err);
                        }
                    );
                    return deferred.promise;
                }

                // Get Question number free
                function selectQuestionNumberFree(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_NUMBER_FREE + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question number fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get Question variant free
                function selectQuestionVariantFree(type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_RANDOM_VARIANT_FREE + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question variant fail" + tx.message);
                            deferred.resolve(tx.message);
                        }
                    );
                    return deferred.promise;
                }

                // Get All answered by theme
                function selectAnsweredByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_ANSWERED_THEME + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answered theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get All answered by theme
                function selectNotAnsweredByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_NOT_ANSWERED_THEME + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all not answered theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get All answered by theme free
                function selectNotAnsweredByThemeFree(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_NOT_ANSWERED_THEME_FREE + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all not answered theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get answer right by theme
                function selectAnswerRightByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_ANSWERED_RIGHT_THEME + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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


                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answer right theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get answer wrong theme
                function selectAnswerWrongByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_ANSWERED_WRONG_THEME + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all answer wrong theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                // Get question hard theme
                function selectQuestionHardByTheme(theme, type) {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(QUESTION_QUESTION_HARD_THEME + "'%" + theme + "%'" + ORDER_BY + type, [], function (tx, results) {
                                var dataResult = new Array();
                                if (results.rows.length > 0) {
                                    for (var i = 0; i < results.rows.length; i++) {
                                        var data = results.rows.item(i);
                                        var itemData = new QuestionModel();
                                        itemData.Z_PK = data.Z_PK;
                                        itemData.Z_ENT = data.Z_ENT;
                                        itemData.Z_OPT = data.Z_OPT;
                                        itemData.ZID = data.ZID;
                                        itemData.ZTESTIMAGE = data.ZTESTIMAGE;
                                        itemData.ZUPDATE = data.ZUPDATE;
                                        itemData.ZISHTML = data.ZISHTML;
                                        itemData.ZISVIDEO = data.ZISVIDEO == 1 ? true : false;
                                        itemData.ZOLDID = data.ZOLDID;
                                        itemData.ZTESTBIGIMAGE = data.ZTESTBIGIMAGE;
                                        itemData.ZL = data.ZL;
                                        itemData.ZPOINTS = data.ZPOINTS;
                                        itemData.ZTHEMA = data.ZTHEMA;
                                        itemData.ZQZG = data.ZQZG;
                                        itemData.ZVALID1 = data.ZVALID1;
                                        itemData.ZVALID2 = data.ZVALID2;
                                        itemData.ZVALID3 = data.ZVALID3;
                                        itemData.ZISINPUT = data.ZISINPUT == 1 ? true : false;
                                        itemData.ZANSWER1 = data.ZANSWER1;
                                        itemData.ZANSWER1VN = data.ZANSWER1VN;
                                        if (itemData.ZISINPUT) {

                                            if (true) {
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
                                                        var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                        var text2 = answer4.substring(answer4.indexOf(" "));
                                                    } else {
                                                        var valid2 = answer4;
                                                        var text2 = answer4;
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                                }
                                                else {
                                                    if (answer2.length > 1) {
                                                        var valid = answer2.substring(0, answer2.indexOf(" "));
                                                        var text = answer2.substring(answer2.indexOf(" "));
                                                    } else {
                                                        var valid = answer2;
                                                        var text = "";
                                                    }
                                                    itemData.ANSWERINPUTSTRING1VN = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                    itemData.ANSWERINPUTSTRING2VN = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                }
                                                itemData.ANSWERINPUTSTRING1TEMP = itemData.ANSWERINPUTSTRING1VN;
                                                itemData.ANSWERINPUTSTRING2TEMP = itemData.ANSWERINPUTSTRING2VN;
                                            }

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
                                                    var valid2 = answer4.substring(0, answer4.indexOf(" "));
                                                    var text2 = answer4.substring(answer4.indexOf(" "));
                                                } else {
                                                    var valid2 = answer4;
                                                    var text2 = answer4;
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + "</p>" + "&nbsp<input class='ipAnswer1' type='text' value='' />" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipAnswer2' value='' type='text' />" + '&nbsp<p>' + utils.convertText(text2) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid1' type='text' value='" + valid1 + "'/>" + '&nbsp<p> ' + utils.convertText(text1) + '</p>' + "&nbsp<input class='ipValid2' type='text' value='" + valid2 + "'/>" + '&nbsp<p> ' + utils.convertText(text2) + '</p>';
                                            }
                                            else {
                                                if (answer2.length > 1) {
                                                    var valid = answer2.substring(0, answer2.indexOf(" "));
                                                    var text = answer2.substring(answer2.indexOf(" "));
                                                } else {
                                                    var valid = answer2;
                                                    var text = "";
                                                }
                                                itemData.ANSWERINPUTSTRING1 = "<p>" + utils.convertText(answer1) + " </p>&nbsp" + "<input class='ipAnswer' value='' type='text' />" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                                itemData.ANSWERINPUTSTRING2 = "<p>" + utils.convertText(answer1) + " </p>" + "&nbsp<input class='ipValid' type='text' value='" + valid + "' readonly/>" + '&nbsp<p> ' + utils.convertText(text) + '</p>';
                                            }
                                        }

                                        if (data.ZPRETEXT != null) {
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZPRETEXT = data.ZPRETEXT.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZPRETEXT = data.ZPRETEXT != null ? $sce.trustAsHtml(utils.convertText(data.ZPRETEXT)) : null;
                                        itemData.ZISPRETEXT = data.ZPRETEXT != null ? true : false;
                                        itemData.ZIMAGE = "img/" + data.ZIMAGE;
                                        itemData.ZISIMAGE = data.ZIMAGE != null ? true : false;
                                        itemData.ZANSWER1IMAGE = data.ZANSWER1IMAGE;
                                        itemData.ZANSWER2IMAGE = data.ZANSWER2IMAGE;
                                        itemData.ZANSWER3IMAGE = data.ZANSWER3IMAGE;
                                        itemData.ZWBMP = data.ZWBMP;

                                        if (data.ZQUESTION != null) {
                                            data.ZQUESTION = data.ZQUESTION.replace(/({\[)/g, "<b style='color: #e50000;'>");
                                            data.ZQUESTION = data.ZQUESTION.replace(/(]\})/g, "</b>");
                                        }

                                        itemData.ZQUESTION = $sce.trustAsHtml(utils.convertText(data.ZQUESTION  + "&nbsp" + (data.ZKOMMENTAR != null ? data.ZKOMMENTAR : '')));
                                        itemData.ZQUESTIONIMAGE = data.ZQUESTIONIMAGE;
                                        itemData.ZTIP = data.ZTIP;
                                        itemData.ZKOMENTAR = data.ZKOMMENTAR;
                                        itemData.ZSETNAME = data.ZSETNAME;
                                        itemData.ZNOTUSED = data.ZNOTUSED;
                                        itemData.ZTYPE = data.ZTYPE;
                                        itemData.ZFRAGENKATALOG = data.ZFRAGENKATALOG;
                                        itemData.ZVARIANT = (data.ZFRAGENKATALOG.indexOf("M") > 0 || data.ZFRAGENKATALOG.indexOf("B") > 0) ? true : false;
                                        itemData.ZBIGIMAGE = "img/" + data.ZBIGIMAGE;
                                        itemData.ZCOMMENTMOFFA = data.ZCOMMENTMOFFA;
                                        itemData.ZCOMMENTZ = data.ZCOMMENTZ;
                                        itemData.ZPRETEXTVN = data.ZPRETEXTVN != null ? $sce.trustAsHtml(data.ZPRETEXTVN) : null;
                                        itemData.ZQUESTIONVN = $sce.trustAsHtml(data.ZQUESTIONVN);
                                        itemData.ZTIPVN = data.ZTIPVN;

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

                                        itemData.ZANSWER[0].vn.ZANSWER = data.ZANSWER1VN != null ? $sce.trustAsHtml(data.ZANSWER1VN) : null;
                                        itemData.ZANSWER[0].vn.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].de.ZANSWER = data.ZANSWER1 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER1)) : null;
                                        itemData.ZANSWER[0].de.ZANSWERIMAGE = "img/" + data.ZANSWER1IMAGE;
                                        itemData.ZANSWER[0].isImage = data.ZANSWER1IMAGE != null ? true : false;
                                        itemData.ZANSWER[0].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[1].vn.ZANSWER = data.ZANSWER2VN != null ? $sce.trustAsHtml(data.ZANSWER2VN) : null;
                                        itemData.ZANSWER[1].vn.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].de.ZANSWER = data.ZANSWER2 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER2)) : null;
                                        itemData.ZANSWER[1].de.ZANSWERIMAGE = "img/" + data.ZANSWER2IMAGE;
                                        itemData.ZANSWER[1].isImage = data.ZANSWER2IMAGE != null ? true : false;
                                        itemData.ZANSWER[1].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[2].vn.ZANSWER = data.ZANSWER3VN != null ? $sce.trustAsHtml(data.ZANSWER3VN) : null;
                                        itemData.ZANSWER[2].vn.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].de.ZANSWER = data.ZANSWER3 != null ? $sce.trustAsHtml(utils.convertText(data.ZANSWER3)) : null;
                                        itemData.ZANSWER[2].de.ZANSWERIMAGE = "img/" + data.ZANSWER3IMAGE;
                                        itemData.ZANSWER[2].isImage = data.ZANSWER3IMAGE != null ? true : false;
                                        itemData.ZANSWER[2].Number = $rootScope.answeredRandom ? (0.5 - $window.Math.random()) : 0;
                                        itemData.ZANSWER[0].isAnswer = data.ZANSWER1 != null ? true : false;
                                        itemData.ZANSWER[1].isAnswer = data.ZANSWER2 != null ? true : false;
                                        itemData.ZANSWER[2].isAnswer = data.ZANSWER3 != null ? true : false;
                                        itemData.ZANSWER[0].checkAnswer = false;
                                        itemData.ZANSWER[1].checkAnswer = false;
                                        itemData.ZANSWER[2].checkAnswer = false;

                                        itemData.ZDIFFICULT = data.ZDIFFICULT == 1 ? true : false;
                                        itemData.ZTEST = data.ZTEST == 1 ? true : false;

                                        itemData.ZQUESTIONTEMP = itemData.ZQUESTIONVN;
                                        itemData.ZANSWER[0].ZANSWER = itemData.ZANSWER[0].vn.ZANSWER;
                                        itemData.ZANSWER[1].ZANSWER = itemData.ZANSWER[1].vn.ZANSWER;
                                        itemData.ZANSWER[2].ZANSWER = itemData.ZANSWER[2].vn.ZANSWER;
                                        if (itemData.ZISVIDEO) {
                                            itemData.ZVARIANT = true;
                                        }
                                        dataResult.push(itemData);
                                    }
                                    deferred.resolve(dataResult);
                                } else {
                                    deferred.resolve(dataResult);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select all Question hard theme fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }                               

                function ready() {
                    var deferred = $q.defer();
                    cordova.ready.then(function () {
                        //console.log("Ready");
                        if (mDB) {
                            deferred.resolve();
                            console.log("b");
                        } else {
                            //mDB = window.sqlitePlugin.openDatabase({ name: DB_NAME });
                            // mDB = window.sqlitePlugin.openDatabase({ name: DB_NAME, createFromLocation: 1 });
                            mDB = window.sqlitePlugin.openDatabase({name: DB_NAME, location: 'default', createFromLocation: 1});
                            deferred.resolve();
                            console.log("a");
                        }
                    });
                    return deferred.promise;
                }

                function getVersion() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(VERSION_APP, [], function (tx, results) {
                                var item = new Object();
                                item.versionApp = null;
                                if (results.rows.length > 0) {
                                    item.versionApp = results.rows.item(0).ZVALUE;                                    
                                    deferred.resolve(item);
                                } else {
                                    deferred.resolve(item);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select version app fail" + tx.message);
                            deferred.resolve(null);
                        }
                    );
                    return deferred.promise;
                }

                function checkIsActive() {
                    var deferred = $q.defer();
                    mDB.transaction(
                        function (tx) {
                            tx.executeSql(CHECK_IS_ACTIVE, [], function (tx, results) {
                                var item = new Object();
                                item.isActive = null;
                                if (results.rows.length > 0) {
                                    item.isActive = results.rows.item(0).ZVALUE == "1" ? true : false;
                                    deferred.resolve(item);
                                } else {
                                    item.isActive = false;
                                    deferred.resolve(item);
                                }

                            })
                        },
                        function (tx, err) {
                            console.log("Select active fail" + tx.message);
                            deferred.resolve(false);
                        }
                    );
                    return deferred.promise;
                }

                //update active
                function updateUserActive() {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_USER_ACTIVE);
                    }, function (tx, er) {
                        console.log("update active Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update active Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update username
                function updateUserName(username) {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql("UPDATE ZSETTINGS SET ZVALUE = "+ username +" WHERE ZKEY = 'UserName'");
                    }, function (tx, er) {
                        console.log("update username Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update username Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update active question
                function updateQuestionActive() {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_ACTIVE_QUESTION);
                    }, function (tx, er) {
                        console.log("update active question Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update active question Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //update active test
                function updateTestActive() {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(UPDATE_ACTIVE_TEST);
                    }, function (tx, er) {
                        console.log("update active test Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("update active test Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //clear test
                function clearTest() {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(DELETE_TEST_START);
                    }, function (tx, er) {
                        console.log("clear test Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("clear test Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //clear question
                function clearQuestion() {
                    var deferred = $q.defer();
                    mDB.transaction(function (tx) {
                        tx.executeSql(DELETE_QUESTION_START);
                    }, function (tx, er) {
                        console.log("clear question Fail " + er);
                        deferred.resolve();
                    }, function (e) {
                        console.log("clear question Success");
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                //
                DatabaseManager.prototype.ready = ready;

                function percentCalculation(a, b) {
                    return Math.floor((a / b) * 100);
                }

                DatabaseManager.prototype.updateQuestionActive = updateQuestionActive;
                DatabaseManager.prototype.updateTestActive = updateTestActive;
                DatabaseManager.prototype.clearTest = clearTest;
                DatabaseManager.prototype.clearQuestion = clearQuestion;
                DatabaseManager.prototype.getVersion = getVersion;
                DatabaseManager.prototype.checkIsActive = checkIsActive;
                DatabaseManager.prototype.updateUserActive = updateUserActive;
                DatabaseManager.prototype.updateUserName = updateUserName;
                DatabaseManager.prototype.percentCalculation = percentCalculation;
                DatabaseManager.prototype.checkIfExistsQuestion = selectQuestionStart;
                DatabaseManager.prototype.checkIfExistsQuestionTest = selectQuestionStartTest;
                DatabaseManager.prototype.addAnswerRight = addAnswerRight;
                DatabaseManager.prototype.addAnswerWrong = addAnswerWrong;
                DatabaseManager.prototype.addQuestionHard = addQuestionHard;
                DatabaseManager.prototype.updateAnswerRight = updateAnswerRight;
                DatabaseManager.prototype.updateAnswerWrong = updateAnswerWrong;
                DatabaseManager.prototype.updateQuestionHard = updateQuestionHard;
                DatabaseManager.prototype.updateQuestionUnHard = updateQuestionUnHard;
                DatabaseManager.prototype.selectAllQuestionRandom = selectAllQuestionB;
                DatabaseManager.prototype.selectAllQuestionFree = selectAllQuestionFree;
                DatabaseManager.prototype.selectAllAnswered = selectAllAnswerB;
                DatabaseManager.prototype.selectAllNotAnswered = selectAllNotAnswerB;
                DatabaseManager.prototype.selectAllNotAnsweredFree = selectAllNotAnswerFree;
                DatabaseManager.prototype.selectAllQuestionVideo = selectQuestionVideoB;
                DatabaseManager.prototype.selectAllQuestionNumber = selectQuestionNumberB;
                DatabaseManager.prototype.selectAllQuestionVariant = selectQuestionVariantB;
                DatabaseManager.prototype.selectAllAnswerRight = selectQuestionAnsweRightB;
                DatabaseManager.prototype.selectAllAnswerWrong = selectQuestionAnsweWrongB;
                DatabaseManager.prototype.selectAllQuestionHard = selectQuestionHardB;
                // free
                DatabaseManager.prototype.selectAllQuestionVideoFree = selectQuestionVideoFree;
                DatabaseManager.prototype.selectAllQuestionNumberFree = selectQuestionNumberFree;
                DatabaseManager.prototype.selectAllQuestionVariantFree = selectQuestionVariantFree;

                DatabaseManager.prototype.selectAllQuestionTheme = selectAllQuestionThemB;
                DatabaseManager.prototype.countQuestionAll = countQuestionB_All;
                DatabaseManager.prototype.countAnsweredAll = countAnsweredB_All;
                DatabaseManager.prototype.countAnsweredRightAll = countAnsweredRightB_All;
                DatabaseManager.prototype.countAnsweredWrongAll = countAnsweredWrongB_All;
                DatabaseManager.prototype.countQuestionHardAll = countQuestionHardB_All;
                DatabaseManager.prototype.countQuestionNumberAll = countQuestionNumberB_All;
                DatabaseManager.prototype.countQuestionVariantAll = countQuestionVariantB_All;
                DatabaseManager.prototype.countQuestionVideoAll = countQuestionVideoB_All;
                DatabaseManager.prototype.selectQuestionById = selectQuestionByIdB;
                DatabaseManager.prototype.searchQuestion = search;

                //theme
                DatabaseManager.prototype.countQuestionByTheme = countQuestionByTheme;
                DatabaseManager.prototype.countQuestionByThemeFree = countQuestionByThemeFree;
                DatabaseManager.prototype.countAnsweredByTheme = countAnsweredByTheme;
                DatabaseManager.prototype.countAnsweredRightByTheme = countAnsweredRightByTheme;
                DatabaseManager.prototype.countAnsweredWrongByTheme = countAnsweredWrongByTheme;
                DatabaseManager.prototype.countQuestionHardByTheme = countQuestionHardByTheme;               
                DatabaseManager.prototype.selectQuestionByTheme = selectQuestionByTheme;
                DatabaseManager.prototype.selectQuestionByThemeFree = selectQuestionByThemeFree;
                DatabaseManager.prototype.selectAllAnsweredByTheme = selectAnsweredByTheme;
                DatabaseManager.prototype.selectAllNotAnsweredByTheme = selectNotAnsweredByTheme;
                DatabaseManager.prototype.selectAllNotAnsweredByThemeFree = selectNotAnsweredByThemeFree;
                DatabaseManager.prototype.selectAllAnswerRightByTheme = selectAnswerRightByTheme;
                DatabaseManager.prototype.selectAllAnswerWrongByTheme = selectAnswerWrongByTheme;
                DatabaseManager.prototype.selectQuestionHardByTheme = selectQuestionHardByTheme;

                //test 
                DatabaseManager.prototype.selectTestPackage = selectTest;
                DatabaseManager.prototype.selectTestPackageFree = selectTestFree;
                DatabaseManager.prototype.checkQuestionVideo = checkQuestionVideo;
                DatabaseManager.prototype.selectQuestionByIdByTest = selectQuestionByIdByTest;
                DatabaseManager.prototype.addTestStart = addTestStart;
                DatabaseManager.prototype.updateTestStart = updateTestStart;
                DatabaseManager.prototype.checkExistsTest = checkExistsTest;
                DatabaseManager.prototype.countTestStart = countTestStart;
                DatabaseManager.prototype.countTestStartRight = countTestStartRight;
                DatabaseManager.prototype.selectAllTestStart = selectAllTestStart;
            }
            return new DatabaseManager();
        }])

})();