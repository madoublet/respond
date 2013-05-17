CREATE TABLE IF NOT EXISTS Files (
  `FileId` int(11) NOT NULL AUTO_INCREMENT,
  `FileUniqId` varchar(50) NOT NULL,
  `UniqueName` varchar(50) NOT NULL,
  `FileName` varchar(255) NOT NULL,
  `Size` int(11) DEFAULT NULL,
  `Width` int(11) DEFAULT NULL,
  `Height` int(11) DEFAULT NULL,
  `IsPublic` int(11) DEFAULT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `ContentType` varchar(255) NOT NULL,
  `StorageType` varchar(255) NOT NULL,
  `IsImage` int(11) DEFAULT NULL,
  `IsResized` int(11) DEFAULT NULL,
  `UserId` int(11) NOT NULL,
  `SiteId` int(11) NOT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`FileId`),
  KEY `UserId` (`UserId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=513 ;


CREATE TABLE IF NOT EXISTS MenuItems (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=594 ;

CREATE TABLE IF NOT EXISTS MenuTypes (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

CREATE TABLE IF NOT EXISTS Pages (
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
  `Created` datetime NOT NULL,
  PRIMARY KEY (`PageId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=361 ;

CREATE TABLE IF NOT EXISTS PageTypes (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=69 ;

CREATE TABLE IF NOT EXISTS Sites (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

CREATE TABLE IF NOT EXISTS Users (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=94 ;

-- Constraints

ALTER TABLE Files
  ADD CONSTRAINT `Files_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Files_ibfk_2` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE MenuItems
  ADD CONSTRAINT `MenuItems_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Pages
  ADD CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE PageTypes
  ADD CONSTRAINT `PageTypes_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Users
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
