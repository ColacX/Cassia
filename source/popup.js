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

					//await chromeTabs.executeScript(`alert("hello world");`);

					var response = await googleVisionApi.analyse(imageBase64);
					console.log(response);
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

	return self;
}]);

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
							{
								"type": "LABEL_DETECTION"
							}
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