
// traduit un 'Xor' en un melange de 'Not' 'Or' et 'And'
function xorFormula(A,B){
	return "( (" + A + ") . / (" +  B + ") ) + ( / (" + A  + ") . ("  + B + ") )";
}

// permet de traduire le premier 'Xor' trouvé
function evalXor(equation){

	// permet la separation a partir du premier symbole xor: ⊕
	equationSplit = equation.split(/⊕(.+)/);


	// on recupere les deux opérandes
	leftSide = parenthesage(false,equationSplit[0]);
	rightSide = parenthesage(true,equationSplit[1]);

	// on remplace l'equation initiale	
	equation = equation.replace(leftSide + xorSymbole + rightSide, xorFormula(leftSide,rightSide));

	return equation;
}

// inverse les lettres d'un string s
function reverse(s){
	return s.split("").reverse().join("");
}

// recupere les données selon la direction de lecture et le nombre de parenthèse
function parenthesage(directionIsRight,splitString){
	
	var counter = 0;
	var counterPlus = "(";
	var counterMinus = ")";
	
	
	if(!directionIsRight){
		splitString = reverse(splitString);
		counterPlus = ")";
		counterMinus = "(";
	}
	
	for(var i = 0; i < splitString.length; i++){
		
		// parenthèse 'ouvrante' trouvé
		if(splitString.charAt(i) == counterPlus){
			counter++;
		}
		
		// parenthèse 'fermante' trouvé
		if(splitString.charAt(i) == counterMinus){
			counter--;
		}
		
		// plus de parenthèse 'fermante' trouvé on a donc les données cherchées
		if(counter < 0){
		
			var stringToReturn = splitString.substring(0,i+1);
		
			if(!directionIsRight){
				stringToReturn = reverse(stringToReturn);
			}
			
			return stringToReturn
		}
	}
	
	if(!directionIsRight){
		splitString = reverse(splitString);
	}
	
	// les données cherchées vont jusqu'au bout et ne nécessitais pas de parenthèse
	
	return splitString;
}

function symbolLogicToEval(text){
	
	var xorSymbole = "⊕";
	var textToEval = text;
	
	textToEval = textToEval.removeAll("<p>");
	textToEval = textToEval.removeAll("</p>");
	
	// on traduis tous les 'Xor'
	while(textToEval.includes(xorSymbole)){
		textToEval = evalXor(textToEval);
	}
	
	textToEval = textToEval.replaceAll("/","!");
	textToEval = textToEval.replaceAll("∧","&&");
	textToEval = textToEval.replaceAll("v","||");
	
	//console.log(textToEval);
}
