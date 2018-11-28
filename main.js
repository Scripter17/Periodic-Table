window.onload=function(){
	initTable();
}
function setAttributesNS(elem, attrs){ // call element.setAttributeNS in bulk
	var x;
	for (x in attrs){
		elem.setAttributeNS(null, x, attrs[x]);
	}
	return elem;
}
function initTable(){
	var y, x, // The period and group of each element
		tr, td, // Periods and groups, respectively
		elemN, // The current element
		elemCell, // The cell of the current element
		table; // The periodic table itself
	table=document.getElementById("periodicTable")
	table.innerHTML=""; // If, for some reason, initTable is called more than once, this should make it not break.
	for (y=0; y<11; y++){ // Periods
		tr=document.createElement("tr");
		for (x=0; x<19; x++){ // Groups
			td=document.createElement("td");
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	
	for (x=1; x<=18; x++){table.childNodes[0].childNodes[x].innerHTML=x;} // Add the period labels at the top
	for (y=1; y<=7; y++){table.childNodes[y].childNodes[0].innerHTML=y;} // Add the group labels on the left
	
	for (elemN in elems){ // Set table cell symbol and add the onclick event
		elemCell=table.childNodes[elems[elemN]["ypos"]].childNodes[elems[elemN]["xpos"]];
		elemCell.innerHTML=elems[elemN].symbol;
		elemCell.title=elems[elemN].name;
		elemCell.setAttribute("onclick","viewElement("+elemN+")"); // If I do elemCell.onclick=function(){viewElement(elemN);} makes it always do Ogganesson (118).
		elemCell.classList.add("element");
	}
}
function viewElement(elem){ // Using this function costs you $11.99 (The price of a plate of spaghetti)
	var svg, // The atom diagram thing
		w, h, // Width and height of the diagram
		viewElem, // class="view" element number
		shell, // The current shell while rendering the diagram
		txt, txtAttrs, // The atomic symbol in the diagram and its attributes
		ring, ringAttrs, // Electron shells
		elecN, elec, elecAttrs, // Electrons (Nth in shell, <circle>, and Attributes)
		angle, // The angle of each electron in a shell
		ions, ionN, // The ions of the element and the nth ion of the element
		span, // Each number in the ion list is its own span element
		data; // I can't use for (x of elems) in IE, so I need to do for (x=0; x<elems.length; x++){elem=elems[x]}
	var rp=6; // Distance between electron shells as a percentage of diagram width
	var ep=1.2; // Radius of electrons as a percentage of diagram width
	elem=elems[elem]; // You may think this is stupid, but due to how I had to set the onclick functions, this is the only not-shit way to do it.
	
	svg=document.getElementById("diagram");
	while (svg.firstChild){ // Remove every ring/electron in the diagram
		svg.removeChild(svg.firstChild);
	}
	
	// Width and height of diagram (Right now, they're constant, but they might change later)
	w=parseInt(svg.getAttribute("width"));
	h=parseInt(svg.getAttribute("height"));
	// Adds the chemical symbol to the diagram.
	txtAttrs={"x":"50%", "y":"50%", "style":"text-anchor:middle; font-size:16px; transform:translate(0,0.25em)"};
	txt=setAttributesNS(document.createElementNS("http://www.w3.org/2000/svg", "text"), txtAttrs);
	txt.innerHTML=elem.symbol;
	svg.appendChild(txt);
	for (shell=0; shell<elem.shells.length; shell++){ // The shell loop.
		ringAttrs={"cx":"50%", "cy":"50%", "r":(shell+1)*rp+"%", "style":"stroke: black; stroke-width:1px; fill:none;"};
		ring=setAttributesNS(document.createElementNS("http://www.w3.org/2000/svg", "circle"), ringAttrs);
		svg.appendChild(ring);
		for (elecN=0; elecN<elem.shells[shell]; elecN++){ // The Electron loop
			angle=elecN/elem.shells[shell]*2*Math.PI;
			elecAttrs={"cx":(50+Math.sin(angle)*(shell+1)*rp)+"%", "cy":(50-Math.cos(angle)*(shell+1)*rp)+"%", "r":ep+"%", "style":"fill: black;"};
			elec=setAttributesNS(document.createElementNS("http://www.w3.org/2000/svg", "circle"), elecAttrs);
			svg.appendChild(elec);
		}
	}
	// Set the data under the diagram
	for (viewElem=0; viewElem<document.getElementsByClassName("view").length; viewElem++){
		data=document.getElementsByClassName("view")[viewElem];
		data.innerHTML=elem[data.id.split("_")[1]];
	}
	
	// 100% jank method of listing ions with the common ones in blue
	ions=document.getElementById("view_ions");
	ions.innerHTML="";
	for (ionN=0; ionN<elem.ions[0].length; ionN++){
		span=document.createElement("span");
		span.innerHTML=elem.ions[0][ionN];
		// elem.ions[0]=all ions, elem.ions[1]=common ions
		if (elem.ions[1].indexOf(elem.ions[0][ionN])!=-1){span.style.color="blue";}
		ions.appendChild(span);
		ions.innerHTML+=",";
	}
	ions.innerHTML=ions.innerHTML.substr(0,ions.innerHTML.length-2);
}
