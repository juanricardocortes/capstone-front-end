angular.module("app").controller("applicantCtrl", function ($scope, $rootScope, $http) {

    onInit();

    function onInit() {
        $rootScope.isLogged = true;
        $http({
            url: $rootScope.baseURL + "api/validateToken",
            method: "POST",
            data: {
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            if (response.data.valid) {
                onCreate();
            } else {
                console.log("BREACH");
                window.location.href = "#!/login";
                $rootScope.isLogged = false;
            }
        });
    }

    $scope.startFeather = function () {
        feather.replace();
        $('.tooltipped').tooltip({
            delay: 1
        });
        return true;
    }

    function onCreate() {
        initializeJavascript();
        getActiveSideBarLink();
        getInitialValues();
        console.log("Applicants controller");
    }

    function initializeJavascript() {
        $('.collapsible').collapsible();
    }

    function getActiveSideBarLink() {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = true;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
    }

    function getInitialValues() {
        $scope.applicantTableSorter = "userkey";
        $rootScope.multipleArchive = [];
        $rootScope.selectAllApplicants = false;
        $scope.toggleArchives = false;
        $rootScope.showHired = false;
        $rootScope.currentPage = "Weltanchaung > Applicants"
        $rootScope.applicantTableSwitch = "Active applicants"
        $rootScope.archiveText = "Archive"
        $rootScope.showhide = "Show";
        $rootScope.archiveModalText = "Archive applicants?"
    }

    $scope.showActiveTableToast = function () {
        if ($scope.toggleArchives) {
            $rootScope.applicantTableSwitch = "Archived applicants"
            $rootScope.archiveText = "Unarchive"
            $rootScope.archiveModalText = "Unarchive applicants?"
        } else {
            $rootScope.applicantTableSwitch = "Active applicants"
            $rootScope.archiveText = "Archive"
            $rootScope.archiveModalText = "Archive applicants?"
        }
    }

    $scope.showhideArchive = function () {
        $scope.activateToggle = $scope.toggleArchives;
    }

    $scope.showHiredApplicants = function () {
        $rootScope.showHired = !$rootScope.showHired;
        if ($rootScope.showHired) {
            $rootScope.showhide = "Hide";
        } else {
            $rootScope.showhide = "Show";
        }
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
            url: $rootScope.baseURL + "secure-api/archiveApplicant",
            method: "POST",
            data: {
                applicant: [applicant],
                token: localStorage.getItem("token")
            }
        }).then(function (response) {
            if (response.data.message === "Success") {
                var message;
                if(applicant.isArchived) {
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
            // Materialize.toast(response.data.message, 4000);
        });
        event.stopPropagation();
    }

    $scope.hireApplicant = function (applicant, event) {
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
    }

    $scope.showArchiveApplicantModal = function (applicant) {
        $rootScope.archiveToggle = $scope.toggleArchives;
        $rootScope.showMultipleAddApplicantModal = true;
    }

    $scope.addApplicantToMultipleArchive = function (applicant) {
        if (applicant.archive) {
            $rootScope.multipleArchive.push(applicant);
        } else {
            $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf(applicant), 1);
            if (applicant.isArchived) {
                $rootScope.unarchiveAllApplicants = false;
            } else {
                $rootScope.archiveAllApplicants = false;
            }
        }
    }

    $scope.archiveAll = function () {
        var toggle;
        if ($rootScope.archiveAllApplicants) {
            toggle = true;
        } else {
            toggle = false;
        }
        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
            if ($rootScope.allApplicants[index].isArchived === $scope.toggleArchives) {
                $rootScope.allApplicants[index].archive = toggle;
                if ($rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired) && !(containsObject($rootScope.allApplicants[index], $rootScope.multipleArchive))) {
                    $rootScope.multipleArchive.push($rootScope.allApplicants[index]);
                } else if (!$rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired)) {
                    $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf($rootScope.allApplicants[index]), 1);
                }
            }
        }
    }

    $scope.unarchiveAll = function () {
        var toggle;
        if ($rootScope.unarchiveAllApplicants) {
            toggle = true;
        } else {
            toggle = false;
        }
        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
            if ($rootScope.allApplicants[index].isArchived === $scope.toggleArchives) {
                $rootScope.allApplicants[index].archive = toggle;
                if ($rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired) && !(containsObject($rootScope.allApplicants[index], $rootScope.multipleArchive))) {
                    $rootScope.multipleArchive.push($rootScope.allApplicants[index]);
                } else if (!$rootScope.allApplicants[index].archive && !($rootScope.allApplicants[index].hired)) {
                    $rootScope.multipleArchive.splice($rootScope.multipleArchive.indexOf($rootScope.allApplicants[index]), 1);
                }
            }
        }
    }

    $scope.sortByKey = function(){
        $scope.applicantTableSorter = "userkey";
    }

    $scope.sortByEmail = function(){
        $scope.applicantTableSorter = "email";
    }

    $scope.sortByRefNum = function(){
        $scope.applicantTableSorter = "referenceNumber";
    }

    $scope.sortByStatus = function(){
        $scope.applicantTableSorter = "Status";
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