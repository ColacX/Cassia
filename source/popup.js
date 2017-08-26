/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", [
	"chromeTabs", "googleVisionApi", "cassiaTools",
	function (chromeTabs, googleVisionApi, cassiaTools) {
		return {
			restrict: "E",
			replace: true,
			template: `<span>testing</span>`,
			link: function ($scope, $element, $attributes, $controller) {
				$scope.$applyAsync(async () => {
					try {
						var imageUrl = await chromeTabs.captureTab();
						$element.append(`<img src="${imageUrl}" />`);
						var prefix = "data:image/jpeg;base64,";
						var imageBase64 = imageUrl.substring(prefix.length, imageUrl.length);

						var htmlCode = `
<img class="cassiaOverlay" src="${imageUrl}" />
<svg class="cassiaOverlay" viewBox="0 0 1920 930">
	<g>
		<polygon points="933,230 983,229 983,240 933,241" style="fill:lime;stroke:purple;stroke-width:1">
			<title>hello world</title>
		</polygon>
	</g>
</svg>
`;

						var script = `
var list = document.getElementsByClassName("cassiaOverlay");
for(var i=0; i<list.length; i++){
	document.body.removeChild(list[i]);
}

var cassiaOverlay = document.createElement("div");
cassiaOverlay.classList.add("cassiaOverlay");
document.body.appendChild(cassiaOverlay);

cassiaOverlay.innerHTML = \`${htmlCode}\`;
`;

						// var response = await googleVisionApi.analyse(imageBase64);
						// console.log(response);
						// response.data.responses[0].textAnnotations.forEach((item) => {
						// 	console.log(item);
						// 	// var v0 = boundingPoly.vertices[0];
						// 	// var v1 = boundingPoly.vertices[1];
						// 	// var v2 = boundingPoly.vertices[2];
						// 	// var v3 = boundingPoly.vertices[3];

						// 	// create({
						// 	// 	left: v0.x,
						// 	// 	top: v0.y,
						// 	// 	width: v1.x - v0.x,
						// 	// 	height: v2.y - v0.y,
						// 	// });
						// });

						// 					{ x: 933, y: 230 }
						// 					1
						// :
						// 					{ x: 983, y: 229 }
						// 					2
						// :
						// 					{ x: 983, y: 240 }
						// 					3
						// :
						// 					{ x: 933, y: 241 }

						await chromeTabs.insertStyle(null, "cassiaOverlay.css");
						await chromeTabs.executeScript(script);
						console.log("script", script);
					}
					catch (error) {
						console.error(error);
					}
				});
			}
		};
	}
]);

//https://developer.chrome.com/extensions/tabs#method-captureVisibleTab
angular.module("cassia").service("chromeTabs", [function () {
	if (!chrome.tabs) throw "chrome.tabs not supported";
	var self = this;

	self.captureTab = () => {
		return new Promise((resolve, reject) => {
			chrome.tabs.captureVisibleTab(resolve);
		});
	};

	self.executeScript = (code) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.executeScript({ code: code }, resolve);
		});
	};

	self.insertStyle = (code, file) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.insertCSS({ code: code, file: file }, resolve);
		});
	};

	return self;
}]);

//https://cloud.google.com/vision/docs/request
angular.module("cassia").service("googleVisionApi", ["$http", function ($http) {
	var self = this;
	var apiKey = "AIzaSyBC6V0krYfH5qBama4J3gwZABf2xWktQXE";
	var apiUrl = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;

	self.analyse = (imageBase64) => {
		return new Promise((resolve, reject) => {
			var data = {
				"requests": [
					{
						"image": {
							"content": imageBase64
						},
						"features": [
							// {
							// 	"type": "CROP_HINTS"
							// },
							// {
							// 	"type": "LABEL_DETECTION"
							// },
							{
								"type": "TEXT_DETECTION"
							},
							// {
							// 	"type": "FACE_DETECTION"
							// },
							// {
							// 	"type": "WEB_DETECTION"
							// },
						]
					}
				]
			};

			$http({
				method: "POST",
				url: apiUrl,
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json"
			}).then(resolve).catch(reject);
		});
	};

	return self;
}]);

angular.module("cassia").service("cassiaTools", [function () {
	var self = this;

	self.getImageData = (dataUrl) => {
		return new Promise(function (resolve, reject) {
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			var image = new Image();

			image.addEventListener('load', function () {
				console.log(image.width, image.height);
				canvas.width = image.width;
				canvas.height = image.height;
				//context.drawImage(image, 0, 0, canvas.width, canvas.height);
				//resolve(context.getImageData(0, 0, canvas.width, canvas.height));
			}, false);

			//image.src = dataUrl;
		});
	};

	return self;
}]);

angular.element(document).ready(function () {
	var injector = angular.element(document).injector();
	console.log("injector", injector);
});