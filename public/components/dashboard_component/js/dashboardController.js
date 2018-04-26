angular.module("app").controller("dashboardCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        onInit: function () {
            $rootScope.isLogged = true;
            $http({
                url: $rootScope.baseURL + "api/validateToken",
                method: "POST",
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
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getInitialValues: function () {},
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }
    functions.onInit();

    $scope.functions = {
        printEmployeeChart: function () {
            
        },
        checkAvailableApplicants: function () {
            var availableApplicants = 0;
            for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                if ($rootScope.allApplicants[index].completion === 100) {
                    availableApplicants++;
                }
            }

            if (availableApplicants === 0) {
                return false;
            } else {
                return true;
            }
        },
        checkIfAllHasProjects: function () {
            var employeesWhoHaveProjects = 0;
            for (var index = 0; index < $rootScope.allEmployees; index++) {
                if ($rootScope.allEmployees[index].files.assigned.isAssigned) {
                    employeesWhoHaveProjects++;
                }
            }
            if (employeesWhoHaveProjects === $rootScope.allEmployees.length) {
                return true;
            } else {
                return false;
            }
        },
        checkIfLeaveNotif: function (notif) {
            if ((notif.message).indexOf("to HR") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        checkIfAddRoleNotif: function (notif) {
            if ((notif.message).indexOf("role in") !== -1) {
                return true;
            } else {
                return false;
            }
        },
        startEmployeeBarGraph: function () {
            $scope.emplabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.empseries = ['Hired employees'];
            $scope.empdata = [$rootScope.janCountEmp, $rootScope.febCountEmp, $rootScope.marCountEmp,
                $rootScope.aprCountEmp, $rootScope.mayCountEmp, $rootScope.junCountEmp,
                $rootScope.julCountEmp, $rootScope.augCountEmp, $rootScope.sepCountEmp,
                $rootScope.octCountEmp, $rootScope.novCountEmp, $rootScope.decCountEmp
            ];
            $scope.empoptions = {
                scales: {
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            min: 0,
                            callback: function (value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            };
        },
        startApplicantBarGraph: function () {
            $scope.applabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.appseries = ['Hired applicants'];
            $scope.appdata = [$rootScope.janCountApp, $rootScope.febCountApp, $rootScope.marCountApp,
                $rootScope.aprCountApp, $rootScope.mayCountApp, $rootScope.junCountApp,
                $rootScope.julCountApp, $rootScope.augCountApp, $rootScope.sepCountApp,
                $rootScope.octCountApp, $rootScope.novCountApp, $rootScope.decCountApp
            ];
            $scope.appoptions = {
                scales: {
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            min: 0,
                            callback: function (value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            };
        }
    }
});