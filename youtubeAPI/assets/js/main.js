document.getElementById("toConvert").defaultValue = 0;
document.getElementById("result").style.visibility = "hidden";

function converter() {
	if (document.getElementById('gRadio').checked){
		g();
	} else if (document.getElementById('kgRadio').checked){
		kg();
	} else if(document.getElementById('ozRadio').checked){
		oz();
	} else if(document.getElementById('lbsRadio').checked){
		lbs();
	} 
}


function g(){

	document.getElementById("toConvert").addEventListener('input', function (e) {
	document.getElementById("result").style.visibility = "visible";
	let grams = e.target.value;
	document.getElementById("gramsResult").innerHTML = grams*1 + "<sub>g</sub>";

	document.getElementById("kgResult").innerHTML = grams*0.001 + "<sub>kg</sub>";

	document.getElementById("ounceResult").innerHTML = grams*0.035274 + "<sub>oz</sub>";

	document.getElementById("poundsResult").innerHTML = grams*0.00220462 + "<sub>lbs</sub>";
});
}


g();

function kg(){

	document.getElementById("toConvert").addEventListener('input', function (e) {
	document.getElementById("result").style.visibility = "visible";
	let kilograms = e.target.value;
	document.getElementById("gramsResult").innerHTML = kilograms*1000 + "<sub>g</sub>";

	document.getElementById("kgResult").innerHTML = kilograms*1 + "<sub>kg</sub>";

	document.getElementById("ounceResult").innerHTML = kilograms*35.274 + "<sub>oz</sub>";

	document.getElementById("poundsResult").innerHTML = kilograms*2.20462 + "<sub>lbs</sub>";
});
}

kg();

function oz(){

	document.getElementById("toConvert").addEventListener('input', function (e) {
	document.getElementById("result").style.visibility = "visible";
	let ounces = e.target.value;
	document.getElementById("gramsResult").innerHTML = ounces*28.3495 + "<sub>g</sub>";

	document.getElementById("kgResult").innerHTML = ounces*0.0283495 + "<sub>kg</sub>";

	document.getElementById("ounceResult").innerHTML = ounces*1 + "<sub>oz</sub>";

	document.getElementById("poundsResult").innerHTML = ounces*0.0625 + "<sub>lbs</sub>";
});
}

oz();


function lbs(){

	document.getElementById("toConvert").addEventListener('input', function (e) {
	document.getElementById("result").style.visibility = "visible";
	let pounds = e.target.value;
	document.getElementById("gramsResult").innerHTML = pounds/0.0022046 + "<sub>g</sub>";

	document.getElementById("kgResult").innerHTML = pounds/2.2046 + "<sub>kg</sub>";

	document.getElementById("ounceResult").innerHTML = pounds*60 + "<sub>oz</sub>";

	document.getElementById("poundsResult").innerHTML = pounds*1 + "<sub>lbs</sub>";
});
}

lbs(); 