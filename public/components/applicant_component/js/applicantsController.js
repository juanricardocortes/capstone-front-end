angular.module("app").controller("applicantCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                data: {
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                if (response.data.valid) {
                    functions.onCreate();
                } else {
                    console.log("BREACH");
                    window.location.href = "#!/login";
                    $rootScope.isLogged = false;
                }
            });
        },
        onCreate: function () {
            functions.getActiveSideBarLink();
            functions.getInitialValues();
            console.log("Applicants controller");
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = true;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getInitialValues: function () {
            $scope.applicantTableSorter = "userkey";
            $rootScope.multipleArchiveApplicant = [];
            $rootScope.selectAllApplicants = false;
            $scope.toggleArchives = false;
            $rootScope.showHired = false;
            $rootScope.currentPage = "Weltanchaung > Applicants"
            $rootScope.applicantTableSwitch = "Active applicants"
            $rootScope.archiveText = "Archive"
            $rootScope.showhide = "Show";
            $rootScope.archiveModalText = "Archive applicants?"
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        containsObject: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
                    return true;
                }
            }
            return false;
        }

    }

    functions.onInit();
    
    $scope.functions = {
        showActiveTableToast: function () {
            if ($scope.toggleArchives) {
                $rootScope.applicantTableSwitch = "Archived applicants"
                $rootScope.archiveText = "Unarchive"
                $rootScope.archiveModalText = "Unarchive applicants?"
            } else {
                $rootScope.applicantTableSwitch = "Active applicants"
                $rootScope.archiveText = "Archive"
                $rootScope.archiveModalText = "Archive applicants?"
            }
        },
        showHideArchive: function () {
            $scope.activateToggle = $scope.toggleArchives;
        },
        showHiredApplicants: function () {
            $rootScope.showHired = !$rootScope.showHired;
            if ($rootScope.showHired) {
                $rootScope.showhide = "Hide";
            } else {
                $rootScope.showhide = "Show";
            }
        },
        gotoApplicantProfile: function (applicant) {
            $rootScope.selectedApplicant = applicant;
            localStorage.setItem("selectedApplicant", JSON.stringify(applicant));
            window.location.href = "#!/applicants/profile";
        },
        showAddApplicantModal: function () {
            $rootScope.showAddApplicant = true;
        },
        archiveApplicant: function (applicant, event) {
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if (applicant.userkey === $rootScope.allApplicants[index].userkey) {
                    $rootScope.allApplicants[index].isArchived = !($rootScope.allApplicants[index].isArchived);
                    functions.refresh();
                }
            }
            $http({
                url: $rootScope.baseURL + "secure-api/archiveApplicant",
                method: "POST",
                data: {
                    applicant: [applicant],
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                if (response.data.message === "Success") {
                    var message;
                    if (applicant.isArchived) {
                        message = " archived";
                    } else {
                        message = " unarchived";
                    }
                    swal({
                        type: 'success',
                        title: applicant.firstname + message,
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
            event.stopPropagation();
        },
        hireApplicant: function (applicant, event) {
            $http({
                url: $rootScope.baseURL + "secure-api/addEmployee",
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
        },
        showArchiveApplicantModal: function (applicant) {
            $rootScope.archiveToggle = $scope.toggleArchives;
            $rootScope.showMultipleAddApplicantModal = true;
        },
        addApplicantToMultipleArchive: function (applicant) {
            if (applicant.archive) {
                $rootScope.multipleArchiveApplicant.push(applicant);
            } else {
                $rootScope.multipleArchiveApplicant.splice($rootScope.multipleArchiveApplicant.indexOf(applicant), 1);
                if (applicant.isArchived) {
                    $rootScope.unarchiveAllApplicants = false;
                } else {
                    $rootScope.archiveAllApplicants = false;
                }
            }
        },
        archiveAll: function () {
            var toggle;
            if ($rootScope.archiveAllApplicants) {
                toggle = true;
            } else {
                toggle = false;
            }
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if ($rootScope.allApplicants[index].isArchived === $scope.toggleArchives) {
                    $rootScope.allApplicants[index].archive = toggle;
                    if ($rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired) && !(functions.containsObject($rootScope.allApplicants[index], $rootScope.multipleArchiveApplicant))) {
                        $rootScope.multipleArchiveApplicant.push($rootScope.allApplicants[index]);
                    } else if (!$rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired)) {
                        $rootScope.multipleArchiveApplicant.splice($rootScope.multipleArchiveApplicant.indexOf($rootScope.allApplicants[index]), 1);
                    }
                }
            }
        },
        unarchiveAll: function () {
            var toggle;
            if ($rootScope.unarchiveAllApplicants) {
                toggle = true;
            } else {
                toggle = false;
            }
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if ($rootScope.allApplicants[index].isArchived === $scope.toggleArchives) {
                    $rootScope.allApplicants[index].archive = toggle;
                    if ($rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired) && !(functions.containsObject($rootScope.allApplicants[index], $rootScope.multipleArchiveApplicant))) {
                        $rootScope.multipleArchiveApplicant.push($rootScope.allApplicants[index]);
                    } else if (!$rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired)) {
                        $rootScope.multipleArchiveApplicant.splice($rootScope.multipleArchiveApplicant.indexOf($rootScope.allApplicants[index]), 1);
                    }
                }
            }
        },
        sortByKey: function () {
            $scope.applicantTableSorter = "userkey";
        },
        sortByEmail: function () {
            $scope.applicantTableSorter = "email";
        },
        sortByRefNum: function () {
            $scope.applicantTableSorter = "referenceNumber";
        },
        sortByStatus: function () {
            $scope.applicantTableSorter = "Status";
        }
    }
});