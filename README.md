Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

The current version is Respond 2.11

New in 2.11:
- UI tweaks
- Improved on-boarding experience
- Role based permissions

Bug fixes:
- TBD

Refactoring:
- TBD

How to update from 2.10:
- Pull latest version
- Re-publish your sites
- Create Roles

```
CREATE TABLE IF NOT EXISTS `Roles` (
  `RoleId` int(11) NOT NULL AUTO_INCREMENT,
  `RoleUniqId` varchar(50) NOT NULL,	
  `Name` varchar(50) NOT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `CanView` text,
  `CanEdit` text,
  `CanPublish` text,
  `CanRemove` text,
  `CanCreate` text,
  PRIMARY KEY (`RoleId`),
  KEY `SiteId` (`SiteId`)
  ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
  
ALTER TABLE `Roles`
  ADD CONSTRAINT `Roles_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
```