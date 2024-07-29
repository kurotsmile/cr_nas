class CR_Nas{

    menu_cur="dashboard";

    log_obj=[];

    onLoad(){
        cr.onLoad();
        cr.setVer("0.0.2");
        cr.setColor("#88D66C");
        cr.add_btn_top();
        cr.loadJs("js/cr_nas_db.js","nas_db","onLoad");
        cr.loadJs("js/cr_nas_file.js","nas_file","onLoad");
        cr.loadJs("js/cr_nas_link.js","nas_link","onLoad");
        cr.loadJs("js/cr_nas_tag.js","nas_tag","onLoad");
        cr.loadJs("js/cr_nas_json.js","nas_json","onLoad");
        setTimeout(()=>{
          nas.show_dashboard();
        },500)
    }

    act_menu(id){
        this.menu_cur=id;
        $(".m-menu").removeClass("active");
        $("#m-"+id).addClass("active");
    }

    show_dashboard(){
        this.act_menu("dashboard");
        cr.get("dashboard.html?v="+cr.ver,(data)=>{
          $("#box_main").html(data).ready(()=>{
              nas.db.show_list_for_dashboard();
              cr.loadJs("js/cr_nas_chart.js","nas_chart","load_char");
          });
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

    check(url) {
      fetch(url, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            cr.msg("File Good","Check File","success");
          } else {
            cr.msg(`File at ${url} does not exist. Status: ${response.status}`,"Check File","error");
          }
        })
        .catch(error => {
          console.error();
          cr.msg(`Error checking file status: ${error}`,"Check File","error");
        });
    }

    export(){
      var objExport={};
      objExport["list_db"]=nas.db.list_db;
      objExport["list_file"]=nas.file.list_file;
      objExport["list_link"]=nas.link.list_link;
      objExport["list_tag"]=nas.tag.list_tag;
      objExport["list_json"]=nas.json.list_data;
      cr.download(objExport,"backup.json");
    }

    import(){
      var formImport=$(`
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h2 class="h2 text-left">Import</h2>
        </div>

        <form class="form-inline">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-cloud-upload-alt mr-1"></i>  Upload</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="fileUpload">
              <label class="custom-file-label" for="fileInput">Choose file</label>
            </div>
          </div>
        </form>
        
      `);
      $("#box_main").html("");
      $("#box_main").append(formImport);

      $('#fileUpload').on('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var jsonContent = JSON.parse(e.target.result);
                    if(jsonContent["list_db"]){
                        nas.db.list_db=jsonContent["list_db"];
                        nas.db.save();
                    }

                    if(jsonContent["list_link"]){
                      nas.link.list_link=jsonContent["list_link"];
                      nas.link.save();
                    }

                    if(jsonContent["list_file"]){
                      nas.file.list_file=jsonContent["list_file"];
                      nas.file.save();
                    }

                    if(jsonContent["list_tag"]){
                      nas.tag.list_tag=jsonContent["list_tag"];
                      nas.tag.save();
                    }

                    if(jsonContent["list_json"]){
                      nas.json.list_data=jsonContent["list_json"];
                      nas.json.save();
                    }
                    
                    Swal.close();
                } catch (error) {
                    cr.msg(error,"Error","error");
                }
            };
            reader.readAsText(file);
        }
      });
    }

    show_lang_db(){
      this.act_menu("lang-db");
      cr.loadJs("js/cr_nas_langdb.js","Nas_langDB","show");
    }

    add_log(data,type_sys="object"){
      data["type_sys"]=type_sys;
      this.log_obj.push(data);
      this.show_log();
    }

    show_log(){
      $("#list_log").html('');
      this.log_obj.reverse();
      $.each(this.log_obj,function(index,o){
          var icon='<i class="fas fa-box"></i>';
          if(o.type_sys=="link") icon='<i class="fas fa-link"></i>';
          if(o.type_sys=="db") icon='<i class="fas fa-server"></i>';
          if(o.type_sys=="file") icon='<i class="fas fa-file"></i>';
          var item_log=$(`
              <li class="nav-item">
                <a class="nav-link name_log">
                  ${icon} ${o.type_sys}
                </a>
              </li>
          `);
          $(item_log).click(()=>{
            cr_data.info(o);
          });
          $("#list_log").append(item_log);
      });
    }

    clear_log(){
      $("#list_log").html('');
      this.log_obj=[];
      $("#list_log").html('<li class="nav-item"><a class="nav-link text-muted" ><i class="fas fa-hands-wash"></i> None Item</a></li>');
    }

    show_tag(){
      this.act_menu("tag");
      nas.tag.show_list();
    }

    show_json(){
      this.act_menu("json");
      nas.json.show_list();
    }

    get_field_customer(){
      var fieldCustomer={};
      var tag={};
      tag["type"]="list";
      tag["datas"]=[];
      tag["name"]="tag";
      tag["datas"].push({value:"",label:"None"});
      $.each(nas.tag.list_tag,function(index,t){
        tag["datas"].push({value:t.name,label:t.name});
      });
      fieldCustomer["tag"]=tag;
      return fieldCustomer;
    }
}

var nas;

$(document).ready(function() {

    nas=new CR_Nas();
    nas.onLoad();
 
});