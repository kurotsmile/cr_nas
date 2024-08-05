class CR_Collection{

    list_collection=[];
    tag_show="";

    onLoad(){
        if(localStorage.getItem("list_collection")!=null) this.list_collection=JSON.parse(localStorage.getItem("list_collection"));
    }

    show_add() {
        var collectionData = {
            "id_sys": "collection" + cr.create_id(5),
            "name": "",
            "note": "",
            "tag": "",
            "date_create": cr_data.convertISOToLocalDatetime()
        };
        cr_data.add(collectionData, (data) => {
            nas.collection.list_collection.push(data);
            nas.collection.save();
            nas.collection.show_list();
            nas.add_log(data, "link");
            cr.msg("Add collection success!", "Add Collection", "success");
        }, nas.get_field_customer());
        cr.box_title("Add Collection");
    }

    save(){
        localStorage.setItem("list_collection",JSON.stringify(this.list_collection));
    }

    show_list(){
        nas.act_menu("firestore-collection");
        this.show_list_by_data(this.list_collection);
    }

    show_list_by_data(data_list){
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">Collection</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.collection.show_add();return false"><i class="fas fa-plus-square"></i> Add Link</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.collection.export();return false"><i class="fas fa-file-download"></i> Export</button>';
            html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="table-responsive">';
            html+='<table class="table table-striped table-hover table-sm text-left">';
            html+='<tbody id="list_file"></tbody>';
            html+='</table>';
        html+='</div>';

        html+='</div>';
        $("#box_main").html(html);

        data_list.sort(function(a, b) {
            return new Date(b.date_create) - new Date(a.date_create);
        });
        
        $.each(data_list,function(index,c){
            var tItemm=$(`
                <tr>
                    <td><i class="fas fa-dumpster-fire"></i> ${c.name}</td>
                    <td>${c.note}</td>
                    <td class="td_db"></td>
                    <td>${c.date_create}</td>
                    <td>
                        <button class="btn btn-sm btn-success btn_json"><i class="fas fa-database"></i> Get Json</button>
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `);

            $(tItemm).find(".btn_del").click(()=>{
                nas.collection.delete(index);
                return false;
            });

            $(tItemm).find(".btn_edit").click(()=>{
                nas.collection.edit(index);
                return false;
            });

            $(tItemm).find(".btn_json").click(()=>{
                cr.get_json(c.url,(data)=>{
                    nas.json.add(data,"json-"+c.note,c.url);
                    cr.msg("Add database json succes","Add json","success");
                });
                return false;
            });

            $.each(nas.firestore.list_firestore,function(index,db){
                var url = `https://firestore.googleapis.com/v1/projects/${db.id}/databases/(default)/documents/${c.name}/?key=${db.api_key}`;
                var btn_db=$('<button class="btn btn-sm ml-1 mr-1 btn-success"><i class="fas fa-fire-alt"></i> '+db.name+'</button>');
                $(btn_db).click(()=>{
                    $.ajax({
                        url: url,
                        method: 'GET',
                        success: function(response) {
                            alert(response.documents.length);
                            console.log(response);
                            cr_data.edit(response);
                        },
                        error: function(xhr, status, error) {
                            
                        }
                    });
                });
                $(tItemm).find(".td_db").append(btn_db);
            });

            $("#list_file").append(tItemm);
        });
    }

    delete(index){
        this.list_collection.splice(index,1);
        this.show_list();
        this.save();
    }

    edit(index){
        var objEdit=this.list_collection[index];
        cr_data.edit(objEdit,(data)=>{
            nas.collection.list_collection[index]=data;
            nas.collection.show_list();
            nas.collection.save();
        },nas.get_field_customer());
    }

    export(){
        cr.download(this.list_collection,"list_collection.json");
    }
}

var nas_collection=new CR_Collection();
nas.collection=nas_collection;