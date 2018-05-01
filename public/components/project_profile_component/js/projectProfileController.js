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
        getProjectMembers: function () {
            var members = [];
            members.push(["Position", "Employee", "Schedule"]);
            for (key in $rootScope.selectedProject.slots) {
                if ($rootScope.selectedProject.slots[key].currentholder) {
                    members.push([$rootScope.selectedProject.slots[key].role,
                        $rootScope.selectedProject.slots[key].currentholder.email,
                        $rootScope.selectedProject.slots[key].shiftdetails.time
                    ]);
                } else {
                    members.push([$rootScope.selectedProject.slots[key].role,
                        {
                            text: "No employee assigned",
                            style: "graycolor"
                        },
                        $rootScope.selectedProject.slots[key].shiftdetails.time
                    ]);
                }
            }
            return members;
        },
        getProjectSchedules: function () {
            var schedules = [];
            schedules.push(["Schedule"]);
            for (key in $rootScope.selectedProject.schedule.shifts) {
                schedules.push([$rootScope.selectedProject.schedule.shifts[key].time]);
            }
            return schedules;
        },
        getProjectReport: function () {
            var docDefinition = {
                content: [{
                        text: "Weltanchaung Corporation",
                        style: "header"
                    },
                    {
                        text: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        style: "subtitle"
                    },
                    {
                        text: $rootScope.selectedProject.name,
                        style: "subheader"
                    },
                    {
                        text: "Project leader: " + $rootScope.selectedProject.projectlead.email,
                        style: "subtitle"
                    },
                    {
                        text: "Start date: " + $rootScope.selectedProject.schedule.dates.startDate,
                        style: "subtitle"
                    },
                    {
                        text: "Schedules",
                        style: "subsubheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ["*"],
                            body: functions.getProjectSchedules()
                        }
                    },
                    {
                        text: "Members",
                        style: "subsubheader"
                    },
                    {
                        style: "tableExample",
                        table: {
                            widths: ["*", "*", "*"],
                            body: functions.getProjectMembers()
                        }
                    }
                ],
                styles: $rootScope.reportStyles

            };
            pdfMake.createPdf(docDefinition).download("project_" + $rootScope.selectedProject.name + ".pdf");
        },
        confirmEndProject: function () {
            $http({
                url: $rootScope.baseURL + "secure-api/endProject",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    signature: JSON.stringify($rootScope.userlogged),
                    project: $rootScope.selectedProject,
                }
            }).then(function (response) {
                swal({
                    type: response.data.success,
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            })
        }
    }

    functions.onInit();

    $scope.functions = {
        printProject: function () {
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
                    projectkey: $rootScope.selectedProject.projectkey,
                    projectname: $rootScope.selectedProject.name
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
            swal({
                title: "Are you sure?",
                text: "End project " + $rootScope.selectedProject.name + "?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4ff783',
                cancelButtonColor: '#f74f6f',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    functions.confirmEndProject();
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
    }
});