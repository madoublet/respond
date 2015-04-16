Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Angular-powered UI, Bootstrap 3.0, Polymer-based plugins, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/learn

New in version 4.8:
- Support for Polymer 0.8
- Better mobile support for Language and Cart components
- ShowSearch toggle
- Site version tracking
- Alternative Logo URL (for smaller mobile logos)
- PayPal Logo URL (for smaller mobile logos)


Upgrading from 4.6:

- Pull latest version

- Add new fields to the Database

```
// update schema
ALTER TABLE `Sites` ADD `ShowSearch` INT NOT NULL DEFAULT '1' AFTER `ShowLogin`;
ALTER TABLE `Sites` ADD `Version` VARCHAR(10) NOT NULL DEFAULT '4.8' AFTER `LastLogin`;
ALTER TABLE `Sites` ADD `AltLogoUrl` varchar(512) DEFAULT NULL AFTER `LogoUrl`;
ALTER TABLE `Sites` ADD `PayPalLogoUrl` varchar(512) DEFAULT NULL AFTER `AltLogoUrl`;

// set version to last updated version
UPDATE Sites SET Version = '4.6'
```

- Upgrade site
