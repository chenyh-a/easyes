const reg = /(\d)(?=(?:\d{3})+$)/g;
//global variables
var loginInfo = { userCode: "chenyh", roleCode: "ADMIN" };// test only

Date.prototype.format = function(fmt) {
   var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "H+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3), //season
      "S": this.getMilliseconds()
   };
   if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
   }
   for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
   }
   return fmt;
}

function num(n) {
   return n.toString().replace(reg, '$1,');
}

var lastTime = 0;

function isDblClick() {
   var d = new Date();
   var n = d.getTime();
   if (n - lastTime < 1000) {
      return true;// avoid double click
   }
   lastTime = n;
   return false;
}
function callajax(serverurl, obj) {
   obj.userCode = loginInfo.userCode;
   obj.roleCode = loginInfo.roleCode;
   var token = "" + new Date().getTime();//test
   var appkey = "app1234567890";//test
   var noncestr = Math.random().toString(36).substring(2, 15);
   var req = JSON.stringify(obj);
   var timestamp = new Date().format("yyyyMMddHHmmss");
   var string1 = "appkey" + appkey + "noncestr" + noncestr + "reqstr" + req + "timestamp" + timestamp;
   var signtype = "SHA-1";//SHA-1 or HMAC-SHA256

   //var signature = CryptoJS.SHA1(string1);
   var signature = "c3a2510fe23310c35f6bc395ad8e093f232b2e9d";//for test
   //console.log("signature=" + signature);
   //console.log("string1=" + string1);

   $(document.body).css("cursor", "progress");

   console.log("----ajax-obj=" + JSON.stringify(obj));

   $.ajax({
      type: "post",
      url: serverurl,
      async: true,
      dataType: "json",
      contentType: 'application/json;charset=UTF-8',
      headers: {
         accept: "application/json;charset=utf-8",
         token: token,
         appkey: appkey,
         noncestr: noncestr,
         reqstr: encodeURIComponent(req),
         timestamp: timestamp,
         signtype: signtype,
         signature: signature
      },
      data: req,
      success: function(result, status) {
         console.log("---ajax-result=" + JSON.stringify(result));
         $(document.body).css("cursor", "default");
         proccessResult(result);
      },
      error: function(xhr) {
         $(document.body).css("cursor", "default");
         console.log("---ajax-Error:" + xhr.status + " " + xhr.statusText);
      }
   });
}

function uploadImport(formData) {
 
   formData.append("userCode", loginInfo.userCode);
   formData.append("roleCode", loginInfo.roleCode);
   formData.append("tag", "IMPORT");
   formData.append("token", "" + new Date().getTime());//required for import
   
   confirm1('Import data', 'Import selected file into database. Are you sure?', function() {
      $("#myUploadDialog").modal('hide'); //close dialog manually
      $(document.body).css("cursor", "progress");
      $.ajax({
         url: 'importserver',
         type: 'post',
         data: formData,
         contentType: false,
         processData: false,
         success: function(result, status) {
            console.log("---ajax-result=" + result);
            $(document.body).css("cursor", "default");
            proccessResult(JSON.parse(result));
         },
         error: function(xhr) {
            $(document.body).css("cursor", "default");
            console.log("---ajax-Error:" + xhr.status + " " + xhr.statusText);
         }
      });
   });
}

class TOption {
   constructor() {
      this.processing = true;
      this.order = [[1, "asc"]];
      this.serverSide = true;
      this.scrollCollapse = true;
      this.fixedColumns = { left: 2 };
      this.displayStart = 0;
      this.pageLength = 10;
      this.autoWidth = true;
      this.pagingType = "simple_numbers";
      this.paging = true;
      this.ordering = true;
      this.searching = true;
      this.info = true;
      this.scrollX = true;
      this.scrollY = "600px";
      this.select = true;
      this.lengthMenu = [10, 13, 20, 30, 50, 100, 200, 500];
   }
}

function showList(tableId, url, opt, columns, columnsDefs, queryData) {
   queryData.userCode = loginInfo.userCode;
   queryData.roleCode = loginInfo.roleCode;
   $(tableId).DataTable({
      //dom: '<"pull-left"B><"pull-right"f>rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',//bootstrap3
      //dom: '<"float-left"B><"float-right"f>rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',//bootstrap4
      processing: opt.processing,
      order: opt.order,
      serverSide: opt.serverSide,
      scrollCollapse: opt.scrollCollapse,//分页挨着表格
      fixedColumns: opt.fixedColumns,
      displayStart: opt.displayStart,
      pageLength: opt.pageLength,
      autoWidth: opt.autoWidth,
      pagingType: opt.pagingType,
      ordering: opt.ordering,
      paging: opt.paging,
      searching: opt.searching,//显示搜索框
      info: opt.info, //显示第N-M条和总记录数
      scrollX: opt.scrollX,
      scrollY: opt.scrollY,
      select: opt.select,
      lengthMenu: opt.lengthMenu,
      columnDefs: columnsDefs,
      columns: columns,

      ajax: {
         type: 'get',
         url: url,
         data: function(data) {// user defined data
            return $.extend({}, data, queryData);
         }
      },
      language: {
         lengthMenu: 'Display _MENU_ records per page',
         //lengthMenu: '每页显示 _MENU_ 条数据',
         zeroRecords: 'Nothing found - sorry',
         info: 'Showing page _PAGE_ of _PAGES_',
         //info: '第 _PAGE_/_PAGES_ 页',
         infoEmpty: 'No records available',
         infoFiltered: '(filtered from _MAX_ total records)',
         emptyTable: "No data available in table",
         infoPostFix: "",
         thousands: ",",
         search: "Search:",
         paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            //next: "后一页",
            previous: "Previous"
            //previous: "前一页"
         },
         aria: {
            sortAscending: ": activate to sort column ascending",
            sortDescending: ": activate to sort column descending"
         }
      },

   });
}


function error1(title1, content1) {
   $.alert({
      title: title1,
      // 'white', 'black', 'material' , 'bootstrap'
      theme: "bootstrap",
      icon: "glyphicon glyphicon-remove",
      content: content1,
      buttons: {
         ok: {
            text: "OK"
         }
      }
   });
}
function info1(title1, contentid) {
   $(contentid).prop("display", "block");
   $.alert({
      title: title1,
      // 'white', 'black', 'material' , 'bootstrap'
      theme: "bootstrap",
      width: "auto",
      icon: "glyphicon glyphicon-info-sign",
      content: $(contentid),
      buttons: {
         ok: {
            text: "OK"
         }
      }
   });
}

function confirm1(title1, content1, callback) {
   $.confirm({
      title: title1,
      // 'white', 'black', 'material' , 'bootstrap'
      theme: "bootstrap",
      width: "auto",
      icon: "glyphicon glyphicon-question-sign",
      content: content1,
      buttons: {
         ok: {
            text: "OK",
            action: function() {
               if (callback) {
                  callback();
               }
            },
         },
         cancel: {
            text: "Cancel",
            action: function() {
            }
         }
      }
   });
}

function refreshList(tableId, checkAllId) {
   $(tableId).dataTable().fnDraw(true);
   if (checkAllId != "") {
      $(checkAllId).prop("checked", false);
   }
}

$(document).ready(function() {
   $.fn.dataTableExt.sErrMode = "console";
   $.fn.dataTable.render.ellipsis = function(cutoff, wordbreak, escapeHtml) {
      var esc = function(t) {
         return t
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
      };

      return function(d, type, row) {
         // Order, search and type get the original data
         if (type !== 'display') {
            return d;
         }
         if (typeof d !== 'number' && typeof d !== 'string') {
            return d;
         }

         d = d.toString(); // cast numbers

         if (d.length < cutoff) {
            return d;
         }
         var shortened = d.substr(0, cutoff - 1);
         // Find the last white space character in the string
         if (wordbreak) {
            shortened = shortened.replace(/\s([^\s]*)$/, '');
         }
         // Protect against uncontrolled HTML input
         if (escapeHtml) {
            shortened = esc(shortened);
         }
         return '<span class="ellipsis" title="' + esc(d) + '">' + shortened + '&#8230;</span>';
      };
   };
   $("#myNav").load("bootstrap.html #navMenu");
});