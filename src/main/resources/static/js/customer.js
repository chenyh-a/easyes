//global variables

var custid = 0;

function queryCustomer() {
   refreshList("#myTable", "#checkAll");
}

function editCustomer() {
   if (isDblClick()) return;
   var d = new Array();
   $("tbody input:checkbox:checked").each(function(index, item) {
      var cust = {};
      cust.customerid = $(this).val();
      d.push(cust);
   });
   if (d.length == 0) {
      error1("Edit error", "Please select a customer to edit.");
      return;
   }
   custid = d[0].customerid;
   queryOneCustomer();
}

function importChooseFile() {
   if (isDblClick()) return;
   $("#up_btn").click(function() {
      importCustomer();
   });
   $("#myUploadDialog").modal();
}

function importCustomer() {
   $("#d2").load("commons.html #myImportResult");
   if (isDblClick()) return;

   var cols = {
      customerid: "Customer Id",//db field: excel header name
      firstname: "First Name",
      lastname: "LastName",
      company: "Company",
      address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      postalcode: "Zip Code",
      phone: "Phone",
      fax: "Fax",
      email: "Email",
      supportrepid: "Support Rep Id",
    
   };

   var file1 = $("#myfile")[0].files[0];
   var formData = new FormData();
   formData.append("file1", file1);
   formData.append("method", "sp_imp_customer");
   formData.append("verifyMethod", "sp_imp_customer_verify");
   formData.append("cols", JSON.stringify(cols));//上传文件时表单变量不支持复杂结构，转为字符串传。
   uploadImport(formData);
}

function deleteCustomer() {
   if (isDblClick()) return;
   var obj = {
      method: "sp_del_customer",
      tag: "UPDATE",
   };
   obj.data = new Array();
   $("tbody input:checkbox:checked").each(function(index, item) {
      var obj2 = {};
      obj2.customerid = $(this).val();
      obj.data.push(obj2);
   });
   console.log("---delete ids=" + JSON.stringify(obj));
   if (obj.data.length == 0) {
      error1("Delete error", "Please select a customer to delete.");
      return;
   }

   confirm1('Delete data', 'Delete selected records. Are you sure?', function() {
      callajax("updateserver", obj);

   });
}


function proccessResult(obj) {

   if (obj.result == "FAIL") {
      error1("Operation failed", "Error: " + obj.message);
      return;
   }

   if (obj.method == "sp_get_customer_by_id" && obj.tag == "QUERY_ONE") {
      openEditCustomer(obj.data[0]);
   } else if (obj.method == "sp_upd_customer") {
      refreshList("#myTable", "#checkAll");
   } else if (obj.method == "sp_del_customer") {
      refreshList("#myTable", "#checkAll");
   } else if (obj.method == "sp_exp_customer") {
      refreshList("#myTable", "#checkAll");
      console.log("----export filename=" + obj.filename);
      $("#export_url").prop("href", obj.fileUrl);
      $("#export_url").text(obj.fileUrl);
      $("#exp_total").text(num(obj.totalNum));
      $("#exp_consumed").text(num(obj.consumed));
      info1("Export finished", "#myExportResult");

   } else if (obj.method == "sp_imp_customer") {
      refreshList("#myTable", "#checkAll");
      $("#upload_file").text(num(obj.sourceFile));
      $("#imp_total").text(num(obj.totalNum));
      $("#imp_success").text(num(obj.successNum));
      $("#imp_error").text(num(obj.errorNum));
      $("#imp_consumed").text(num(obj.consumed));
      if (obj.successNum > 0) {
         $("#imp_success").css("color", "darkgreen");
      }
      if (obj.errorNum > 0) {
         $("#imp_error").css("color", "red");
         $("#import_url").prop("href", obj.fileUrl);
         $("#import_url").text(obj.fileUrl);
         $("#imp_file").show();
      }
      info1("Import finished", "#myImportResult");
   } else if (obj.method == "sp_get_employee_sel") {
      $("#supportrepid").empty("");
      $(obj.data).each(function(index, d) {
         $("#supportrepid").append(new Option(d.lastname, d.employeeid));
      });
      $(".selectpicker").selectpicker("refresh");

      var obj = {};
      obj.method = "sp_get_customer_by_id";
      obj.tag = "QUERY_ONE";
      obj.data = { customerid: custid };
      callajax("getone", obj);//get one record after get select values

   }
}

function listCustomer() {
   var opt = new TOption();
   opt.searching = true;
   opt.paging = true;
   opt.pageLength = 13;
   opt.info = true;

   var columns = [
      { data: 'customerid' },
      { data: 'customerid' },
      { data: 'firstname' },
      { data: 'lastname' },
      { data: 'company' },
      { data: 'address' },
      { data: 'city' },
      { data: 'state' },
      { data: 'country' },
      { data: 'postalcode' },
      { data: 'phone' },
      { data: 'fax' },
      { data: 'email' },
      { data: 'supportrepid' },
      { data: 'create_by' },
      { data: 'create_date' },
      { data: 'update_by' },
      { data: 'update_date' },
   ];

   var columnsDefs = [{
      targets: 0, // column index start from 0
      orderable: false,
      render: function(id, type, data) { // use defined column content
         return '<input type="checkbox" value="' + data.customerid + '" name="id[]">';
      }
   },
   {
      targets: 4, // company
      render: $.fn.dataTable.render.ellipsis(25)//cut off if too long
   },
   {
      targets: 5, // address
      render: $.fn.dataTable.render.ellipsis(25)
   }
   ];
   var queryData = {
      tag: "CUSTOMER_LIST",
      method: "sp_get_customer_list",
   };

   showList("#myTable", "getlist", opt, columns, columnsDefs, queryData);
}

function exportCustomer() {
   $("#d1").load("commons.html #myExportResult");
   if (isDblClick()) return;

   var cols = {
      customerid: "Customer Id",// db field : excel header name
      firstname: "First Name",
      lastname: "LastName",
      company: "Company",
      Address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      postalcode: "Zip Code",
      phone: "Phone",
      fax: "Fax",
      email: "Email",
      supportrepid: "Support Rep Id",
      supportrep: "Support Rep.",
      
   }
   var obj = {};
   obj.method = "sp_exp_customer";
   obj.tag = "EXPORT";
   obj.filename = "export";//export file name without suffix;
   obj.autoSizeColumn = false;//autoSize excel column
   obj.watermark = false;//print userCode as watermark
   obj.cols = cols;
   obj.data = {};
   confirm1('Export data', 'Export data to excel file. Are you sure?', function() {
      callajax("exportserver", obj);
   });
}

$(document).ready(function() {
   listCustomer();

   $("#myUploadDialog").load("commons.html #upload_dialog");
   $("#myEditDialog").load("edit_customer.html #edit_dialog");


   // check all rows
   $("#checkAll").on("click", function() {
      var check = $(this).prop("checked");
      $("tbody input:checkbox").prop("checked", check);
   });

   // add table double click event
   var table = $('#myTable').DataTable();
   $('#myTable tbody').on('dblclick', 'tr', function() {
      custid = table.row(this).data().customerid;
      queryOneCustomer();
   });

});

function queryOneCustomer() {
   var obj = {};
   obj.method = "sp_get_employee_sel";// get select data firstly
   obj.tag = "QUERY_ONE";
   obj.data = {};
   callajax("getone", obj);
}

function openEditCustomer(data) {
   $("#edit_dialog input").each(function(index, item) {
      var v = eval('data.' + item.id);
      $(this).val(v);
   });

   $("#supportrepid").find("option").each(function() {
      if ($(this).val() == data.supportrepid) {
         $(this).attr("selected", true);
      }
   });
   $(".selectpicker").selectpicker("refresh");
   $("#myEditDialog").modal({
      backdrop: 'static',
      keyboard: false
   });
}

function newCustomer() {
   $("#edit_dialog input").each(function(index, item) {
      $(this).val("");
   });
   $("#myEditDialog").modal();
}

function saveCustomer() {

   var rec = {};
   rec.customerid = $("#customerid").val();
   rec.firstname = $("#firstname").val();
   rec.lastname = $("#lastname").val();
   rec.company = $("#company").val();
   rec.address = $("#address").val();
   rec.city = $("#city").val();
   rec.state = $("#state").val();
   rec.country = $("#country").val();
   rec.postalcode = $("#postalcode").val();
   rec.phone = $("#phone").val();
   rec.fax = $("#fax").val();
   rec.email = $("#email").val();
   rec.supportrepid = $("#supportrepid").val();
   if (rec.firstname == '' || rec.lastname == '' || rec.phone == '') {
      error1("Data Required", "Please input required field.");
      return;
   }
   var obj = {};
   obj.method = "sp_upd_customer";
   obj.tag = "UPDATE";
   obj.data = [rec];
   //confirm1('Save data', 'Save current record. Are you sure?', function() {
   $("#myEditDialog").modal("hide");
   callajax("updateserver", obj);
   //});
}