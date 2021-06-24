var compagnon_change = {
		"fichier incorrect" : {
			  "spriteName" : "sgrl_compagnon_4.png",
			  "activation" : true,
			  "remediation" : "Le fichier n'est pas au format .CONNECTIO",
			  "qualite" : 0,
			  "performence" : 0,

			},
		"entrees/sorties" : {
			  "spriteName" : "sgrl_compagnon_2.png",
			  "activation" : true,
			  
			  "entrees incorrects" : {
				  "remediation" : "Certaines entrées ont des noms incorrects",
				  "activation" : true,
				  "qualite" : 0,
				  "performence" : 0,
				},
			  "sorties incorrects" : {
				  "remediation" : "Certaines sorties ont des noms incorrects",
				  "activation" : true,
				  "qualite" : 0,
				  "performence" : 0,
				},
			  "sorties multiples" : {
				  "remediation" : "Certaines sorties sont en plusieurs exemplaires",
				  "activation" : true,
				  "qualite" : 0,
				  "performence" : 0,
				},
			  "entrees manquantes" : {
				  "remediation" : "Des entrées sont manquantes",
				  "activation" : true,
				  "qualite" : 0,
				  "performence" : 0,
				},
			  "sorties manquantes" : {
				  "remediation" : "Des sorties sont manquantes",
				  "activation" : true,
				  "qualite" : 0,
				  "performence" : 0,
				},
			  
			  "remediation" : "Le fichier ne sera pas analysé avant la correction des entrées/sorties",
			  "qualite" : 0,
			  "performence" : 0,
			  
			},
		"echec" : {
			  "spriteName" : "sgrl_compagnon_2.png",
			  "activation" : true,
			  "remediation" : "Certaines sorties n'ont pas les comportements attendus",
			  "qualite" : 0,
			  "performence" : 0,
		},
		"reussite" : {
				"spriteName" : "sgrl_compagnon.png",
				"remediation" : "Félicitations, l'exercice est réussi",
				"activation" : true,
				"qualite" : 100,
				"performence" : 100,
				"affiner" : {
					"spriteName" : "sgrl_compagnon_3.png",
					"activation" : true,
					"remediation" : "Le schéma logique est bon",
					"qualite" : 80,
					"performence" : 100,
					"aucune entrees portes manquantes" : {
						"remediation" : "Certaines portes ont des entrees vides",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
					"aucune sorties portes manquantes" : {
						"spriteName" : "sgrl_compagnon_3.png",
						"remediation" : "Certaines portes ont des sorties vides",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
					"respect des portes imposees" : {
						"spriteName" : "sgrl_compagnon_3.png",
						"remediation" : "Attention vous n'avez pas utilisé les portes imposées",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
					"entrees portes manquantes" : {
						"spriteName" : "sgrl_compagnon_3.png",
						"remediation" : "Certaines portes ont des entrees vides",
						"SpriteName" : "feoh",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
					"sorties portes manquantes" : {
						"spriteName" : "sgrl_compagnon_3.png",
						"remediation" : "Certaines portes ont des sorties vides",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
					"non respect des portes imposees" : {
						"spriteName" : "sgrl_compagnon_3.png",
						"remediation" : "Attention vous n'avez pas utilisé les portes imposées",
						"activation" : true,
						"qualite" : 0,
						"performence" : 0,
					  },
				},	
			},
}
	