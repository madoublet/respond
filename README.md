Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. The February update (Respond 2.7) brings categories to pages created within Respond.  With categories, you can organize your pages within the CMS and create lists for a particular category within your sites.  The February update also brings a new feature called code snippets.  Snippets allow you to create re-usable PHP blocks for your templates.  And finally, Respond 2.7 adds support for nested menus.  This allows you to create a 2-level navigation structure for your site.

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

Our current version is 2.6.  You are viewing the development branch for 2.7.

New in 2.7:
- Categories for pages
- Category support for list widget
- Code snippets for templates
- Nested menus
- E-commerce Cart with Paypal (beta)

How to update from 2.6:
- Backup sites you created
- Add Categories table

```
CREATE TABLE IF NOT EXISTS `Categories` (
	`CategoryId` int(11) NOT NULL AUTO_INCREMENT,
	`CategoryUniqId` varchar(50) NOT NULL,
	`FriendlyId` varchar(50) DEFAULT NULL,
	`Name` varchar(255) NOT NULL,
	`PageTypeId` int(11) DEFAULT NULL,
	`CreatedBy` int(11) NOT NULL,
	`LastModifiedBy` int(11) NOT NULL,
	`LastModifiedDate` datetime NOT NULL,
	`Created` datetime NOT NULL,
	PRIMARY KEY (`CategoryId`)
	) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
```
		
- Add Category_Page_Rel table

```
CREATE TABLE IF NOT EXISTS `Category_Page_Rel` (
	`CategoryId` int(11) NOT NULL,
	`PageId` int(11) NOT NULL
	) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
```

- Add relationships between tables

```
ALTER TABLE `Category_Page_Rel`
	ADD CONSTRAINT `Category_Page_Rel_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`CategoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Category_Page_Rel`
	ADD CONSTRAINT `Category_Page_Rel_ibfk_2` FOREIGN KEY (`PageId`) REFERENCES `Pages` (`PageId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Categories`
	ADD CONSTRAINT `Categories_ibfk_1` FOREIGN KEY (`PageTypeId`) REFERENCES `PageTypes` (`PageTypeId`) ON DELETE CASCADE ON UPDATE CASCADE;
```

- Add IsNested to MenuItems

```
ALTER TABLE  `MenuItems` ADD  `IsNested` INT NOT NULL DEFAULT  '0' AFTER `Priority`
```
	  
- Add Currency, WeightUnit to Sites	  

```
ALTER TABLE  `Sites` ADD  `Currency` VARCHAR(10) NOT NULL DEFAULT  'USD' AFTER `Language`;
ALTER TABLE  `Sites` ADD  `WeightUnit` VARCHAR(10) NOT NULL DEFAULT  'kgs' AFTER `Currency`;
```
	  
- Pull latest version




