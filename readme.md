# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular 2 and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.0.2-MR2
Status: 6 Stable, Maintenance Release 2

### Latest updates
- New Installation Tests under /install/ to help troubleshoot installations
- Recurring billing powered by Stripe Checkout
- Webhooks (Thank you https://github.com/axis80)
- Suomi, Português translations (Thank you https://github.com/pskoike and https://github.com/joas8211)

### Updating from 6.0.1-MR1

Update your .env file with the following.

```
  # site status (Active or Trial)
  DEFAULT_STATUS=Active
  
  # trial length (if Trial set above)
  TRIAL_LENGTH=30
  
  # activation (Stripe or URL)
  ACTIVATION_METHOD=Stripe
  ACTIVATION_URL=https://example.com/pay?site={{site}}
  
  # stripe
  STRIPE_SECRET_KEY=TEMP
  STRIPE_PUBLISHABLE_KEY=TEMP
  STRIPE_PLAN=TEMP
  STRIPE_AMOUNT=2000
  STRIPE_NAME="Monthly Subscription"
  STRIPE_DESCRIPTION="$20 per month"
  
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