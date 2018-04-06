angular.module("app").controller("leaveRequestsCtrl", function ($scope, $http, $rootScope) {

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
            // functions.jsInitialize();
            functions.getInitialValues();
            functions.getActiveSideBarLink();
            functions.createCalendar();
            functions.refreshCalendar();
        },
        createCalendar: function () {
            $rootScope.calendarAttributes = {
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                navLinks: true,
                header: {
                    right: 'prev,next today',
                    left: 'title'
                },
                dayClick: function (date, jsEvent, view) {
                    $scope.functions.viewByDay(date.format());
                }
            }
        },
        // jsInitialize: function () {
        //     $('.datepicker').datepicker();
        //     $('.tooltipped').tooltip();
        //     $('.fixed-action-btn').floatingActionButton();
        // },
        getInitialValues: function () {
            $rootScope.calendarAttributes = {};
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = false;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = true;
            $rootScope.profileactive = false;
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        refreshCalendar: function () {
            $rootScope.calendar = $('#calendar').fullCalendar($rootScope.calendarAttributes);
        }
    }
    functions.onInit();

    $scope.functions = {
        viewByDay: function (date) {
            if (date) {
                $('#calendar').fullCalendar('changeView', 'agendaDay', date);
            } else {
                $('#calendar').fullCalendar('changeView', 'agendaDay');
            }
        },
        viewByWeek: function () {
            $('#calendar').fullCalendar('changeView', 'agendaWeek');
        },
        viewByMonth: function () {
            $('#calendar').fullCalendar('changeView', 'month');
        }
    }
});