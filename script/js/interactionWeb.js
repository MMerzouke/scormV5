// ecriture en dur des couleurs de la charte graphique
var vert_fonce = "#294c26";
var vert_moyen = "#407b3a";
var vert_clair = "#54ac47";


function showTips(id){
	
	if(document.getElementById('tips'+id).style.visibility == 'visible'){
		document.getElementById('tips'+id).style.visibility = 'hidden';
	}
	else{
		document.getElementById('tips'+id).style.visibility = 'visible';

	}
}


var numberOfRessource = 1; //( number of ressource (blue) - 1 -> 2-1 = 1);


function updateSideBar(newID){
	var sideBarItems = sectionList.children;
	
	var idParcours = parseInt(currentId) + numberOfRessource;
	
	
	sideBarItems[idParcours].children[0].style.color = vert_clair;
	
	sideBarItems[idParcours].children[0].style.fontWeight = 900;

	
	for (var i = numberOfRessource + 1; i < sideBarItems.length; i++) {
		if(i != (idParcours)){
				sideBarItems[i].children[0].style.color = "#000"; //children nous donnet l'element <li> ou l'unique fils est <a> le lien de la sidebar
				sideBarItems[i].children[0].style.fontWeight = "normal";
		}

		
	}

}


var currentId = 1;


//This function loops over the HTML section elements and update the main url. 
function updateFragId() {
        var len = contents.children.length;
          for (var i = 0; i < len; i++) {
            var id = contents.children[i].children[0].id;
			
			//Collects the Y scroll position relative to the viewport. 
			
			var rect = contents.children[i].getBoundingClientRect().y;
			
			//convert the two arrays into an object
			
			var pageData = {id:id, rect:rect};
			
			//set a range for the code to trigger in between. Here it will trigger when the top of the section element is between -200px to 400px
			
			 if (pageData.rect > -200 && pageData.rect < 200) {
				 				 
				   if (pageData.rect > -100 && pageData.rect < 100) {
						//if (pageData.id != location.hash.substr(1)) { //if supprimer a cause de l'appel par la sidebar qui prechange l'url avant le scrolling initial

							currentId = pageData.id;
							//setActiveLink(currentId);
							//window.history.pushState("object or string", "", "#" + currentId); //pose des problemes lorsque l'on fait precedent, tres mauvaise utilisation de ma part
							updateSideBar(currentId);
							return;
						 // } 
						 /*
						else {
							return;
						}*/
          }
        }
      }
}
//window.history.pushState("object or string", "", "");

window.addEventListener('scroll', updateFragId);


updateFragId();
updateSideBar(location.hash.substr(1)); // init current position on reload

// function drag and drop to load files
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/



let dropArea = document.getElementsByClassName('drop-area');


//*

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	for(var i = 0; i < dropArea.length; i++){
		dropArea[i].addEventListener(eventName, preventDefaults, false)
	}
  
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

//*/

//*



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
			alert("Le fichier déposé n'est au bon format");  
		  }
    }
	
  
  
}

//*/

function handleFiles(files,id) {
	// to load multiple file ( not used here)
  //([...files]).forEach(uploadFile)
  //uploadFile(files);
  //loadXMLDoc(files);
  fileToRead = files[0];
  
  document.getElementById("indicateurDragAndDrop"+id).innerHTML = files[0].name;
  loadXML();
}

/*

function uploadFile(file) {
  var url = 'file:///C:/Users/natha/Desktop/Stage/Web/exercice.html#1'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the user
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('file', file)
  xhr.send(formData)
  
  return xhr;
}



function loadXMLDoc(files)
            {
                if (window.XMLHttpRequest)
                {
                    var xhttp=new XMLHttpRequest();
                }
                else
                {
                    var xhttp=new ActiveXObject("Microsoft.XMLDOM");
					console.log("error");
                }

                xhttp.open("POST",'file:///C:/Users/natha/Desktop/Stage/Web/exercice.html#1'.name,false);
                xhttp.send(files[0]);
				console.log(files[0].name);
                return xhttp.responseXML;
}

//*/

var docXML;

function loadXML(){
	
	console.log("loadXML");
	
	try{
		var reader = new FileReader();
		//reader.onload = function(event) { content.innerHTML = reader.result; };
		reader.readAsText(fileToRead);
			
		//var parser = new DOMParser();
		//
		reader.onloadend = function () {
			var parser = new DOMParser();
			docXML = parser.parseFromString( reader.result, "application/xml");
		}
		
		//.currentFile.innerHTML = fileToRead.name;
		
		
		// ne fonctionne plus au bon moment depuis le deplacement de la fonction loadXML dans le html
		//document.getElementById("currentFile").innerHTML = "Le fichier validé est: " + fileToRead.name;
	}catch{
		alert("Aucun fichier selectionner");	
	}
	
	
	
}


// fonction permettant d'inverser les bit dans une table de verite au niveau de la ligne 'l' et de la colonne des sorties 'c'

/*

function changeBit(l,c){
	var getCurrentBit = document.getElementById('l'+l+'c'+c).innerHTML;
	var bitValue = parseInt(getCurrentBit);
	document.getElementById('l'+l+'c'+c).innerHTML = 1 - bitValue;
	
}*/


//var solutionEx4 = [0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1];

//verifie les sorties de la table de verite
//besoin d'ajouter une reaction lors de la validation celon true false

/*

function verificationTableVerite(jsonKey){
	
	
	
	
	var lineNumber = document.getElementById("tableVerite").children[0].children.length-1;
	console.log(lineNumber);
	
	var columnNumber = 1; //cherchez comment recuperer le bon nombre de colonne
	
	var finalResult = [];
	
	for(var c=0; c<columnNumber;c++){
		
		for (var l = 0; l < lineNumber; l++) {
			finalResult.push(parseInt(document.getElementById('l'+l+'c'+c).innerHTML));
		}
	}
	
	for(var i=0; i<finalResult.length;i++){
		if(finalResult[i] != solutionEx4[i]){
				console.log(false);
				
				traitementJSON("mauvais");
				return false;
		}
	}
	traitementJSON("bon");
	return true;

} */

function traitementJSON(animation){
	
	for(var i = 0; i < data.length; i++){
		if(data[i].animationName == animation){
			document.getElementById("personnage").src = "assets/images/" + data[i].spriteName
			document.getElementById("tips1").innerHTML = data[i].text;
			document.getElementById("tips1").style.visibility = 'visible';
			return;
		}
	}
	
	//document.getElementById("personnage").src = "assets/images/" + data[1].spriteName
	
	//console.log(data[0].spriteName);
	
	
}

