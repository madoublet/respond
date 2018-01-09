# Respond CMS

Respond 6 is a multi-site, flat-file CMS powered by Angular Latest and Lumen.  Sites built using Respond are static, front-end framework agnostic and optimized for exceptional performance.

### Status
Version: 6.7.0

### Latest updates
- [Feature] Enable Amazon S3 Sync of site
- Bug fixes: #570, #568, #567, #565, #562


### How to Enable S3 Sync (optional)
1. Add the following to resources/sites/site-name/settings.json (ensure valid json)

```
  {
        "id": "s3-key",
        "label": "S3 Access Key",
        "description": "The access key provided by Amazon IAM",
        "type": "text",
        "value": "",
        "encrypted": true
    },
    {
        "id": "s3-secret",
        "label": "S3 Secret Key",
        "description": "The secret key provided by Amazon IAM",
        "type": "text",
        "value": "",
        "encrypted": true
    },
    {
        "id": "s3-bucket",
        "label": "S3 Bucket",
        "description": "The bucket created using the Amazon S3",
        "type": "text",
        "value": "",
        "encrypted": true
    },
    {
        "id": "s3-region",
        "label": "S3 Region",
        "description": "The region in which you created your bucket",
        "type": "text",
        "value": "",
        "encrypted": true
    }
```

### Updating from 6.6.0
- Follow normal update instructions at https://respondcms.com/documentation/updating-respond

### Design Goals
- Modern application stack: Angular Latest + Laravel
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
