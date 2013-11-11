// models a site
function Site(siteId, siteUniqId, friendlyId, domain, name, logoUrl, template, analyticsId, facebookAppId, primaryEmail, timeZone, lastLogin, type, customerId, created){

    var self = this;

    self.siteId = ko.observable(siteId);
    self.siteUniqId = ko.observable(siteUniqId);
	self.friendlyId = ko.observable(friendlyId);
    self.domain = ko.observable(domain);
    self.name = ko.observable(name);
    self.logoUrl = ko.observable(logoUrl);
    self.template = ko.observable(template);
    self.analyticsId = ko.observable(analyticsId);
    self.facebookAppId = ko.observable(facebookAppId);
    self.primaryEmail = ko.observable(primaryEmail);
    self.timeZone = ko.observable(timeZone);
    self.lastLogin = ko.observable(lastLogin);
    self.type = ko.observable(type);
    self.customerId = ko.observable(customerId);
    self.created = ko.observable(created);
}

// creates a site based on data returned from the API
Site.create = function(data){

	return new Site(data['SiteId'], data['SiteUniqId'], data['FriendlyId'], data['Domain'], data['Name'], data['LogoUrl'], data['Template'],
                    data['AnalyticsId'], data['FacebookAppId'], data['PrimaryEmail'], data['TimeZone'], data['LastLogin'], data['Type'], data['CustomerId'], data['Created']);
}

// models a user
function User(userId, userUniqId, email, password, firstName, lastName, role, created, token){

    var self = this;

    self.userId = ko.observable(userId);
    self.userUniqId = ko.observable(userUniqId);
    self.email = ko.observable(email);
    self.password = ko.observable(password);
    self.firstName = ko.observable(firstName);
    self.lastName = ko.observable(lastName);
    self.role = ko.observable(role);
    self.created = ko.observable(created);
    self.token = ko.observable(token);
    
    self.fullName = ko.computed(function(){
    	return self.firstName() + ' ' + self.lastName();
	});
    
    self.friendlyDate = ko.computed(function(){
    	var st = moment.utc(self.created(), 'YYYY-MM-DD HH:mm:ss');
		return st.fromNow(); 
	});

}

// creates a user based on data returned from the API
User.create = function(data){

	return new User(data['UserId'], data['UserUniqId'], data['Email'], data['Password'], data['FirstName'], data['LastName'], data['Role'],
                    data['Created'], data['Token']);
}


// models a page
function Page(pageId, pageUniqId, pageTypeId, friendlyId, name, description, keywords, callout, 
				rss, layout, stylesheet, url, image, thumb, lastModifiedDate, lastModifiedFullName, isActive){

	var self = this;

	self.pageId = ko.observable(pageId);
	self.pageUniqId = ko.observable(pageUniqId);
	self.pageTypeId = ko.observable(pageTypeId);
	self.friendlyId = ko.observable(friendlyId);
	self.name = ko.observable(name);
	self.description = ko.observable(description);
	self.keywords = ko.observable(keywords);
	self.callout = ko.observable(callout);
	self.rss = ko.observable(rss);
	self.layout = ko.observable(layout);
	self.stylesheet = ko.observable(stylesheet);
	self.url = ko.observable(url);
	self.image = ko.observable(image);
	self.thumb = ko.observable(thumb);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.lastModifiedFullName = ko.observable(lastModifiedFullName);
	self.isActive = ko.observable(isActive);

	self.friendlyDate = ko.computed(function(){
		var st = moment.utc(self.lastModifiedDate(), 'YYYY-MM-DD HH:mm:ss');
		return st.fromNow(); 
	});

	self.rssArr = ko.computed(function(){
		if(self.rss()){
			return self.rss().split(',');
		}
		else{
			return [];
		};
	});

	self.editUrl = ko.computed(function(){
		return 'content?p=' + self.pageUniqId();
	});

}

// creates a page based on data returned from the API
Page.create = function(data){

	return new Page(data['PageId'], data['PageUniqId'], data['PageTypeId'], data['FriendlyId'], data['Name'], data['Description'], 
					data['Keywords'], data['Callout'], data['Rss'], data['Layout'], data['Stylesheet'], 
					data['Url'], data['Image'], data['Thumb'], data['LastModifiedDate'], data['LastModifiedFullName'], 
					data['IsActive']);
}

// models a pagetype
function PageType(pageTypeId, pageTypeUniqId, friendlyId, typeS, typeP, createdBy, lastModifiedBy, lastModifiedDate, created){

	var self = this;

	self.pageTypeId = ko.observable(pageTypeId);
	self.pageTypeUniqId = ko.observable(pageTypeUniqId);
	self.friendlyId = ko.observable(friendlyId);
	self.typeS = ko.observable(typeS);
	self.typeP = ko.observable(typeP);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

	self.dir = ko.computed(function(){
		return '/' + self.typeS().toLowerCase();
	});

}

// creates a pagetype based on data returned from the API
PageType.create = function(data){

	return new PageType(data['PageTypeId'], data['PageTypeUniqId'], data['FriendlyId'],
						data['TypeS'], data['TypeP'], data['CreatedBy'], data['LastModifiedBy'],
						data['LastModifiedDate'], data['Created']);
}

// models a menutype
function MenuType(menuTypeId, menuTypeUniqId, friendlyId, name, createdBy, lastModifiedBy, lastModifiedDate, created){

	var self = this;

	self.menuTypeId = ko.observable(menuTypeId);
	self.menuTypeUniqId = ko.observable(menuTypeUniqId);
	self.friendlyId = ko.observable(friendlyId);
	self.name = ko.observable(name);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

}

// creates a menutype based on data returned from the API
MenuType.create = function(data){

	return new MenuType(data['MenuTypeId'], data['MenuTypeUniqId'], data['FriendlyId'],
						data['Name'], data['CreatedBy'], data['LastModifiedBy'],
						data['LastModifiedDate'], data['Created']);
}

// models a menuitem
function MenuItem(menuItemId, menuItemUniqId, name, cssClass, type, url, pageId, priority, createdBy, lastModifiedBy, lastModifiedDate, created){

    var self = this;

	self.menuItemId = ko.observable(menuItemId);
	self.menuItemUniqId = ko.observable(menuItemUniqId);
	self.name = ko.observable(name);
    self.cssClass = ko.observable(cssClass);
    self.type = ko.observable(type);
    self.url = ko.observable(url);
    self.pageId = ko.observable(pageId);
    self.priority = ko.observable(priority);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

}

// creates a menuitem based on data returned from the API
MenuItem.create = function(data){

	return new MenuItem(data['MenuItemId'], data['MenuItemUniqId'], data['Name'], data['CssClass'],
						data['Type'], data['Url'], data['PageId'], data['Priority'], 
                        data['CreatedBy'], data['LastModifiedBy'],	data['LastModifiedDate'], data['Created']);
}

// models a template
function Template(id, name, desc){

    var self = this;

    self.id = ko.observable(id);
	self.name = ko.observable(name);
	self.desc = ko.observable(desc);

}

// creates a template based on data returned from the API
Template.create = function(data){

	return new Template(data['id'], data['name'], data['desc']);
}