// Code goes here


//columns
var columns = {

  city: {
    headerName: 'City',
    editable: true
  },
  country: {
    headerName: 'Country',
    editable: true
  },
  continent: {
    headerName: 'Continent',
    editable: true
  }
};

//records
var records = {
  123: {
    city: "London",
    country: "UK",
    continent: "Europe"
  },
  214: {
    city: "Prague",
    country: "Czech",
    continent: "Europe"
  },
  345: {
    city: "New York",
    country: "USA",
    continent: "North America"
  },
  212: {
    city: "Bangalore",
    country: "India",
    continent: "Asia"
  },
  321: {
    city: "London",
    country: "UK",
    continent: "Europe"
  },
};

var cellMetadata = {
  123: {
    city: {
      trackChanges: false,
      errorState: false,
      tooltip: 'Invalid value'
    },
    country: {
      trackChanges: false,
      tooltip: 'Changed from USA to UK'
    }
  },
  345: {
    city: {
      trackChanges: false,
      errorState: false,
      tooltip: ''
    },
    country: {
      trackChanges: false,
      tooltip: ''
    }
  }
};




//get column defs
function getColumnDefs(columns) {
  var columnDefs = [];
  _.forEach(columns, function (column, key) {
    column.field = key;
    columnDefs.push(column);
  });

  return columnDefs;
}

//get row data
function getRowData(records) {
  var rowData = [];
  _.forEach(records, function (record, key) {
    record.key = key;
    rowData.push(record);
  });
  return rowData;
}

function findAndReplace() {
  var rowDataArray = gridOptions.rowData;
  var columns = gridOptions.columnApi.getAllColumns();
  var e = document.getElementById("attrOptions");
  var value = e.options[e.selectedIndex].value;
  var columnName = e.options[e.selectedIndex].text;
  var findColumnValue = document.getElementById('findVal').value;
  var replaceColumnValue = document.getElementById('replaceVal').value;
  _.forEach(rowDataArray, function (rowData, key) {
    if (rowData[columnName] === findColumnValue) {
        rowDataArray[key][columnName] = replaceColumnValue;
    };
    gridOptions.api.setRowData(rowDataArray);
    gridOptions.api.redrawRows();
  });

}

function bulkUpdate() {
  var rowDataArray = gridOptions.rowData;
  var e = document.getElementById("bulkAttrOptions");
  var value = e.options[e.selectedIndex].value;
  var columnName = e.options[e.selectedIndex].text;
  var replaceColumnValue = document.getElementById('bulkReplaceVal').value;
  _.forEach(rowDataArray, function (rowData, key) {
    rowDataArray[key][columnName] = replaceColumnValue;
    gridOptions.api.setRowData(rowDataArray);
    gridOptions.api.redrawRows();
  });

}

var gridOptions = {
  columnDefs: getColumnDefs(columns),
  rowData: getRowData(records),
  onGridReady: function (params) {

    var gridData = gridOptions.rowData;
    var attributeValues = [];
    var columData = gridOptions.columnDefs;
    _.forEach(columData, function (value) {
      attributeValues.push(value.field);
    });
    var findDataOptions = [];
    var replaceDataOptions = [];
    var bulkReplaceOptions = [];
    /* Creating the attributes drop down dynamically : PENDING*/
    /* F & R dropdown */
    //var optionValues = [[1, "city"], [2, "country"]];
    var $select = $('#attrOptions');
    $select.find('option').remove();
    for (var i = 0; i < attributeValues.length; i++) {
      $('#attrOptions').append($("<option></option>").val(attributeValues[i]).text(attributeValues[i]))
    }

    var $select = $('#bulkAttrOptions');
    $select.find('option').remove();
    for (var i = 0; i < attributeValues.length; i++) {
      $('#bulkAttrOptions').append($("<option></option>").val(attributeValues[i]).text(attributeValues[i]))
    }
    var selectedAttribute = $("select#attrOptions option:checked").val();
    /* fetch selected attribute for F & R */

    _.forEach(gridData, function (value) {
      findDataOptions.push(value[selectedAttribute]);
    });
    findDataOptions = _.uniq(findDataOptions);

    _.forEach(gridData, function (value) {
      replaceDataOptions.push(value[selectedAttribute]);
    });
    replaceDataOptions = _.uniq(replaceDataOptions);

    _.forEach(gridData, function (value) {
      bulkReplaceOptions.push(value[selectedAttribute]);
    });
    bulkReplaceOptions = _.uniq(bulkReplaceOptions);

    /*  Generate type ahead data for find , replace fields : F & R */

    $('#findVal').typeahead({ source: findDataOptions });
    $('#replaceVal').typeahead({ source: replaceDataOptions });
    $('#bulkReplaceVal').typeahead({ source: bulkReplaceOptions });
    /* Change event for dropdowns : findDataOptions and replaceDataOptions needs to be recalculated */
    $("#attrOptions").change(function () {
      findDataOptions.length = 0;
      replaceDataOptions.length = 0;
      selectedAttribute = $("select#attrOptions option:checked").val();
      _.forEach(gridData, function (value) {
        findDataOptions.push(value[selectedAttribute]);
      });
      findDataOptions = _.uniq(findDataOptions);
      

      _.forEach(gridData, function (value) {
        replaceDataOptions.push(value[selectedAttribute]);
      });
      replaceDataOptions = _.uniq(replaceDataOptions);

      $('#findVal').typeahead('destroy');
      $('#replaceVal').typeahead('destroy');
      $('#findVal').typeahead({ source: findDataOptions });
      $('#replaceVal').typeahead({ source: replaceDataOptions });
    });


    $("#bulkAttrOptions").change(function () {
      bulkReplaceOptions.length = 0;
      selectedAttribute = $("select#bulkAttrOptions option:checked").val();
      _.forEach(gridData, function (value) {
        bulkReplaceOptions.push(value[selectedAttribute]);
      });
      bulkReplaceOptions = _.uniq(bulkReplaceOptions);
      $('#bulkReplaceVal').typeahead('destroy');
      $('#bulkReplaceVal').typeahead({ source: replaceDataOptions });
    });


  }
};

document.getElementById('replaceAll').addEventListener("click", findAndReplace);
document.getElementById('updateAll').addEventListener("click", bulkUpdate);

document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

});