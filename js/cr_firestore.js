class CR_Firestore{

    list_firestore=[];

    onLoad(){
        if(localStorage.getItem("list_firestore")!=null) this.list_firestore=JSON.parse(localStorage.getItem("list_firestore"));
    }

    show_list_for_dashboard(){
        $.each(this.list_firestore,function(index,db){
            db["index"]=index;
            var dbServerItem=$(`
                <div class="col-6 col-md-3 col-lg-3">
                    <div role="button" class="card bg-success border-rounder text-white w-100 m-1">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-fire-alt"></i> ${db.name}</h5>
                        <small class="card-text">
                            <i class="fas fa-database"></i> Firestore
                        </small>
                        <button class="btn btn-sm btn-dark btn_edit"><i class="fas fa-edit"></i> Edit</button>
                    </div>
                    </div>
                </div>
            `);

            $(dbServerItem).find(".btn_edit").click(()=>{
                cr_data.edit(db);
                nas.add_log(db,"db");
                return false;
            });

            if(db.link!=null){
                var btn_link=$('<button class="btn btn-sm btn-dark btn_edit"><i class="fas fa-link"></i> Open</button>');
                $(btn_link).click(()=>{ window.open(db.link,"_blank");});
                $(dbServerItem).find(".card-body").append(btn_link);
            }
            
            var url = `https://firestore.googleapis.com/v1/projects/${db.id}/databases/(default)/documents/about_us/?key=${db.api_key}`;
            $.ajax({
                url: url,
                method: 'GET',
                success: function(response) {
                    $(dbServerItem).find(".card-text").append('<small><i class="fas fa-signal"></i> Online</small>');
                },
                error: function(xhr, status, error) {
                    $(dbServerItem).find(".card-text").append('<small><i class="fas fa-exclamation-triangle"></i> Offline</small>');
                }
            });

            $("#list_db").append(dbServerItem);
        });
    }

    add_db(){
        var data_db_new={
            "name":"",
            "id":"",
            "api_key":"",
            "link":"",
            "id_sys":"db"+cr.create_id(4)
        };
        cr_data.edit(data_db_new,(data)=>{
            nas.firestore.list_firestore.push(data);
            nas.firestore.save();
            nas.firestore.show_list();
            cr.msg("Add databas success!","Add Db","Success");
        });
    }

    export_all(){
        cr.download(this.list_firestore,"list_firestore.json");
    }

    show_list(){
        nas.act_menu("firestore");
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">FireStore Manager</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.firestore.add_db();return false"><i class="fas fa-plus-square"></i> Add DB</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.firestore.export_all();return false"><i class="fas fa-file-download"></i> Export</button>';
            html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="table-responsive">';
            html+='<table class="table table-striped table-hover table-sm text-left">';
            html+='<tbody id="list_db"></tbody>';
            html+='</table>';
        html+='</div>';

        html+='</div>';
        $("#box_main").html(html);

        $.each(this.list_firestore,function(index,db){
            var itemBD=$(`
                <tr>
                    <td><i class="fas fa-fire-alt"></i> ${db.id}</td>
                    <td>${db.name}</td>
                    <td>${db.api_key}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
            `);
            $(itemBD).click(()=>{
                cr_data.info(db);
            });

            $(itemBD).find(".btn_del").click(()=>{
                nas.firestore.delete(index);
                return false;
            });

            $(itemBD).find(".btn_edit").click(()=>{
                nas.firestore.edit(index);
                return false;
            });
            $("#list_db").append(itemBD);
        });
    }

    delete(index){
        this.list_firestore.splice(index,1);
        this.show_list();
        this.save();
    }

    edit(index){
        var objEdit=this.list_firestore[index];
        cr_data.edit(objEdit,(data)=>{
            nas.firestore.list_firestore[index]=data;
            nas.firestore.show_list();
            nas.firestore.save();
        });
    }

    save(){
        localStorage.setItem("list_firestore",JSON.stringify(this.list_firestore));
    }
}
var nas_firestore=new CR_Firestore();
nas.firestore=nas_firestore;
