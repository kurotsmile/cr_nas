class CR_Nas_DB{

    list_db=[];

    onLoad(){
        if(localStorage.getItem("list_db")!=null) this.list_db=JSON.parse(localStorage.getItem("list_db"));

        $.each(this.list_db,function(index,db){
            db["index"]=index;
            var dbServerItem=$(`
                <div class="col-6 col-md-3 col-lg-3">
                    <div role="button" class="card bg-dark border-rounder text-white w-100">
                    <div class="card-body">
                        <div class="card-title"><i class="fas fa-server"></i> ${db.name}</div>
                        <div class="card-text">${db.id}</div>
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
            console.log(data);
            nas.list_db.push(data);
            localStorage.setItem("list_db",JSON.stringify(nas.list_db));
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
        $("#box_main").html("sdsd");
    }
}
var nas_db=new CR_Nas_DB();
nas.db=nas_db;
