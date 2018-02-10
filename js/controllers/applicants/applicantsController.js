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
        $scope.allApplicants = [];
        $rootScope.currentPage = "Weltanchaung > Applicants"
        console.log("Applicants controller");
        onListeners();
    }

    function onListeners() {
        firebase.database().ref("HRMS_Storage/Applicants/").on("child_added", function (snapshot) {
            setTimeout(function () {
                $scope.allApplicants.push(snapshot.val());
                $scope.$apply();
            });
        });

        firebase.database().ref("HRMS_Storage/Applicants/").on("child_removed", function (snapshot) {
            setTimeout(function () {
                $scope.allApplicants.splice($scope.allApplicants.indexOf(snapshot.val()), 1);
                $scope.$apply();
            });
        });

        firebase.database().ref("HRMS_Storage/Applicants/").on("child_changed", function (snapshot) {
            for (var index = 0; index < $scope.allApplicants.length; index++) {
                if ($scope.allApplicants[index].userkey === snapshot.val().userkey) {
                    $scope.allApplicants[index] = snapshot.val();
                    break;
                }
            }
            setTimeout(function () {
                $scope.$apply();
            });
        });
    }

    $scope.gotoApplicantProfile = function (applicant) {
        $rootScope.selectedApplicant = applicant;
        window.location.href = "#!/applicants/profile";
    }

    $scope.showAddApplicantModal = function () {
        $rootScope.showAddApplicant = true;
    }

    $scope.archiveApplicant = function (applicant, event) {
        event.stopPropagation();
        for (var index = 0; index < $scope.allApplicants.length; index++) {
            if (applicant.userkey === $scope.allApplicants[index].userkey) {
                $scope.allApplicants[index].isArchived = true;
                refresh();
            }
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/archiveApplicant",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                userkey: applicant.userkey,
                isArchived: false,
                email: applicant.email
            }
        }).then(function (response) {
            Materialize.toast(response.data.message, 4000);
        });
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
});