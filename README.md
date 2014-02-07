Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. The February update (Respond 2.7) brings categories to pages created within Respond.  With categories, you can organize your pages within the CMS and create lists for a particular category within your sites.  The February update also brings a new feature called code snippets.  Snippets allow you to create re-usable PHP blocks for your templates.  And finally, Respond 2.7 adds support for nested menus.  This allows you to create a 2-level navigation structure for your site.

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

This is the development branch for version 2.8.

New in 2.8:
- Categories for pages
- Category support for list widget
- Code snippets for templates
- Nested menus
- E-commerce Cart with Paypal (beta)

How to update from 2.7:
- Add Dates and Spatial columns

```
ALTER TABLE  `Pages` ADD  `BeginDate` DATETIME AFTER `Callout`;
ALTER TABLE  `Pages` ADD  `EndDate` DATETIME AFTER `BeginDate`;
ALTER TABLE  `Pages` ADD  `Location` VARCHAR(1024) AFTER `EndDate`;
ALTER TABLE  `Pages` ADD  `LatLong` POINT AFTER `Location`;
```
	  
- Pull latest version




