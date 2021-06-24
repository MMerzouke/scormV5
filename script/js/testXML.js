function loadXMLDoc(dname)
            {
                if (window.XMLHttpRequest)
                {
                    var xhttp=new XMLHttpRequest();
                }
                else
                {
                    var xhttp=new ActiveXObject("Microsoft.XMLDOM");
                }

                xhttp.open("GET",dname,false);
                xhttp.send();
                return xhttp.responseXML;
}

var xmlDoc;// = loadXMLDoc("fonction_logique.CONNECTIO");


/*
for(var k = 0; k < 1;k++){
	//console.log(xmlDoc.getElementsByTagName("recueil")[2].children[1].textContent);
}*/

//console.log(xmlDoc.getElementsByTagName("NodeData")[0].attributes["Key"]); // .value
//document.getElementById("test").innerHTML = xmlDoc.getElementsByTagName("NodeData")[0].attributes["Key"].value;


// structure de départ qui n'est plus utilisée
//var nodeDataList = [];


//Object contenant des Objects permettant de faire une structure similaire à un arbre
//referData -> arbre de correction / entries -> entrée en parametre de la correction / output -> sortie de la correction associe a sa clef / testData -> arbre du fichier eleve
var referData = {};
var entries = {};
var hasInput = false;

var outputKey = {};
var memoryRefer = [];

var testData = {};
var memoryTest = [];







function setSymbol(type){
	
	//console.log(connecteur_logique.length);
	
	//for(var i = 0; i < Object.keys(connecteur_logique).length;i++){
		
		
	if(connecteur_logique[type] != null){
		//return [stringToSymbol[i].symbol,stringToSymbol[i].priority];
		return [connecteur_logique[type].symbol , connecteur_logique[type].priority , connecteur_logique[type].minimumEntries,connecteur_logique[type].needFunction];
	}
	//}
	
	return ["Function not added to the connecteur logique list : " + type,-1,-1,-1];
}

// recupere les nodes précedentes du node de clef 'Key'
function getPreNode(Key){
	
	var preNode = [];
	var preNodePort = [];
	
	var LinkData = xmlDoc.getElementsByTagName("LinkData");
	
	//console.log(LinkData);
	
	for(var k = 0; k < LinkData.length;k++){
		
		//console.log("To " + LinkData[k].attributes["To"].value);
		//console.log("Key "+Key);
		
		
		if(LinkData[k].attributes["To"].value == Key){
				var port = LinkData[k].attributes["ToPort"].value.split("-");
				var portEntry = eval(port[port.length-1]);
				
				
				//console.log(portEntry);
				//preNode.push(LinkData[k].attributes["From"].value);
				preNode[portEntry] = LinkData[k].attributes["From"].value;
				
				port = LinkData[k].attributes["FromPort"].value.split("-");
				var portOutput = eval(port[port.length-1]);
				
				
				preNodePort[portEntry] = portOutput;
		}
	}
	
	return [preNode,preNodePort];
}

function IsRoot(Key){
	
	var LinkData = xmlDoc.getElementsByTagName("LinkData");
	
	//console.log(LinkData);
	
	for(var k = 0; k < LinkData.length;k++){
		
		//console.log("To " + LinkData[k].attributes["To"].value);
		//console.log("Key "+Key);
		
		
		if(LinkData[k].attributes["From"].value == Key){
				return false;
		}
	}
	
	return true;
}

//*
var basculeOutput = { 	Rs: [],
						Jk: [],
				};

var basculeNameList = ["Rs","Jk"];

var cptBascule = {	Rs: 0,
					Jk: 0
				};
//*/

function isBascule(basculeName){
	return basculeNameList.includes(basculeName);
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}




function ObjectNodeData(NodeDataPosition){
	var Data = {}
	var attributes = xmlDoc.getElementsByTagName("NodeData")[NodeDataPosition].attributes;
	
	// Stock la clef du block
	Data.Key = attributes["Key"].value;
	
	// recupere le type de  block
	Data.Type = attributes["NodeType"].value;
	
	// Permet  de savoir si la Node en question est une racine
	Data.IsRoot = IsRoot(Data.Key);
	
	// recupere les nodes précedentes ainsi que leurs ports
	var preNode = getPreNode(Data.Key);
	
	Data.PreNode = preNode[0];
	Data.PreNodePort = preNode[1];
	

	
	// recupere la valeur du block
	if(Data.Type.includes("Source")){
		
		
		// test avec la description
		//Data.Description = attributes["NodeDescription"].value;
		try{
			Data.Description = htmlEntities(attributes["NodeDescription"].value).toLowerCase();
		}
		catch{
			Data.Description = "";
		}
		
		// differencier boolean de numerical -> buttonchecked / SourceValue
		
		try{
			// source de type int
			Data.Value = attributes["SourceValue"].value;

		}catch(error){
			// source de type boolean
			Data.Value = attributes["ButtonChecked"].value;
		}
	}
	
	else if(Data.Type.includes("InternalCustomNode")){
		
		
		Data.Description = "";
		
		var functionBlocks = attributes["NodeID"].value;
		
		//console.log(functionBlocks);
		var typeSplit = functionBlocks.split(".");
		//console.log(typeSplit);
		
		

		
		Data.Blocks = typeSplit[typeSplit.length - 1];
		
		
		// traitement de typeSplit surement a faire dasn la fonction elle meme
		//Data.Value = setSymbol(typeSplit[typeSplit.length - 1]);
		var functionAttributes = setSymbol(Data.Blocks);
		
		Data.Value = functionAttributes[0];
		Data.Priority = functionAttributes[1];
		Data.MinimumEntries = parseInt(functionAttributes[2]);
		Data.NeedFunction = functionAttributes[3];
		
		//console.log(Data.Blocks);
		
		
		// sequentielle non fait
		
		if(isBascule(Data.Blocks)){
			Data.CptBascule = cptBascule[Data.Blocks];
			cptBascule[Data.Blocks]++;
		}
		
		// changement de la liste des entrees pour pouvoir avoir des entrees null pour les entrées non utilisées
		try{
			Data.PreNode.length = connecteur_logique[Data.Blocks].totalEntries;
			Data.PreNodePort.length = connecteur_logique[Data.Blocks].totalEntries;
		}catch(error){
			
		}
		
		
		// a changer dans les cas speciaux (Advantech4704)
		if(Data.IsRoot){
			
			// cas Advantech (au moins 4704)
			if(!Data.Blocks.includes("Advantech")){
				erreur.missing_gate_output.push("attention, une porte " + Data.Blocks + " n'utilise pas sa sortie");
			}
			Data.IsRoot = false;
		}
		
		
	}
	
	else{
		Data.Value = "";
		//Data.Description = attributes["NodeDescription"].value;
		try{
			Data.Description = (htmlEntities(attributes["NodeDescription"].value)).toLowerCase();
		}
		catch{
			
		}
		
		
		
		
		//		-> pb init referData and testData
		
		/*
		if(Data.Type.includes("Memory")){
			memoryEval[Data.Description] = null;
		}*/
	}
	
	
		
	
	
	
	
	var entryUsed = verifEntries(Data);
	
	
	
	if(entryUsed < Data.MinimumEntries){
		erreur.missing_gate_entries.push("attention, une porte " + Data.Blocks + " ne possède que " + entryUsed + " entrée(s) utilisée(s) sur les " + Data.MinimumEntries + " attendues");
	}
	
	//console.log(Data.Type.includes("Source") || Data.Type.includes("Input"));
	return Data;
}


function verifEntries(ObjectData){
	
	//if(ObjectData.NeedFunction){
		
	var cptNotNull = 0;
	
	for(var i = 0; i < ObjectData.PreNode.length; i++){
			if(ObjectData.PreNode[i] != null){
					cptNotNull++;
			}
	}
	return cptNotNull;
	//}
	//return ObjectData.PreNode.length;
}

//*
function initData(dataToEval){
	
	var dataStructure;
	var memory = {};
	
	if(dataToEval){
		dataStructure = testData;
		reloadsessionStorage();
		var number_of_gates_required = JSON.parse(sessionStorage.number_of_gates_required);
		var number_of_gates_required_used = {};
		
		var output_used = [];
		var entry_used = [];
		
		Object.keys(number_of_gates_required).forEach(key => {
			number_of_gates_required_used[key] = 0;
		});
	}
	else{
		dataStructure = referData;
		var entriesOnlyInput = {};
		//sessionStorage.clear();
	}
	
	
	for(var j = 0; j < xmlDoc.getElementsByTagName("NodeData").length;j++){
		
		//ObjectNodeData.test = j;
		//nodeDataList.push(new ObjectNodeData(j));
		
		var newKey = xmlDoc.getElementsByTagName("NodeData")[j].attributes["Key"].value;
		
		dataStructure[newKey] = new ObjectNodeData(j);
		
		
		// fichier referend
		if(!dataToEval){
			
			//init reference entries
			if(dataStructure[newKey].Type.includes("Input") || dataStructure[newKey].Type.includes("Source")){
			
					
				
				if(dataStructure[newKey].Type.includes("Bit") || dataStructure[newKey].Type.includes("Boolean")){
					entries[dataStructure[newKey].Description] = false;
					
					if(dataStructure[newKey].Type.includes("Input")){
						entriesOnlyInput[dataStructure[newKey].Description] = false;
					}
				}
///////////////////////////////////////////////////////////////////////////////////////////// fixe tres temporaire
				else{
					entries[dataStructure[newKey].Description] = 0;
					
					if(dataStructure[newKey].Type.includes("Input")){
						entriesOnlyInput[dataStructure[newKey].Description] = 0;
					}
				}
				
			}
			
			//init reference output
			if(dataStructure[newKey].IsRoot){
				outputKey[dataStructure[newKey].Description] = newKey;
			}
			
			//init reference memory
			if(dataStructure[newKey].Type.includes("Memory")){
				memory[dataStructure[newKey].Description] = false;
			}
			
		}
		// fichier etudiant
		else{
			
			//init test memory
			if(dataStructure[newKey].Type.includes("Memory")){
				memory[dataStructure[newKey].Description] = false;
			}
			
			
			//ici on increment le compteur pour les blocks recommande par le professeur
			
			// traitement And3 etudiant = 2 * And2 si aucune demande de And3 / Or3 / Xor3
			
			if(dataStructure[newKey].Blocks in number_of_gates_required){
				number_of_gates_required_used[dataStructure[newKey].Blocks]++;
			}
			
			//test entrees
			if(dataStructure[newKey].Type.includes("Input") || (dataStructure[newKey].Type.includes("Source") && !hasInput)){
				if(dataStructure[newKey].Description in entries){
				
					//ici on a une entree étudiants qui existe bien dans le fichier de référence 
					//console.log("input :" + dataStructure[newKey].Description);
					//console.log("type :" + dataStructure[newKey].Type);
					if(!(entry_used.includes(dataStructure[newKey].Description))){
						entry_used.push(dataStructure[newKey].Description);
					}
					else{
						
					}
						
				}
				else{
					//ici on a une entree étudiant qui ne fait pas partie du fichier de référence
					if(dataStructure[newKey].Description != ""){
						erreur.entry_name.push(dataStructure[newKey].Description);
					}
					
				}
			}
			
			
			// temporary fix to test
			/*
			if(dataStructure[newKey].Type.includes("Memory") && dataStructure[newKey].PreNode.length == 0){
				if(dataStructure[newKey].Description in entries){
				
					//ici on a une entree étudiants qui existe bien dans le fichier de référence 
					//console.log("input :" + dataStructure[newKey].Description);
					//console.log("type :" + dataStructure[newKey].Type);
					if(!(entry_used.includes(dataStructure[newKey].Description))){
						entry_used.push(dataStructure[newKey].Description);
					}
						
				}
				else{
					//ici on a une entree étudiant qui ne fait pas partie du fichier de référence
					erreur.entry_name.push(dataStructure[newKey].Description);
				}
			}*/
			
			if( (dataStructure[newKey].Type.includes("Output") || dataStructure[newKey].Type.includes("Memory")) && dataStructure[newKey].IsRoot){
				if(dataStructure[newKey].Description in outputKey){
					
					if(!(output_used.includes(dataStructure[newKey].Description))){
						//ici on a une sortie étudiants qui existe bien dans le fichier de référence et qui n'est pas un double d'une autre sortie
						//console.log("output :" + dataStructure[newKey].Description);
						//console.log("type :" + dataStructure[newKey].Type);
						output_used.push(dataStructure[newKey].Description);
					}
					else{
						
						//ici on a une sortie qui existe au moins en double
						if(!(erreur.duplicate_output.includes(dataStructure[newKey].Description))){
							erreur.duplicate_output.push(dataStructure[newKey].Description);
						}
					}
				}
				else{
					//ici on a une sortie étudiant qui ne fait pas partie du fichier de référence
					erreur.output_name.push(dataStructure[newKey].Description);
				}
			}
			

		}
		
		//nodeDataList.push(xmlDoc.getElementsByTagName("NodeData")[0].attributes["NodeType"]);
	}
	
	// fichier etudiant
	if(dataToEval){
		sessionStorage.setItem('total_gates_used', Object.keys(testData).length);
		sessionStorage.setItem('number_of_gates_required_used', JSON.stringify(number_of_gates_required_used));
		sessionStorage.setItem('output_used', JSON.stringify(output_used));
		sessionStorage.setItem('entry_used', JSON.stringify(entry_used));
		sessionStorage.erreur = JSON.stringify(erreur);
		memoryTest[0] = memory;
	}
	
	// ficheir referend
	else{
		sessionStorage.setItem('referend_gates_used', Object.keys(referData).length);
		memoryRefer[0] = memory;
		
		// reduction des entrees a faire varier si elles contiennent des source et des input
		if( _.size(entriesOnlyInput) > 0){
			entries = entriesOnlyInput;
			hasInput = true;
		}

	}
}

function reloadsessionStorage(){
	
	sessionStorage.setItem('missing_gate_entries', false);
	
	sessionStorage.setItem('missing_gate_output', false);
	
	if(sessionStorage.getItem('load_file') == null){
		sessionStorage.setItem('load_file',1);
	}
	else{
		sessionStorage.load_file++;
	}
	
	sessionStorage.setItem('output_validated',0);
	
	sessionStorage.setItem('total_output', Object.keys(outputKey).length);
	
	//sessionStorage
}





function DataToString(dataStructure,ObjectData,NodePort){	
	
	var preNode = ObjectData.PreNode;
	var preNodePort = ObjectData.PreNodePort;
	var priority = ObjectData.Priority;
	var symbol = ObjectData.Value;
	var needFunction = ObjectData.NeedFunction;
	
	var dataToString;
	
	
	
	
	if(preNode[0] == null){
			dataToString = false;
	}
	else{
		dataToString = evalDataRec(dataStructure,dataStructure[preNode[0]],preNodePort[0],priority);
	}
	
	
	if(needFunction){
		
			// fonction basique ne prenant en parametre que la liste ordonne des entrees
			
			/*
			console.log("here   " + symbol + "(" + ObjectData.PreNode + ")");
			console.log("(["+preNodePort+"])");
			console.log(ObjectData);
			*/
			
			
			dataToString = symbol + "([" + dataToString;
			var nodePortList = [];
			
			for(var i = 1; i < preNode.length; i++){
				
				if(preNode[i] == null){
					dataToString += "," + false;
				}
				else{
					dataToString += "," + evalDataRec(dataStructure,dataStructure[preNode[i]],preNodePort[i],priority);
				}
				
			}
			
			dataToString += "]," + NodePort + ")";
			
			return eval(dataToString);
	} 
		
		if(preNode.length == 1){
			return eval(symbol + dataToString);
		}
		
		for(var i=1; i < preNode.length; i++){
			

				dataToString += " " + symbol + " " + evalDataRec(dataStructure,dataStructure[preNode[i]],preNodePort[i],priority);

			}

		return eval(dataToString);
	
	
}


// set the next set of entriesSet (binary), if the next set is only false (0) then it return true
function nextEntriesSet(entriesSet){
		var keys = Object.keys(entriesSet);
		
		
		for(var i = 0; i < keys.length; i++){
			
			if(typeof(entriesSet[keys[i]]) == 'number'){
				if(entriesSet[keys[i]] < 10){
					entriesSet[keys[i]]++;
					return false; // le parcours n'est pas finis
				}
				else{
					entriesSet[keys[i]] = 0;
				}
			}
			else{
			
				if(entriesSet[keys[i]]){
						entriesSet[keys[i]] = false;
				}
				else{
						entriesSet[keys[i]] = true;
						return false; // le parcours des entrees n'est pas finis
				}
			}
		}
		return true; // on est revenue aux set d'entrees initial (all false)
}

function compareData(val){
	
	var referVal = referData[outputKey[val.Description]];
	
	return evalData(testData,val) == evalData(referData,referVal);
}


function memoryChange(data,memoryUsed){
	
		// on repart sur un cas initial (toutes les memoire fausse !!!! ne marche pas en sequentielle !!!!)
		memoryUsed.length = 1;
		
		
		// test stabilite
		
		do{
			
			var nextMemory = new Object({});
			
			Object.values(data).forEach(val => {
				if(val.IsRoot && val.Type.includes("Memory")){ // dans un premier temps on va exclure les outputs
					nextMemory[val.Description] = evalData(data,val);
				}
			});
			
			//console.log(nextMemory);
			
			memoryUsed.push(nextMemory);
		}while(_.isEqual(memoryStability(memoryUsed),"en cours"));
		
		
		
		return (_.isEqual(memoryStability(memoryUsed),"stable")); /*{
			return true;
			// on passe a memoryTest et on fait la meme chose puis on compare les données
			/*
			do{
			
				var nextMemory = new Object({});
				
				Object.values(testData).forEach(val => {
					if(val.IsRoot && val.Type.includes("Memory")){ // dans un premier temps on va exclure les outputs
						nextMemory[val] = evalData(testData,val);
					}
				});
				
				memoryTest.push(nextMemory);
			}while(_.isEqual(memoryStability(memoryTest),"en cours"));
			
			if(_.isEqual(memoryStability(memoryTest),"stable")){
				
			}
			else{
				// la memoire du coter etudiant est instable -> il y a donc une erreur
			}
			*/
			/*
		}
		else{
			return false;
			// la memoire du coter referend est instable -> il y a donc une erreur
		}*/
	
}

function memoryStability(memoryList){
	if(memoryList.length == 1){
		return "en cours";
	}
	else{
		if(_.isEqual(memoryList[memoryList.length-1], memoryList[memoryList.length-2])){
			return "stable";	// les memoires n'ont pas changé lors de la derniere iteration
		}
		else{
			for(var i = 0; i < memoryList.length-2;i++){
				if(_.isEqual(memoryList[memoryList.length-1], memoryList[i])){
					return "instable";	// on est retombé sur une configuration de memoire qui sera amener a changer, c'est donc instable
				}
			}
			return "en cours";
		}
	}
}

// Eval file CONNECT I/O

function evalFile(){
	Object.values(testData).forEach(val => {
		  
		  var dataOutput;
		  
		  var cptCorrect = 0;
		  var cptTotal = 0;
		  // permet d'écrire les données ssi c'est une racine est qu'elle est une sortie ou memoire ayant une description ( un bloc logique ne peut aps avoir de description)
		  if(val.IsRoot){
			  if(val.PreNode.length >0){
			  

				
				
				referVal = referData[outputKey[val.Description]];
				console.log("testData " + evalData(testData,val));
				console.log("referData " + evalData(referData,referVal));
				  
				  
				  
				  
				  
				  
				  
				  
				  
				  
				  
				  //modif ici pour eval data comparer les data pour testData et referData pour chauqe entree possible
				  
				  /*
				  if(compareData(val)){
					  cptCorrect++;
					  
					  console.log(val.Description + " test " + evalData(testData,val) + " : " + eval(evalData(testData,val)));
					  console.log(val.Description + " refer " + evalData(referData,val)+ " : " + eval(evalData(referData,val)));
					  console.log(cptCorrect+ "/"+cptTotal);
				  }
				  cptTotal++;
				  
				  while(!nextEntriesSet(entries)){
					  
					  //var memory = 
					  
					  
					  
					  if(compareData(val)){
						  cptCorrect++;
					  }
					  cptTotal++;
					  
					  console.log(val.Description + " test " + evalData(testData,val) + " : " + eval(evalData(testData,val)));
					  console.log(val.Description + " refer " + evalData(referData,val)+ " : " + eval(evalData(referData,val)));
					  console.log(cptCorrect+ "/"+cptTotal);
				  }*/
				  
				  
				  do {
					  					  
					  
					//  do{
						  // ici on fera le traitement des cas "interdit"
		
						  // du code
						  
						  
						  
						memoryChange(referData,memoryRefer);
						memoryChange(testData,memoryTest);
						  
						  
						  /*
						  if(compareData(val)){
							  cptCorrect++;
						  }
						  cptTotal++;
						  
						  console.log(val.Description + " test " + evalData(testData,val) + " : " + eval(evalData(testData,val)));
						  console.log(val.Description + " refer " + evalData(referData,val)+ " : " + eval(evalData(referData,val)));
						  console.log(cptCorrect+ "/"+cptTotal);
						  */
						  
					  
					  //} while(!nextEntriesSet(memory));
					  
					 
					 //compteur de reussite
						if(compareData(val)){
							  cptCorrect++;
						  }
					  cptTotal++;
					  
					  console.log(entries);
					  
					  ///////////////////////////////////////////////////////////////////////////////////////////affichage desactiver pour moins de calcul
					  console.log(val.Description + " test " + evalData(testData,val) );
					  console.log(val.Description + " refer " + evalData(referData,referVal));
					  console.log(cptCorrect+ "/"+cptTotal);
					  
					  
					  
				  
				  } while(!nextEntriesSet(entries));
				  
				  
				  console.log(val.Description + " : " + cptCorrect + " / " + cptTotal);
				  
				  if(cptCorrect == cptTotal){
					  sessionStorage.output_validated++;
				  }
				  
				  else{
					  erreur.wrong_output.push("La sortie " + val.Description + " n'a pas le comportement attendu: " + cptCorrect + " / " + cptTotal);
				  }
				  
				  
				  //console.log(val)
				  //console.log(referData[outputKey[val.Description]]);
				  //console.log(dataOutput);
			  }
			  else{
				  erreur.block_alone.push(val.Description);
				  //sessionStorage.setItem('missing_gate_output',true);
			  }
		  }
		  
		});
		sessionStorage.erreur = JSON.stringify(erreur);
}

function evalData(dataStructure,val){
	return evalDataRec(dataStructure,val,null, 0);
}


// Ceci n'est fonctionnel que pour des opérations de même priorité est sera donc modifier prochainement
// Il faudra modifier en type A B C + * puis traduire en A * (B + C)
function evalDataRec(dataStructure,ObjectData,NodePort, previousPriority){
	
	
	
	// ici on est dans le cas ou un il manque une entrée à un des connecteurs logiques
	if(ObjectData == null){
		
		sessionStorage.setItem('missing_gate_entries', true);
		
		return false;
	}
	
	// ObjectData.PreNode.length == 0 -> on a donc atteint une feuille
	if(ObjectData.PreNode.length == 0){
		//return ObjectData.Value; // a changer en node description
		//console.log(ObjectData.Description + " " + entries[ObjectData.Description]);
		
		
		
		
		
		// rajouter les sorties plus tard
		if(ObjectData.Type.includes("Memory")){
			// a modifier en fonction de la datastructure
	
			if(_.isEqual(dataStructure,testData)){
				return memoryTest[memoryTest.length-1][ObjectData.Description];
			}
			
			return memoryRefer[memoryRefer.length-1][ObjectData.Description];
			
		}
		
		if(ObjectData.Type.includes("Source") || ObjectData.Type.includes("Input")){
			
			if(ObjectData.Type.includes("Source") && hasInput){
				return eval(ObjectData.Value);
			}
			
			return entries[ObjectData.Description];
		}
		
		// pour le moment empeche le bouclage de sortie !!!!!!
		return false;	
		
	}
	
	// On modifiera surement plus tard la taille des prenode par le type de node a cause des calcul a 1 seul parametre ( NOT ?)
	else if(ObjectData.PreNode.length == 1){
		
		if(ObjectData.Type == "InternalCustomNode"){	
			//return ObjectData.Value + writtingData(testData[ObjectData.PreNode[0]],ObjectData.Priority);
			return DataToString(dataStructure,ObjectData,NodePort);//eval(DataToString(dataStructure,ObjectData));
		}
		else{ // ici on devrait etre dans les sortie et donc il faudrai faire un traitement pour la sortie
		// il faudra aussi prevoir le cas ou on utilise un ByteToBit qui ne possede qu'une entree -> port a recuperer
			return evalDataRec(dataStructure,dataStructure[ObjectData.PreNode[0]],ObjectData.PreNodePort[0],ObjectData.Priority);//eval(evalData(dataStructure,dataStructure[ObjectData.PreNode[0]],ObjectData.Priority));
		}
	}
	
	else if(ObjectData.PreNode.length >= 2){
		if(ObjectData.Priority < previousPriority && !ObjectData.NeedFunction){
			//return "( " + writtingData(testData[ObjectData.PreNode[0]],ObjectData.Priority) + " " +  ObjectData.Value + " " + writtingData(testData[ObjectData.PreNode[1]],ObjectData.Priority) + " )";
			return "( " + DataToString(dataStructure,ObjectData,NodePort) + " )";//eval("( " + DataToString(dataStructure,ObjectData) + " )");
		}
		else{
			//return writtingData(testData[ObjectData.PreNode[0]],ObjectData.Priority) + " " +  ObjectData.Value + " " + writtingData(testData[ObjectData.PreNode[1]],ObjectData.Priority);
			return DataToString(dataStructure,ObjectData,NodePort);//eval(DataToString(dataStructure,ObjectData));
		}
	}
}




// file to initialise, id in html where the change will occur, boolean true if the file is the student file

function testSiteHTML(file,IdToReplace,dataToEval){
	
	xmlDoc = file;
	
	if(dataToEval){
		
		initData(dataToEval);
		
		
		
		
		
		
			
		//var entry_or_output_invalid = false;
		var entry_or_output_invalid = [];	
			
		//console.log(JSON.parse(sessionStorage.erreur).entry_name);
		// on reset la partie remediation pour pouvoir faire une nouvelle analyse
		document.getElementById("tips").innerHTML = "";
		
		// verification que l'on ai pas des entrées en trop dans le fichier étudiant
		if(JSON.parse(sessionStorage.erreur).entry_name.length > 0){
			
			// V1
			// document.getElementById("tips").innerHTML += "<p> Certaines entrées ont des noms incorrects</p>"
			// entry_or_output_invalid = true;
			
			// V2
			
			entry_or_output_invalid.push("entrees incorrects");
		}
		
		// verification que l'on ai pas des sorties en trop dans le fichier étudiant
		if(JSON.parse(sessionStorage.erreur).output_name.length > 0){
			
			// V1
			// document.getElementById("tips").innerHTML += "<p> Certaines sorties ont des noms incorrects</p>"
			// entry_or_output_invalid = true;
			
			
			// V2
			entry_or_output_invalid.push("sorties incorrects");
		}
		
		// verification que l'on ai pas des sorties en double dans le fichier étudiant
		if(JSON.parse(sessionStorage.erreur).duplicate_output.length > 0){
			
			// V1
			// document.getElementById("tips").innerHTML += "<p> Certaines sorties sont en plusieurs exemplaires </p>"
			// entry_or_output_invalid = true;
			
			// V2
			entry_or_output_invalid.push("sorties multiples");
		}
		
		
		
		var missing_entry = 0;
		Object.keys(entries).forEach(key => {
				
			if(!(JSON.parse(sessionStorage.entry_used).includes(key))){
				missing_entry++;
			}
		});
		if(missing_entry > JSON.parse(sessionStorage.erreur).entry_name.length){
			
			// V1
			// document.getElementById("tips").innerHTML += "<p> Des entrées sont manquantes </p>"
			// entry_or_output_invalid = true;
			
			// V2
			entry_or_output_invalid.push("entrees manquantes");
		}
		
		var missing_output = false;
		Object.keys(outputKey).forEach(key => {
				
			if(!(JSON.parse(sessionStorage.output_used).includes(key))){
				missing_output = true;
			}
		});
		if(missing_output){
			
			// V1
			// document.getElementById("tips").innerHTML += "<p> Des sorties sont manquantes </p>"
			// entry_or_output_invalid = true;
			
			// V2
			entry_or_output_invalid.push("sorties manquantes");
		}
		
		
		
		
		//if(entry_or_output_invalid){
		if(entry_or_output_invalid.length > 0){
			
			//document.getElementById("tips").innerHTML += "<p> Le fichier ne sera pas analysé avant la correction des entrées/sorties </p>"
			
			//compagnon de entry_or_output_invalid
			changeCompagnonV2("entrees/sorties",entry_or_output_invalid);
		}

		else{
			
			evalFile();
			
			var affiner = [];
				
				if(updateCompagnon("missing_gate_entries")){
					affiner.push("entrees portes manquantes");
				}
				if(updateCompagnon("missing_gate_output")){
					affiner.push("sorties portes manquantes");
				}
				
				// respect des portes imposées
				var number_of_gates_required = JSON.parse(sessionStorage.number_of_gates_required);
				var number_of_gates_required_used = JSON.parse(sessionStorage.number_of_gates_required_used);
				var missmatch = false
				
				Object.keys(number_of_gates_required).forEach(key => {
					if(number_of_gates_required[key] != number_of_gates_required_used[key]){
						missmatch = true;
					}
				});
				
				if(missmatch){
					affiner.push("non respect des portes imposees");
				}
			
			// verification que l'on ai pas de blocks d'entrées ou de sorties sans aucune liaison
			if(JSON.parse(sessionStorage.erreur).block_alone.length > 0){
				
				// V2
				//affiner.push("block sans liaison");
			}
						
			// V1
			// updateCompagnon("wrong_output");
			if(updateCompagnon("wrong_output")){
					//changeCompagnonV2();
					changeCompagnonV2_no_parameter("echec");
					//document.getElementById("tips").innerHTML = "echec";
			}
						
			
			//reussite si on entre dans le if
			if(document.getElementById("tips").innerHTML == ""){
				
				// il n'y  a rien a affiner donc on a reussi toutes les consignes de l'exercice
				if(affiner.length == 0){
					
					changeCompagnonV2_no_parameter("reussite");
					
					// document.getElementById("tips").innerHTML = "<p> Félicitations, l'exercice est réussi </p>";
					// //compagnon reussite
					// changeCompagnon("reussite");
					try{
						API.LMSSetValue("cmi.core.lesson_status", "finished");
					}
					catch{
						
					}
					
				}
				else{
					
					changeCompagnonV2("affiner",affiner);
					//compagnon mauvaise utilisation
					//changeCompagnon("affiner");
				}
			}			
		}

		
		
		
		
		
		
		//window.open('competence.html', '_blank');
		
		resetData();
	}
	else{
		initData(dataToEval);
	}	
}



function changeCompagnon(etat){

	
	for(var i = 0; i < data.length; i++){
		if(data[i].animationName == etat){
			document.getElementById("compagnon").src = "assets/images/" + data[i].spriteName
			//document.getElementById("tips").innerHTML = data[i].text;
			return;
		}
	}
	
}

function changeCompagnonV2_no_parameter(etat){
	var list_vide = [];
	changeCompagnonV2(etat,list_vide);
}

function changeCompagnonV2(etat,list_erreur){
		
	if(compagnon_change[etat].activation){
		
		document.getElementById("compagnon").src = "assets/images/" + compagnon_change[etat].spriteName;
		
		for(var i = 0; i < list_erreur.length;i++){
			if(compagnon_change[etat][list_erreur[i]].activation){			
			
				document.getElementById("tips").innerHTML += "<p>" + compagnon_change[etat][list_erreur[i]].remediation + "</p>";
			}
			
			//traitement du score
		}
		
		document.getElementById("tips").innerHTML += "<p>" + compagnon_change[etat].remediation + "</p>";
		
		//traitement du score
	}
}

function changeCompagnonAffinage(etat, list_affiner){


}

function updateCompagnon(id){
	
	// V1
	
	// if(JSON.parse(sessionStorage.erreur)[id].length > 0){
						
			// switch (id) {
				// case 'missing_gate_entries':
					// //document.getElementById("tips").innerHTML += "<p>certaines portes logiques ont des entrées inutilisées</p>";
					// break;
				// case 'missing_gate_output':
					// document.getElementById("tips").innerHTML += "<p>certaines portes logiques ont des sorties inutilisées</p>";
					// break;
				// case 'wrong_output':
					// changeCompagnonV2_no_parameter("echec");
					// //document.getElementById("tips").innerHTML += "<p>Certaines sorties n'ont pas les comportements attendus</p>";
					// break;
			// }
			
	// }
	
	// V2
	
	return (JSON.parse(sessionStorage.erreur)[id].length > 0);
}

function resetData(){
	testData = {};
	Object.keys(erreur).forEach(key => {
			erreur[key] = [];
		});
	
	/*
	cptBascule = {	Rs: 0,
					Jk: 0
				};
	*/
	
}

function detailsErreur(id, correctString){
	
	if(JSON.parse(sessionStorage.erreur)[id].length == 0){
			
			document.getElementById(id).innerHTML = correctString;
		}
		else{
			
			document.getElementById(id).innerHTML = "";
			
			for(var i = 0; i < JSON.parse(sessionStorage.erreur)[id].length; i++){
				document.getElementById(id).innerHTML += "<p>" + JSON.parse(sessionStorage.erreur)[id][i] +"</p>";
			}
		}
}






var referenceXMLName = "correction.CONNECTIO";
testSiteHTML(referenceXML(referenceXMLName),"",false);

//testSiteHTML("test");

//nodeDataList.push(xmlDoc.getElementsByTagName("NodeData")[0].attributes["NodeType"]);

//*/