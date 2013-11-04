(function($) {
	
	var DataGrabber = function(page)
	{
		this.page = page;	
	}
	
	DataGrabber.prototype.getNetIncome = function(startdate, enddate, callback)
	{
		var parser = this;
		
		this.page.open('https://wwws.mint.com/trend.event', function(status) {

			if(!parser.success(status)) {
				console.log('{"error":"Unable to load the DataGrabber page: '+status+'"}');
				phantom.exit();
			}
			
			parser.page.injectJs('lib/jquery.js');

			var interval = window.setTimeout(function(){
				console.log('{"error":"Page Timed out"}');
				phantom.exit();
			}, 5000);

			parser.page.onAlert = function(msg)
			{
				window.clearInterval(interval);
				console.log('---start payload---');
				console.log(msg);
				console.log('---end payload---');
				phantom.exit();
			}
			var results = parser.page.evaluate(function(startdate, enddate)
			{
				var token = jQuery("#javascript-token").val();
				var query = '{"reportType":"NW","chartType":"P","comparison":"","matchAny":true,"terms":[],"accounts":{"groupIds":["AA"],"accountIds":[]},"dateRange":{"period":{"label":"Custom","value":"CS"},"start":"'+startdate+'","end":"'+enddate+'"},"drilldown":null,"categoryTypeFilter":"all"}';
				
				var params = {
					token:token,
					searchQuery:query
				};
				
				jQuery.post('https://wwws.mint.com/trendData.xevent', params, function(response){
					alert(JSON.stringify(response));
				})
				return true;
			}, startdate, enddate);
			
		
		});
	}
	
		
	DataGrabber.prototype.success = function(status)
	{
		if (status != 'success')
		{
			return false;
		}
		return true;
	}
	
	window.DataGrabber = DataGrabber;

})(jQuery);