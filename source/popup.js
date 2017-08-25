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

angular.element(document).ready(function () {
	var injector = angular.element(document).injector();
	console.log("injector", injector);
});