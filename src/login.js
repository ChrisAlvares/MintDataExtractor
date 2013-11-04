(function($) {
	
	var Login = function(page)
	{
		this.page = page;	
	}
	
	Login.prototype.login = function(username, password, callback)
	{
		if(this.isLoggedIn()) return;
		var parser = this;
		this.page.open('https://wwws.mint.com/login.event', function(status) {
		
			if(!parser.success(status)) {
				console.log("{'error':'Unable to load the login page: "+status+"'}");
				phantom.exit();
			}
			
			parser.page.injectJs('lib/jquery.js');
			
			var results = parser.page.evaluate(function(username, password)
			{			
				jQuery('#form-login-username').val(username);
				jQuery('#form-login-password').val(password);
				jQuery('#form-login').submit();
				return true;
			}, username, password);
			
			window.setTimeout(function() {
				if(parser.isLoggedIn()) {
					if(typeof callback !== 'undefined') callback();
				} else {
					console.log("{'error':'Bad Username or Password'}");
					phantom.exit();
				}
			}, 5000);
		});			
	}
	
	Login.prototype.isLoggedIn = function() 
	{
		return this.page.evaluate(function(){
			return (document.cookie.indexOf("wa_login") != -1);
		});
	}
	
	Login.prototype.success = function(status)
	{
		if (status != 'success')
		{
			return false;
		}
		return true;
	}
	
	window.Login = Login;

})(jQuery);