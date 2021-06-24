let dropArea = document.getElementsByClassName('drop-area');


;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	for(var i = 0; i < dropArea.length; i++){
		dropArea[i].addEventListener(eventName, preventDefaults, false)
	}
  
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}


// highlight when hovering the drop zone

;['dragenter', 'dragover'].forEach(eventName => {
	for(var i = 0; i < dropArea.length; i++){
		dropArea[i].addEventListener(eventName, highlight(i), false)
	}
})

;['dragleave', 'drop'].forEach(eventName => {
	for(var i = 0; i < dropArea.length; i++){
		dropArea[i].addEventListener(eventName, unhighlight(i), false)
	}
})

function highlight(id) {
	return function curried_func(e) {
		dropArea[id].classList.add('highlight')
	}
}

function unhighlight(id) {
	return function curried_func(e) {
		dropArea[id].classList.remove('highlight')
	}
}



// file drop
for(var i = 0; i < dropArea.length; i++){
	dropArea[i].addEventListener('drop', handleDrop(i+1), false)
}


var fileToRead = null;

function handleDrop(id) {
	
	return function curried_func(e) {
        let dt = e.dataTransfer
		  let files = dt.files
		  
		  var typeSplit = (files[0].name).split(".");
		  var type = typeSplit[typeSplit.length-1];
		  
			
		  if(type == "CONNECTIO"){

			handleFiles(files,id);
			
		  }
		  else{
			//alert("Le fichier déposé n'est au bon format");
			document.getElementById("tips").innerHTML = "";

			changeCompagnonV2_no_parameter("fichier incorrect");
			//document.getElementById("tips").innerHTML = "<p> Le fichier n'est pas au format .CONNECTIO </p>"
		  }
    }
	
  
  
}


function handleFiles(files,id) {

  fileToRead = files[0];
  
  //document.getElementById("indicateurDragAndDrop").innerHTML = files[0].name;
  
  loadXML(id);
}


var docXML;


function referenceXML(xmlName)
            {
                if (window.XMLHttpRequest)
                {
                    var xhttp=new XMLHttpRequest();
                }
                else
                {
                    var xhttp=new ActiveXObject("Microsoft.XMLDOM");
                }

                xhttp.open("GET","CONTENU/"+xmlName,false);
                xhttp.send();
                return xhttp.responseXML;
}



function loadXML(id){
	
	//console.log("loadXML");
	
	try{
		var reader = new FileReader();
		reader.readAsText(fileToRead);
			
		reader.onloadend = function () {
			var parser = new DOMParser();
			docXML = parser.parseFromString( reader.result, "application/xml");
			testSiteHTML(docXML,id,true);
		}

	}catch{
		//alert("Aucun fichier selectionner");	
	}
}

