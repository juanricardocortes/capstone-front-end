angular.module("app").controller("loginCtrl", function ($scope, $rootScope, $http) {

    initialize();

    function initialize() {
        console.log("Login controller");
        $scope.auth = false;
    }

    $scope.login = function () {
        console.log("EMAIL: " + $scope.email + "\nPASSWORD: " + $scope.password);
        $http({
            url: "http://127.0.0.1:9001/api/authOne",
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
        })
    }

    $scope.cancel = function () {
        $http({
            url: "http://127.0.0.1:9001/api/cancelAuth",
            method: "POST",
            data: {
                user: $scope.user
            }
        }).then(function (response) {
            console.log(response.data);
            $scope.auth = false;
            $("#email").val(undefined);
            $("#email").blur();
            $("#password").val(undefined);
            $("#password").blur();
            $("#pin").val(undefined);
            $("#pin").blur();
        })
    }

    $scope.authTwo = function () {
        $http({
            url: "http://127.0.0.1:9001/api/authTwo",
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
                $("#email").val(undefined);
                $("#email").blur();
                $("#password").val(undefined);
                $("#password").blur();
                $("#pin").val(undefined);
                $("#pin").blur();
                $rootScope.token = response.data.token;
                $rootScope.isLogged = true;
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
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }
});