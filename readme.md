# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.1.2

### Latest updates
- Support for DEFAULT_LANGUAGE. This allows you to specify the language that will be shown on the login, forgot password, and create screens
- Bug fix: #525 https://github.com/madoublet/respond/issues/525
- Bug fix: #524 https://github.com/madoublet/respond/issues/524
- Bug fix: #523 https://github.com/madoublet/respond/issues/523 
- Bug fix: #522 https://github.com/madoublet/respond/issues/522
- Bug fix: #513 https://github.com/madoublet/respond/issues/513


### Updating from 6.0.3

1. Add DEFAULT_LANGUAGE to your .env file.  See .env.example for format.

```
  ...
  DEFAULT_LANGUAGE=en
  ...
  
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