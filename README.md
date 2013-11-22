Respond CMS
===========

Respond is an open source, responsive content management system that you can use to build responsive sites. Respond 2.4 features a REST API, a lightning-fast Knockout-based UI, Bootstrap 3.0, and an enhanced data layer using PDO. In the latest release, we have cleaned up the UI, fixed bugs, improved blog support, and added support for paid site subsciptions via Stripe. Respond 2.4 is faster, more secure, and more beautiful than ever.

Learn more about Respond CMS at: http://respondcms.com

View our documentation at: http://respondcms.com/page/documentation

Our current version is 2.4.

See whats new in the November 2013 update: http://respondcms.com/update/november-2013

New in 2.4:
- Paid Stripe subscriptions: bill customers via Stripe
- New slide out menu, other UI tweaks
- Timezone stored in PHP format
- Better blog support: added to default site
- Update File Upload (show progress, make icon clickable)
- Emails for creating accounts, payment successful, payment failed
- Bug fixes

How to Update from 2.3:
- Pull latest version, does require updates to Setup.php to merge your version with the new version
- In Sites table, change TimeZone to varchar(50), update field to your default timezone (e.g. America/Chicago).  See http://php.net/manual/en/timezones.php.

```    
    ALTER TABLE Sites MODIFY TimeZone varchar(50)
    UPDATE Sites SET TimeZone = 'America/Chicago'
```

- In Sites table, add column Type varchar(25) with a default of "Non-Subscription"

```
    ALTER TABLE Sites ADD COLUMN Type varchar(25) NOT NULL DEFAULT 'Non-Subscription' AFTER LastLogin
```

- In Sites table, add column CustomerId varchar(256) with a default of NULL

```	
    ALTER TABLE Sites ADD COLUMN CustomerId varchar(256) DEFAULT NULL AFTER Type
``` 
- In PageTypes table, add columns Layout varchar(50) and Stylesheet(50) with a default of NULL

```	
    ALTER TABLE PageTypes ADD COLUMN Layout varchar(50) DEFAULT 'content' AFTER TypeP;
    ALTER TABLE PageTypes ADD COLUMN Stylesheet varchar(50) DEFAULT 'content' AFTER Layout;
``` 




Next Version:
- Need a default layout, style for a page type

- Prevent Google from indexing sites in /sites/ folder
- Forward direct hits to /sites/ folder
x Remove need for CORS
- When a URL is entered into settings strip 'http://', 'www.', and trailing '/'
- Allow editing of HTML blocks
x Collapse HTML blocks, provide a name for a prettier L&F
- Fix spacing on code block
- Hitting enter should add row below
x {{author}} and {{date}}
