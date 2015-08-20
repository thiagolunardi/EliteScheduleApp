(function (){
	'use strict';
	
	angular.module('eliteApp').controller('leaguesCtrl', ['$state', 'eliteApi', leaguesCtrl]);
	
	function leaguesCtrl($state, eliteApi) {	
		var vm = this;
		
		eliteApi.getLeagues().then(function(data){
			vm.leagues = data;	
		});				
		
		vm.selectLeague = function(leagueId) {			
			eliteApi.setLeagueId(leagueId);
			$state.go('app.teams');
		}
	};
	
})();