class CR_Nas{

    menu_cur="dashboard";

    onLoad(){
        cr.onLoad();
        cr.setColor("#88D66C");
        cr.add_btn_top();
        this.show_dashboard();
        cr.loadJs("js/cr_nas_file.js","nas_file","onLoad");
        cr.loadJs("js/cr_nas_link.js","nas_link","onLoad");
    }

    act_menu(id){
        this.menu_cur=id;
        $(".m-menu").removeClass("active");
        $("#m-"+id).addClass("active");
    }

    show_dashboard(){
        this.act_menu("dashboard");
        cr.get("dashboard.html",(data)=>{
          $("#box_main").html(data).ready(()=>{
              cr.loadJs("js/cr_nas_db.js","nas_db","onLoad");
              nas.load_char();
          });
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
                  nas.file.add(response);
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

    show_setting(){
      cr.show_setting();
    }

    show_all_file(){
      this.act_menu("file");
      nas.file.show_list();
    }

    show_all_link(){
      this.act_menu("link");
      nas.link.show_list();
    }
}

var nas;

$(document).ready(function() {

    nas=new CR_Nas();
    nas.onLoad();
 
});