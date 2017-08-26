function cassiaImageLoaded() {
	var imageWidth = 1920;
	var imageHeight = 930;
}

function cassiaLoad(imageUrl) {
	console.log(imageUrl);
};

var imageWidth = 1920;
var imageHeight = 930;
var htmlCode = `
<svg class="cassiaSvg" viewBox="0 0 ${imageWidth} ${imageHeight}">
	<g>
		<polygon class="0" points="933,230 983,229 983,240 933,241" style="fill:lime;stroke:purple;stroke-width:1">
			<title>hello world</title>
		</polygon>
	</g>
</svg>
`;

var list = document.getElementsByClassName("cassiaOverlay");
for (var i = 0; i < list.length; i++) {
	document.body.removeChild(list[i]);
}

var cassiaOverlay = document.createElement("div");
cassiaOverlay.classList.add("cassiaOverlay");
document.body.appendChild(cassiaOverlay);
cassiaOverlay.innerHTML = htmlCode;