  var $img   =   'icon.jpg';
  var lat    =   null;
  var lon    =   null;
	
	function dbInit(ob)
	{
	  ob.executeSql('CREATE TABLE IF NOT EXISTS animalfind (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, date TEXT DEFAULT "null", texto TEXT DEFAULT "null", tipo TEXT DEFAULT "null", src TEXT DEFAULT "null", latitude TEXT  DEFAULT "null", longitude TEXT  DEFAULT "null")');
	};
	function getDB()
	{
	  return window.openDatabase("animalFinder", "1.0", "Animal Finder Database", 900000);
	};
	
	function populateDB(tx)
	{
	  dbInit(tx);
	};   
	
	function queryDB(tx) {
	
	};
	
	function querySuccess(tx, results) {
	};
	function errorCB(err) {
	  console.log("Error processing SQL: "+err.code);
	  alert('code: '    + err.code    + '\n' +
	  'message: ' + err.message + '\n');
	};
	function successCB() {
	  getDB().transaction(queryDB, errorCB);
	};
	function onDeviceReady() {
	  getDB().transaction(populateDB, errorCB, successCB);
	  getObjects();
	  getLocation();
	};
        
	function savePosition(pos)
	{
	  lat  =   pos.coords.latitude;
	  lon  =   pos.coords.longitude;
	  /*
	  $('#save-object').removeClass("ui-disabled");
	  $('#save-object  .ui-btn-text').text('Done!, can you save now!');
          */
	};

	function takeImage() {         
	  var opt = {
		 quality: 50,
		 destinationType: navigator.camera.DestinationType.FILE_URI,
		 sourceType : Camera.PictureSourceType.CAMERA, 
		 allowEdit : true,
		 encodingType: Camera.EncodingType.JPEG,
		 targetWidth: 100,
		 targetHeight: 100
	  };
	  return navigator.camera.getPicture(newImage, errorCB, opt);
	};
	function newImage(src)
	{
	  $img   =  src;
	};
	function showImage(id)
	{
	  
	  
	  var _Query  =   "select src from animalfind where id = "+id;
	  
	  getDB().transaction(function(tx){
		dbInit(tx);
		tx.executeSql(_Query, [],
					  function(qr,rs){
						
						var len = rs.rows.length;
						
						for (var i=0; i<len; i++){
						  $('#_photo').attr('src',rs.rows.item(i).src);
						  $("#sql_console").append("<br/> IMAGE SRC: "+rs.rows.item(i).src);
						}
					  }, errorCB);
	  }, errorCB, successCB);
	};
	function getLocation(){
		navigator.geolocation.getCurrentPosition(savePosition, errorCB)
	}
	function objectSave()
	{
	  var now =   new Date().toLocaleDateString();
	  var texto = $("#texto").val()
          var tipo = $("#tipo").val();
	  $('#save-object').addClass("ui-disabled");
          $('#save-object  .ui-btn-text').text('Salvando...');
          
	  
	  
	  for (var i = 0; i<=(texto.length-1);i++)
	  {
		texto = texto.replace('"',"'");
	  }
	  
	  if(validForm())
	  {
		var statements_     =   'INSERT INTO animalfind (date,src,texto,tipo,latitude, longitude) VALUES ("'+ now +'","'+ $img +'","'+texto+'","'+tipo+'","'+lat+'","'+lon+'")';
		
		getDB().transaction(function(tx){
		  dbInit(tx);
		  tx.executeSql(statements_);
		}, errorCB, successCB);
		  
		  window.location.reload(true);
		console.log(statements_);
		return;
	  }
          $('#save-object').removeClass("ui-disabled");
	  $('#save-object  .ui-btn-text').text('Salva');
	};
	function getObjects()
	{
	  
	  $("#table-of-animalfind").html('');
	  
	  var _Query  =   "select * from animalfind";
	  
	  getDB().transaction(function(tx){
		dbInit(tx);
		tx.executeSql(_Query, [],
					  function(qr,rs){
						
						var len = rs.rows.length;
						
						for (var i=0; i<len; i++){
						  $("#table-of-animalfind").append("<tr><td>"+rs.rows.item(i).date+"</td><td>"+rs.rows.item(i).texto+"</td><td><a href='#dialogPage' data-rel='dialog'  data-role='button' data-mini='true' data-icon='search'  data-iconpos='notext' data-id='"+rs.rows.item(i).id+"'>View</a><a href='#dialogPage' data-rel='dialog'  data-role='button' data-icon='delete' data-action='delete' data-iconpos='notext' data-id='"+rs.rows.item(i).id+"'>Delete</a></td></tr>");
						}
					  }, errorCB);
	  }, errorCB, successCB);
	};
	function validForm()
	{
	  var texto          =   !$('#texto').val()?'':$('#texto').val();
	  
	  if(texto.length>1 || $img!=='icon.jpg')
	  {
		return true;
	  }
	  else
          {
		alert('Por Favor, insira um texto e/ou uma foto, para que as pessoas possam conhecer o animal perdido');
		$('#texto').focus();
		return false;
	  }
	  
	  return false;
	};
	  $("#photo").on('click',function(){
		takeImage();
	  });
		
		  
          $("#save-object").on('click',function(){objectSave();getObjects();});
		
		
		$("#table-of-animalfind").on('click','a',function(){
		  
		  var id  =   $(this).attr('data-id');
		  var action  =   $(this).attr('data-action');
		  
		  if(action==='delete')
		  {
			if(confirm(action))
			{
			  
			  statements_ =   'delete from animalfind where id='+id;
			  
			  getDB().transaction(function(tx){
				dbInit(tx);
				tx.executeSql(statements_);
			  }, errorCB, successCB);
			  alert('Item deleted!');
			}
			document.location   =   'index.html';
		  }
		  
		  
		  var _Query  =   "select * from animalfind where id="+id;
		  
		  console.log(_Query);
		  getDB().transaction(function(tx){
			dbInit(tx);
			tx.executeSql(_Query, [],
						  function(qr,rs){
							
							var len = rs.rows.length;
							
							for (var i=0; i<len; i++){
							  $("#object-texto-dialog").html(rs.rows.item(i).name);
							  $("#object-content-dialog").html('Latitude:'+rs.rows.item(i).latitude + '</br> <br/>Longitude:'+rs.rows.item(i).longitude);
							  $("#object-image-dialog").attr('src',rs.rows.item(i).src);
							}
						  }, errorCB);
		  }, errorCB, successCB);
							  
							  $.mobile.dialog.prototype.options.initSelector = ".mydialog";
							  $('#dialogPage').dialog();
		});
			$('.refresh').on('click',function(){
			  window.location.reload(true);
			});
	  $('#getPosition-btn').on('click',function(){
		$('#save-object').addClass("ui-disabled");
		$('#save-object  .ui-btn-text').text('Salvando...');
		navigator.geolocation.getCurrentPosition(savePosition, errorCB);
	  }); 


onDeviceReady();
