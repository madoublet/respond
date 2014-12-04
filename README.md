Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond features a REST API, a lightning-fast Angular-powered UI, Bootstrap 3.0, multilingual support, and an enhanced data layer using PDO. 

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

The current version is Respond 4.

Database update for the update on 11/28/2014:

ALTER TABLE `Sites` ADD `Direction` varchar(10) NOT NULL DEFAULT 'ltr' AFTER `Language`;

Database update for the update on 12/3/2014:

ALTER TABLE `Pages` ADD `IncludeOnly` INT NOT NULL DEFAULT '0' AFTER `Image`;