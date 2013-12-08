Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond 2.4 features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, and an enhanced data layer using PDO. In the latest release, we have cleaned up the UI, fixed bugs, improved blog support, and added support for paid site subsciptions via Stripe. Respond 2.4 is faster, more secure, and more beautiful than ever.

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

Our current version is 2.5.

See whats new in the December 2013 update: http://respondcms.com/update/december-2013

New in 2.5:
- Better theme support
	- Rename templates => themes
	- Allow files (images, js, etc) to be included with theme
	- Easier theme installation, just drop folder into themes directory
	- Custom default themes and start pages
- Touch upgrades for entire app, editor	
- .htaccess updates to improve security

How to update from 2.4:
- Backup custom templates you created 
- For each site:
	1. Rename sites/[site name]/templates to sites/[site name]/themes
	2. Rename sites/[site name]/themes/[theme name]/html to sites/[site name]/themes/[theme name]/layouts
	3. Rename sites/[site name]/themes/[theme name]/less to sites/[site name]/themes/[theme name]/styles
- For each custom template:
	1. Create a folder in themes, e.g. themes/[template name]
	2. Copy layouts/[template name]/html to themes/[template name]/layouts
	3. Copy layouts/[template name]/less to themes/[template name]/styles
	4. Copy the themes/simple/files to themes/[template name]/files
	5. Copy the themes/simple/pages to themes/[template name]/pages
- Rename template to theme in sites table
	ALTER TABLE Sites CHANGE Template Theme varchar(50);
- Republish site
	




