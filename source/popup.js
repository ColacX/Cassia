/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", [
	"chromeTabs", "googleVision", "googleTranslate",
	function (chromeTabs, googleVision, googleTranslate) {
		return {
			restrict: "E",
			replace: true,
			template: `
<div>
	<p>source</p>
	<input type="text" ng-model="text.source"></input>
	
	<p>target</p>
	<input type="text" ng-model="text.target"></input>

	<p>
		<button ng-click="overlayButton()">overlay</button>
		<button ng-click="translateButton()">translate</button>
	</p>
</div>
`,
			link: function ($scope, $element, $attributes, $controller) {
				$scope.text = {
					source: "",
					target: ""
				};

				$scope.overlayButton = async () => {
					try {
						var imageUrl = await chromeTabs.captureTab();
						//$element.append(`<img src="${imageUrl}" />`);
						var prefix = "data:image/jpeg;base64,";
						var imageBase64 = imageUrl.substring(prefix.length, imageUrl.length);

						await chromeTabs.insertStyle(null, "cassiaOverlay.css");
						await chromeTabs.executeScript(null, "cassiaOverlay.js");

						var data = {};
						data.imageUrl = imageUrl;
						data.items = [];
						var dictionary = {};

						var response = await googleVision.analyse(imageBase64);

						response.data.responses[0].textAnnotations.forEach((item) => {
							if (!item.boundingPoly || !item.boundingPoly.vertices) {
								console.error(item);
								return;
							}

							for (var i = 0; i < item.boundingPoly.vertices.length; i++) {
								var v = item.boundingPoly.vertices[i];

								if (!v.x || !v.y) {
									console.error(item);
									return;
								}
							};

							data.items.push({
								points: item.boundingPoly.vertices,
								source: item.description
							});

							dictionary[item.description] = false;
						});

						// var keys = Object.keys(dictionary);
						// console.log(keys);
						// var r = await googleTranslate.translate("ja", "en", keys);

						// for (var i = 0; i < keys.length; i++) {
						// 	dictionary[keys[i]] = r.data.data.translations[i].translatedText;
						// }

						// data.items.forEach((item) => {
						// 	item.target = dictionary[item.source];
						// });

						var tab = await chromeTabs.getCurrent();
						chromeTabs.sendMessage(tab.id, data);
					}
					catch (error) {
						console.error(error);
					}
				};

				$scope.translateButton = async () => {
					var response = await googleTranslate.translate("ja", "en", [$scope.text.source]);
					$scope.$apply(() => {
						$scope.text.target = response.data.data.translations[0].translatedText;
					});
				}
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
	var apiUrl = "https://translation.googleapis.com/language/translate/v2";

	self.translate = (source, target, list) => {
		return new Promise((resolve, reject) => {
			var data = `key=${apiKey}&source=${source}&target=${target}`;

			list.forEach((item) => {
				data += `&q=${encodeURIComponent(item)}`;
			});

			$http({
				method: "POST",
				url: apiUrl,
				headers: {
					"X-HTTP-Method-Override": "GET",
					"AcceptCharset": "UTF-8",
					"content-type": "application/x-www-form-urlencoded"
				},
				data: data
			}).then(resolve).catch(reject);
		});
	};

	return self;
}]);

angular.element(document).ready(function () {
	var injector = angular.element(document).injector();
});
