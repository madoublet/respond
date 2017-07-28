# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.2.0

### Latest updates
- Add support for custom syntax in templates:
  {{page.title}}
  {{page.description}}
  {{page.keywords}}
  {{page.tags}}
  {{page.callout}}
  {{page.url}}
  {{page.fullUrl}}
  {{page.photoUrl}}
  {{page.fullPhotoUrl}}
  {{page.thumbUrl}}
  {{page.fullThumbUrl}}
  {{page.language}}
  {{page.direction}}
  {{page.customHeader}}
  {{page.customFooter}}


### Updating from 6.1.2

1. Update your theme templates and site templates to support the new 

```
  <html lang="{{page.language}}" dir="{{page.direction}}">
  
  ...
  
  <meta property="og:url" content="{{page.fullUrl}}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{{page.title}}" />
  <meta property="og:description" content="{{page.description}}" />
  <meta property="og:image" content="{{page.image}}" />
  
  ...
  
  {{page.customHeader}}

  
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