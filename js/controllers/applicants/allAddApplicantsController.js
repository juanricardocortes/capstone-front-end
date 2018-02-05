angular.module("app").controller("allAddApplicantsCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        $('.collapsible').collapsible();
        console.log("All add applicants controller");
    }

    $scope.hideAllAddApplicantModal = function () {
        $rootScope.showAllAddApplicants = false;
        $rootScope.showAddApplicant = true;
    }

    $scope.viewApplicant = function (applicant) {
        alert(JSON.stringify(applicant));
    }

    $scope.addApplicants = function () {
        $http({
            url: "http://127.0.0.1:9001/secure-api/addApplicant",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                applicants: $rootScope.allApplicantsToBeAdded
            }
        }).then(function (response) {
            console.log("Applicants added" + JSON.stringify(response.data));
            setTimeout(function(){
                $rootScope.showAllAddApplicants = false;
                $rootScope.showAddApplicant = false
                $scope.$apply();
            });
        });
    }
});