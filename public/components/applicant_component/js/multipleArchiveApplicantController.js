angular.module("app").controller("multipleAddApplicantCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        initialize: function () {
            console.log("Multiple add applicant controller");
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.initialize();

    $scope.functions = {
        hideMultipleArchiveApplicant: function () {
            $rootScope.showMultipleArchiveApplicantModal = false;
        },
        removeApplicant: function (applicant) {
            $rootScope.multipleArchiveApplicant.splice($rootScope.multipleArchiveApplicant.indexOf(applicant), 1);
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if (applicant.userkey === $rootScope.allApplicants[index].userkey) {
                    $rootScope.allApplicants[index].archive = false;
                    if ($rootScope.allApplicants[index].isArchived) {
                        $rootScope.unarchiveAllApplicants = false;
                    } else {
                        $rootScope.archiveAllApplicants = false;
                    }
                }
            }
            functions.refresh();
        },
        archiveApplicants: function () {
            for (var outerindex = 0; outerindex < $rootScope.multipleArchiveApplicant.length; outerindex++) {
                for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                    if ($rootScope.multipleArchiveApplicant[outerindex].userkey === $rootScope.allApplicants[index].userkey &&
                        $rootScope.allApplicants[index].isArchived === $rootScope.archiveApplicantToggle) {
                        // $rootScope.multipleArchiveApplicant.splice($rootScope.multipleArchiveApplicant.indexOf($rootScope.allApplicants[index]), 1);
                        $rootScope.allApplicants[index].isArchived = !($rootScope.allApplicants[index].isArchived);
                        $rootScope.allApplicants[index].archive = false;
                        functions.refresh();
                    }
                }
            }
            queue({
                url: $rootScope.baseURL + "secure-api/archiveApplicant",
                method: "POST",
                data: {
                    applicant: $rootScope.multipleArchiveApplicant,
                    signature: JSON.stringify($rootScope.userlogged),
                    cache : true,
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                $rootScope.showMultipleArchiveApplicantModal = false;
                functions.refresh();
                M.toast({
                    html: response.data.message,
                    displayLength: 2500
                });
            });
            $rootScope.unarchiveAllApplicants = false;
            $rootScope.archiveAllApplicants = false;
            $rootScope.multipleArchiveApplicant = [];
            event.stopPropagation();
        }
    }
});