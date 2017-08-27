// Code goes here

agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module("gridApp", ["agGrid", "ui.bootstrap"]);

module.controller("TypeaheadCtrl", function ($scope, $http, limitToFilter) {

// function to act as a class
function Datepicker () {}

// gets called once before the renderer is used
Datepicker.prototype.init = function(params) {
    // create the cell
    this.eInput = document.createElement('input');
     this.eInput.setAttribute("style", "width:100%");
    this.eInput.value = params.value;

    // https://jqueryui.com/datepicker/
    $(this.eInput).datepicker({
        dateFormat: "dd/mm/yy"
    });
};

// gets called once when grid ready to insert the element
Datepicker.prototype.getGui = function() {
    return this.eInput;
};

// focus and select can be done after the gui is attached
Datepicker.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
};

// returns the new value after editing
Datepicker.prototype.getValue = function() {
    return this.eInput.value;
};

// any cleanup we need to be done here
Datepicker.prototype.destroy = function() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
Datepicker.prototype.isPopup = function() {
    // and we could leave this method out also, false is the default
    return false;
};

// function to act as a class
    function TypeaheadEditor() {
    }

// gets called once before the renderer is used
    TypeaheadEditor.prototype.init = function (params) {
        this.eInput = document.createElement('input');
        this.eInput.setAttribute("typeahead", "suggestion for suggestion in getItem($viewValue)");
        this.eInput.setAttribute("typeahead-wait-ms", "300");
        this.eInput.setAttribute("style", "width:100%");
        this.eInput.setAttribute("ng-model", "result");
        this.eInput.value = params.value;

    };

// gets called once when grid ready to insert the element
    TypeaheadEditor.prototype.getGui = function () {
        return this.eInput;
    };

// focus and select can be done after the gui is attached
    TypeaheadEditor.prototype.afterGuiAttached = function () {
        this.eInput.focus();

    };

// returns the new value after editing
    TypeaheadEditor.prototype.getValue = function () {
        return this.eInput.value;
    };
    var columnDefs = [
        {
            headerName: "Name",
            field: "name",
            editable: true
        },
        {
            headerName: "City",
            field: "city",
            editable: true,
            cellEditor: TypeaheadEditor
        },
        {
            headerName: "Date of Birth",
            field: "date",
            editable: true,
            cellEditor: Datepicker
        }
    ];

    var rowData = [
        {name: "Tom", city: "", date:""},
        {name: "Dick", city: "", date:""},
        {name: "Harry", city: "", date:""}
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        angularCompileRows: true,
        onGridReady: function (params) {
            params.api.sizeColumnsToFit();
        }
    };

    $scope.getItem = function (viewValue) {
        return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK&q=" + viewValue).then(function (response) {
            return limitToFilter(response.data, 15);
        });
        
    };
});


