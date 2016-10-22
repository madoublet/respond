var plugins = [
  {
        action: "respond.featured",
        selector: "[respond-plugin][type=featured-post]",
        title: "Featured Blog Post",
        display: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="100%" viewBox="0 0 18 18" width="100%"><path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/><path d="M0 0h18v18H0z" fill="none"/></svg>',
        view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="100%" viewBox="0 0 18 18" width="100%"><path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/><path d="M0 0h18v18H0z" fill="none"/></svg><span>' + hashedit.i18n('Featured Blog Post') + '</span></div>',
        html: '<div respond-plugin type="featured-post"></div>'

  },
  {
        action: "respond.blog",
        selector: "[respond-plugin][type=recent-posts]",
        title: "Recent Blog Posts",
        display: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" width="100%"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" width="100%"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/><path d="M0 0h24v24H0z" fill="none"/></svg><span>' + hashedit.i18n('Recent Blog Posts') + '</span></div>',
        html: '<div respond-plugin type="recent-posts"></div>'

  },
  {
      action: "respond.form",
      selector: "[respond-plugin][type=form]",
      title: "Form",
      display: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>' + hashedit.i18n('Form') + '</span></div>',
      html: '<div respond-plugin type="form" form="contact-us"></div>',
      attributes: [
        {
          attr: 'form',
          label: 'Form',
          type: 'select',
          values: ['respond.forms']
        }
      ]
  },
  {
      action: "respond.gallery",
      selector: "[respond-plugin][type=gallery]",
      title: "Gallery",
      display: '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>',
      view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg><span>' + hashedit.i18n('Gallery') + '</span></div>',
      html: '<div respond-plugin type="gallery" gallery="sample-gallery"></div>',
      attributes: [
        {
          attr: 'gallery',
          label: 'Gallery',
          type: 'select',
          values: ['respond.galleries']
        }
      ]
  },
  {
      action: "respond.slideshow",
      selector: "[respond-plugin][type=slideshow]",
      title: "Slideshow",
      display: '<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg>',
      view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg><span>' + hashedit.i18n('Slideshow') + '</span></div>',
      html: '<div respond-plugin type="slideshow" gallery="sample-gallery"></div>',
      attributes: [
        {
          attr: 'gallery',
          label: 'Gallery',
          type: 'select',
          values: ['respond.galleries']
        }
      ]
  },
  {
      action: "respond.map",
      selector: "[respond-plugin][type=map]",
      title: "Map",
      display: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="100%" viewBox="0 0 24 24" width="100%"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
      view: '<div class="respond-plugin"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="100%" viewBox="0 0 24 24" width="100%"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/><path d="M0 0h24v24H0z" fill="none"/></svg><span>' + hashedit.i18n('Map') + '</span></div>',
      html: '<div respond-plugin type="map" address="700 Clark Ave, St. Louis, MO 63102" zoom="8"></respond-form>',
      attributes: [
        {
          attr: 'address',
          label: 'Address',
          type: 'text'
        },
        {
          attr: 'zoom',
          label: 'Zoom',
          type: 'select',
          values: ['20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
        }
      ]
  }
];

// add plugins
if(hashedit.menu !== null && hashedit.menu !== undefined) {
  hashedit.menu = hashedit.menu.concat(plugins);
}