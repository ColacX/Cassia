/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", [
	"chromeTabs", "googleVision", "googleTranslate", "cassiaTools",
	function (chromeTabs, googleVision, googleTranslate, cassiaTools) {
		return {
			restrict: "E",
			replace: true,
			template: `<span>testing</span>`,
			link: function ($scope, $element, $attributes, $controller) {
				$scope.$applyAsync(async () => {
					try {
						// var imageUrl = await chromeTabs.captureTab();
						// //$element.append(`<img src="${imageUrl}" />`);
						// var prefix = "data:image/jpeg;base64,";
						// var imageBase64 = imageUrl.substring(prefix.length, imageUrl.length);

						// await chromeTabs.insertStyle(null, "cassiaOverlay.css");
						// await chromeTabs.executeScript(null, "cassiaOverlay.js");

						// var data = {};
						// data.imageUrl = imageUrl;
						// data.items = [];

						// var response = await googleVision.analyse(imageBase64);
						// console.log(response);

						// response.data.responses[0].textAnnotations.forEach((item) => {
						// 	if (!item.boundingPoly || !item.boundingPoly.vertices) {
						// 		console.error(item);
						// 		return;
						// 	}

						// 	for (var i = 0; i < item.boundingPoly.vertices.length; i++) {
						// 		var v = item.boundingPoly.vertices[i];

						// 		if (!v.x || !v.y) {
						// 			console.error(item);
						// 			return;
						// 		}
						// 	};

						// 	data.items.push({
						// 		points: item.boundingPoly.vertices,
						// 		title: item.description
						// 	});
						// });

						// var tab = await chromeTabs.getCurrent();
						// chromeTabs.sendMessage(tab.id, data);

						var response = await googleTranslate.translate("こんにちは世界", "jp", "en");
						console.log(response);
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

	self.executeScript = (code, file) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.executeScript({ code: code, file: file }, resolve);
		});
	};

	self.insertStyle = (code, file) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.insertCSS({ code: code, file: file }, resolve);
		});
	};

	self.getCurrent = () => {
		return new Promise((resolve, reject) => {
			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
				resolve(tabs[0]);
			});
		});
	}

	self.sendMessage = (tabId, message) => {
		chrome.tabs.sendMessage(tabId, message);
	};

	return self;
}]);

//https://cloud.google.com/vision/docs/request
angular.module("cassia").service("googleVision", ["$http", function ($http) {
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

angular.module("cassia").service("googleTranslate", ["$http", function ($http) {
	var self = this;
	var apiKey = "AIzaSyBC6V0krYfH5qBama4J3gwZABf2xWktQXE";
	var apiUrl = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;

	self.translate = (text, source, target) => {
		return new Promise((resolve, reject) => {
			var data = {
				"q": text,
				"source": source,
				"target": target
			};

			data = {
				'q': text,
				'target': 'en'
			}

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
});
