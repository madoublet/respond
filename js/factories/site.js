(function() {
    
    angular.module('respond.factories')
    
    .factory('Site', function($http, Setup){
	
		var site = {};
		site.data = [];
		
		// retrieve site
		site.retrieve = function(callback){
		
			// set params
			var params = {};
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
				
			// post to API
			$http.post(Setup.api + '/site/retrieve/', $.param(params))
				.success(callback);
				
		}
		
		// validate friendlyId for a site
		site.validateFriendlyId = function(friendlyId, successCallback, failureCallback){
		
			// set params
			var params = {
				friendlyId: friendlyId
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/validate/id', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// validate email for a site
		site.validateEmail = function(email, successCallback, failureCallback){
		
			// set params
			var params = {
				email: email
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/validate/email', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// create a site
		site.create = function(friendlyId, name, email, password, passcode, timeZone, language, userLanguage, theme, 
			firstName, lastName,
			successCallback, failureCallback){
		
			// set params
			var params = {
				friendlyId: friendlyId, 
				name: name, 
				email: email, 
				password: password, 
				passcode: passcode,
				timeZone: timeZone, 
				language: language, 
				userLanguage: userLanguage, 
				theme: theme,
				firstName: firstName,
				lastName: lastName
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/create', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// publish a site
		site.publish = function(successCallback, failureCallback){
			
			// API call
			$http.get(Setup.api + '/site/publish')
				.success(successCallback)
				.error(failureCallback);
		}
		
		// deploys a site
		site.deploy = function(successCallback, failureCallback){
			
			// API call
			$http.get(Setup.api + '/site/deploy')
				.success(successCallback)
				.error(failureCallback);
		}
		
		// edits administrative
		site.editAdmin = function(site, successCallback, failureCallback){
				
			// set params
			var params = { 
				siteId: site.SiteId,
				domain: site.Domain,
				bucket: site.Bucket, 
				status: site.Status,
				userLimit: site.UserLimit,
				fileLimit: site.FileLimit
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/edit/admin', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// saves settings for the site
		site.save = function(site, successCallback, failureCallback){
		
			// set params
			var params = { 
				name: site.Name, 
				domain: site.Domain,
				primaryEmail: site.PrimaryEmail, 
				timeZone: site.TimeZone,
				language: site.Language,
				direction: site.Direction,
				currency: site.Currency,
				showCart: site.ShowCart,
				showSettings: site.ShowSettings,
				showLanguages: site.ShowLanguages,
				showLogin: site.ShowLogin,
				showSearch: site.ShowSearch,
				urlMode: site.UrlMode,
				weightUnit: site.WeightUnit,
				shippingCalculation: site.ShippingCalculation,
				shippingRate: site.ShippingRate,
				shippingTiers: site.ShippingTiers,
				taxRate: site.TaxRate,
				payPalId: site.PayPalId,
				payPalUseSandbox: site.PayPalUseSandbox,
				welcomeEmail: site.WelcomeEmail,
				receiptEmail: site.ReceiptEmail,
				isSMTP: site.IsSMTP,
				SMTPHost: site.SMTPHost,
				SMTPAuth: site.SMTPAuth,
				SMTPUsername: site.SMTPUsername,
				SMTPPassword: site.SMTPPassword,
				SMTPSecure: site.SMTPSecure,
				formPublicId: site.FormPublicId,
				formPrivateId: site.FormPrivateId,
				embeddedCodeHead: site.EmbeddedCodeHead,
				embeddedCodeBottom: site.EmbeddedCodeBottom
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/save', $.param(params))
				.success(successCallback)
				.error(failureCallback);
		}
		
		// adds images for the site
		site.addImage = function(type, image, callback){
			
			// set params
			var params = { 
				url: image.filename, 
				type: type
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/branding/image', $.param(params))
				.success(callback);
			
		}
		
		// adds images for the site
		site.updateIconBg = function(color, callback){
			
			// set params
			var params = { 
				color: color
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/branding/icon/background', $.param(params))
				.success(callback);
			
		}
		
		// subscribe with Stripe payment provider
		site.subscribeWithStripe = function(token, plan, domain, successCallback, failureCallback){
			
			// set params
			var params = { 
				token: token,
				plan: plan,
				domain: domain
			}
		
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/subscribe/stripe', $.param(params))
				.success(successCallback)
				.error(failureCallback);
			
		}
	
		// retrieve a list of sites
		site.list = function(callback){
		
			// get list from API, ref: http://bit.ly/1gkUW4E
			$http.get(Setup.api + '/site/list/all')
				.then(function(res){
				
					// set data for factory
					site.data = res.data;
					return site.data;
					
				})
				.then(callback);
		}
		
		// removes a site
		site.remove = function(toBeRemoved, successCallback, failureCallback){
			
			// set params
			var params = {
				siteId: toBeRemoved.SiteId};
				
			// set post to URL Encoded
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		
			// post to API
			$http.post(Setup.api + '/site/remove', $.param(params))
				.then(function(res){
					var i = site.getIndexById(toBeRemoved.SiteId);
					if(i !== -1)site.data.splice(i, 1);
					
					return;
				}, failureCallback)
				.then(successCallback);
			
			// invalidate cache
			site.invalidateCache();
		}
		
		// get the index by id
		site.getIndexById = function(id){
		
			var data = site.data;
			
			for(x=0; x<data.length; x++){
				
				if(data[x].SiteId == id){
					return x;
				}
				
			}
			
			return -1;
		}
		
		return site;
		
	})
	
})();