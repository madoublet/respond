Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Angular-powered UI, Bootstrap 3.0, Polymer-based plugins, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/learn

New in version 5.1:
- New editor UI
- Support for Embed Code in Header/Footer
- Remove subscriptions, Amazon S3 support

Upgrading from version 5.0
- Pull (or download) the latest version
- Update setup.php (or setup.local.php)
- Upgrade sites
- Update SQL
```
alter table Sites add Column EmbeddedCodeHead text NULL default '';
alter table Sites add Column EmbeddedCodeBottom text NULL default '';
```

License Information: http://respondcms.com/page/license