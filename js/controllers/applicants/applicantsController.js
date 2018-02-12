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
        $rootScope.currentPage = "Weltanchaung > Applicants"
        console.log("Applicants controller");
        Materialize.toast("Active applicants", 1000);
    }

    $scope.showActiveTableToast = function () {
        if ($scope.toggleArchives) {
            Materialize.toast("Archived applicants", 1000);
        } else {
            Materialize.toast("Active applicants", 1000);
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
        var isArchived;
        for (var index = 0; index < $scope.allApplicants.length; index++) {
            if (applicant.userkey === $scope.allApplicants[index].userkey) {
                $scope.allApplicants[index].isArchived = !($scope.allApplicants[index].isArchived);
                isArchived = ($scope.allApplicants[index].isArchived)
                refresh();
            }
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/archiveApplicant",
            method: "POST",
            data: {
                applicant: [applicant],
                token: localStorage.getItem("token"),
                isArchived: isArchived,
            }
        }).then(function (response) {
            Materialize.toast(response.data.message, 4000);
        });
        event.stopPropagation();
    }

    $scope.showArchiveApplicantModal = function (applicant) {
        alert(JSON.stringify(applicant));
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
});