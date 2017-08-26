chrome.runtime.onMessage.addListener((data) => {
	console.log("data", data);

	function pointsToString(points) {
		var list = [];
		points.forEach((item) => {
			list.push(`${item.x},${item.y}`);
		}, this);
		return list.join(" ");
	}

	function polygonsToString(polygons) {
		var list = [];
		polygons.forEach((item) => {
			list.push(`
<g>
	<polygon points="${pointsToString(item.points)}">
		<title>${item.title} ${item.translation}</title>
	</polygon>
</g>
`);
		});
		return list.join("\n");
	};

	var list = document.getElementsByClassName("cassiaOverlay");
	for (var i = 0; i < list.length; i++) {
		document.body.removeChild(list[i]);
	}

	var cassiaOverlay = document.createElement("div");
	cassiaOverlay.classList.add("cassiaOverlay");
	document.body.appendChild(cassiaOverlay);

	var cassiaImg = new Image();

	cassiaImg.onload = () => {
		var imageWidth = cassiaImg.clientWidth;
		var imageHeight = cassiaImg.clientHeight;

		cassiaOverlay.innerHTML += `
<svg viewBox="0 0 ${imageWidth} ${imageHeight}">
	${polygonsToString(data.items)}
</svg>
`;

	};

	cassiaImg.src = data.imageUrl;
	cassiaOverlay.appendChild(cassiaImg);
});