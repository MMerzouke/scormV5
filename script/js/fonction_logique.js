
//fonction permettant l'évaluation de Xor2 et Xor3

function XOR(entriesList,port){
	
	//console.log(entriesList);
	
	var A = entriesList.shift();
	
	var B;
	
	if(entriesList.length == 2){
		B = XOR(entriesList);
	}
	else{
		B = entriesList[0];
	}
	
	//console.log("a b " + A + " " + B);
	
	return eval("( (" + A + ") && ! (" +  B + ") ) || ( ! (" + A  + ") && ("  + B + ") )");

}



function bitToByte(entriesList,port){
	
	if(entriesList.length > 1){
		return entriesList.shift() + 2 * bitToByte(entriesList);
	}
	return entriesList[0];
}

function byteToBit(entriesList,port){
	var quotien = entriesList[0];
	var remainder = 0;
	var outputList = [0,0,0,0,0,0,0,0];
	
	var cpt = 0;
	
	while(quotien>0){
		remainder = quotien%2;
		quotien = Math.floor(quotien/2);
		
		outputList[cpt] = remainder;
		cpt++;
	}
	
	return (outputList[port] == 1);
}

