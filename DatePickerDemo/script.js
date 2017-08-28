
//Date Editor
function DateEditor () {}

// gets called once before the renderer is used
DateEditor.prototype.init = function(params) {
    // create the cell
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;

    // https://jqueryui.com/datepicker/
    $(this.eInput).datepicker({
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    });
};

// gets called once when grid ready to insert the element
DateEditor.prototype.getGui = function() {
    return this.eInput;
};

// focus and select can be done after the gui is attached
DateEditor.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
};

// returns the new value after editing
DateEditor.prototype.getValue = function() {
    return this.eInput.value;
};

// any cleanup we need to be done here
DateEditor.prototype.destroy = function() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
};

// if true, then this editor will appear in a popup
DateEditor.prototype.isPopup = function() {
    // and we could leave this method out also, false is the default
    return false;
};

var columnDefs = [{
  headerName: "City",
  field: "city",
  editable: true
}, {
  headerName: "Country",
  editable: true,
  field: "country"
},{
  headerName: "Date",
  editable: true,
  field: "date",
  cellRenderer: function(params) {
   var calendarImage='./images/calendar.png';
   return  '<img width="20px" src="' + calendarImage + '" />'+params.value;
  },
 
  cellEditor: DateEditor
}];

var rowData = [{
  city: "New York",
  country: "USA",
  date:""
}, {
  city: "London",
  country: "USA",
  date:""
},{
  city: "London",
  country: "USA",
  date:""
}]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  enableSorting: true,
  enableFiter: true
};

document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
  window.gridOptions;
});