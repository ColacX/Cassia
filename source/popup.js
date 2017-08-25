/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", ["chromeTabs", "googleVisionApi", function (chromeTabs, googleVisionApi) {
	return {
		restrict: "E",
		replace: true,
		template: `<span>test</span>`,
		link: function ($scope, $element, $attributes, $controller) {
			(async () => {
				try {
					var dataUrl = await chromeTabs.captureTab();
					//$element.append(`<img src="${dataUrl}" />`);
					var prefix = "data:image/jpeg;base64,";
					var imageBase64 = dataUrl.substring(prefix.length, dataUrl.length);

					// var response = await googleVisionApi.analyse(imageBase64);
					// console.log(response);
					// response.data.responses[0].textAnnotations.forEach((item) => {
					// 	console.log(item);
					// 	//.boundingPoly.vertices[0].x
					// });

					await chromeTabs.insertStyle(null, "cassiaOverlay.css");

					var script = `
var list = document.getElementsByClassName("cassiaOverlay");
for(var i=0; i<list.length; i++){
	document.body.removeChild(list[i]);
}

var cassiaOverlay = document.createElement("div");
cassiaOverlay.classList.add("cassiaOverlay");
document.body.appendChild(cassiaOverlay);
`;
					await chromeTabs.executeScript(script);
				}
				catch (error) {
					console.error(error);
				}
			})();
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