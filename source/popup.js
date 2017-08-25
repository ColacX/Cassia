/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", ["cassiaTabs", function (cassiaTabs) {
	return {
		restrict: "E",
		replace: true,
		template: `<span>test</span>`,
		link: function ($scope, $element, $attributes, $controller) {
			(async () => {
				try {
					var dataUrl = await cassiaTabs.captureTab();
					$element.append(`<img src="${dataUrl}" />`);

					await cassiaTabs.executeScript(`alert("hello world");`);
				}
				catch (error) {
					console.error(error);
				}
			})();
		}
	};
}]);

//https://developer.chrome.com/extensions/tabs#method-captureVisibleTab
angular.module("cassia").service("cassiaTabs", [function () {
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

angular.element(document).ready(function () {
	var injector = angular.element(document).injector();
	console.log("injector", injector);
});