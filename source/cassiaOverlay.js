function cassiaLoad(imageUrl, jsonData) {
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
	<polygon points="${pointsToString(item.points)}" style="fill-opacity: 0; stroke:purple; stroke-width:1;">
		<title>hello world</title>
	</polygon>
</g>
`);
		});
		return list.join();
	};

	console.log(jsonData);
	var data = JSON.parse(jsonData);

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
		console.log(imageWidth, imageHeight);

		cassiaOverlay.innerHTML += `
<svg viewBox="0 0 ${imageWidth} ${imageHeight}">
	${polygonsToString(data.items)}
</svg>
`;

	};
	cassiaImg.src = imageUrl;
	cassiaOverlay.appendChild(cassiaImg);
};
