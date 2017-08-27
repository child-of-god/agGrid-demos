// setup the grid after the page has finished loading

function TypeaheadCellEditor() {}
TypeaheadCellEditor.prototype.init = function(params) {
  this.eInput = document.createElement('input');
  this.eInput.setAttribute("id", "search1");
  this.eInput.setAttribute("data-provide", "typeahead");
  this.eInput.value = params.value;
};

//Making the cell editor a pop up editor
TypeaheadCellEditor.prototype.isPopup = function() {
  return true;
};

// gets called once when grid ready to insert the element
TypeaheadCellEditor.prototype.getGui = function() {
  return this.eInput;
};

// focus and select can be done after the gui is attached
TypeaheadCellEditor.prototype.afterGuiAttached = function() {
  $('#search1').typeahead({
    minLength: 3,
    source: function(query, process) {
      $.ajax({
          url: 'https://api.myjson.com/bins/kps71',
          data: {
            q: query
          },
          dataType: 'json'
        })
        .done(function(response) {
          return process(response);
        });
        
    }
  });
  this.eInput.focus();

};

// returns the new value after editing
TypeaheadCellEditor.prototype.getValue = function() {
  return this.eInput.value;
};

var columnDefs = [{
  headerName: "City",
  field: "city",
  editable: true,
  cellEditor: TypeaheadCellEditor
}, {
  headerName: "Country",
  editable: true,
  field: "country"
}];

var rowData = [{
  city: "",
  country: "USA"
}, {
  city: "",
  country: "USA"
}]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData
};

document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});