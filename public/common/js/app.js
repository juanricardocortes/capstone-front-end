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

    .controller("mainCtrl", function ($rootScope, $scope, $http) {

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
                $rootScope.baseURL = "http://127.0.0.1:9001/";
                // $rootScope.baseURL = "https://us-central1-hrmsbot.cloudfunctions.net/venus/";
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
                        functions.employeeListeners();
                        functions.leavesListeners();
                        functions.projectListeners();
                        functions.applicantListeners();
                        // if($rootScope.userlogged.isAdmin) {
                        //     if(functions.checkIfProjectLead()){
                        //     }
                        // } 
                    } else {
                        console.log("NO USER SIGNED IN");
                    }
                });
            },
            getUserLogged: function () {
                $rootScope.userlogged = JSON.parse(localStorage.getItem("userlogged"));
            },
            applicantUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Applicants/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allApplicants.splice($rootScope.allApplicants.indexOf(decrypted), 1);
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
                $rootScope.appNotifCounter = 0;
                $rootScope.applicantNotifications = [];
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

                firebase.database().ref("HRMS_Storage/Notifications/Applicants/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        if (!(decrypted.seen)) {
                            $rootScope.appNotifCounter++;
                        }
                        $rootScope.unseenNotifications["applicants"] = $rootScope.appNotifCounter;
                        $rootScope.applicantNotifications.push(decrypted);
                        functions.refresh();
                    });
                });
                firebase.database().ref("HRMS_Storage/Applicants/").orderByKey().limitToLast(1).once('value').then(function (snapshot) {
                    try {
                        $rootScope.lastApplicant = snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]];
                    } catch (err) {
                        console.log("NO APPLICANTS YET");
                    }
                });
                firebase.database().ref("HRMS_Storage/Applicants/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allApplicants.push(decrypted);
                        $rootScope.applicantCount++;
                        functions.getMonthBarGraphApp(decrypted);
                        functions.refresh();
                        try {
                            if (snapshot.val().userkey === $rootScope.lastApplicant.userkey) {
                                console.log("ALL APPLICANTS");
                                console.log($rootScope.allApplicants);
                                $rootScope.applicantDataPopulated = true;
                                $rootScope.applicantsLoaded = true;
                                functions.applicantUpdateListeners();
                            }
                        } catch (err) {
                            console.log(err.message);
                            console.log("NO LAST APPLICANT");
                            $rootScope.applicantDataPopulated = true;
                            $rootScope.applicantsLoaded = true;
                            functions.applicantUpdateListeners()
                        }
                    });
                });
            },
            projectUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Projects/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allProjects.splice($rootScope.allProjects.indexOf(decrypted), 1);
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
                $rootScope.projectNotifCounter = 0;
                $rootScope.projectNotifications = [];
                $rootScope.allProjects = [];
                $rootScope.lastProject;
                $rootScope.isProjectLead = false;
                $rootScope.projectCount = 0;
                $rootScope.projectsLoaded = false;

                firebase.database().ref("HRMS_Storage/Notifications/Projects/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        if (!(decrypted.seen)) {
                            $rootScope.projectNotifCounter++;
                        }
                        $rootScope.unseenNotifications["projects"] = $rootScope.projectNotifCounter;
                        $rootScope.projectNotifications.push(decrypted);
                        functions.refresh();
                    })
                });
                firebase.database().ref("HRMS_Storage/Projects/").orderByKey().limitToLast(1).once("value").then(function (snapshot) {
                    try {
                        $rootScope.lastProject = snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]];
                    } catch (err) {
                        console.log("NO LAST PROJECT YET");
                    }
                });
                firebase.database().ref("HRMS_Storage/Projects/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        try {
                            if (decrypted.projectlead.userkey === $rootScope.userlogged.userkey && !$rootScope.isProjectLead) {
                                $rootScope.isProjectLead = true;
                            }
                        } catch (err) {
                            console.log("NO PROJECT LEAD YET")
                        }
                        $rootScope.allProjects.push(decrypted);
                        $rootScope.projectCount++;
                        functions.refresh();
                        try {
                            if (snapshot.val().projectkey === $rootScope.lastProject.projectkey) {
                                console.log("ALL PROJECTS");
                                console.log($rootScope.allProjects);
                                $rootScope.projectsLoaded = true;
                                functions.projectUpdateListeners();
                            }
                        } catch (err) {
                            $rootScope.projectsLoaded = true;
                            console.log(err.message);
                            console.log("NO LAST PROJECT");
                            functions.projectUpdateListeners();
                        }
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
                $rootScope.leaveNotifCounter = 0;
                $rootScope.leaveNotifications = [];
                $rootScope.allLeaves = [];
                $rootScope.lastLeave;
                $rootScope.allLeaveEvents = [];
                $rootScope.toggleAllLeaveEvents = false;
                $rootScope.userloggedHasLeaves = false;
                $rootScope.leavesDataPopulated = false;
                $rootScope.leavesLoaded = false;

                firebase.database().ref("HRMS_Storage/Notifications/Leaves/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        if (!(decrypted.seen)) {
                            $rootScope.leaveNotifCounter++;
                        }
                        $rootScope.unseenNotifications["leaves"] = $rootScope.leaveNotifCounter;
                        $rootScope.leaveNotifications.push(decrypted);
                        functions.refresh();
                    })
                });
                firebase.database().ref("HRMS_Storage/Leaves/").orderByKey().limitToLast(1).once("value").then(function (snapshot) {
                    try {
                        $rootScope.lastLeave = snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]];
                    } catch (err) {
                        console.log("NO LEAVES YET");
                    }
                });
                firebase.database().ref("HRMS_Storage/Leaves/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allLeaves.push(decrypted);
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
                        }
                        functions.refresh();
                        try {
                            if (snapshot.val().request.leavekey === $rootScope.lastLeave.request.leavekey) {
                                $rootScope.toggleAllLeaveEvents = true;
                                $rootScope.leavesDataPopulated = true;
                                $rootScope.leavesLoaded = true;
                                functions.refresh();
                                functions.leavesUpdateListener();
                            }
                        } catch (err) {
                            $rootScope.toggleAllLeaveEvents = true;
                            $rootScope.leavesDataPopulated = true;
                            $rootScope.leavesLoaded = true;
                            functions.refresh();
                            functions.leavesUpdateListener();
                        }
                        try {
                            if (decrypted.request.employee.userkey === $rootScope.userlogged.userkey) {
                                $rootScope.userloggedHasLeaves = true;
                            }
                        } catch (err) {}
                    });
                });
            },
            employeeUpdateListeners: function () {
                firebase.database().ref("HRMS_Storage/Employees/").on("child_removed", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allEmployees.splice($rootScope.allEmployees.indexOf(decrypted), 1);
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
                $rootScope.empNotifCounter = 0;
                $rootScope.employeeNotifications = [];
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

                firebase.database().ref("HRMS_Storage/Notifications/Employees/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        if (!(decrypted.seen)) {
                            $rootScope.empNotifCounter++;
                        }
                        $rootScope.unseenNotifications["employees"] = $rootScope.empNotifCounter;
                        $rootScope.employeeNotifications.push(decrypted);
                        functions.refresh();
                    })
                });
                firebase.database().ref("HRMS_Storage/Employees/").orderByKey().limitToLast(1).once("value").then(function (snapshot) {
                    try {
                        $rootScope.lastEmployee = snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]];
                    } catch (err) {
                        console.log("NO EMPLOYEES YET");
                    }
                });
                firebase.database().ref("HRMS_Storage/Employees/").on("child_added", function (snapshot) {
                    functions.decrypt(snapshot.val(), function (decrypted) {
                        $rootScope.allEmployees.push(decrypted);
                        $rootScope.employeeCount++;
                        functions.getMonthBarGraphEmp(decrypted);
                        functions.refresh();
                        try {
                            if (snapshot.val().userkey === $rootScope.lastEmployee.userkey) {
                                console.log("ALL EMPLOYEES");
                                console.log($rootScope.allEmployees);
                                $rootScope.employeeDataPopulated = true;
                                $rootScope.employeesLoaded = true;
                                functions.employeeUpdateListeners();
                            }
                        } catch (err) {
                            console.log(err.message);
                            console.log("NO LAST EMPLOYEE");
                            $rootScope.employeeDataPopulated = true;
                            $rootScope.employeesLoaded = true;
                            functions.employeeUpdateListeners();
                        }
                    });
                });
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
                $http({
                    url: $rootScope.baseURL + "secure-api/decrypt",
                    method: "POST",
                    data: {
                        token: localStorage.getItem("token"),
                        signature: JSON.stringify($rootScope.userlogged),
                        object: object
                    }
                }).then(function (response) {
                    callback(response.data.object);
                });
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