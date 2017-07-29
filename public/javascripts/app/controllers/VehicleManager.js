require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/Vehicle", "bootstrap"], function ($, Vehicle) {
        $(document).ready(function () {

            loadAndDisplayVehicles();
            $('.add-vehicle').on('click', onAddVehicleClicked);
            $('.vehicle-list').on('click', '.edit-vehicle', onEditVehicleClicked);
            $('.vehicle-list').on('click', '.delete-vehicle', onDeleteVehicleClicked);
            $('.save-vehicle').on('click', onSaveVehicleClicked);
        });

        function onAddVehicleClicked(e) {
            $('.vehicle-modal-title').text('Add Vehicle');
            $('input[class*="vehicle"]').val("");
        }

        function onSaveVehicleClicked(e) {
            if ($('.vehicle-id').val() != "") {
                Vehicle.update($('.vehicle-id').val(), $('.vehicle-make').val(), $('.vehicle-model').val(), $('.vehicle-color').val(), $('.vehicle-plate').val(), 0, function () {
                    $('#vehicleModal').modal('hide');
                    loadAndDisplayVehicles();
                }, function (errors) {
                    console.log(errors);
                });
            } else {
                Vehicle.add($('.vehicle-make').val(), $('.vehicle-model').val(), $('.vehicle-color').val(), $('.vehicle-plate').val(), 0, function () {
                    $('#vehicleModal').modal('hide');
                    loadAndDisplayVehicles();
                }, function (errors) {
                    console.log(errors);
                });
            }
        }

        function onEditVehicleClicked(e) {
            e.preventDefault();
            $('.vehicle-modal-title').text('Edit Vehicle');
            Vehicle.get($(this).closest('.vehicle-list-item').data('id'), function (vehicle) {
                $('.vehicle-id').val(vehicle.id);
                $('.vehicle-make').val(vehicle.make);
                $('.vehicle-model').val(vehicle.model);
                $('.vehicle-plate').val(vehicle.plate);
                $('.vehicle-color').val(vehicle.color);
                $('#vehicleModal').modal('show');
            }, console.log);
        }

        function onDeleteVehicleClicked(e) {
            e.preventDefault();
            Vehicle.remove($(this).closest('.vehicle-list-item').data('id'), loadAndDisplayVehicles, console.log);
            //remove vehicle, refresh list
        }

        function makeVehicleListItem(vehicle) {
            var editVehicleLink = $('<a href="#">Edit</a>').addClass('pull-right').addClass('edit-vehicle');
            var deleteVehicleLink = $('<a href="#">Delete</a>').addClass('pull-right').addClass('delete-vehicle');
            var vehicleText = $('<span></span>').html('<b>' + vehicle.plate + '</b> ' + vehicle.color + " " + vehicle.make + " " + vehicle.model);
            return $('<div></div>').addClass('list-group-item').addClass('vehicle-list-item').data("id", vehicle.id).append([vehicleText, deleteVehicleLink, editVehicleLink]);
        }

        function loadAndDisplayVehicles() {
            Vehicle.load(function (vehicles) {
                $('.vehicle-list').empty();
                vehicles.forEach(function (vehicle, i) {
                    $('.vehicle-list').append(makeVehicleListItem(vehicle));
                });
            }, function (errors) {});
        }
    });
});