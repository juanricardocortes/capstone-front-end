angular.module("app", ["ngRoute", "blockUI", 'angular-toArrayFilter', 'chart.js'])

    .config(function ($routeProvider, blockUIConfig) {
        blockUIConfig.templateUrl = "common/views/blockui_spinner.html";
        $routeProvider
            .when("/", {
                templateUrl: "components/profile_component/views/profile.html",
                controller: "profileCtrl"
            })
            .when("/error", {
                templateUrl: "components/error_component/views/error.html"
            })
            .when("/dashboard", {
                templateUrl: "components/dashboard_component/views/dashboard.html",
                controller: "dashboardCtrl"
            })
            .when("/employees", {
                templateUrl: "components/employee_component/views/employee.html",
                controller: "employeeCtrl"
            })
            .when("/employees/profile", {
                templateUrl: "components/employee_profile_component/views/employeeprofile.html",
                controller: "employeeProfileCtrl"
            })
            .when("/projects", {
                templateUrl: "components/projects_component/views/projects.html",
                controller: "projectCtrl"
            })
            .when("/projects/profile", {
                templateUrl: "components/project_profile_component/views/projectprofile.html",
                controller: "projectProfileCtrl"
            })
            .when("/applicants", {
                templateUrl: "components/applicant_component/views/applicants.html",
                controller: "applicantCtrl"
            })
            .when("/applicants/profile", {
                templateUrl: "components/applicant_profile_component/views/applicantprofile.html",
                controller: "applicantProfileCtrl"
            })
            .when("/profile", {
                templateUrl: "components/profile_component/views/profile.html",
                controller: "profileCtrl"
            })
            .when("/leaverequests", {
                templateUrl: "components/leaves_component/views/leaverequests.html",
                controller: "leaveRequestsCtrl"
            })
    })
    
    .factory('queue', function($q,$http) {
  
        var queue=[];
        var execNext = function() {
          var task = queue[0];
          $http(task.c).then(function(data) {
            queue.shift();
            task.d.resolve(data);
            if (queue.length>0) execNext();
          }, function(err) {
            task.d.reject(err);
          })
          ;
        }; 
        return function(config) {
          var d = $q.defer();
          queue.push({c:config,d:d});
          if (queue.length===1) execNext();            
          return d.promise;
        };
      })

    .controller("mainCtrl", function ($rootScope, $scope, $http, queue) {

        var functions = {
            initialize: function () {
                console.log("Main controller");
                functions.getInitialValues();
                functions.getUserLogged();
                functions.startReportFormats();
                functions.testInitFirebase();
            },
            testInitFirebase: function () {
                var config = JSON.parse(localStorage.getItem("firebaseconfig"));
                console.log(config);
                if (config != null || config != undefined) {
                    $(document).ready(function () {
                        firebase.initializeApp(config);
                        $rootScope.isAuthenticated = true;
                    });
                }
            },
            startReportFormats: function () {
                $rootScope.reportStyles = {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subtitle: {
                        fontSize: 11,
                        italics: true,
                        color: 'gray',
                        margin: [0, 0, 0, 10]
                    },
                    graycolor: {
                        italics: true,
                        color: 'gray'
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    subsubheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                }
            },
            getInitialValues: function () {
                // $rootScope.baseURL = "http://127.0.0.1:9001/";
                $rootScope.baseURL = "https://us-central1-hrmsbot.cloudfunctions.net/venus/";
                $rootScope.currentPage = "Weltanchaung";
                $rootScope.dashboardactive = true;
                $rootScope.employeeactive = false;
                $rootScope.projectsactive = false;
                $rootScope.applicantsactive = false;
                $rootScope.applicantsactive = false;
                $rootScope.leavesactive = false;
                $rootScope.profileactive = false;
                $rootScope.isAuthenticated = false;
                $rootScope.unseenNotifications = {};
                $rootScope.dateToday = moment();
                $rootScope.logExam = false;
                $rootScope.inExamMain = (false || localStorage.getItem("inExamMain"));
                $rootScope.userlogged = JSON.parse(localStorage.getItem("userlogged"));
            },
            onListeners: function () {
                console.log("TURNING ON LISTENERS");
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        console.log(user);
                        $rootScope.firebaseuser = user;
                        setTimeout(function () {
                            functions.employeeListeners();
                        });
                        setTimeout(function () {
                            functions.employeeNotifListener();
                        });
                        setTimeout(function () {
                            functions.applicantListeners();
                        })
                        setTimeout(function () {
                            functions.applicantNotifListener();
                        });
                        setTimeout(function () {
                            functions.projectListeners();
                        });
                        setTimeout(function () {
                            functions.projectNotifListener();
                        });
                        setTimeout(function () {
                            functions.leavesListeners();
                        });
                        setTimeout(function () {
                            functions.leaveNotifListener();
                        });
                    } else {
                        console.log("NO USER SIGNED IN");
                    }
                });
            },
            getUserLogged: function () {
                $rootScope.userlogged = JSON.parse(localStorage.getItem("userlogged"));
            },
            employeeUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Employees/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allEmployees.splice($rootScope.allEmployees.indexOf(decrypted), 1);
                        $rootScope.employeeCount--;
                    });
                    functions.refresh();
                });
                firebase.database().ref("HRMS_Storage/Employees/").on("child_changed", function (snapshot) {
                    console.log("EMPLOYEE CHANGED");
                    console.log(snapshot.val());
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        console.log(decrypted);
                        for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                            if ($rootScope.allEmployees[index].userkey === decrypted.userkey) {
                                $rootScope.allEmployees[index] = decrypted;
                                try {
                                    if ($rootScope.selectedEmployee.userkey === decrypted.userkey) {
                                        $rootScope.selectedEmployee = decrypted;
                                        localStorage.setItem("selectedEmployee", JSON.stringify($rootScope.selectedEmployee));
                                    }
                                } catch (err) {
                                    console.log("No selected employee");
                                }
                                try {
                                    if ($rootScope.userlogged.userkey === decrypted.userkey) {
                                        $rootScope.userlogged = decrypted;
                                        localStorage.setItem("userlogged", JSON.stringify($rootScope.userlogged));
                                    }
                                } catch (err) {
                                    console.log("No logged in user");
                                }
                                break;
                            }
                        }
                    })
                    functions.refresh();
                });
            },
            employeeListeners: function () {
                $rootScope.allEmployees = [];
                $rootScope.lastEmployee;
                $rootScope.employeeCount = 0;
                $rootScope.employeeDataPopulated = false;
                $rootScope.janCountEmp = $rootScope.febCountEmp =
                    $rootScope.marCountEmp = $rootScope.aprCountEmp =
                    $rootScope.mayCountEmp = $rootScope.junCountEmp =
                    $rootScope.julCountEmp = $rootScope.augCountEmp =
                    $rootScope.sepCountEmp = $rootScope.octCountEmp =
                    $rootScope.novCountEmp = $rootScope.decCountEmp = 0;
                $rootScope.employeesLoaded = false;

                queue({
                    url: $rootScope.baseURL + "secure-api/getEmployees",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.employeeCount = response.data.employees.length;
                    $rootScope.allEmployees = response.data.employees;
                    for (var index = 0; index < $rootScope.allEmployees.length; index++) {
                        functions.getMonthBarGraphEmp($rootScope.allEmployees[index]);
                    }
                    $rootScope.employeeDataPopulated = true;
                    $rootScope.employeesLoaded = true;
                    functions.employeeUpdateListeners();
                    firebase.database().ref("HRMS_Storage/Employees/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.userkey != $rootScope.allEmployees[$rootScope.allEmployees.length - 1].userkey) {
                                    $rootScope.allEmployees.push(decrypted);
                                    $rootScope.employeeCount++;
                                    functions.getMonthBarGraphEmp(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        })
                    })
                })
            },
            employeeNotifListener: function () {
                $rootScope.employeeNotifications = [];
                queue({
                    url: $rootScope.baseURL + "secure-api/getEmployeeNotifications",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.employeeNotifications = response.data.employees;
                    firebase.database().ref("HRMS_Storage/Notifications/Employees/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.key != $rootScope.employeeNotifications[$rootScope.employeeNotifications.length - 1].key) {
                                    $rootScope.employeeNotifications.push(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        })
                    });
                });
            },
            applicantUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Applicants/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allApplicants.splice($rootScope.allApplicants.indexOf(decrypted), 1);
                        $rootScope.applicantCount--;
                        functions.refresh();
                    });
                });
                firebase.database().ref("HRMS_Storage/Applicants/").on("child_changed", function (snapshot) {
                    console.log("APPLICANT CHANGED");
                    console.log(snapshot.val());
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        console.log(decrypted);
                        for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                            if ($rootScope.allApplicants[index].userkey === decrypted.userkey) {
                                $rootScope.allApplicants[index] = decrypted;
                                try {
                                    if ($rootScope.selectedApplicant.userkey === decrypted.userkey) {
                                        $rootScope.selectedApplicant = decrypted;
                                        localStorage.setItem("selectedApplicant", JSON.stringify($rootScope.selectedApplicant));
                                    }
                                } catch (err) {
                                    console.log("No selected applicant");
                                }
                                break;
                            }
                        }
                        functions.refresh();
                    });
                });
            },
            applicantListeners: function () {
                $rootScope.allApplicants = [];
                $rootScope.lastApplicant;
                $rootScope.applicantCount = 0;
                $rootScope.applicantDataPopulated = false;
                $rootScope.janCountApp = $rootScope.febCountApp =
                    $rootScope.marCountApp = $rootScope.aprCountApp =
                    $rootScope.mayCountApp = $rootScope.junCountApp =
                    $rootScope.julCountApp = $rootScope.augCountApp =
                    $rootScope.sepCountApp = $rootScope.octCountApp =
                    $rootScope.novCountApp = $rootScope.decCountApp = 0;
                $rootScope.applicantsLoaded = false;
                queue({
                    url: $rootScope.baseURL + "secure-api/getApplicants",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.applicantCount = response.data.applicants.length;
                    $rootScope.allApplicants = response.data.applicants;
                    for (var index = 0; index < $rootScope.allApplicants.length; index++) {
                        functions.getMonthBarGraphApp($rootScope.allApplicants[index]);
                    }
                    $rootScope.applicantDataPopulated = true;
                    $rootScope.applicantsLoaded = true;
                    functions.applicantUpdateListeners();
                    firebase.database().ref("HRMS_Storage/Applicants/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.userkey != $rootScope.allApplicants[$rootScope.allApplicants.length - 1].userkey) {
                                    $rootScope.allApplicants.push(decrypted);
                                    $rootScope.applicantCount++;
                                    functions.getMonthBarGraphApp(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        })
                    });
                });
            },
            applicantNotifListener: function () {
                $rootScope.applicantNotifications = [];
                queue({
                    url: $rootScope.baseURL + "secure-api/getApplicantNotifications",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.applicantNotifications = response.data.applicants;
                    firebase.database().ref("HRMS_Storage/Notifications/Applicants/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.userkey != $rootScope.applicantNotifications[$rootScope.applicantNotifications.length - 1].userkey) {
                                    $rootScope.applicantNotifications.push(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        });
                    });
                })

            },
            projectUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Projects/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allProjects.splice($rootScope.allProjects.indexOf(decrypted), 1);
                        $rootScope.projectCount--;
                        functions.refresh();
                    })
                });
                firebase.database().ref("HRMS_Storage/Projects/").on("child_changed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypt) {
                        for (var index = 0; index < $rootScope.allProjects.length; index++) {
                            if ($rootScope.allProjects[index].projectkey === decrypt.projectkey) {
                                $rootScope.allProjects[index] = decrypt;
                                try {
                                    if (decrypt.projectlead.userkey === $rootScope.userlogged.userkey) {
                                        $rootScope.isProjectLead = true;
                                    }
                                } catch (err) {
                                    console.log("CHANGED BUT NO PL");
                                }
                                try {
                                    if ($rootScope.selectedProject.projectkey === decrypt.projectkey) {
                                        $rootScope.selectedProject = decrypt;
                                        localStorage.setItem("selectedProject", JSON.stringify($rootScope.selectedProject));
                                    }
                                } catch (err) {
                                    console.log("No selected project");
                                }
                                break;
                            }
                        }
                        functions.refresh();
                    });
                });
            },
            projectListeners: function () {
                $rootScope.allProjects = [];
                $rootScope.lastProject;
                $rootScope.isProjectLead = false;
                $rootScope.projectCount = 0;
                $rootScope.projectsLoaded = false;

                queue({
                    url: $rootScope.baseURL + "secure-api/getProjects",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.allProjects = response.data.projects;
                    $rootScope.projectCount = response.data.projects.length;
                    $rootScope.projectsLoaded = true;
                    functions.projectUpdateListeners();
                    try {
                        for (project in $rootScope.allProjects) {
                            if ($rootScope.allProjects[project].projectlead.userkey === $rootScope.userlogged.userkey) {
                                $rootScope.isProjectLead = true;
                            }
                        }
                    } catch (err) {}
                    firebase.database().ref("HRMS_Storage/Projects/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.projectlead.userkey === $rootScope.userlogged.userkey && !$rootScope.isProjectLead) {
                                    $rootScope.isProjectLead = true;
                                }
                            } catch (err) {}
                            try {
                                if (decrypted.projectkey != $rootScope.allProjects[$rootScope.allProjects.length - 1].projectkey) {
                                    $rootScope.allProjects.push(decrypted);
                                    $rootScope.projectCount++;
                                    functions.refresh();
                                }
                            } catch (err) {
                                if($rootScope.allProjects.length === 0){
                                    $rootScope.allProjects.push(decrypted);
                                    $rootScope.projectCount++;
                                    functions.refresh();
                                }
                                console.log("ERROR: " + err.message);
                            }
                        });
                    });
                })
            },
            projectNotifListener: function () {
                $rootScope.projectNotifications = [];
                queue({
                    url: $rootScope.baseURL + "secure-api/getProjectNotifications",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.projectNotifications = response.data.projects;
                    firebase.database().ref("HRMS_Storage/Notifications/Projects/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if ($rootScope.projectNotifications[$rootScope.projectNotifications.length - 1].key != decrypted.key) {
                                    $rootScope.projectNotifications.push(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        })
                    });
                });
            },
            leavesUpdateListener: function () {
                firebase.database().ref("HRMS_Storage/Leaves/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allLeaves.splice($rootScope.allLeaves.indexOf(decrypted), 1);
                        functions.refresh();
                    });
                });
                firebase.database().ref("HRMS_Storage/Leaves/").on("child_changed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        for (var index = 0; index < $rootScope.allLeaves.length; index++) {
                            if ($rootScope.allLeaves[index].request.leavekey === decrypted.request.leavekey) {
                                $rootScope.allLeaves[index] = decrypted;
                                try {
                                    var event = {
                                        title: decrypted.request.request.type + ": " + decrypted.request.employee.files.lastname,
                                        start: decrypted.request.request.startDate,
                                        end: (moment(decrypted.request.request.endDate).add(1, "days")).format('YYYY-MM-DD'),
                                        displayEventEnd: true,
                                        allDay: true
                                    }
                                    if (decrypted.request.isAcceptedByHR && !functions.contains(event, $rootScope.allLeaveEvents)) {
                                        console.log("ADDING EVENT FROM CHANGE");
                                        console.log(event);
                                        $rootScope.allLeaveEvents.push(event);
                                        $rootScope.toggleAllLeaveEvents = true;
                                    }
                                    functions.refresh();
                                } catch (err) {
                                    console.log("NOT ADDING AN EVENT")
                                }
                                try {
                                    if (decrypted.request.employee.userkey === $rootScope.userlogged.userkey) {
                                        $rootScope.userloggedHasLeaves = true;
                                    }
                                } catch (err) {}
                                break;
                            }
                        }
                        functions.refresh();
                    });
                });
            },
            leavesListeners: function () {
                $rootScope.allLeaves = [];
                $rootScope.lastLeave;
                $rootScope.allLeaveEvents = [];
                $rootScope.toggleAllLeaveEvents = false;
                $rootScope.userloggedHasLeaves = false;
                $rootScope.leavesDataPopulated = false;
                $rootScope.leavesLoaded = false;

                queue({
                    url: $rootScope.baseURL + "secure-api/getLeaves",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.allLeaves = response.data.leaves;
                    console.log("ALL LEAVES");
                    console.log($rootScope.allLeaves);
                    $rootScope.toggleAllLeaveEvents = true;
                    $rootScope.leavesDataPopulated = true;
                    $rootScope.leavesLoaded = true;
                    functions.refresh();
                    functions.leavesUpdateListener();
                    for (leave in $rootScope.allLeaves) {
                        try {
                            if (($rootScope.allLeaves[leave].request.isAcceptedByHR && !functions.contains(event, $rootScope.allLeaveEvents)) &&
                                ($rootScope.allLeaves[leave].projectlead === $rootScope.userlogged.userkey || $rootScope.allLeaves[leave].request.employee.userkey === $rootScope.userlogged.userkey ||
                                    $rootScope.userlogged.isAdmin)) {
                                var event = {
                                    title: decrypted.request.request.type + ": " + decrypted.request.employee.files.lastname,
                                    start: decrypted.request.request.startDate,
                                    end: (moment(decrypted.request.request.endDate).add(1, "days")).format('YYYY-MM-DD'),
                                    displayEventEnd: true,
                                    allDay: true
                                }
                                $rootScope.allLeaveEvents.push(event);
                                functions.refresh();
                            }
                            if ($rootScope.allLeaves[leave].request.employee.userkey === $rootScope.userlogged.userkey) {
                                $rootScope.userloggedHasLeaves = true;
                            }
                        } catch (err) {}
                    }
                    firebase.database().ref("HRMS_Storage/Leaves/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.request.leavekey != $rootScope.allLeaves[$rootScope.allLeaves.length - 1].request.leavekey) {
                                    $rootScope.allLeaves.push(decrypted);
                                    functions.refresh();
                                    if ((decrypted.request.isAcceptedByHR && !functions.contains(event, $rootScope.allLeaveEvents)) &&
                                        (decrypted.projectlead === $rootScope.userlogged.userkey || decrypted.request.employee.userkey === $rootScope.userlogged.userkey ||
                                            $rootScope.userlogged.isAdmin)) {
                                        var event = {
                                            title: decrypted.request.request.type + ": " + decrypted.request.employee.files.lastname,
                                            start: decrypted.request.request.startDate,
                                            end: (moment(decrypted.request.request.endDate).add(1, "days")).format('YYYY-MM-DD'),
                                            displayEventEnd: true,
                                            allDay: true
                                        }
                                        $rootScope.allLeaveEvents.push(event);
                                        functions.refresh();
                                    }
                                    if (decrypted.request.employee.userkey === $rootScope.userlogged.userkey) {
                                        $rootScope.userloggedHasLeaves = true;
                                    }
                                }
                            } catch (err) {}
                        });
                    });
                });
            },
            leaveNotifListener: function () {
                $rootScope.leaveNotifications = [];
                queue({
                    url: $rootScope.baseURL + "secure-api/getLeaveNotifications",
                    method: "POST",
                    data: {
                        signature: JSON.stringify($rootScope.userlogged),
                        token: localStorage.getItem("token")
                    }
                }).then(function (response) {
                    $rootScope.leaveNotifications = response.data.leaves;
                    firebase.database().ref("HRMS_Storage/Notifications/Leaves/").limitToLast(1).on("child_added", function (snapshot) {
                        functions.decrypt(snapshot.val(), function (decrypted) {
                            try {
                                if (decrypted.key != $rootScope.leaveNotifications[$rootScope.leaveNotifications.length - 1].key) {
                                    $rootScope.leaveNotifications.push(decrypted);
                                    functions.refresh();
                                }
                            } catch (err) {}
                        })
                    });
                })
            },
            getMonthBarGraphEmp: function (employee) {
                var yearhired = moment(employee.files.datehired, "dddd, MMMM Do YYYY, h:mm:ss a").format("YYYY");
                var monthhired = moment(employee.files.datehired, "dddd, MMMM Do YYYY, h:mm:ss a").format("MMMM");
                if (yearhired === moment().format("YYYY")) {
                    switch (monthhired) {
                        case "January":
                            {
                                $rootScope.janCountEmp++;
                                break;
                            }
                        case "February":
                            {
                                $rootScope.febCountEmp++;
                                break;
                            }
                        case "March":
                            {
                                $rootScope.marCountEmp++;
                                break;
                            }
                        case "April":
                            {
                                $rootScope.aprCountEmp++;
                                break;
                            }
                        case "May":
                            {
                                $rootScope.mayCountEmp++;
                                break;
                            }
                        case "June":
                            {
                                $rootScope.junCountEmp++;
                                break;
                            }
                        case "July":
                            {
                                $rootScope.julCountEmp++;
                                break;
                            }
                        case "August":
                            {
                                $rootScope.augCountEmp++;
                                break;
                            }
                        case "September":
                            {
                                $rootScope.sepCountEmp++;
                                break;
                            }
                        case "October":
                            {
                                $rootScope.octCountEmp++;
                                break;
                            }
                        case "November":
                            {
                                $rootScope.novCountEmp++;
                                break;
                            }
                        case "December":
                            {
                                $rootScope.decCountEmp++;
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }
            },
            getMonthBarGraphApp: function (applicant) {
                var yearapplied = moment(applicant.dateapplied, "dddd, MMMM Do YYYY, h:mm:ss a").format("YYYY");
                var monthapplied = moment(applicant.dateapplied, "dddd, MMMM Do YYYY, h:mm:ss a").format("MMMM");
                if (yearapplied === moment().format("YYYY")) {
                    switch (monthapplied) {
                        case "January":
                            {
                                $rootScope.janCountApp++;
                                break;
                            }
                        case "February":
                            {
                                $rootScope.febCountApp++;
                                break;
                            }
                        case "March":
                            {
                                $rootScope.marCountApp++;
                                break;
                            }
                        case "April":
                            {
                                $rootScope.aprCountApp++;
                                break;
                            }
                        case "May":
                            {
                                $rootScope.mayCountApp++;
                                break;
                            }
                        case "June":
                            {
                                $rootScope.junCountApp++;
                                break;
                            }
                        case "July":
                            {
                                $rootScope.julCountApp++;
                                break;
                            }
                        case "August":
                            {
                                $rootScope.augCountApp++;
                                break;
                            }
                        case "September":
                            {
                                $rootScope.sepCountApp++;
                                break;
                            }
                        case "October":
                            {
                                $rootScope.octCountApp++;
                                break;
                            }
                        case "November":
                            {
                                $rootScope.novCountApp++;
                                break;
                            }
                        case "December":
                            {
                                $rootScope.decCountApp++;
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }
            },
            refresh: function () {
                setTimeout(function () {
                    $scope.$apply();
                });
            },
            jsInitialize: function () {
                M.AutoInit();
            },
            decrypt: function (object, callback) {
                try {
                    queue({
                        url: $rootScope.baseURL + "secure-api/decrypt",
                        method: "POST",
                        data: {
                            token: localStorage.getItem("token"),
                            signature: JSON.stringify($rootScope.userlogged),
                            object: object,
                            cache: true
                        }
                    }).then(function (response) {
                        setTimeout(function () {
                            callback(response.data.object);
                        });
                    }).catch(function (err) {
                        console.log("still rendering some data...");
                        console.log("ERROR: " + err.message);
                    });
                } catch (err) {}
            },
            contains: function (object, list) {
                for (obj in list) {
                    if (JSON.stringify(object) === JSON.stringify(list[obj])) {
                        console.log("ALREADY IN EVENTS");
                        return true;
                    }
                }
                console.log("NO SUCH EVENT YET");
                return false;
            },
            checkIfProjectLead: function () {
                var isPL = 0;
                var userlogged = $rootScope.userlogged;
                try {
                    for (project in userlogged.files.projects) {
                        if (userlogged.files.projects[project].isProjectLead) {
                            isPL++;
                        }
                    }
                } catch (err) {}
                if (isPL) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        functions.initialize();

        $scope.functions = {
            onListeners: function () {
                functions.onListeners();
            }
        }

        $rootScope.startJS = function () {
            feather.replace();
            $(document).ready(function () {
                // $(function () {
                $('.tooltipped').tooltip();
                $('.collapsible').collapsible();
                $('.select').formSelect();
                $('.fixed-action-btn').floatingActionButton({
                    direction: 'left'
                });
            });
            return true;
        }

        $rootScope.rootfunctions = {
            validate: function (e) {
                var k;
                document.all ? k = e.keyCode : k = e.which;
                return ((k >= 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
            },
            isEmpty: function (object) {
                console.log(JSON.stringify(object));
                return true;
            },
            fitImageOn: function (canvas, imageObj, context) {
                var imageAspectRatio = imageObj.width / imageObj.height;
                var canvasAspectRatio = canvas.width / canvas.height;
                var renderableHeight, renderableWidth, xStart, yStart;

                if (imageAspectRatio < canvasAspectRatio) {
                    renderableHeight = canvas.height;
                    renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
                    xStart = (canvas.width - renderableWidth) / 2;
                    yStart = 0;
                } else if (imageAspectRatio > canvasAspectRatio) {
                    renderableWidth = canvas.width
                    renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
                    xStart = 0;
                    yStart = (canvas.height - renderableHeight) / 2;
                } else {
                    renderableHeight = canvas.height;
                    renderableWidth = canvas.width;
                    xStart = 0;
                    yStart = 0;
                }
                context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
            }
        }
    });