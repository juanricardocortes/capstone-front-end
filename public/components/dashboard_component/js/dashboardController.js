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
            functions.startChart();
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = true;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getInitialValues: function () {

        },
        startChart: function () {
            console.log("STARTING CHART");
            $scope.data = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                        fillColor: 'rgba(220,220,220,0.5)',
                        strokeColor: 'rgba(220,220,220,1)',
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        fillColor: 'rgba(151,187,205,0.5)',
                        strokeColor: 'rgba(151,187,205,1)',
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            };
            $scope.options = {
                // scales: {
                //     xAxes: [{
                //         stacked: true
                //     }],
                //     yAxes: [{
                //         stacked: true
                //     }]
                // }
            };

            functions.refresh();
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        }

    }
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
        functions.onInit();
});