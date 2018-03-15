angular.module("app").controller("loginCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Login controller");
        feather.replace();
        $scope.auth = false;
    }

    $scope.testSwal = function () {
        swal(
            'Good job!',
            'You clicked the button!',
            'success'
        )
    }
    $scope.login = function () {
        $http({
            url: $rootScope.baseURL + "api/authOne",
            method: "POST",
            data: {
                user: {
                    email: $scope.email,
                    password: $scope.password
                }
            }
        }).then(function (response) {
            console.log(JSON.stringify(response.data));
            Materialize.toast(response.data.message, 4000);
            if (response.data.valid) {
                $scope.user = response.data.user;
                $scope.auth = true;
            }
        });
    }

    $scope.cancel = function () {
        $http({
            url: $rootScope.baseURL + "api/cancelAuth",
            method: "POST",
            data: {
                user: $scope.user
            }
        }).then(function (response) {
            console.log(response.data);
            $scope.auth = false;
            resetForm();
        })
    }

    $scope.authTwo = function () {
        $http({
            url: $rootScope.baseURL + "api/authTwo",
            method: "POST",
            data: {
                pin: $scope.pin,
                user: $scope.user
            }
        }).then(function (response) {
            console.log(response.data);
            if (response.data.valid) {
                authenticate();
                $scope.auth = false;
                resetForm();
                $rootScope.token = response.data.token;
                $rootScope.isLogged = true;
                $rootScope.userlogged = response.data.user;
                localStorage.setItem("userlogged", JSON.stringify($rootScope.userlogged));
                localStorage.setItem("token", response.data.token);
                window.location.href = "#!/dashboard";
            } else {
                Materialize.toast("Invalid code", 4000);
                $scope.cancel();
            }
        });
    }

    $scope.triggerForget = function () {
        $scope.forgotPassword = true;
    }

    $scope.cancelForget = function () {
        $scope.forgotPassword = false;
    }

    function authenticate() {
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password)
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }

    function resetForm() {
        $("#email").val(undefined);
        $("#email").blur();
        $("#password").val(undefined);
        $("#password").blur();
        $("#pin").val(undefined);
        $("#pin").blur();
    }

});