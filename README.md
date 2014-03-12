Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

This is the development version for the April 2014 release (Respond 2.9).

New in 2.9:
- Secure pagetypes (WIP)
- Editor tooltips
- SVG image support
- Theme /resources support
- Form options: message text, custom actions, placholder text, custom field classes

Bug fixes:
- Layout for small tablet responsive app

Refactoring:
- TBD

How to update from 2.8:
- Add IsSecure flag to PageTypes

```
ALTER TABLE  `PageTypes` ADD `IsSecure` INT NOT NULL DEFAULT '0' AFTER `Stylesheet`;
```

- Pull latest version
- Re-publish sites




