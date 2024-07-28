class CR_Nas_Json {
    list_data = [];

    onLoad() {
        if (localStorage.getItem("list_data") != null) this.list_data = JSON.parse(localStorage.getItem("list_data"));
    }

    show_list() {
        let html = '';
        html += '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">';

        html += '<h2 class="h2 text-left">Data Manager</h2>';
        html += '<div class="btn-toolbar mb-2 mb-md-0">';
        html += '<div class="btn-group mr-2">';
        html += '<button class="btn btn-sm btn-outline-secondary" onclick="nas.json.show_add();return false"><i class="fas fa-plus-square"></i> Add Data</button>';
        html +='<button class="btn btn-sm btn-outline-secondary" onclick="nas.json.paste();return false"><i class="fas fa-clipboard"></i> Paste clipboard</button>';
        html += '<button class="btn btn-sm btn-outline-secondary" onclick="nas.json.export();return false"><i class="fas fa-file-download"></i> Export</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="table-responsive">';
        html += '<table class="table table-striped table-hover table-sm text-left">';
        html += '<tbody id="list_data"></tbody>';
        html += '</table>';
        html += '</div>';

        $("#box_main").html(html);

        $.each(this.list_data, (index, d) => {
            let dataItem = $(`
                <tr>
                    <td><i class="fas fa-file"></i> ${d.name}</td>
                    <td>${d.note}</td>
                    <td class="tr_list_btn">
                        <button class="btn btn-sm btn-warning btn_edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn_del"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
            `);
            $(dataItem).click(() => {
                cr_data.info(d);
                nas.add_log(d, 'data');
            });

            $(dataItem).find(".btn_del").click(() => {
                nas.json.delete(index);
                return false;
            });

            $(dataItem).find(".btn_edit").click(() => {
                nas.json.edit(index);
                return false;
            });

            if (d.link !== "" && d.link != null) {
                let btn_link = $('<button class="btn btn-sm btn-success btn_link"><i class="fas fa-external-link-alt"></i> Open</button>');
                $(btn_link).click(() => {
                    window.open(d.link, "_blank");
                });
                $(dataItem).find(".tr_list_btn").append(btn_link);
            }

            $("#list_data").append(dataItem);
        });
    }

    add(data,name="",tip=""){
        let id="data" + cr.create_id(5);
        if(name=="") name=id;
        let dataTemplate = {
            "id_sys": id,
            "name":name,
            "note": tip,
            "date_create": cr_data.convertISOToLocalDatetime(),
            "data":data
        };
        nas.json.list_data.push(dataTemplate);
        nas.json.save();
        nas.json.show_list();
    }

    show_add() {
        let dataTemplate = {
            "id_sys": "data" + cr.create_id(5),
            "name": "",
            "note": "",
            "date_create": cr_data.convertISOToLocalDatetime()
        };
        cr_data.add(dataTemplate, (data) => {
            if (data.name !== "") {
                nas.json.list_data.push(data);
                nas.json.save();
                nas.json.show_list();
                nas.add_log(data, "data");
                cr.msg("Add data success!", "Add Data", "success");
            } else {
                cr.msg("Name data cannot be null!", "Add data fail", "error");
            }
        });
        cr.box_title("Add Data Json");
    }

    save() {
        localStorage.setItem("list_data", JSON.stringify(this.list_data));
    }

    edit(index) {
        let objEdit = this.list_data[index];
        cr_data.edit(objEdit, (data) => {
            nas.json.list_data[index] = data;
            nas.json.show_list();
            nas.json.save();
        });
    }

    delete(index) {
        this.list_data.splice(index, 1);
        this.show_list();
        this.save();
    }

    export() {
        cr.download(this.list_data, "list_data.json");
    }

    paste(){
        cr.paste(null,(txt)=>{
                if (txt!="") {
                    nas.json.add(JSON.parse(txt));
                    nas.json.save();
                    nas.json.show_list();
                    nas.add_log(linkData,'json');
                } else {
                    cr.msg("Object json not Fomat!","Paste json","error");
                }
        });
    }

}

var nas_json = new CR_Nas_Json();
nas.json = nas_json;
