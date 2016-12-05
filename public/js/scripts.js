
document.getElementById("eye-left").addEventListener("mouseover", function() {
	document.getElementById("eye-speech").innerText = "\"Hey what are you doing?\"";
});
document.getElementById("eye-left").addEventListener("mouseout", function() {
	document.getElementById("eye-speech").innerText = "\"Eye see you\"";
});
document.getElementById("eye-right").addEventListener("mouseover", function() {
	document.getElementById("eye-speech").innerText = "\"Hey what are you doing?\"";
});
document.getElementById("eye-right").addEventListener("mouseout", function() {
	document.getElementById("eye-speech").innerText = "\"Eye see you\"";
});

document.getElementById("eye-left").addEventListener("mousedown", function() {
	$("#eye-left").attr('src', '/images/eye-red.png');
});
document.getElementById("eye-left").addEventListener("mouseup", function() {
	$("#eye-left").attr('src', '/images/eye.png');
});
document.getElementById("eye-right").addEventListener("mousedown", function() {
	$("#eye-right").attr('src', '/images/eye-red.png');
});
document.getElementById("eye-right").addEventListener("mouseup", function() {
	$("#eye-right").attr('src', '/images/eye.png');
});

document.getElementById("door-img").addEventListener("mouseover", function() {
	document.getElementById("eye-speech").innerText = "\"Dare you knock??\"";
});
document.getElementById("door-img").addEventListener("mouseout", function() {
	document.getElementById("eye-speech").innerText = "\"Eye see you\"";
});

document.getElementById("eye-speech").addEventListener("copy", function() {
	document.getElementById("eye-speech").innerHTML = "\"<u>Woah!</u> Are you recording me??\"";
});

document.getElementById("ghost-left").addEventListener("mouseover", function() {
	var ghostl = document.getElementById("ghost-left");
	var ghostr = document.getElementById("ghost-right");
	if ((ghostl.style.visibility == "visible") || (ghostr.style.visibility)) {
		ghostl.style.visibility = "hidden";
		ghostr.style.visibility = "visible";
	}
});
document.getElementById("ghost-right").addEventListener("mouseover", function() {
	var ghostl = document.getElementById("ghost-left");
	var ghostr = document.getElementById("ghost-right");
	if ((ghostr.style.visibility == "visible") || (ghostr.style.visibility == "")) {
		ghostr.style.visibility = "hidden";
		ghostl.style.visibility = "visible";
	}
});

function openDoor() {
	$("#door-img").attr('src', '/images/skeleton.gif');
	document.getElementById("eye-speech").innerHTML = "\"<u>Hey!</u> Close the door!\"";
	window.setTimeout(function() {
		$("#door-img").attr('src', '/images/door.jpg');
		document.getElementById("eye-speech").innerHTML = "\"<u>Not</u> cool man...\"";
	}, 1600);
}

function pokeEye() {
	var responses = ["\"Cut it out!\"", "\"Quit it!\"", "\"Ow!\"", "\"Stop it!\"", "\"That hurts!\""];
	document.getElementById("eye-speech").innerText = responses[Math.floor(Math.random() * responses.length)];
}

function hideEyeText() {
	var eyeSpeech = document.getElementById("eye-speech");
	if ((eyeSpeech.style.visibility == "visible") || (eyeSpeech.style.visibility == "")) {
		eyeSpeech.style.visibility = "hidden";
	} else {
		eyeSpeech.style.visibility = "visible";
		document.getElementById("eye-speech").innerText = "\"You trying to shut me up?\"";
	}
}

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {

	rotateObject("eye-left");
	rotateObject("eye-right");

	function rotateObject(objName) {

		var rect = document.getElementById(objName).getBoundingClientRect();
		var dx = event.pageX - ((rect.right + rect.left) / 2);
		var dy = event.pageY - ((rect.top + rect.bottom) / 2);
		var angle = 180 - (Math.atan2(dx, dy) * (180/Math.PI));

		//console.log(angle);

		var $obj = $("#" + objName);
		rotate(angle);

		function rotate(degree) {
			$obj.css({
				'-webkit-transform': 'rotate(' + degree + 'deg)',
				'-moz-transform': 'rotate(' + degree + 'deg)',
				'-ms-transform': 'rotate(' + degree + 'deg)',
				'-o-transform': 'rotate(' + degree + 'deg)',
				'transform': 'rotate(' + degree + 'deg)',
				'zoom': 1
			}, 5000);
		}
	}
}

function changeColors() {
  //change body background color
  var bodyElement = document.querySelector(".body");
  bodyElement.style.backgroundColor = document.querySelector("#color1").value;

  //change header background color
  var headerElement = document.querySelector(".header");
  headerElement.style.backgroundColor = document.querySelector("#color2").value;

  //change main-material background color
  var mainMaterialElement = document.querySelector(".main-material");
  mainMaterialElement.style.backgroundColor = document.querySelector("#color3").value;

  //change table background color
  var tableElement = document.querySelector("table");
  var thElement = document.querySelector("th");
  var tdElement = document.querySelector("td");
  tableElement.style.backgroundColor = document.querySelector("#color4").value;
  console.log(thElement);
  thElement.style.backgroundColor = document.querySelector("#color4").value;
  tdElement.style.backgroundColor = document.querySelector("#color4").value;

  //change color rating
  document.getElementById("color-rating").innerHTML = "" + ((10 * Math.random()).toFixed(1));
}