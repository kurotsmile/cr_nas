class CR_Nas_LangDB{

    list_url_data_lang=[
        "https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/lang.json",
        "https://www.googleapis.com/drive/v3/files/1TUObqv-6R0Vp7dfmNekijZB61o_HqZQp?alt=media&key=AIzaSyDKcjH_bDJz3EcqPdV5i62IZNVQ6EkyOFg"
    ];

    lang="en";

    obj_lang={
        "en":{"key":""}
    }

    show(){
        var html='';

        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';
            html+='<h2 class="h2 text-left">Lang Config Editor</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
                html+='<div class="btn-group mr-2">';
                    html+='<form class="form-inline">';
                    html+='<div class="input-group">';
                    html+='<div class="input-group-prepend">';
                        html+='<span class="input-group-text"><i class="fas fa-cloud-upload-alt mr-1"></i>  Upload</span>';
                        html+='</div>';
                        html+='<div class="custom-file">';
                        html+='<input type="file" class="custom-file-input" id="fileInput">';
                        html+='<label class="custom-file-label" for="fileInput">Choose file</label>';
                        html+='</div>';
                        html+='</div>';
                    html+=' </form>';
                html+='</div>';

                html+='<div class="btn-group mr-2">';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.add_db();return false"><i class="fas fa-plus-square"></i> Add Field</button>';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.import_all();return false"><i class="fas fa-file-upload"></i> Import</button>';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.export_all();return false"><i class="fas fa-file-download"></i> Export</button>';
                html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="table-responsive" id="list_country"></div>';

        html+='<div class="table-responsive">';
        html+='<table class="table table-striped table-hover table-sm text-left">';
        html+='<tbody id="list_db_field"></tbody>';
        html+='</table>';
        html+='</div>';

        html+='</div>';
        $("#box_main").html(html);

        cr.get_json(cr.random(this.list_url_data_lang),(data)=>{
            var list_country=data["all_item"];
            $.each(list_country,function(index,c){
                var itemC=$('<button role="button" class="btn m-lang '+(Nas_langDB.lang===c.key? "active":c.key)+' btn-sm m-1 btn-light">'+c.name+'</button>');
                $(itemC).click(function(){
                    $(".m-lang").removeClass("active");
                    $(this).addClass("active");
                });
                $("#list_country").append(itemC);
            });
        });

        $('#fileInput').on('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var jsonContent = JSON.parse(e.target.result);
                        if (typeof jsonContent === 'object') {
                            if (Array.isArray(jsonContent)) {
                                Nas_langDB.obj_lang=jsonContent;
                                Nas_langDB.loadByObject(jsonContent);
                            } else if (jsonContent === null) {
                                cr.msg("File config lang là object trống","Import","error");
                            } else {
                                Nas_langDB.obj_lang=jsonContent;
                                Nas_langDB.loadByObject(jsonContent);
                            }
                        } else {
                            cr.msg("File config lang không đúng định dạng","Import","error");
                        }
                    } catch (error) {
                        cr.msg(error,"Error","error");
                    }
                };
                reader.readAsText(file);
            }
          });
    }

    loadByObject(){
        $.each(this.obj_lang[this.lang],function(k,v){
            $("#list_db_field").append('<tr><td>'+k+'</td><td>'+v+'</td></tr>');
        });
    }
}
var Nas_langDB=new CR_Nas_LangDB();
nas.langDB=Nas_langDB;