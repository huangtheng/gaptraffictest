(function () {
  "use strict";
  angular.module("TrafficLaws.SearchController", ['ui.router'])
  .controller('SearchCtrl', function ($scope, $rootScope, $q, db, $timeout, $state,$sce, $http) {
      $scope.listSearch = [];
      $scope.onText = false;
      $rootScope.isBack = true;
      $rootScope.isSearch = true;
      $rootScope.isClear = false;
      var utils = new Utils($http);
       $scope.searchInput = "";
       if ($rootScope.language == 0) {
           $rootScope.titleAll = $rootScope.Menu.vn.search_question;
       }
       else {
           $rootScope.titleAll = $rootScope.Menu.de.search_question;
       } 
       $scope.$on("changeLanguage", function (event) {
          $scope.isLanguage = $rootScope.language;
           if ($rootScope.isSearch) {
               if ($rootScope.language == 0) {
                   $rootScope.titleAll = $rootScope.Menu.vn.search_question;
               }
               else {
                   $rootScope.titleAll = $rootScope.Menu.de.search_question;
               }

               for (var i = 0; i < $scope.listSearch.length; i++) {
                   if ($rootScope.language == 0) $scope.listSearch[i].ZQUESTIONTEMP = $scope.listSearch[i].ZQUESTIONVN;
                   else $scope.listSearch[i].ZQUESTIONTEMP = $scope.listSearch[i].ZQUESTION;
               }
           }             
       });

      $scope.clearTextSearch = function () {
          $scope.searchInput = "";
          $scope.listSearch = [];
      }

      var scroller = null;

      $scope.changeSearch = function (event) {
        searchQuestions();
        if ($scope.searchInput.length > 0) $scope.onText = true; else $scope.onText = false;
      }

      $scope.enterSearch = function (event) {
        searchQuestions();
      }

      function searchQuestions() {
        if ($scope.searchInput.length > 0 && $scope.searchInput.length % 2 == 0) {
          db.searchQuestion($scope.searchInput, $rootScope.isActive).then(function (data) {
              $scope.listSearch = [];
              if (data != null) {
                  for (var i = 0; i < data.length; i++) {
                      var item = new Object();
                      var k = data.item(i).ZQUESTION.indexOf("<br");
                      if (k > -1) {
                          data.item(i).ZQUESTION = data.item(i).ZQUESTION.substring(0, k);
                      }
                      var length = data.item(i).ZQUESTION.length > 55;
                      if (length) {
                          data.item(i).ZQUESTION = data.item(i).ZQUESTION.substring(0, 55) + "...";
                      }

                      var j = data.item(i).ZQUESTIONVN.indexOf("<br");
                      if (k > -1) {
                          data.item(i).ZQUESTIONVN = data.item(i).ZQUESTIONVN.substring(0, j);
                      }
                      var length = data.item(i).ZQUESTIONVN.length > 55;
                      if (length) {
                          data.item(i).ZQUESTIONVN = data.item(i).ZQUESTIONVN.substring(0, 55) + "...";
                      }

                      item.ZQUESTION = data.item(i).ZQUESTION != null ? $sce.trustAsHtml(utils.convertText(data.item(i).ZQUESTION)) : null;
                      item.ZQUESTIONVN = data.item(i).ZQUESTIONVN != null ? $sce.trustAsHtml(data.item(i).ZQUESTIONVN) : null;
                      if ($rootScope.language == 0) item.ZQUESTIONTEMP = item.ZQUESTIONVN;
                      else item.ZQUESTIONTEMP = item.ZQUESTION;
                      item.ZID = data.item(i).ZID;
                      item.ZFRAGENKATALOG = data.item(i).ZFRAGENKATALOG;
                      $scope.listSearch.push(item);
                  }
                 
                  if (!$scope.$$phase) {
                      $scope.$apply();
                  } else {
                      $timeout(function () { $scope.$apply(); }, 500);
                  }

              }
          });
        }          
        else
        {
          $scope.listSearch = [];
        }
      }

      $scope.openQuestion = function (event) {      
        $rootScope.isSearch = false;  
        $state.go('questionSearch', { ZId: event}, {});
      };
  })
})();