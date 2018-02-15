angular.module("app").controller("applicantInformationCtrl", function ($scope, $rootScope, $http) {

   initialize();

    function initialize() {
        console.log($rootScope.selectedApplicant);
        console.log("Applicant information controller");
    }

});