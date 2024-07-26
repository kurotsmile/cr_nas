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

        html+='<div class="table-responsive">';
        html+='<table class="table table-striped table-hover table-sm text-left">';
        html+='<tbody id="list_file"></tbody>';
        html+='</table>';
        html+='</div>';

        html+='</div>';
        $("#box_main").html(html);

        $.each(this.list_file,function(index,f){
            var tItemm=$(`
                <tr>
                    <td><i class="fas fa-file"></i> ${f.name}</td>
                    <td>${nas.file.formatBytes(f.size)}</td>
                    <td>${f.bucket}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `);
            $(tItemm).click(()=>{
                cr_data.info(f);
            });

            $(tItemm).find(".btn_del").click(()=>{
                nas.file.delete(index);
                return false;
            });

            $(tItemm).find(".btn_edit").click(()=>{
                nas.file.edit(index);
                return false;
            });
            $("#list_file").append(tItemm);
        });
    }

    delete(index){
        this.list_file.splice(index,1);
        this.show_list();
        this.save();
    }

    edit(index){
        var objEdit=this.list_file[index];
        cr_data.edit(objEdit,(data)=>{
            nas.file.list_file[index]=data;
            nas.file.show_list();
            nas.file.save();
        });
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Byte';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

var nas_file=new CR_Nas_File();
nas.file=nas_file;