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
        firebase.database().ref("HRMS_Storage/Applicants/").on("child_added", function (snapshot) {
            $scope.allApplicants.push(snapshot.val());
            setTimeout(function(){
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
});