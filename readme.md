# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and use Polymer web components for advanced functionality.

### Status
Version: 6.0.0-beta.2
Status: Beta 2

### Latest updates
Beta 2 cleans up the Angular 2 implementation and bundles the source into a distributable to make the application load quickly.
- Update to Angular 2 RC4
- Improve the Gulp build process
- Package Hashedit dependencies
- Implement @angular/router (remove deprecated router)
- Fix Typescript errors and warnings
- Sitemaps

### Updating from Beta 1
1. Update to Gulp 4 - http://bit.ly/29KB3Dv
2. git pull
3. npm install
4. gulp

### Prerequisites
1. Install NPM - tutorial: https://docs.npmjs.com/
2. Install composer - tutorial: https://getcomposer.org/
3. Gulp 4.0 - tutorial: http://bit.ly/29KB3Dv

### Installation
1. mkdir respond
2. git clone https://github.com/madoublet/respond .
3. npm install
4. gulp
5. cp .env.example .env
6. nano .env
7. mkdir public/sites
8. chown -R www-data public/sites
9. mkdir resources/sites
10. chown -R www-data resources/sites
11. composer update

### Design Goals
- Modern application stack: Angular 2 + Laravel
- Static sites powered by Polymer
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

### Developer features
- Easy to write plugins
- Sites as themes
- Snippets to promote code re-use
- Static sites lower deployment costs
- Easy backups and migrations due to flat-file structure
- Popular frameworks make it easier to build on the CMS