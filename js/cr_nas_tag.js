class CR_Nas_Tag{

    list_tag=[];

    onLoad(){
        if(localStorage.getItem("list_tag")!=null) this.list_tag=JSON.parse(localStorage.getItem("list_tag"));
    }

    show_list(){
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">Tag Manager</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.tag.show_add();return false"><i class="fas fa-plus-square"></i> Add Tag</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.tag.export();return false"><i class="fas fa-file-download"></i> Export</button>';
            html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="table-responsive">';
        html+='<table class="table table-striped table-hover table-sm text-left">';
        html+='<tbody id="list_tag"></tbody>';
        html+='</table>';
        html+='</div>';

        html+='</div>';
        $("#box_main").html(html);

        $.each(this.list_tag,function(index,t){
            var tItemm=$(`
                <tr>
                    <td><i class="fas fa-file"></i> ${t.name}</td>
                    <td>${t.note}</td>
                    <td class="tr_list_btn">
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `);
            $(tItemm).click(()=>{
                cr_data.info(t);
                nas.add_log(f,'tag');
            });

            $(tItemm).find(".btn_del").click(()=>{
                nas.tag.delete(index);
                return false;
            });

            $(tItemm).find(".btn_edit").click(()=>{
                nas.tag.edit(index);
                return false;
            });

            if(t.link!=""&&t.link!=null){
                var btn_link=$('<button class="btn btn-sm btn-success btn_link"><i class="fas fa-external-link-alt"></i> Open</button>');
                $(btn_link).click(()=>{
                    window.open(t.link,"_blank");
                });
                $(tItemm).find(".tr_list_btn").append(btn_link);
            }

            $("#list_tag").append(tItemm);
        });
    }

    show_add(){
        var linkData={
            "id_sys":"tag"+cr.create_id(5),
            "name":"",
            "note":"",
            "link":"",
            "date_create":cr_data.convertISOToLocalDatetime()
        };
        cr_data.add(linkData,(data)=>{
            if(data.name!=""){
                nas.tag.list_tag.push(data);
                nas.tag.save();
                nas.tag.show_list();
                nas.add_log(data,"tag");
                cr.msg("Add link success!","Add Tag","success");
            }else{
                cr.msg("Name tag not null!","Add tag fail","error");
            }
        });
        cr.box_title("Add Tag");
    }

    save(){
        localStorage.setItem("list_tag",JSON.stringify(this.list_tag));
    }

    edit(index){
        var objEdit=this.list_tag[index];
        cr_data.edit(objEdit,(data)=>{
            nas.file.list_tag[index]=data;
            nas.file.show_list();
            nas.file.save();
        });
    }

    delete(index){
        this.list_tag.splice(index,1);
        this.show_list();
        this.save();
    }

    export(){
        cr.download(this.list_tag,"list_tag.json");
    }
}
var nas_tag=new CR_Nas_Tag();
nas.tag=nas_tag;