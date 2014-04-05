Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

This is the dev branch for Respond 2.10 (May 2014)

New in 2.10:
- Paypal IPN support to track transactions
- Receipt email for successful payments
- Digital download support
- Drag-and-Drop new elements into the editor
- Improved site administration (delete site)

Bug fixes:
- TBD

Refactoring:
- TBD

How to update from 2.9:
- Backup your DB and sites
- Add Transactions table to track transactions

```
CREATE TABLE IF NOT EXISTS `Transactions` (
  `TransactionId` int(11) NOT NULL AUTO_INCREMENT,
  `TransactionUniqId` varchar(50) NOT NULL,
  `SiteId` int(11) DEFAULT NULL,
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
  `Created` datetime NOT NULL,
  PRIMARY KEY (`TransactionId`),
  KEY `SiteId` (`SiteId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`SiteId`) ON DELETE CASCADE ON UPDATE CASCADE;
```
- Add additional PayPal options to the Site
```
ALTER TABLE  `Sites` ADD `PayPalUseSandbox` INT NOT NULL DEFAULT '0' AFTER `PayPalId`;
ALTER TABLE  `Sites` ADD `PayPalLogoUrl` VARCHAR(512) NULL AFTER `PaypalUseSandbox`;
```

- Re-publish your sites




