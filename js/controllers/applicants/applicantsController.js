angular.module("app").controller("applicantCtrl", function ($scope, $rootScope, $http) {

    if (localStorage.getItem("token")) {
        $rootScope.isLogged = true;
        initialize();
    } else {
        console.log("BREACH");
        window.location.href = "#!/login";
        $rootScope.isLogged = false;
    }

    function initialize() {
        $rootScope.multipleArchive = [];
        $rootScope.currentPage = "Weltanchaung > Applicants"
        $rootScope.applicantTableSwitch = "Active applicants"
        $rootScope.archiveButton = "archive"
        console.log("Applicants controller");
    }

    $scope.showActiveTableToast = function () {
        if ($scope.toggleArchives) {
            $rootScope.applicantTableSwitch = "Archived applicants"
            $rootScope.archiveButton = "undo"
        } else {
            $rootScope.applicantTableSwitch = "Active applicants"
            $rootScope.archiveButton = "archive"
        }
    }

    $scope.showhideArchive = function () {
        $scope.activateToggle = $scope.toggleArchives;
    }

    $scope.gotoApplicantProfile = function (applicant) {
        $rootScope.selectedApplicant = applicant;
        window.location.href = "#!/applicants/profile";
    }

    $scope.showAddApplicantModal = function () {
        $rootScope.showAddApplicant = true;
    }

    $scope.archiveApplicant = function (applicant, event) {
        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
            if (applicant.userkey === $rootScope.allApplicants[index].userkey) {
                $rootScope.allApplicants[index].isArchived = !($rootScope.allApplicants[index].isArchived);
                refresh();
            }
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/archiveApplicant",
            method: "POST",
            data: {
                applicant: [applicant],
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            Materialize.toast(response.data.message, 4000);
        });
        event.stopPropagation();
    }

    $scope.hireApplicant = function (applicant, event) {
        $http({
            url: "http://127.0.0.1:9001/secure-api/addEmployee",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                employees: {
                    email: applicant.email,
                    image: applicant.image,
                    password: applicant.lastname,
                    firstname: applicant.firstname,
                    lastname: applicant.lastname
                }
            }
        });
        event.stopPropagation();
    }

    $scope.showArchiveApplicantModal = function (applicant) {
        $rootScope.showMultipleAddApplicantModal = true;
    }

    $scope.addApplicantToMultipleArchive = function (applicant) {
        if (applicant.archive) {
            $rootScope.multipleArchive.push(applicant);
        } else {
            $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf(applicant), 1);
        }
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
});