class CR_Nas_DB{

    list_db=[];

    onLoad(){
        if(localStorage.getItem("list_db")!=null) this.list_db=JSON.parse(localStorage.getItem("list_db"));
    }

    show_list_for_dashboard(){
        $.each(this.list_db,function(index,db){
            db["index"]=index;
            var dbServerItem=$(`
                <div class="col-6 col-md-3 col-lg-3">
                    <div role="button" class="card bg-dark border-rounder text-white w-100">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-server"></i> ${db.name}</h5>
                        <small class="card-text"><i class="fas fa-drum-steelpan"></i> ${db.id}
                            <i class="fas fa-database"></i> size:${nas.file.formatBytes(nas.file.SizePerBucket[db.id])}
                        </small>
                        <button class="btn btn-sm btn-dark btn_edit"><i class="fas fa-edit"></i> Edit</button>
                    </div>
                    </div>
                </div>
            `);

            $(dbServerItem).find(".btn_edit").click(()=>{
                cr_data.edit(db);
                return false;
            });

            $(dbServerItem).click(()=>{
                nas.upload_file(db.id,db.api_key);
            });
            $("#list_db").append(dbServerItem);
        });
    }

    add_db(){
        var data_db_new={
            "name":"",
            "id":"",
            "api_key":"",
            "id_sys":"db"+cr.create_id(4)
        };
        cr_data.edit(data_db_new,(data)=>{
            nas.db.list_db.push(data);
            nas.db.save();
            nas.db.show_list_db();
            cr.msg("Add databas success!","Add Db","Success");
        });
    }

    import_all(){

    }

    export_all(){
        cr.download(this.list_db,"list_db.json");
    }

    show_list_db(){
        nas.act_menu("db");
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">Database Manager</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.add_db();return false"><i class="fas fa-plus-square"></i> Add DB</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.import_all();return false">Import</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.export_all();return false"><i class="fas fa-file-download"></i> Export</button>';
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

        $.each(this.list_db,function(index,db){
            var itemBD=$(`
                <tr>
                    <td><i class="fas fa-server"></i> ${db.id}</td>
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
                nas.db.delete(index);
                return false;
            });

            $(itemBD).find(".btn_edit").click(()=>{
                nas.db.edit(index);
                return false;
            });
            $("#list_db").append(itemBD);
        });
    }

    delete(index){
        this.list_db.splice(index,1);
        this.show_list_db();
        this.save();
    }

    edit(index){
        var objEdit=this.list_db[index];
        cr_data.edit(objEdit,(data)=>{
            nas.db.list_db[index]=data;
            nas.db.show_list_db();
            nas.db.save();
        });
    }

    save(){
        localStorage.setItem("list_db",JSON.stringify(this.list_db));
    }
}
var nas_db=new CR_Nas_DB();
nas.db=nas_db;
