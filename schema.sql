CREATE TABLE IF NOT EXISTS `MenuItems` (
  `MenuItemId` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CssClass` varchar(50) NOT NULL,
  `Type` varchar(50) NOT NULL DEFAULT 'primary',
  `Url` varchar(512) DEFAULT NULL,
  `PageId` varchar(50) DEFAULT NULL,
  `Priority` int(11) DEFAULT NULL,
  `IsNested` int(11) DEFAULT '0',
  `SiteId` varchar(50) NOT NULL,
  `LastModifiedBy` varchar(50) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  PRIMARY KEY (`MenuItemId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `MenuTypes` (
  `MenuTypeId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `SiteId` varchar(50) NOT NULL,
  `LastModifiedBy` int(11) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  PRIMARY KEY (`MenuTypeId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Pages` (
  `PageId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text,
  `Keywords` text,
  `Tags` text,
  `Content` text,
  `Draft` text,
  `Callout` varchar(100) DEFAULT NULL,
  `BeginDate` DATETIME,
  `EndDate` DATETIME,
  `Location` VARCHAR(1024),
  `LatLong` POINT,
  `Layout` varchar(50) DEFAULT NULL,
  `Stylesheet` varchar(50) DEFAULT NULL,
  `IsActive` int(11) DEFAULT NULL,
  `Image` varchar(256) DEFAULT NULL,
  `IncludeOnly` INT NOT NULL DEFAULT '0',
  `PageTypeId` varchar(50) NOT NULL,
  `SiteId` varchar(50) NOT NULL,
  `LastModifiedBy` varchar(50) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`PageId`),
  KEY `OrgId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Versions` (
  `VersionId` varchar(50) NOT NULL,
  `PageId` varchar(50) NOT NULL,
  `UserId` varchar(50) NOT NULL,
  `Content` text,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`VersionId`),
  KEY `PageId` (`PageId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Products` (
  `ProductId` varchar(50) NOT NULL,
  `SKU` varchar(50) NOT NULL,
  `PageId` varchar(50) NOT NULL,
  `Name` varchar(512) NOT NULL,
  `Price` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Shipping` varchar(50) NOT NULL,
  `Weight` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Download` varchar(512),
  `Created` datetime NOT NULL,
  PRIMARY KEY (`ProductId`),
  KEY `PageId` (`PageId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `PageTypes` (
  `PageTypeId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Layout` varchar(50) DEFAULT NULL,
  `Stylesheet` varchar(50) DEFAULT NULL,
  `IsSecure` INT NOT NULL DEFAULT '0',
  `SiteId` varchar(50) NOT NULL,
  `LastModifiedBy` varchar(50) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  PRIMARY KEY (`PageTypeId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Sites` (
  `SiteId` varchar(50) NOT NULL,
  `FriendlyId` varchar(50) DEFAULT NULL,
  `Domain` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `LogoUrl` varchar(512) DEFAULT NULL,
  `AltLogoUrl` varchar(512) DEFAULT NULL,
  `PayPalLogoUrl` varchar(512) DEFAULT NULL,
  `IconUrl` varchar(512) DEFAULT NULL,
  `IconBg` varchar(10) DEFAULT '#FFFFFF',
  `Theme` varchar(50) DEFAULT NULL,
  `PrimaryEmail` varchar(255) DEFAULT NULL,
  `TimeZone` varchar(100) DEFAULT NULL,
  `Language` varchar(10) NOT NULL DEFAULT 'en',
  `Direction` varchar(10) NOT NULL DEFAULT 'ltr',
  `ShowCart` INT NOT NULL DEFAULT '0',
  `ShowSettings` INT NOT NULL DEFAULT '0',
  `ShowLanguages` INT NOT NULL DEFAULT '0',
  `ShowLogin` INT NOT NULL DEFAULT '0',
  `ShowSearch` INT NOT NULL DEFAULT '1',
  `Currency` varchar(10) NOT NULL DEFAULT 'USD',
  `WeightUnit` varchar(10) NOT NULL DEFAULT 'kgs',
  `ShippingCalculation` VARCHAR(10) NOT NULL DEFAULT  'free',
  `ShippingRate` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `ShippingTiers` TEXT,
  `TaxRate` DECIMAL(5, 5) NOT NULL DEFAULT '0',
  `PayPalId` VARCHAR(255) DEFAULT '',
  `PayPalUseSandbox` INT NOT NULL DEFAULT '0',
  `WelcomeEmail` TEXT DEFAULT '',
  `ReceiptEmail` TEXT DEFAULT '',
  `IsSMTP` INT NOT NULL DEFAULT '0',
  `SMTPHost` varchar(512) DEFAULT '',
  `SMTPAuth` INT NOT NULL DEFAULT '0',
  `SMTPUsername` varchar(255) DEFAULT '',
  `SMTPPassword` varchar(255) DEFAULT '',
  `SMTPPasswordIV` varchar(255) DEFAULT '',
  `SMTPSecure` varchar(255) DEFAULT 'tls',
  `FormPrivateId` VARCHAR(240) DEFAULT '',
  `FormPublicId` VARCHAR(240) DEFAULT '',
  `EmbeddedCodeHead` TEXT DEFAULT '',
  `EmbeddedCodeBottom` TEXT DEFAULT '',
  `Status` varchar(10) DEFAULT 'Trial',
  `Plan` varchar(50) DEFAULT 'Trial',
  `Provider` varchar(50) DEFAULT '',
  `SubscriptionId` varchar(256) DEFAULT '',
  `CustomerId` varchar(256) DEFAULT '',
  `CanDeploy` INT NOT NULL DEFAULT '0',
  `UserLimit` INT NOT NULL DEFAULT '1',
  `FileLimit` INT NOT NULL DEFAULT '100',
  `LastLogin` datetime DEFAULT NULL,
  `Version` varchar(10) DEFAULT '4.8',
  `Created` datetime NOT NULL,
  PRIMARY KEY (`SiteId`),
  UNIQUE KEY `Domain` (`Domain`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Users` (
  `UserID` varchar(50) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `PhotoUrl` VARCHAR(512),
  `Role` varchar(16) NOT NULL,
  `Language` varchar(10) NOT NULL DEFAULT 'en',
  `SiteId` varchar(50) NOT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `IsActive` int(11) NOT NULL DEFAULT '1',
  `SiteAdmin` int(11) NOT NULL DEFAULT '0',
  `Created` datetime NOT NULL,
  PRIMARY KEY (`UserID`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Transactions` (
  `TransactionId` varchar(50) NOT NULL,
  `SiteId` varchar(50) NOT NULL,
  `Processor` varchar(50) DEFAULT NULL,
  `ProcessorTransactionId` varchar(256) DEFAULT NULL,
  `ProcessorStatus` varchar(50) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `PayerId` varchar(256) DEFAULT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `Shipping` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Fee` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Tax` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Total` DECIMAL(15,2) NOT NULL DEFAULT  '0.00',
  `Currency` varchar(10) DEFAULT 'USD',
  `Items` text,
  `Data` text,
  `Receipt` text,
  `Created` datetime NOT NULL,
  PRIMARY KEY (`TransactionId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Roles` (
  `RoleId` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `SiteId` varchar(50) NOT NULL,
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
  
ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MenuItems`
  ADD CONSTRAINT `MenuItems_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Pages`
  ADD CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PageTypes`
  ADD CONSTRAINT `PageTypes_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
  
ALTER TABLE `Versions`
  ADD CONSTRAINT `Versions_ibfk_1` FOREIGN KEY (`PageId`) REFERENCES `Pages` (`PageId`) ON DELETE CASCADE ON UPDATE CASCADE; 
  
ALTER TABLE `Versions`
  ADD CONSTRAINT `Versions_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE; 
  
ALTER TABLE `Products`
  ADD CONSTRAINT `Products_ibfk_2` FOREIGN KEY (`PageId`) REFERENCES `Pages` (`PageId`) ON DELETE CASCADE ON UPDATE CASCADE;  
  
