angular.module("app").controller("allAddEmployeesCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        $('.collapsible').collapsible();
        console.log("All add employees controller");
    }

    $scope.hideAllAddEmployeeModal = function () {
        $rootScope.showAllAddEmployees = false;
        $rootScope.showAddEmployee = true;
    }

    $scope.addEmployees = function () {
        $http({
            url: $rootScope.baseURL +"secure-api/addEmployee",
            method: "POST",
            data: {
                token: localStorage.getItem("token"),
                employees: $rootScope.allEmployeesToBeAdded
            }
        }).then(function (response) {
            uploadEmployeeImages();
            setTimeout(function () {
                $rootScope.showAllAddEmployees = false;
                $rootScope.showAddEmployee = false
                $scope.$apply();
            });
        });
    }

    $scope.removeEmployee = function (employee) {
        setTimeout(function () {
            $rootScope.allEmployeesToBeAdded.splice($rootScope.allEmployeesToBeAdded.indexOf(employee, 1));
            $scope.$apply();
        });
    }

    function uploadEmployeeImages() {
        for (var index = 0; index < $rootScope.allEmployeesToBeAdded.length; index++) {
            console.log("Uploading images: " + $rootScope.allEmployeesToBeAdded[index].firstname);
            uploadImageAsPromise($rootScope.allEmployeesToBeAdded[index]);
        }
    }

    function uploadImageAsPromise(employee) {
        console.log("Uploading images step 2");
        return new Promise(function (resolve, reject) {
            var storageRef = firebase.storage().ref(employee.storageRef);
            var task = storageRef.put(employee.employeeImageFile);
            task.on('state_changed',
                function progress(snapshot) {
                    // var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    // uploader.value = percentage;
                },
                function error(err) {
                    console.log("ERROR: " + err.message);
                },
                function complete() {
                    var downloadURL = task.snapshot.downloadURL;
                    $http({
                        url: "http://127.0.0.1:9001/secure-api/uploadEmployeeImage",
                        method: "POST",
                        data: {
                            token: localStorage.getItem("token"),
                            userkey: employee.userkey,
                            email: employee.email,
                            downloadURL: downloadURL
                        }
                    }).then(function (response) {
                        Materialize.toast(response.data.message, 4000);
                    });
                }
            );
        });
    }

    function refresh() {
        setTimeout(function () {
            $scope.$apply();
        });
    }
});