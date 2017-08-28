# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.4.1

### Latest updates
- [Bugfix] Update form submissions to work with SSL enabled sites
- [Bugfix] Change reCAPTCHA on /create to render explicit to make rendering more consistent

### Updating from 6.4.0
- Follow normal update instructions at https://respondcms.com/documentation/updating-respond
- To enable https support for forms, copy the updated plugin.js (https://github.com/madoublet/respond/blob/master/public/themes/bootstrap/js/plugins.js) code into your site by navigating to Code > JS > js/plugins.js from the left menu 
- NOTE: Copying it via the Respond UI will automatically generate the js/site.all.js file.

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