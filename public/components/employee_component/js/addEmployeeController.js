angular.module("app").controller("addEmployeeCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("Add employee controller");
            functions.onListeners();
            functions.getInitialValues();
        },
        getInitialValues: function () {
            $rootScope.allEmployeesToBeAdded = [];
            $rootScope.databaseConnection = [];
        },
        onListeners: function () {
            $('#file').on("change", function (event) {
                $scope.selectedFile = event.target.files[0];
            });
        },
        checkEmail: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (obj === list[i].email) {
                    return true;
                }
            }
            return false;
        },
        confirmAddEmployee: function () {
            var storageRef = "/images/employeeImages/" + $scope.addEmployee_email + "_" + $scope.addEmployee_lastname + ", " + $scope.addEmployee_firstname;
            var newUserKey = firebase.database().ref("HRMS_Storage/Employees/").push().key;
            $rootScope.allEmployeesToBeAdded.push({
                firstname: $scope.addEmployee_firstname,
                lastname: $scope.addEmployee_lastname,
                email: $scope.addEmployee_email,
                position: $scope.addEmployee_position,
                contact: $scope.addEmployee_contact,
                address: $scope.addEmployee_address,
                userkey: newUserKey,
                image: "",
                employeeImageFile: $scope.selectedFile,
                storageRef: storageRef
            });
        },
        resetForm: function () {
            $("#addEmployee_firstname").val(undefined);
            $("#addEmployee_firstname").blur();
            $("#addEmployee_lastname").val(undefined);
            $("#addEmployee_lastname").blur();
            $("#addEmployee_email").val(undefined);
            $("#addEmployee_email").blur();
            $("#file").val(undefined);
            $("#file").blur();
            $("#filename").val(undefined);
            $("#filename").blur();
            $("#addEmployee_position").val(undefined);
            $("#addEmployee_position").blur();
            $("#addEmployee_contact").val(undefined);
            $("#addEmployee_contact").blur();
            $("#addEmployee_address").val(undefined);
            $("#addEmployee_address").blur();
        }
    }

    functions.initialize();

    $scope.functions = {
        hideAddEmployeeModal: function () {
            $rootScope.showAddEmployee = false;
        },
        viewEmployees: function () {
            $rootScope.showAllAddEmployees = true;
            $rootScope.showAddEmployee = false;
        },
        addEmployee: function () {
            var errors = 0;
            if ($scope.addEmployee_firstname === undefined) {
                errors = 1;
            }
            if ($scope.addEmployee_lastname === undefined) {
                errors = 2;
            }
            if ($scope.addEmployee_email === undefined) {
                errors = 3;
            }
            if (errors === 0) {
                if (functions.checkEmail($scope.addEmployee_email, $rootScope.allEmployeesToBeAdded)) {
                    M.toast({
                        html: "<i class='small material-icons'>priority_high</i>Email already listed.",
                        displayLength: 2500
                    });
                } else {
                    functions.confirmAddEmployee();
                    functions.resetForm();
                    M.toast({
                        html: "Employee listed",
                        displayLength: 2500
                    });
                }
            } else {
                M.toast({
                    html: "<i class='small material-icons'>priority_high</i>Please fill out the form.",
                    displayLength: 2500
                });
            }
        }
    }
});