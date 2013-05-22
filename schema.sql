CREATE TABLE IF NOT EXISTS `MenuItems` (
  `MenuItemId` int(11) NOT NULL AUTO_INCREMENT,
  `MenuItemUniqId` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CssClass` varchar(50) NOT NULL,
  `Type` varchar(50) NOT NULL DEFAULT 'primary',
  `Url` varchar(512) DEFAULT NULL,
  `PageId` int(11) DEFAULT NULL,
  `Priority` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `Created` datetime NOT NULL,
  `LastModifiedBy` int(11) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  PRIMARY KEY (`MenuItemId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=697 ;

CREATE TABLE IF NOT EXISTS `MenuTypes` (
  `MenuTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `MenuTypeUniqId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `LastModifiedBy` int(11) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`MenuTypeId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;


CREATE TABLE IF NOT EXISTS `Pages` (
  `PageId` int(11) NOT NULL AUTO_INCREMENT,
  `PageUniqId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text,
  `Keywords` text,
  `Callout` varchar(100) DEFAULT NULL,
  `Rss` text,
  `Layout` varchar(50) DEFAULT NULL,
  `Stylesheet` varchar(50) DEFAULT NULL,
  `PageTypeId` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `LastModifiedBy` int(11) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  `IsActive` int(11) DEFAULT NULL,
  `ImageFileId` int(11) DEFAULT NULL,
  `Image` varchar(256) DEFAULT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`PageId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=457 ;


CREATE TABLE IF NOT EXISTS `PageTypes` (
  `PageTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `PageTypeUniqId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Profile` varchar(50) DEFAULT NULL,
  `TypeS` varchar(100) NOT NULL,
  `TypeP` varchar(100) NOT NULL,
  `SiteId` int(11) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `LastModifiedBy` int(11) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`PageTypeId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=94 ;


CREATE TABLE IF NOT EXISTS `Sites` (
  `SiteId` int(11) NOT NULL AUTO_INCREMENT,
  `SiteUniqId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Domain` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `LogoUrl` varchar(512) DEFAULT NULL,
  `Template` varchar(50) DEFAULT NULL,
  `AnalyticsId` varchar(50) DEFAULT NULL,
  `FacebookAppId` varchar(255) DEFAULT NULL,
  `PrimaryEmail` varchar(255) DEFAULT NULL,
  `TimeZone` varchar(10) DEFAULT NULL,
  `LastLogin` datetime DEFAULT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`SiteId`),
  UNIQUE KEY `Domain` (`Domain`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;


CREATE TABLE IF NOT EXISTS `Users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `UserUniqId` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Role` varchar(16) NOT NULL,
  `SiteId` int(11) NOT NULL,
  `Created` datetime NOT NULL,
  `Token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `Email_2` (`Email`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=114 ;


ALTER TABLE `Files`
  ADD CONSTRAINT `Files_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Files_ibfk_2` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MenuItems`
  ADD CONSTRAINT `MenuItems_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Pages`
  ADD CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PageTypes`
  ADD CONSTRAINT `PageTypes_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
