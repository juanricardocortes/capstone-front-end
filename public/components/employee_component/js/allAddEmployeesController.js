angular.module("app").controller("allAddEmployeesCtrl", function ($scope, $rootScope, $http) {

    var functions = {
        initialize: function () {
            console.log("All add employees controller");
        },
        uploadEmployeeImages: function() {
            for (var index = 0; index < $rootScope.allEmployeesToBeAdded.length; index++) {
                console.log("Uploading images: " + $rootScope.allEmployeesToBeAdded[index].firstname);
                functions.uploadImageAsPromise($rootScope.allEmployeesToBeAdded[index]);
            }
        },
        uploadImageAsPromise: function(employee) {
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
                        console.log("Image uploaded");
                        var downloadURL = task.snapshot.downloadURL;
                        $http({
                            url: $rootScope.baseURL + "secure-api/uploadEmployeeImage",
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
        },
        refresh: function() {
            setTimeout(function () {
                $scope.$apply();
            });
        }
    }

    functions.initialize();
    
    $scope.functions = {
        hideAllAddEmployeeModal: function () {
            $rootScope.showAllAddEmployees = false;
            $rootScope.showAddEmployee = true;
        },
        addEmployees: function () {
            $http({
                url: "http://127.0.0.1:9001/secure-api/addEmployee",
                method: "POST",
                data: {
                    token: localStorage.getItem("token"),
                    allEmployees: $rootScope.allEmployeesToBeAdded
                }
            }).then(function (response) {
                functions.uploadEmployeeImages();
                setTimeout(function () {
                    $rootScope.showAllAddEmployees = false;
                    $rootScope.showAddEmployee = false
                    $scope.$apply();
                });
            });
        },
        removeEmployee: function (employee) {
            setTimeout(function () {
                $rootScope.allEmployeesToBeAdded.splice($rootScope.allEmployeesToBeAdded.indexOf(employee), 1);
                $scope.$apply();
            });
        }
    }
});