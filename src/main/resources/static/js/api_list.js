
var apiName = "";
var oid = 0;

function queryApiList() {
   refreshList("#apiList", "");
}

function proccessResult(obj) {
   if (obj.result == "FAIL") {
      error1("Operation failed", "Error: " + obj.message);
      return;
   }
}

function listApi() {
   var opt = new TOption();
   opt.pageLength = 10;

   var columns = [
      { data: 'db' },
     // { data: 'oid' },
      { data: 'name' },
      { data: 'comment' },
      { data: 'created' },
      { data: 'modified' },
   ];
   var columnsDefs = [];
   var queryData = {
      method: "sp_get_api_list",
      data: { db: "test" }
   };
   showList("#apiList", "getlist", opt, columns, columnsDefs, queryData);
}

$(document).ready(function() {
   listApi();
   var table = $('#apiList').DataTable();
   $('#apiList tbody').on('click', 'tr', function() {
      apiName = table.row(this).data().name;
      oid = table.row(this).data().oid;
      listParams();
   });

});

function listParams() {
   var table = $('#paramList').dataTable();
   table.fnClearTable();
   table.fnDestroy();

   var opt = new TOption();
   opt.searching = false;
   opt.paging = false;
   opt.pageLength = 15;
   opt.info = false;

   var columns = [
      { data: 'api_name' },
      { data: 'parameter_name' },
      { data: 'parameter_type' },
      { data: 'data_type' }
   ];
   var columnsDefs = [];
   var queryData = {
      tag: "PARAMS_LIST",
      method: "sp_get_api_params",
      data: { db: "test", name: apiName, oid: oid }
   };

   showList("#paramList", "getlist", opt, columns, columnsDefs, queryData);
}