class CR_Nas_Link{

    list_link=[];
    tag_show="";

    onLoad(){
        if(localStorage.getItem("list_link")!=null) this.list_link=JSON.parse(localStorage.getItem("list_link"));
    }

    show_add(){
        var linkData={
            "id_sys":"link"+cr.create_id(5),
            "url":"",
            "note":"",
            "tag":"",
            "date_create":cr_data.convertISOToLocalDatetime()
        };
        cr_data.add(linkData,(data)=>{
            if(data.url!=""){
                nas.link.list_link.push(data);
                nas.link.save();
                nas.link.show_list();
                nas.add_log(data,"link");
                cr.msg("Add link success!","Add Link","success");
            }else{
                cr.msg("Url link not null!","Add link fail","error");
            }
        },nas.get_field_customer());
        cr.box_title("Add link");
    }

    save(){
        localStorage.setItem("list_link",JSON.stringify(this.list_link));
    }

    show_list(){
        this.show_list_by_data(this.list_link);
    }

    show_list_by_data(data_list){
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">Link Manager</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
            
                html+='<div class="dropdown">';
                    html+='<button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">';
                        html+='<i class="fas fa-filter"></i> Filter by tag';
                    html+='</button>';
                    html+='<div class="dropdown-menu">';
                        html+='<a class="dropdown-item  '+(nas.link.tag_show===""?"active":"")+'" href="#" onclick="nas.link.show_list_by_tag(\'\');return false;">All</a>';
                        $.each(nas.tag.list_tag,function(index,t){
                            html+='<a class="dropdown-item '+(t.name===nas.link.tag_show?"active":t.name)+'" href="#" onclick="nas.link.show_list_by_tag(\''+t.name+'\');return false;">'+t.name+'</a>';
                        })
                    html+='</div>';
                html+='</div>';

                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.link.show_add();return false"><i class="fas fa-plus-square"></i> Add Link</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.link.paste();return false"><i class="fas fa-clipboard"></i> Paste clipboard</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.link.export();return false"><i class="fas fa-file-download"></i> Export</button>';
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
        
        $.each(data_list,function(index,l){
            var tItemm=$(`
                <tr>
                    <td><i class="fas fa-link"></i></td>
                    <td>${l.note}</td>
                    <td class="td_link" title="${l.url}"><a href="${l.url}" target="_blank">${l.url}</a></td>
                    <td>${l.date_create}</td>
                    <td>
                        <button class="btn btn-sm btn-info btn_check"><i class="fas fa-check-double"></i> Check</button>
                        <button class="btn btn-sm btn-success btn_json"><i class="fas fa-database"></i> Get Json</button>
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `);
            $(tItemm).click(()=>{
                cr_data.info(l);
                nas.add_log(l,"link");
            });

            $(tItemm).find(".btn_del").click(()=>{
                nas.link.delete(index);
                return false;
            });

            $(tItemm).find(".btn_edit").click(()=>{
                nas.link.edit(index);
                return false;
            });

            $(tItemm).find(".btn_check").click(()=>{
                nas.check(l.url);
                return false;
            });

            $(tItemm).find(".btn_json").click(()=>{
                cr.get_json(l.url,(data)=>{
                    nas.json.add(data,"json-"+l.note,l.url);
                    cr.msg("Add database json succes","Add json","success");
                });
                return false;
            });

            $("#list_file").append(tItemm);
        });
    }

    delete(index){
        this.list_link.splice(index,1);
        this.show_list();
        this.save();
    }

    edit(index){
        var objEdit=this.list_link[index];
        cr_data.edit(objEdit,(data)=>{
            console.log(data);
            nas.link.list_link[index]=data;
            nas.link.show_list();
            nas.link.save();
        },nas.get_field_customer());
    }

    paste(){
        cr.paste(null,(txt)=>{
                if (nas.link.isValidUrl(txt)) {
                    var id_link="link"+cr.create_id(5);
                    var linkData={
                        "id_sys":id_link,
                        "url":txt,
                        "note":id_link,
                        "date_create":cr_data.convertISOToLocalDatetime()
                    };
                    nas.link.list_link.push(linkData);
                    nas.link.save();
                    nas.link.show_list();
                    nas.add_log(linkData,'link');
                } else {
                    cr.msg("Link Not Fomat!","Paste Link","error");
                }
        });
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false; 
        }
    }

    export(){
        cr.download(this.list_link,"list_link.json");
    }

    show_list_by_tag(tag){
        nas.link.tag_show=tag;
        if(tag==""){
            nas.link.show_list_by_data(nas.link.list_link);
        }else{
            var list_link_tag=[];
            $.each(nas.link.list_link,function(index,l){
                if(l.tag!=null){
                    if(l.tag==tag) list_link_tag.push(l);
                }
            });
            nas.link.show_list_by_data(list_link_tag);
        }
    }
}

var nas_link=new CR_Nas_Link();
nas.link=nas_link;