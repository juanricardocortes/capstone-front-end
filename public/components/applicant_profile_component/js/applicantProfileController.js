angular.module("app").controller("applicantProfileCtrl", function ($scope, $rootScope, $http) {

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

    function onCreate() {
        if (checkIfSelected()) {
            getInitialValues();
            getActiveSideBarLink();
        } else {
            window.location.href = "#!/applicants"
        }
        console.log("Applicant profile controller");
    }

    function getInitialValues() {
        $rootScope.selectedApplicant = JSON.parse(localStorage.getItem("selectedApplicant"));
    }

    function getActiveSideBarLink() {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = true;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
    }

    function checkIfSelected() {
        if (localStorage.getItem("selectedApplicant")) {
            return true;
        } else {
            return false;
        }
    }

    function completeRequirement(key, requirement) {
        swal({
            title: "Are you sure?",
            text: "Complete " + requirement.name + "?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4ff783',
            cancelButtonColor: '#f74f6f',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
        }).then(function (result) {
            if (result.value) {
                requirement.status = "complete";
                updateRequirement(key, requirement);
            } else if (
                result.dismiss === swal.DismissReason.cancel
            ) {
                swal({
                    title: "Cancelled",
                    text: "Action cancelled",
                    type: "error",
                    confirmButtonColor: "#4fc3f7"
                })
            }
        })
    }

    function updateRequirement(key, requirement) {
        alert($rootScope.selectedApplicant.completion + " " + Object.keys($rootScope.selectedApplicant.requirements).length)
        $http({
            url: $rootScope.baseURL + "secure-api/updateRequirements",
            method: "POST",
            data: {
                status: "complete",
                token: localStorage.getItem("token"),
                requirementKey: key,
                requirementName: requirement.name,
                applicantKey: $rootScope.selectedApplicant.userkey,
                completion: $rootScope.selectedApplicant.completion,
                totalRequirements: Object.keys($rootScope.selectedApplicant.requirements).length
            }
        }).then(function (response) {
            swal({
                title: "Success",
                text: response.data.message,
                type: "success",
                confirmButtonColor: "#4fc3f7"
            })
        })
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }

    $scope.displayInformation = function (title, message) {
        swal(title, message);
    }

    $scope.toggleRequirement = function (key, requirement) {
        if (requirement.status === "incomplete") {
            completeRequirement(key, requirement);
        } else {
            swal({
                title: "Error",
                text: "Requirement already completed!",
                type: "error",
                confirmButtonColor: "#4fc3f7"
            })
        }
    }
});