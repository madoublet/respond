Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

This is the development version for the April 2014 release (Respond 2.9).

New in 2.9:
- Secure pagetypes (WIP)
- Editor tooltips
- SVG image support
- Theme /resources support
- Form options: message text, custom actions, placholder text, custom field classes
- Language switch

Bug fixes:
- Layout for small tablet responsive app

Refactoring:
- Language bugs
- Site API

How to update from 2.8:
- Add IsSecure flag to PageTypes

```
ALTER TABLE  `PageTypes` ADD `IsSecure` INT NOT NULL DEFAULT '0' AFTER `Stylesheet`;
```

- Add SearchIndex table for searching

```
CREATE TABLE IF NOT EXISTS `SearchIndex` (
  `PageUniqId` varchar(50) NOT NULL,
  `SiteUniqId` varchar(50) NOT NULL,
  `Language` varchar(10) DEFAULT NULL,
  `Url` varchar(255) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `Image` varchar(256) DEFAULT NULL,
  `IsSecure` INT NOT NULL DEFAULT '0',
  `h1s` text,
  `h2s` text,
  `h3s` text,
  `Description` text,
  `Content` text,
  FULLTEXT INDEX(Name, H1s, H2s, H3s, Description, Content)
  ) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
```
  
- Add IsActive to Users  
```
ALTER TABLE  `Users` ADD `IsActive` INT NOT NULL DEFAULT '1' AFTER `Token`;
```

- Pull latest version
- Re-publish sites




