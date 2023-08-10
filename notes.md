 # Game Cycle
	1. start of the game	
	2. start countdown timer
	3. choose colors for each button
	4. start 2s timer
		* show button colors
		* finish 2s timer  
		* hide button colors
	5. coloring of the buttons:
		* click on the button - button with "chosen" effect
		* choose color from color palette
	6. all buttons colored before finishing countdown timer:
		* finish countdown timer
		* check button colors
		* if some buttons not colored:
			* finish countdown timer
			* check button colors
	
* button colors checking = compare RGB or HEX values of button colors
* have variable for chosen color
* have eventListeners for palette buttons and for game buttons