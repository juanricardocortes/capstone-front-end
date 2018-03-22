angular.module("app").controller("leaveRequestsCtrl", function ($scope, $http, $rootScope) {

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
        createCalendar();
        refreshCalendar();
    }

    function createCalendar() {
        $rootScope.calendarAttributes = {
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            navLinks: true,
            header: {
                right: 'prev,next today',
                left: 'title'
            },
            dayClick: function (date, jsEvent, view) {
                $scope.viewByDay(date.format());
                // $(this).css('background-color', 'red');
            }
        }
    }

    function getInitialValues() {
        $rootScope.calendarAttributes = {};
    }

    function getActiveSideBarLink() {
        $rootScope.dashboardactive = false;
        $rootScope.employeeactive = false;
        $rootScope.projectsactive = false;
        $rootScope.applicantsactive = false;
        $rootScope.leavesactive = true;
        $rootScope.profileactive = false;
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }

    function refreshCalendar() {
        $rootScope.calendar = $('#calendar').fullCalendar($rootScope.calendarAttributes);
    }

    $scope.viewByDay = function (date) {
        if (date) {
            $('#calendar').fullCalendar('changeView', 'agendaDay', date);
        } else {
            $('#calendar').fullCalendar('changeView', 'agendaDay');
        }
    }

    $scope.viewByWeek = function () {
        $('#calendar').fullCalendar('changeView', 'agendaWeek');
    }

    $scope.viewByMonth = function () {
        $('#calendar').fullCalendar('changeView', 'month');
    }
});