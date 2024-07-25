class CR_Nas{

    menu_cur="dashboard";

    onLoad(){
        cr.onLoad();
        cr.setColor("#88D66C");
        cr.add_btn_top();
        this.show_dashboard();
    }

    act_menu(id){
        this.menu_cur=id;
        $(".m-menu").removeClass("active");
        $("#m-"+id).addClass("active");
    }

    show_dashboard(){
        this.act_menu("dashboard");
        var html=`
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h2 class="h2 text-left">Server</h2>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group mr-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="nas.db.add_db();return false"><i class="fas fa-plus-square"></i> Add DB</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="nas.db.import_all();return false">Import</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="nas.db.export_all();return false"><i class="fas fa-file-download"></i> Export</button>
          </div>
        </div>
        </div>

        <form class="form-inline">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-cloud-upload-alt mr-1"></i>  Upload</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="fileInput">
              <label class="custom-file-label" for="fileInput">Choose file</label>
            </div>
            <div class="input-group-append">
              <span class="input-group-text" id="upload_delete">Delete</span>
            </div>
          </div>
        </form>

        <div class="row mb-3" id="list_db"></div>


        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 class="h2">Dashboard</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button class="btn btn-sm btn-outline-secondary">Share</button>
              <button class="btn btn-sm btn-outline-secondary">Export</button>
            </div>
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle">
              <span data-feather="calendar"></span> This week
            </button>
          </div>
        </div>

        <canvas class="my-4" id="myChart" width="900" height="380"></canvas>

        <h2><i data-feather="clock" class="fs-5"></i> Recently uploaded files</h2>
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Header</th>
                <th>Header</th>
                <th>Header</th>
                <th>Header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1,001</td>
                <td>Lorem</td>
                <td>ipsum</td>
                <td>dolor</td>
                <td>sit</td>
              </tr>
            </tbody>
          </table>
        </div>

        `;
        $("#box_main").html(html).ready(()=>{
            cr.loadJs("js/cr_nas_db.js","nas_db","onLoad");
            nas.load_char();
        });
    }

    load_char(){
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [{
              data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: '#808836',
              borderWidth: 4,
              pointBackgroundColor: '#808836'
            },{
              data: [15339, 20, 100, 22, 33, 24092, 500],
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: '#73BBA3',
              borderWidth: 4,
              pointBackgroundColor: '#73BBA3'
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]
            },
            legend: {
              display: false,
            }
          }
        });
    }

    upload_file(id_db,api_key){
        var fileInput = $('#fileInput')[0];
        var file = fileInput.files[0];
        if(file) {
          var storageUrl = 'https://firebasestorage.googleapis.com/v0/b/'+id_db+'/o?uploadType=multipart&name=' + encodeURIComponent(file.name);

          var formData = new FormData();
          formData.append('file', file);

          $.ajax({
              url: storageUrl,
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              headers: {
                  'Authorization': 'Bearer '+api_key
              },
              success: function(response) {
                  console.log('Upload successful', response);
                  cr.msg('Upload successful',"Upload File","success");
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.error('Upload failed', textStatus, errorThrown);
                  cr.msg("Upload Faield","Upload File","error");
              }
          });
      }else{
        cr.msg("Please Select File","None File","info");
      }
    }
}

var nas;

$(document).ready(function() {

    nas=new CR_Nas();
    nas.onLoad();
 
});