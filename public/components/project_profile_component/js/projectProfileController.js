angular.module("app").controller("projectProfileCtrl", function ($scope, $rootScope, $http) {

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
        getInitialValues: function () {
            $rootScope.selectedProject = JSON.parse(localStorage.getItem("selectedProject"));
        },
        refresh: function () {
            setTimeout(function () {
                $scope.$apply();
            });
        },
        getActiveSideBarLink: function () {
            $rootScope.dashboardactive = false;
            $rootScope.employeeactive = false;
            $rootScope.projectsactive = true;
            $rootScope.applicantsactive = false;
            $rootScope.leavesactive = false;
            $rootScope.profileactive = false;
        },
        getEmployee: function (employee) {
            $http({
                url: $rootScope.baseURL + "secure-api/getEmployee",
                method: "POST",
                data: {
                    signature: JSON.stringify($rootScope.userlogged),
                    token: localStorage.getItem("token"),
                    userkey: employee.userkey
                }
            }).then(function (response) {
                $rootScope.selectedEmployee = response.data.employee;
                localStorage.setItem("selectedEmployee", JSON.stringify(response.data));
                window.location.href = "#!/employees/profile";
            });
        },
        getProjectReport: function () {
            
        }
    }

    functions.onInit();

    $scope.functions = {
        printMyProfile: function () {
            $(document).ready(function () {
                functions.getProjectReport();
            });
        },
        removeEmployee: function (slot) {
            $http({
                url: $rootScope.baseURL + "secure-api/removeMember",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged),
                    employee: slot.currentholder,
                    slotkey: slot.slotkey,
                    projectkey: $rootScope.selectedProject.projectkey
                }
            }).then(function (response) {
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        },
        gotoEmployeeProfile: function (employee) {
            functions.getEmployee(employee);
        },
        showAddEmployeeModal: function (value) {
            $rootScope.selectedSlot = value;
            $rootScope.showAddEmployee = true;
        },
        showAddShiftModal: function () {
            $rootScope.showAddShift = true;
        },
        showAddSlotModal: function () {
            $rootScope.showAddSlot = true;
        },
        showAddPLModal: function () {
            $rootScope.showAddPL = true;
        },
        showAddMemberModal: function () {
            $rootScope.showAddMember = true;
        },
        endProject: function () {

        }
    }
});