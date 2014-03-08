Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

The current version is 2.8. Read about the updates here: http://respondcms.com/update/march-2014

New in 2.8:
- Dates (begin/end) and Spatial (address/lat/long) metadata for pages
- Thumbnail, calendar and map display for lists
- Gallery display for Image Groups
- All generated content available in sites/common/modules/
- Photos for user's profile

Bug fixes:
- UTF-8 support for languages
- Better unique element names
- Language on site creation

Refactoring:
- js/respond.Editor.js
- sites/common/modules
- sites/common/js/pageModel.js
- sites/common/js/respond.Calendar.js
- sites/common/js/respond.Featured.js
- sites/common/js/respond.Form.js
- sites/common/js/respond.List.js
- sites/common/js/respond.Map.js

How to update from 2.7:
- Add Dates and Spatial columns

```
ALTER TABLE  `Pages` ADD  `BeginDate` DATETIME AFTER `Callout`;
ALTER TABLE  `Pages` ADD  `EndDate` DATETIME AFTER `BeginDate`;
ALTER TABLE  `Pages` ADD  `Location` VARCHAR(1024) AFTER `EndDate`;
ALTER TABLE  `Pages` ADD  `LatLong` POINT AFTER `Location`;
```

- Add Photo for profile photo
```
ALTER TABLE  `Users` ADD  `PhotoUrl` VARCHAR(512) AFTER `LastName`;
```
	  
- Pull latest version
- Re-publish sites




