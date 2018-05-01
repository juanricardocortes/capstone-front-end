angular.module("app").controller("projectCtrl", function ($scope, $rootScope, $http) {

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
                if ($rootScope.userlogged != null || $rootScope.userlogged != undefined) {
                    if (!$rootScope.userlogged.isAdmin) {
                        if (functions.checkIfProjectLead()) {
                            if (response.data.valid) {
                                functions.onCreate();
                            } else {
                                console.log("BREACH");
                                window.location.href = "#!/login";
                                $rootScope.isLogged = false;
                            }
                        } else {
                            window.location.href = "#!/error";
                        }
                    } else {
                        if (response.data.valid) {
                            functions.onCreate();
                        } else {
                            console.log("BREACH");
                            window.location.href = "#!/login";
                            $rootScope.isLogged = false;
                        }
                    }
                } else {
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
            $scope.projectsSwitchText = "Active Projects";
            $scope.archiveButtonText = "Archive";
            $scope.projectArchiveToggle = false;
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
        checkIfProjectLead: function () {
            var isPL = false;
            var userlogged = $rootScope.userlogged;
            try {
                for (project in userlogged.files.projects) {
                    if (userlogged.files.projects[project].isProjectLead) {
                        isPL = true;
                    }
                }
            } catch (err) {}
            return isPL;
        }
    }

    functions.onInit();

    $scope.functions = {
        showAddProjectModal: function () {
            $rootScope.showAddProject = true;
        },
        toggleProjectArchive: function () {
            if ($scope.projectArchiveToggle) {
                $scope.projectsSwitchText = "Archived Projects";
                $scope.archiveButtonText = "Unarchive";
            } else {
                $scope.projectsSwitchText = "Active Projects";
                $scope.archiveButtonText = "Archive";
            }
        },
        archiveProject: function (project) {
            project.isArchived = !project.isArchived;
            functions.refresh();
            $http({
                url: $rootScope.baseURL + "secure-api/archiveProject",
                method: "POST",
                data: {
                    projects: [project],
                    signature: JSON.stringify($rootScope.userlogged),
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                if (response.data.message === "Success") {
                    var message;
                    if (project.isArchived) {
                        message = " archived";
                    } else {
                        message = " unarchived";
                    }
                    swal({
                        type: 'success',
                        title: project.name + message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        },
        gotoProjectProfile: function (project) {
            $rootScope.selectedProject = project;
            localStorage.setItem("selectedProject", JSON.stringify(project));
            window.location.href = "#!/projects/profile";
        }
    }
});