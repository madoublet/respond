Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond 2.4 features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, and an enhanced data layer using PDO. In the latest release, we have cleaned up the UI, fixed bugs, improved blog support, and added support for paid site subsciptions via Stripe. Respond 2.4 is faster, more secure, and more beautiful than ever.

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

Our current version is 2.6.

See whats new in the January 2014 update: http://respondcms.com/update/january-2014

New in 2.6:
- Multi-lingual support for the app
- Multi-lingual support for sites created with Respond
- Contributor role
- Add site w/o user
- Re-factor the editor
- Bug fixes:
	- drag & drop after layout creation
	- delete page fix

How to update from 2.5:
- Backup sites you created
- Add Language to the Users table
	- ALTER TABLE  `Users` ADD  `Language` VARCHAR( 10 ) NOT NULL DEFAULT  'en' AFTER  `Role`;
- Add Language to the Sites table
	- ALTER TABLE  `Sites` ADD  `Language` VARCHAR( 10 ) NOT NULL DEFAULT  'en' AFTER  `TimeZone`;




