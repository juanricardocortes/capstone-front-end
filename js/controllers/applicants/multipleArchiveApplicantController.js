angular.module("app").controller("multipleAddApplicantCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Multiple add applicant controller");
    }

    $scope.hideMultipleAddApplicant = function () {
        $rootScope.showMultipleAddApplicantModal = false;
    }

    $scope.removeApplicant = function (applicant) {
        $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf(applicant), 1);
        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
            if (applicant.userkey === $rootScope.allApplicants[index].userkey) {
                $rootScope.allApplicants[index].archive = false;
            }
        }
        refresh();
    }

    $scope.archiveApplicants = function () {
        for (var outerindex = 0; outerindex < $rootScope.multipleArchive.length; outerindex++) {
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if ($rootScope.multipleArchive[outerindex].userkey === $rootScope.allApplicants[index].userkey) {
                    $rootScope.allApplicants[index].isArchived = !($rootScope.allApplicants[index].isArchived);
                    refresh();
                }
            }
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/archiveApplicant",
            method: "POST",
            data: {
                applicant: $rootScope.multipleArchive,
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            $rootScope.showMultipleAddApplicantModal = false;
            $rootScope.multipleArchive = [];
            refresh();
            Materialize.toast(response.data.message, 4000);
        });
        event.stopPropagation();
    }


    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
})