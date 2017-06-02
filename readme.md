# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.1.0

### Latest updates
- reCAPTCHA during site creation, see: https://respondcms.com/documentation/recaptcha-on-create
- reCAPTCHA for site forms, see: https://respondcms.com/documentation/recaptcha-on-forms
- Add fully configurable acknowledgement on login and creation
- Update to latest Angular release (4)
- To support more updates, support us at: https://www.patreon.com/respond

### Updating from 6.0.3

1. Add ACKNOWLEDGEMENT, RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY to your .env file.  See .env.example for format.

```
  # white label
  ...
  ACKNOWLEDGEMENT="Powered by <a href="\https://respondcms.com\">Respond 6</a>. Build fast, responsive sites with Respond CMS."

  # reCAPTCHA for /create
  RECAPTCHA_SITE_KEY=
  RECAPTCHA_SECRET_KEY=
  
```

### Design Goals
- Modern application stack: Angular 2 + Laravel
- Flat File CMS / static HTML site
- No database
- Easy installation, no configuration
- Easy to write plugins
- Sites as themes
- Intuitive editing experience
- Powerful developer features to promote efficiency

### Consumer features
- Fast, easy-to-use app
- Desktop focused, mobile ready
- Intuitive editing experience
- Quick access to common customizations (forms, galleries, etc.)
- LDAP authentication

### Developer features
- Easy to write plugins
- Sites as themes
- Snippets to promote code re-use
- Static sites lower deployment costs
- Easy backups and migrations due to flat-file structure
- Popular frameworks make it easier to build on the CMS
- Free, open source version
- Paid premium version includes installation and premium themes (and additional features to be announced)
- Monthly support options