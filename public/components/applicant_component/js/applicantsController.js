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
        $('.tooltipped').tooltip({
            delay: 50
        });
        $rootScope.multipleArchive = [];
        $rootScope.showHired = false;
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

    $scope.showHiredApplicants = function () {
        $rootScope.showHired = !$rootScope.showHired;
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
                employees: [{
                    email: applicant.email,
                    image: applicant.image,
                    password: applicant.lastname,
                    firstname: applicant.firstname,
                    lastname: applicant.lastname,
                    applicantkey: applicant.userkey
                }],
                hireFrom: "applicants"
            }
        }).then(function (response) {
            alert(response.data.message);
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
            $scope.selectAllApplicants = false;
        }
    }

    $scope.checkAll = function () {
        var toggle;
        if ($scope.selectAllApplicants) {
            toggle = true;
        } else {
            toggle = false;
        }
        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
            $rootScope.allApplicants[index].archive = toggle;
            if ($rootScope.allApplicants[index].archive && !(containsObject($rootScope.allApplicants[index], $rootScope.multipleArchive))) {
                $rootScope.multipleArchive.push($rootScope.allApplicants[index]);
            } else if (!$rootScope.allApplicants[index].archive) {
                $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf($rootScope.allApplicants[index]), 1);
            }
        }
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                return true;
            }
        }
        return false;
    }



});