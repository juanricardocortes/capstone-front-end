angular.module("app").controller("profileCtrl", function ($scope, $rootScope, $http, queue) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            queue({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
                cache : true,
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged)
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
            functions.getInitialValues();
            functions.getActiveSideBarLink();
            console.log("Personal profile controller");
        },
        getInitialValues: function () {
            $scope.showProfile = true;
            $scope.showLeaves = true;
            $scope.showProjects = true;
            $rootScope.selectedEmployee = JSON.parse(localStorage.getItem("selectedEmployee"));
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = true;
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.onInit();

    $scope.functions = {
        showChangePassModal: function () {
            $rootScope.showChangePass = true;
        },
        displayInformation: function (title, message) {
            swal(title, message);
        },
    }
});