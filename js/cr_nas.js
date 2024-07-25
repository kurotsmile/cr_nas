class CR_Nas{

    onLoad(){
        cr.onLoad();
        cr.setColor("#88D66C");
        cr.add_btn_top();
        cr.loadJs("js/cr_nas_db.js","nas_db","onLoad");
    }
    
    upload_file(id_db,api_key){
        var fileInput = $('#fileInput')[0];
        var file = fileInput.files[0];
        if(file) {
          var storageUrl = 'https://firebasestorage.googleapis.com/v0/b/'+id_db+'/o?uploadType=multipart&name=' + encodeURIComponent(file.name);

          var formData = new FormData();
          formData.append('file', file);

          $.ajax({
              url: storageUrl,
              type: 'POST',
              data: formData,
              contentType: false,
              processData: false,
              headers: {
                  'Authorization': 'Bearer '+api_key
              },
              success: function(response) {
                  console.log('Upload successful', response);
                  cr.msg('Upload successful',"Upload File","success");
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.error('Upload failed', textStatus, errorThrown);
                  cr.msg("Upload Faield","Upload File","error");
              }
          });
      }else{
        cr.msg("Please Select File","None File","info");
      }
    }
}

var nas;

$(document).ready(function() {

    nas=new CR_Nas();
    nas.onLoad();
 
});