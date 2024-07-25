class CR_Nas{

    onLoad(){
        cr.onLoad();
        cr.setColor("#88D66C");
        cr.add_btn_top();
    }

    add_db(){
        var data_db_new={
            "name":"",
            "db_url":"",
            "db_web":""
        };
        cr_data.edit(data_db_new);
    }
}

var nas;

$(document).ready(function() {

    nas=new CR_Nas();
    nas.onLoad();
 
});