(function (){
	'use strict';
	
	angular.module('eliteApp').controller('locationMapCtrl', ['$stateParams', 'eliteApi', locationMapCtrl]);
	
	function locationMapCtrl($stateParams, eliteApi) {	
		var vm = this;
		
		vm.locationId = Number($stateParams.id);		
		
		
		
		eliteApi.getLeagueData().then(function(data) {
			 vm.location = _.find(data.locations, { id: vm.locationId });
			 vm.locationName = vm.location.name;
			 
 			 vm.marker = {
				 id: 1,
				 latitude: vm.location.latitude,
				 longitude: vm.location.longitude,
				 title: vm.location.name + '<br />(Toque para direções)',
				 showWindow: true,
				 options: {
					labelContent: vm.location.name + '<br />(Toque para direções)',
					labelAnchor: google.maps.Point(10, -8),
					labelClass: 'marker-labels'
				 }
			 };		
			 
			 vm.map = {
				center: {
					latitude: vm.location.latitude,
					longitude: vm.location.longitude
				},
				zoom: 12	
			};			 
		});
		
		vm.locationClicked = function(marker) {
			console.log('clicked marker:', marker);
			window.location = 'geo:' + marker.latitude +','+ marker.longitude + ';u=35';
		}
	};
	
})();