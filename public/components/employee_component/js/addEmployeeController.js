angular.module("app").controller("addEmployeeCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Add employee controller");
        listeners();
        $rootScope.allEmployeesToBeAdded = [];
        $rootScope.databaseConnection = [];
    }

    function checkEmail(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (obj === list[i].email) {
                return true;
            }
        }
        return false;
    }

    function listeners() {
        $('#file').on("change", function (event) {
            $scope.selectedFile = event.target.files[0];
        });
    }

    function confirmAddEmployee() {
        var storageRef = "/images/employeeImages/" + $scope.addEmployee_email + "_" + $scope.addEmployee_lastname + 
                    ", " +  $scope.addEmployee_firstname;
        var newUserKey = firebase.database().ref().push().key;
        $rootScope.allEmployeesToBeAdded.push({
            firstname: $scope.addEmployee_firstname,
            lastname: $scope.addEmployee_lastname,
            password: $scope.addEmployee_password,
            email: $scope.addEmployee_email,
            userkey: newUserKey,
            image: "",
            employeeImageFile: $scope.selectedFile,
            storageRef: storageRef
        });
    }

    $scope.startFeather = function () {
        feather.replace();
        return true;
    }

    $scope.hideAddEmployeeModal = function () {
        $rootScope.showAddEmployee = false;
    }

    $scope.viewEmployees = function () {
        $rootScope.showAllAddEmployees = true;
        $rootScope.showAddEmployee = false;
    }

    $scope.addEmployee = function () {
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
        if ($scope.addEmployee_password === undefined) {
            errors = 4;
        }
        if (errors === 0) {
            if (checkEmail($scope.addEmployee_email, $rootScope.allEmployeesToBeAdded)) {
                Materialize.toast("<i class='small material-icons'>priority_high</i>Email already listed.", 4000);
            } else {
                 confirmAddEmployee();
                $("#addEmployee_firstname").val(undefined);
                $("#addEmployee_firstname").blur();
                $("#addEmployee_lastname").val(undefined);
                $("#addEmployee_lastname").blur();
                $("#addEmployee_email").val(undefined);
                $("#addEmployee_email").blur();
                $("#addEmployee_password").val(undefined);
                $("#addEmployee_password").blur();
                $("#file").val(undefined);
                $("#file").blur();
                Materialize.toast("Employee listed.", 4000);
            }
        } else {
            Materialize.toast("<i class='small material-icons'>priority_high</i>Please fill out the form.", 4000);
        }
    }
});