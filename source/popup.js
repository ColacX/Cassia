/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", ["chromeTabs", "googleVisionApi", function (chromeTabs, googleVisionApi) {
	return {
		restrict: "E",
		replace: true,
		template: `<span>testing</span>`,
		link: function ($scope, $element, $attributes, $controller) {
			$scope.$applyAsync(async () => {
				try {
					var dataUrl = await chromeTabs.captureTab();
					//$element.append(`<img src="${dataUrl}" />`);
					var prefix = "data:image/jpeg;base64,";
					var imageBase64 = dataUrl.substring(prefix.length, dataUrl.length);

					var svgHtml = `
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="9.2762mm" height="8.9409mm" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
viewBox="0 0 48 47"
 xmlns:xlink="http://www.w3.org/1999/xlink">
 <defs>
  <style type="text/css">
   <![CDATA[
    .fil0 {fill:#B0CB1F}
    .fil1 {fill:#009846}
   ]]>
  </style>
 </defs>
 <g id="Layer_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <g id="_1194153776">
   <path class="fil1" d="M0 0l48 0 0 47 -48 0 0 -47zm39 24l-28 -18 0 34 28 -16z"/>
  </g>
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

cassiaOverlay.innerHTML = \`${svgHtml}\`;

`;

					// var response = await googleVisionApi.analyse(imageBase64);
					// console.log(response);
					// response.data.responses[0].textAnnotations.forEach((item) => {
					// 	console.log(item);
					// 	var v0 = boundingPoly.vertices[0];
					// 	var v1 = boundingPoly.vertices[1];
					// 	var v2 = boundingPoly.vertices[2];
					// 	var v3 = boundingPoly.vertices[3];

					// 	create({
					// 		left: v0.x,
					// 		top: v0.y,
					// 		width: v1.x - v0.x,
					// 		height: v2.y - v0.y,
					// 	});
					// });

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
}]);

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

angular.element(document).ready(function () {
	var injector = angular.element(document).injector();
	console.log("injector", injector);
});