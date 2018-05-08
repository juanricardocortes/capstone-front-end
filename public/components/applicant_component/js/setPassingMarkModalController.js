angular.module("app").controller("setPassingMarkModalCtrl", function ($scope, $rootScope, $http) {
    var functions = {
        initialize: function () {
            functions.getInitialValues();
        },
        getInitialValues: function () {
        }
    }

    functions.initialize();

    $scope.functions = {
        hideSetPassingMarkModal: function () {
            $rootScope.showSetPassingMarkModal = false;
        },
        setPassingMark: function () {
            $rootScope.showSetPassingMarkModal = false;
            swal({
                type: 'success',
                title: "Passing mark set",
                showConfirmButton: false,
                timer: 1500
            });
        },
    }
});