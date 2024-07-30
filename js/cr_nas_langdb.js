class CR_Nas_LangDB{

    list_url_data_lang=[
        "https://raw.githubusercontent.com/kurotsmile/Database-Store-Json/main/lang.json",
        "https://www.googleapis.com/drive/v3/files/1TUObqv-6R0Vp7dfmNekijZB61o_HqZQp?alt=media&key=AIzaSyDKcjH_bDJz3EcqPdV5i62IZNVQ6EkyOFg"
    ];

    lang="en";

    obj_lang=null;
    obj_lang_default={"key":"test"};
    list_country=null;

    type_import="all";

    show(){
        var html='';

        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';
            html+='<h2 class="h2 text-left">Lang Config Editor ('+this.lang+')</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';

                html+='<div class="btn-group mr-2">';
                    html+='<button onClick="Nas_langDB.save();" class="btn btn-sm btn-outline-success"><i class="fas fa-save"></i> Save</button>';
                    html+='<form class="form-inline">';
                    html+='<div class="input-group">';
                    html+='<div class="input-group-prepend">';
                        html+='<span class="input-group-text"><i class="fas fa-cloud-upload-alt mr-1"></i></span>';
                        html+='</div>';
                        html+='<div class="custom-file">';
                        html+='<input type="file" class="custom-file-input" id="fileInput">';
                        html+='<label class="custom-file-label" for="fileInput">Choose file</label>';
                        html+='</div>';
                        html+='</div>';
                    html+=' </form>';

                    html+='<button id="btntypeimportall" class="btn btn-sm btn-secondary m-type-import '+(this.type_import==='all'? "active":"all")+'" onclick="Nas_langDB.set_type_impot(\'all\');return false"><i class="fas fa-border-all"></i> All Lang</button>';
                    html+='<button id="btntypeimportone" class="btn btn-sm btn-secondary m-type-import '+(this.type_import==='one'? "active":"one")+'" onclick="Nas_langDB.set_type_impot(\'one\');return false"><i class="far fa-square"></i> One Lang</button>';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.langDB.paste_object();return false"><i class="fas fa-clipboard"></i> Paste clipboard</button>';
                html+='</div>';

                html+='<div class="btn-group mr-2">';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="Nas_langDB.show_add_field();return false"><i class="fas fa-plus-square"></i> Add Field</button>';
                    html+='<button class="btn btn-sm btn-outline-secondary" onclick="Nas_langDB.export();return false"><i class="fas fa-file-download"></i></button>';
                html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="table-responsive" id="list_country"></div>';

        html+='<div class="table-responsive">';
            html+='<div class="table table-striped table-hover table-sm text-left" id="list_db_field"></div>';
        html+='</div>';

        html+='<div class="table-responsive" id="list_btn">';
            html+='<button onClick="Nas_langDB.save();" class="btn btn-lg btn-success m-1"><i class="fas fa-save"></i> Save</button>';
            html+='<button class="btn btn-lg btn-success m-1" onclick="Nas_langDB.export();return false"><i class="fas fa-file-download"></i> Export</button>';
            html+='<button class="btn btn-success m-1" onclick="Nas_langDB.save_to_json();return false"><i class="fas fa-database"></i> Save to json</button>';
            html+='<button onClick="Nas_langDB.download_obj_json_cur();" class="btn btn-light m-1"><i class="fas fa-file-download"></i> Download Object Curnet</button>';
            html+='<button class="btn btn-light m-1" onclick="nas.langDB.paste_object();return false"><i class="fas fa-clipboard"></i> Paste clipboard</button>';
        html+='</div>';
        $("#box_main").html(html);
        $('#fileInput').on('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var jsonContent = JSON.parse(e.target.result);
                        if (typeof jsonContent === 'object') {
                            if(Nas_langDB.type_import=="all"){
                                Nas_langDB.lang="en";
                                Nas_langDB.obj_lang=jsonContent;
                                Nas_langDB.loadByObject();
                            }else{
                                Nas_langDB.import_object_json_one(jsonContent);
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
        
        this.loadByObject();
    }

    import_object_json_one(data){
        $(".inp_db").each(function(index,emp){
            var k=$(emp).attr("db-key");
            if(data[k]!=null) $(emp).val(data[k]);
            delete data[k];
        });

        $.each(data,function(k,v){
            $("#list_db_field").append(cr_data.itemField(k,v));
        });
    }

    loadListLang(){
        if(this.list_country==null){
            cr.get_json(cr.random(this.list_url_data_lang),(data)=>{
                Nas_langDB.list_country=data["all_item"];
                Nas_langDB.loadDataListCountry(Nas_langDB.list_country);
            });
        }else{
            this.loadDataListCountry(this.list_country);
        }
    }

    loadDataListCountry(data){
        $("#list_country").html('');
        $.each(data,function(index,c){
            var sClass='btn-light';
            if(Nas_langDB.obj_lang!=null){
                if(Nas_langDB.obj_lang[c.key]!=null) sClass="btn-success";
            }
            var itemC=$('<button role="button" class="btn m-lang '+(Nas_langDB.lang===c.key? "active":c.key)+' btn-sm m-1 '+sClass+'">'+c.name+'</button>');
            $(itemC).click(function(){
                $(".m-lang").removeClass("active");
                $(this).addClass("active");
                Nas_langDB.lang=c.key;
                Nas_langDB.show();
            });
            $("#list_country").append(itemC);
        });
    }

    loadByObject(){
        this.loadListLang();
        var objCur=null;
        this.obj_lang_default={"key_new":""};
        if(this.obj_lang!=null){
            this.obj_lang_default=this.obj_lang["en"];
            if(this.obj_lang[this.lang]!=null) objCur=this.obj_lang[this.lang];
        }
        if(objCur==null) objCur={"key":"lang "+this.lang};
        $("#list_db_field").html('');
        $.each(this.obj_lang_default,function(k,v){
            var val_field='';
            if(objCur[k]!=null) val_field=objCur[k];
            $("#list_db_field").append(cr_data.itemField(k,val_field,null,v));
        });

        $(".inp_db").each(function(index,emp){
            var p=$(emp).parent();
            var db_key=$(emp).attr("db-key");
            var txt=$("#"+db_key+"_tip").html();
            var btn_translate=$('<button class="btn btn-light input-group-text"><i class="fas fa-language"></i></button>');
            $(btn_translate).click(function(){
                $(this).removeClass("btn-light").removeClass("input-group-text").addClass("btn-success");
                window.open("https://translate.google.com/?sl=en&tl="+nas.langDB.lang+"&text="+encodeURIComponent(txt)+"&op=translate","blank");
            });

            var btn_translate_auto=$('<button class="btn btn-light input-group-text"><i class="fas fa-globe-americas"></i></button>');
            $(btn_translate_auto).click(function(){
                cr.tr(txt,$(emp),nas.langDB.lang);
                return false;
            });
            $(p).find(".input-group-append").append(btn_translate);
            $(p).find(".input-group-append").append(btn_translate_auto);
        });
    }

    save(){
        var db={};
            $(".inp_db").each(function(index,emp){
                var db_key=$(emp).attr("db-key");
                var db_val=$(emp).val();
                db[db_key]=db_val;
            });
        if(this.obj_lang==null)this.obj_lang={};
        this.obj_lang[this.lang]=db;
        cr.msg("Save success ("+this.lang+")!","Langs","success");
        this.loadListLang();
    }

    export(){
        if(this.obj_lang!=null){
            cr.download(this.obj_lang,"langs.json");
        }else{
            cr.msg("Not data","Langs","error");
        }
    }
    
    show_add_field(){
        cr.input("Add new Field",'Key new',(val)=>{
            if(Nas_langDB.obj_lang==null){
                Nas_langDB.obj_lang={};
                Nas_langDB.obj_lang["en"]={};
                Nas_langDB.obj_lang["en"][val]="";
            }else{
                Nas_langDB.obj_lang["en"][val]="";
            }
            Nas_langDB.loadByObject();
        });
    }

    set_type_impot(type){
        this.type_import=type;
        $(".m-type-import").removeClass("active");
        $("#btntypeimport"+type).addClass("active");
    }

    download_obj_json_cur(){
        var db={};
        $(".inp_db").each(function(index,emp){
            var k=$(emp).attr("db-key");
            db[k]=$(emp).val();
        });
        cr.download(db,"object.json");
        Nas_langDB.set_type_impot("one");
    }

    paste_object(){
        cr.paste(null,(txt)=>{
            Nas_langDB.import_object_json_one(JSON.parse(txt));
            nas.add_log(JSON.parse(txt));
        });
    }

    save_to_json(){
        nas_json.add(this.obj_lang,"","Lang Editor database");
        cr.msg("Save to json database success!","Save to json Database","success");
    }

    loadData(data){
        console.log(data);
        this.lang="en";
        this.obj_lang=data;
        this.show();
    }
}
var Nas_langDB=new CR_Nas_LangDB();
nas.langDB=Nas_langDB;