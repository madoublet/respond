Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Angular-powered UI, Bootstrap 3.0, Polymer-based plugins, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/learn

New in version 4.5:
- Improved site rendering powered by Polymer-based web components
- Server side rendering for Menu (respond-menu) and Content (respond-content) components
- Improved look-and-feel for search, language selection, and the cart
- Miscellaneous bug fixes
- Editable footers in themes

Upgrading from 4.0+:
- Pull latest version
- Update dependencies using Composer (php composer.phar update)
- Reset themes
- Re-publish sites
- Update Transaction table (bugfix)

ALTER TABLE  `Transactions` ADD `Receipt` TEXT AFTER `Data`;

Migrating custom themes to 4.5:
- A guide is available here: http://respondcms.com/documentation/migrating-to-respond-4-5 
- The themes in the build have been updated to support Respond 4.5.  Use these as a reference for upgrading your own themes.