//alert("加载成功");
require.config({
   paths: {
      "jquery": "https://cdn.staticfile.org/jquery/2.1.1/jquery.min",
      "bootstrap": "https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min",
      "jdatatable": "https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min",
      "jwidget": ["https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui", "jquery.ui.widget"],
      //"fixedcolumn": "https://cdn.bootcdn.net/ajax/libs/datatables.net-fixedcolumns/4.1.0/dataTables.fixedColumns",
      "ellipsis": "https://cdn.datatables.net/plug-ins/1.12.1/dataRender/ellipsis",
      "crypto": "https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js",
      "jfileupload": "https://cdn.bootcdn.net/ajax/libs/jquery-file-upload/4.0.11/jquery.uploadfile",
      "jconfirm": "https://cdn.bootcdn.net/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min"
   },
   map: {
      "*": {
         'css': 'js/css'
      }
   },
//   shim: {
//      bootstrap: {
//         deps: ['css!https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css']
//      },
//      jconfirm: {
//         deps: ['css!https://cdn.bootcdn.net/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css']
//      }
//   }
});


require(['jquery', 'bootstrap', 'jdatatable', 'ellipsis', 'crypto', 'jconfirm', 'jwidget', 'jfileupload'],  //,'fixedcolumn'
   function($, _, jdatatable, ellipsis, crypto, jconfirm, jwidget, jfileupload) {
      $(document).ready(function() {
         $("#myId").text("AAAAAA");
         confirm1('a', 'bbbbb');

      });

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

   });

//require(['jquery', 'bootstrap', 'jdatatable', 'fixedcolumn', 'ellipsis', 'crypto', 'jwidget', 'jtransport', 'jfileupload', 'jconfirm'],
 //  function($, _, jdatatable, fixedcolumn, ellipsis, crypto, jwidget, jtransport, jfileupload, jconfirm) {
 //     $("#myTest").text("AAAAAA");
  // });