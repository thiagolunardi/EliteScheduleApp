(function (){
	'use strict';
	
	angular.module('eliteApp').factory('eliteApi', ['$http', '$q', '$ionicLoading', 'CacheFactory', eliteApi]);
	
	function eliteApi($http, $q, $ionicLoading, CacheFactory) {
		
		self.leaguesCache = CacheFactory.get('leaguesCache');
		if(!self.leaguesCache) {
			self.leaguesCache = CacheFactory.createCache('leaguesCache', { storageMode: 'localStorage', maxAge: 10000, deleteOnExpire: 'aggressive' });
		}
		
		self.leagueDataCache = CacheFactory.get('leagueDataCache');
		if(!self.leagueDataCache) {
		    self.leagueDataCache = CacheFactory.createCache('leagueDataCache', { storageMode: 'localStorage', maxAge: 10000, deleteOnExpire: 'aggressive' });
		}

		self.staticCache = CacheFactory.get('staticCache');
		if(!self.staticCache) {
			 self.staticCache = CacheFactory.createCache('staticCache', { storageMode: 'localStorage' });
		}
		
		self.leaguesCache.setOptions({
			onExpire: function (key, value) {
				getLeagues()
					.then(function () {
						console.log('Leagues Cache auto refresh');
					}, function () {
						console.log('Error getting data. Delaying data expiration.');
						self.leaguesCache.put(key, value);
					});
			}
		});
		
		self.leagueDataCache.setOptions({
			onExpire: function (key, value) {
				getLeagueData()
					.then(function () {
						console.log('League Data Cache auto refresh');
					}, function () {
						console.log('Error getting data. Delaying data expiration.');
						self.leaguesCache.put(key, value);
					});
			}
		});
		
		
		function setLeagueId(leagueId) {
			self.staticCache.put('currentLeagueId', leagueId);
		}
		function getLeagueId(leagueId) {
			return self.staticCache.get('currentLeagueId');
		}

		
		function getLeagues() {
			var deferred = $q.defer(),
				cacheKey = 'leagues',
				leaguesData = self.leaguesCache.get(cacheKey);
				
			if(leaguesData) {
				console.log('Cached data found.', leaguesData);
				deferred.resolve(leaguesData);
			}
			else {				
				$http.get('http://elite-schedule.net/api/leaguedata')
					.success(function(data) {
						console.log('Received via HTTP request', data, status);
						self.leaguesCache.put(cacheKey, data);
						deferred.resolve(data);
					})
					.error(function(){
						console.log('Error requiesting via HTTP request');
						deferred.reject();
					});
			}			
			return deferred.promise;
		}
		
		function getLeagueData(forceRefresh){
			var deferred = $q.defer(),
				cacheKey = 'leagueData-' + getLeagueId(),
				leagueData = null;
				
			if(!forceRefresh) {
				leagueData = self.leagueDataCache.get(cacheKey);
			}
				
			if(leagueData) {
				//console.log('Dados encontrados no Cache', leagueData);
				deferred.resolve(leagueData);
			} else {
				$ionicLoading.show({template: 'Loading...'});
				
				$http.get('http://elite-schedule.net/api/leaguedata/' + getLeagueId())			
					.success(function(data, status) {
						console.log('Received via HTTP request', data, status);
						self.leagueDataCache.put(cacheKey, data);					
						$ionicLoading.hide();					
						deferred.resolve(data);											
					})
					.error(function(){
						$ionicLoading.hide();
						console.log('Error via HTTP request');
						deferred.reject();
					});				
			}						

			return deferred.promise;
		}		
		
		return {
			getLeagues: getLeagues,
			getLeagueData: getLeagueData,
			setLeagueId: setLeagueId
		}
	};
	
})();