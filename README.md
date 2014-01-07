Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond 2.4 features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, and an enhanced data layer using PDO. The first update of 2014 (Respond 2.6) brings support for multiple languages for both the CMS and sites you create using Respond. The update also brings a new "contributor" role that allows you to create a user that can edit content, but not publish or change the look-and-feel of site. This enables a new level of collaboration. Finally, the update brings support for creating sites from the admin (without adding new users), providing more flexibility to site administrators. As always, the update features a number of bug fixes as well.

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
	- ALTER TABLE  'Users' ADD  'Language' VARCHAR( 10 ) NOT NULL DEFAULT  'en' AFTER  'Role';
- Add Language to the Sites table
	- ALTER TABLE  'Sites' ADD  'Language' VARCHAR( 10 ) NOT NULL DEFAULT  'en' AFTER  'TimeZone';
- Pull latest version




