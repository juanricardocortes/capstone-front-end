angular.module("app").controller("projectCtrl", function ($scope, $rootScope, $http) {

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
        getInitialValues();
        getActiveSideBarLink();
    }

    function getInitialValues() {
        $scope.projectsSwitchText = "Archived Projects";
        $scope.archiveButtonText = "Archive";
        $scope.projectArchiveToggle = false;
    }

    function getActiveSideBarLink() {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = true;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = false;
        $rootScope.profileactive = false;
    }

    $scope.showAddProjectModal = function () {
        $rootScope.addProject = true;
    }

    $scope.toggleProjectArchive = function () {
        if ($scope.projectArchiveToggle) {
            $scope.projectsSwitchText = "Active Projects";
            $scope.archiveButtonText = "Unarchive";
        } else {
            $scope.projectsSwitchText = "Archived Projects";
            $scope.archiveButtonText = "Archive";
        }
    }

    $scope.archiveProject = function () {

    }

});