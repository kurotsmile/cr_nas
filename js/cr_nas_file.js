class CR_Nas_File{

    list_file=[];

    onLoad(){
        if(localStorage.getItem("list_file")!=null) this.list_file=JSON.parse(localStorage.getItem("list_file"));
    }

    add(data){
        this.list_file.push(data);
        this.save();
    }

    save(){
        localStorage.setItem("list_file",JSON.stringify(this.list_file));
    }

    show_list(){
        var html='';
        html+='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html+='<h2 class="h2 text-left">File Manager</h2>';
            html+='<div class="btn-toolbar mb-2 mb-md-0">';
            html+='<div class="btn-group mr-2">';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.add_db();return false"><i class="fas fa-plus-square"></i> Add DB</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.import_all();return false">Import</button>';
                html+='<button class="btn btn-sm btn-outline-secondary" onclick="nas.db.export_all();return false"><i class="fas fa-file-download"></i> Export</button>';
            html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<table class="table table-striped table-hover table-sm text-left table-responsive">';
        html+='<tbody id="list_file"></tbody>';
        html+='</table>';

        html+='</div>';
        $("#box_main").html(html);

        $.each(this.list_file,function(index,f){
            var tItemm=$(`
                <tr>
                    <td><i class="fas fa-file"></i> ${f.name}</td>
                    <td>${f.size}</td>
                    <td>${f.bucket}</td>
                </tr>
                `);
            $(tItemm).click(()=>{
                cr_data.info(f);
            });
            $("#list_file").append(tItemm);
        });
    }
}

var nas_file=new CR_Nas_File();
nas.file=nas_file;