Personnalisation de l'application ###############################################################################################################################################################################

Titre + énoncé de l'exercice
============================

Dans un fichier texte nommé "enonce.txt", placez le titre de votre activité à la première ligne, sautez une ligne et inscrivez l'énoncé de votre exercice à la ligne 3 comme dans l'exemple ci-dessous.

Exemple:
--------

Exercice 4 : Le monte escalier

Un monte escalier électrique est équipé de deux boutons poussoirs (monostables) permettant de monter ou de descendre.
Ces boutons doivent être maintenus pour que le moteur tourne...

#################################################################################################################################################################################################################

Portes logiques imposées
========================

Dans cette application, il est possible d'imposer à l'étudiant d'utiliser la porte logique voulue. Pour cela, rendez-vous dans le fichier texte "porte_logique.txt". Une fois dans le fichier rien de plus simple.
Inscrivez le nom de la porte logique désirée et le nombre voulu. Séparez ces deux informations de deux points comme dans l'exemple ci-dessous.

Exemple:
--------

And2 : 2
Or2 : 2

##################################################################################################################################################################################################################

Gestion des erreurs et remédiation du compagnon
===============================================

Cette application abrite un compagnon qui aidera l'étudiant en lui fournissant des indications ou un retour direct sur le travail effectué. Ces phrases de remédiation ainsi que l'apparence du compagnon sont 
totalement personnalisables. Pour cela, modifiez le fichier nommé "compagnon.js" situé dans le dossier CONTENU. Dans ce fichier, vous trouverez les erreurs que l'étudiant peut commettre dans l'exercice organisées 
de la façon suivante : 

"nom de l'erreur" : {
	"spriteName" : "nom_du_sprite.png",
	"activation" : true,
	"remediation" : "Il y a un problème, fais plutôt comme ça",
	"qualite" : 1,
	"performance" : 5
}

Parfois, ces différents paragraphes sont regroupés en un groupe (entrées/sorties) mais la forme est pratiquement identique. Voyons de plus près ce que tout ça signifie : 

"nom de l'erreur" = nom de l'erreur 
"spriteName" = nom de l'image correspondant à la réaction du compagnon voulue
"activation" = true si activée ou false si désactivée
"remediation" = phrase de remédiation voulue par le professeur
"qualité" = points à attribuer dans la catégorie qualité
"performance" = points à attribuer dans la catégorie performance


###################################################################################################################################################################################################################