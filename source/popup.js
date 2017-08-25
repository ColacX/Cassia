/**
 * Definition of the core module and its dependencies to other modules
 */
angular.module("cassia", []);

angular.module("cassia").directive("cassiaTest", function () {
	return {
		restrict: "E",
		replace: true,
		template: `<span>test</span>`,
		link: function ($scope, $element, $attributes, $controller) {
		}
	};
});

document.addEventListener('DOMContentLoaded', function () {
	console.log("started");
});
