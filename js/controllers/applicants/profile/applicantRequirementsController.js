angular.module("app").controller("applicantRequirementsCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Applicant requirements controller");
        console.log(JSON.stringify($rootScope.selectedApplicant));
    }

    $scope.updateRequirement = function (key, status) {
        if (status == "complete") {
            status = "incomplete"
        } else {
            status = "complete"
        }
        $http({
            url: "http://127.0.0.1:9001/secure-api/updateRequirements",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                applicantKey: $rootScope.selectedApplicant.userkey,
                requirementKey: key,
                status: status
            }
        }).then(function (response) {
            toggleRequirementListener(response);
        });
    }

    function toggleRequirementListener(response) {
        firebase.database().ref("HRMS_Storage/Applicants/").on("child_changed", function (snapshot) {
            setTimeout(function () {
                $rootScope.selectedApplicant = snapshot.val();
                $scope.$apply();
                Materialize.toast(response.data.message, 4000);
            });
        });
    }
});