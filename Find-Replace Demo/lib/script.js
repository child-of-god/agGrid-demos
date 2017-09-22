
//columns
var columns = {

  city: {
    headerName: 'City',
    editable: true
  },
  country: {
    headerName: 'Country',
    editable: true,
    findReplaceAllowed: true,
    bulkUpdateAllowed: true
  },
  continent: {
    headerName: 'Continent',
    editable: true,
    findReplaceAllowed: true,
    bulkUpdateAllowed: true,
    cellEditor:'select',
    cellEditorParams: {
      values:['Europe', 'North America', 'Asia']
    }
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


/* Selection Handler */
function onSelectionChanged() {
  var findDataOptions = [];
  var replaceDataOptions = [];
  var bulkReplaceOptions = [];
   selectedRows = gridOptions.api.getSelectedRows();
   var rowDataArray = selectedRows ? selectedRows : gridOptions.rowData;
   var selectedAttribute = $("select#attrOptions option:checked").val();
   _.forEach(rowDataArray, function (value) {
     findDataOptions.push(value[selectedAttribute]);
   });
   findDataOptions = _.uniq(findDataOptions);
   _.forEach(rowDataArray, function (value) {
     replaceDataOptions.push(value[selectedAttribute]);
   });
   replaceDataOptions = _.uniq(replaceDataOptions);

   _.forEach(rowDataArray, function (value) {
     bulkReplaceOptions.push(value[selectedAttribute]);
   });
   bulkReplaceOptions = _.uniq(bulkReplaceOptions);
   $('#findVal').typeahead({ source: findDataOptions });
   $('#replaceVal').typeahead({ source: replaceDataOptions });
   $('#bulkReplaceVal').typeahead({ source: bulkReplaceOptions });
}

/* replaceUtils */

var _replaceUtils = {
    replaceAll : function() {
        
    
    },
}



function findAndReplace() {
  var rowDataArray = gridOptions.rowData;
  var e = document.getElementById("attrOptions");
  var value = e.options[e.selectedIndex].value;
  var columnName = e.options[e.selectedIndex].text;
  var findColumnValue = document.getElementById('findVal').value;
  var selectedCol = document.getElementById("replaceSelectValues");
  var value = selectedCol.options[selectedCol.selectedIndex].value;
  var replaceColumnValue = selectedCol.options[selectedCol.selectedIndex].text;
  var replaceColValue = document.getElementById('replaceVal').value;
  var replaceValue = replaceColumnValue ? replaceColumnValue: replaceColValue; // BUG HERE

  _.forEach(rowDataArray, function (rowData, key) {
    if (rowData[columnName] === findColumnValue) {
        rowDataArray[key][columnName] = replaceValue;
    };
    gridOptions.api.setRowData(rowDataArray);
    gridOptions.api.redrawRows();
  });

}

function bulkUpdate() {
  var rowDataArray =  gridOptions.rowData;
  var e = document.getElementById("bulkAttrOptions");
  var value = e.options[e.selectedIndex].value;
  var columnName = e.options[e.selectedIndex].text;
  _.forEach(gridData, function (value) {
    bulkReplaceOptions.push(value[selectedAttribute]);
  });
  bulkReplaceOptions = _.uniq(bulkReplaceOptions);
  var replaceColumnValue = document.getElementById('bulkReplaceVal').value;
  _.forEach(rowDataArray, function (rowData, key) {
    rowDataArray[key][columnName] = replaceColumnValue;
    gridOptions.api.setRowData(rowDataArray);
    gridOptions.api.redrawRows();
  });

}

var gridOptions = {
  columnDefs: getColumnDefs(columns),
  rowSelection: 'multiple',
  rowData: getRowData(records),
  onGridReady: function (params) {
    var gridData = gridOptions.rowData;
    var columnData = gridOptions.columnDefs;
    var attributeValues = [];
    var findDataOptions = [];
    var replaceDataOptions = [];
    var bulkReplaceOptions = [];

    /* Creating the attributes list drop down dynamically */

    /* F & R */
    var $select = $('#attrOptions');
    $select.find('option').remove();
    for (var i = 0; i < columnData.length; i++) {
      if(columnData[i].findReplaceAllowed) {
        $('#attrOptions').append($("<option></option>").val(columnData[i].field).text(columnData[i].field));
      }
    }
    /* Bulk Update */
    var $select = $('#bulkAttrOptions');
    $select.find('option').remove();
    for (var i = 0; i < columnData.length; i++) {
      if(columnData[i].bulkUpdateAllowed) {
        $('#bulkAttrOptions').append($("<option></option>").val(columnData[i].field).text(columnData[i].field))
      }
    }

   
  
    var selectedAttribute = $("select#attrOptions option:checked").val();
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

      var selectedAttribute = $("select#attrOptions option:checked").val();
      
      _.forEach(gridData, function (value) {
        findDataOptions.push(value[selectedAttribute]);
      });
      findDataOptions = _.uniq(findDataOptions);

      _.forEach(gridData, function (value) {
        replaceDataOptions.push(value[selectedAttribute]);
      });
      replaceDataOptions = _.uniq(replaceDataOptions);

      /* Populate the drop down list for columns which are dropdown */
      
      for (var i = 0; i < columnData.length; i++) {
        if(columnData[i].field === selectedAttribute && columnData[i].cellEditor === 'select') {
          $('#replaceVal').hide();
          $('#replaceSelectValues').show();

          _.forEach(gridData, function (value) {
            $('#replaceSelectValues').append($("<option></option>").val(value[selectedAttribute]).text(value[selectedAttribute]));
          });
       
        } else {
          $('#replaceVal').show();
          $('#replaceSelectValues').hide();
        }
      }
      

      $('#findVal').typeahead('destroy');
      $('#replaceVal').typeahead('destroy');
      $('#findVal').typeahead({ source: findDataOptions });
      $('#replaceVal').typeahead({ source: replaceDataOptions });
    });


    $("#bulkAttrOptions").change(function () {
      bulkReplaceOptions.length = 0;
      var selectedAttribute = $("select#bulkAttrOptions option:checked").val();
      _.forEach(gridData, function (value) {
        bulkReplaceOptions.push(value[selectedAttribute]);
      });
      bulkReplaceOptions = _.uniq(bulkReplaceOptions);
      $('#bulkReplaceVal').typeahead('destroy');
      $('#bulkReplaceVal').typeahead({ source: bulkReplaceOptions });
    });


  }
};

document.getElementById('replaceAll').addEventListener("click", findAndReplace);
document.getElementById('updateAll').addEventListener("click", bulkUpdate);

document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

});