(function () {
    "use strict";
    angular.module("TrafficLaws.Statistic2Controller", ['ngMaterial', "chart.js", 'ui.router', 'ngAnimate', 'TrafficLaws.databaseService'])
    .controller('Statistic2Ctrl', function ($scope, $rootScope, $timeout, $q, $state, $window, db) {
        $rootScope.isBack = true;
        $rootScope.statistic2 = true;
        var wrapcontent = document.getElementById("wrapContent1");
        wrapcontent.setAttribute('class', 'pt-page-moveFromRightFade');
        wrapcontent.style.left = "1%";
        $scope.hasmade = { title: null, number: 0 };
        $scope.testBestanden = { title: null, number: 0, percent: 0 };
        $scope.wrongPoint = { title: null};
        $scope.advancedPoint = { title: null };
        $scope.basicPoint = { title: null };
        $scope.allBestanden = { title: null };
        var countTestBestanden = 0;
        $scope.listData = [];        
        init();
        function init() {
            if ($rootScope.language == 0) {
                $rootScope.titleAll = $rootScope.Menu.vn.statistic;
                $scope.divider1 = $rootScope.Menu.vn.test_klass;
                $scope.hasmade.title = $rootScope.Menu.vn.hasmade;
                $scope.testBestanden.title = $rootScope.Menu.vn.bestanden;
                $scope.wrongPoint.title = $rootScope.Menu.vn.wrong_point;
                $scope.advancedPoint.title = $rootScope.Menu.vn.advanced_question;
                $scope.basicPoint.title = $rootScope.Menu.vn.basic_question;
                $scope.allBestanden.title = $rootScope.Menu.vn.all_rick;
                $scope.noTest = $rootScope.Menu.vn.no_test;
                $scope.version = $rootScope.Menu.vn.version;
                $scope.licenceApp = $rootScope.Menu.vn.licence;
            }
            else {
                $rootScope.titleAll = $rootScope.Menu.de.statistic;
                $scope.divider1 = $rootScope.Menu.de.test_klass;
                $scope.hasmade.title = $rootScope.Menu.de.hasmade;
                $scope.testBestanden.title = $rootScope.Menu.de.bestanden;
                $scope.wrongPoint.title = $rootScope.Menu.de.wrong_point;
                $scope.advancedPoint.title = $rootScope.Menu.de.advanced_question;
                $scope.basicPoint.title = $rootScope.Menu.de.basic_question;
                $scope.allBestanden.title = $rootScope.Menu.de.all_rick;
                $scope.noTest = $rootScope.Menu.de.no_test;
                $scope.version = $rootScope.Menu.de.version;
                $scope.licenceApp = $rootScope.Menu.de.licence;
            }
        }        

        $scope.$on("changeLanguage", function (event) {
            init();
        });
        $scope.$on("reloadStatistic", function (event) {
            reloadStatistic();
        });
        reloadStatistic();
        function reloadStatistic() {
            db.countTestStart().then(function (data) {
                if (data != null) {
                    $scope.hasmade.number = data;
                    db.selectAllTestStart().then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var obj = new Object();
                            var pointError = data.item(i).ZBASICERRORPOINTS + data.item(i).ZEXTENDEDERRORPOINTS;
                            var basicPoint = data.item(i).ZBASICERRORPOINTS;
                            var advancedPoint = data.item(i).ZEXTENDEDERRORPOINTS;
                            if (Math.max(window.screen.height, window.screen.width) > 1124) {
                                obj.number = pointError;
                                obj.isResult = data.item(i).ZRESULT == 1 ? true : false;
                                obj.basicPoint = db.percentCalculation(basicPoint, pointError) * 567 / 100;
                                obj.advancedPoint = db.percentCalculation(advancedPoint, pointError) * 567 / 100;
                                obj.pointError = obj.basicPoint + obj.advancedPoint;
                            }
                            else if (Math.max(window.screen.height, window.screen.width) > 481) {
                                obj.number = pointError;
                                obj.isResult = data.item(i).ZRESULT == 1 ? true : false;
                                obj.basicPoint = db.percentCalculation(basicPoint, pointError) * 187 / 100;
                                obj.advancedPoint = db.percentCalculation(advancedPoint, pointError) * 187 / 100;
                                obj.pointError = obj.basicPoint + obj.advancedPoint;
                            }
                            else if (Math.max(window.screen.height, window.screen.width) < 481) {
                                obj.number = pointError;
                                obj.isResult = data.item(i).ZRESULT == 1 ? true : false;
                                obj.basicPoint = db.percentCalculation(basicPoint, pointError) * 157 / 100;
                                obj.advancedPoint = db.percentCalculation(advancedPoint, pointError) * 157 / 100;
                                obj.pointError = obj.basicPoint + obj.advancedPoint;
                            }
                            $scope.listData.push(obj);

                            //$timeout(function () {
                            //    var scroller = new TouchScroll(document.querySelector("#wrapScrollChart"), { elastic: true });
                            //}, 200);
                        }

                        db.countTestStartRight().then(function (data) {
                            if (data != null) {
                                $scope.testBestanden.number = data;
                                $scope.testBestanden.percent = db.percentCalculation($scope.testBestanden.number, $scope.hasmade.number);
                            }
                        });
                    });
                }

            });
        }        
           
    })
})();