/**
 * Respond Edit is a simple, web-based editor for static HTML sites. Learn more at respondcms.com Download from Github at github.com/madoublet/editor
 * @author: Matthew Smith
 */
var editor = editor || {};

editor = (function() {

  'use strict';

  return {

    // url to page
    url: null,
    previewUrl: null,

    // page title
    title: '',

    // API urls
    saveUrl: '/api/pages/save',
    addPageURL: '/api/pages/add',
    pageSettingsURL: '/api/pages/settings',
    uploadUrl: '/api/images/add',
    imagesListUrl: '/api/images/list',
    pagesListUrl: '/api/pages/list',
    authUrl: '/api/auth',
    loginUrl: '/login',
    pathListUrl: '/api/pages/path/list',

    // loading indicators
    imagesListLoaded: false,
    pagesListLoaded: false,
    pathListLoaded: false,

    // set debug messages
    debug: false,

    // set demo mode
    demo: false,

    // init menu
    menu: [],

    // path to editor library
    path: '/node_modules/editor/',

    // path to stylesheet
    stylesheet: ['editor-min.css'],

    // pointers to selected elements
    current: {
      container: null,
      node: null,
      parent: null,
      element: null,
      image: null
    },

    // new grid elements
    grid: [
      {
        "name": "1 Column",
        "desc": "100%",
        "html": "<div class=\"block row\" editor-block><div class=\"col col-md-12\" editor-sortable></div></div>"
      },
      {
        "name": "2 Column",
        "desc": "100%",
        "html": "<div class=\"block row\" editor-block><div class=\"col col-md-6\" editor-sortable></div><div class=\"col col-md-6\" editor-sortable></div></div>"
      }
    ],

    // handles text selection
    selection: null,

    framework: 'bootstrap',

    // framework defaults
    frameworkDefaults: {
      'bootstrap': {
        'table': 'table',
        'image': 'img-responsive',
        'code': ''
      },
      'foundation': {
        'table': '',
        'image': '',
        'code': ''
      },
      'mdl': {
        'table': 'mdl-data-table',
        'image': '',
        'code': ''
      }
    },

    // counts and flags
    isI18nInit: false,

    /**
     * Set as active
     */
    setActive: function() {

      // set [editor-active] on body
      document.querySelector('body').setAttribute('editor-active', '');

    },

    /**
     * Setup content editable element
     */
    setContentEditable: function() {

      var x, els;

      // setup [contentEditable=true]
      els = document.querySelectorAll(
        'p[editor-element], [editor] h1[editor-element], [editor] h2[editor-element], h3[editor-element], h4[editor-element], h5[editor-element], span[editor-element], ul[editor-element] li, ol[editor-element] li, table[editor-element] td, table[editor-element] th, blockquote[editor-element], pre[editor-element]'
      );

      for (x = 0; x < els.length; x += 1) {

        // add attribute
        els[x].setAttribute('contentEditable', 'true');

      }

    },

    /**
     * Sets up empty
     * @param {Array} sortable
     */
    setupEmpty: function() {

      var x, sortable, els;

      els = document.querySelectorAll('[editor-sortable]');

      // walk through sortable clases
      for (x = 0; x < els.length; x += 1) {

        if(els[x].firstElementChild === null){
          els[x].setAttribute('editor-empty', 'true');
        }
        else {
          els[x].removeAttribute('editor-empty');
        }

      }

    },

    /**
     * Sets up block
     * @param {Array} sortable
     */
    setupBlocks: function() {

      var x, els, y, div, blocks, el, next, previous, span;

      blocks = editor.config.blocks;

      // setup sortable classes
      els = document.querySelectorAll('[editor] ' + blocks);


      // set [data-editor-sortable=true]
      for (y = 0; y < els.length; y += 1) {

        // setup blocks
        if(els[y].querySelector('.editor-block-menu') === null) {

          els[y].setAttribute('editor-block', '');

          // create element menu
          div = document.createElement('DIV');
          div.setAttribute('class', 'editor-block-menu');
          div.setAttribute('contentEditable', 'false');
          div.innerHTML = '<label><i class="material-icons">more_vert</i> ' + editor.i18n('Layout Menu') + '</label>';

          // create up
          span = document.createElement('span');
          span.setAttribute('class', 'editor-block-up');
          span.innerHTML = '<i class="material-icons">arrow_upward</i> ' + editor.i18n('Move Up');

          // append the handle to the wrapper
          div.appendChild(span);

          // create down
          span = document.createElement('span');
          span.setAttribute('class', 'editor-block-down');
          span.innerHTML = '<i class="material-icons">arrow_downward</i> ' + editor.i18n('Move Down');

          // append the handle to the wrapper
          div.appendChild(span);

          /*
          // create duplicate
          span = document.createElement('span');
          span.setAttribute('class', 'editor-block-duplicate');
          span.innerHTML = '<i class="material-icons">content_copy</i> ' + editor.i18n('Duplicate');

          // append the handle to the wrapper
          div.appendChild(span); */

          // create properties
          span = document.createElement('span');
          span.setAttribute('class', 'editor-block-properties');
          span.innerHTML = '<i class="material-icons">settings</i> ' + editor.i18n('Settings');

          // append the handle to the wrapper
          div.appendChild(span);

          // create remove
          span = document.createElement('span');
          span.setAttribute('class', 'editor-block-remove');
          span.innerHTML = '<i class="material-icons">cancel</i> ' + editor.i18n('Remove');

          // append the handle to the wrapper
          div.appendChild(span);

          els[y].appendChild(div);

        }

      }

    },

    /**
     * Adds an element menu to a given element
     * @param {DOMElement} el
     */
    setupElementMenu: function(el) {

      var menu, span;

      // set element
      el.setAttribute('editor-element', '');

      // create element menu
      menu = document.createElement('span');
      menu.setAttribute('class', 'editor-element-menu');
      menu.setAttribute('contentEditable', 'false');
      menu.innerHTML = '<label><i class="material-icons">more_vert</i> ' + editor.i18n('Content Menu') + '</label>';

      // create a handle
      span = document.createElement('span');
      span.setAttribute('class', 'editor-move');
      span.innerHTML = '<i class="material-icons">apps</i> ' + editor.i18n('Move');

      // append the handle to the wrapper
      menu.appendChild(span);

      span = document.createElement('span');
      span.setAttribute('class', 'editor-properties');
      span.innerHTML = '<i class="material-icons">settings</i> ' + editor.i18n('Settings');

      // append the handle to the wrapper
      menu.appendChild(span);

      span = document.createElement('span');
      span.setAttribute('class', 'editor-remove');
      span.innerHTML = '<i class="material-icons">cancel</i> ' + editor.i18n('Remove');

      // append the handle to the wrapper
      menu.appendChild(span);

      // append the handle to the wrapper
      el.appendChild(menu);

    },

    /**
     * Adds a editor-sortable class to any selector in the sortable array, enables sorting
     * @param {Array} sortable
     */
    setupSortable: function() {

      var x, y, els, div, span, el, item, obj, menu, sortable, a;

      sortable = editor.config.sortable;

      // walk through sortable clases
      for (x = 0; x < sortable.length; x += 1) {

        // setup sortable classes
        els = document.querySelectorAll('[editor] ' + sortable[x]);

        // set [data-editor-sortable=true]
        for (y = 0; y < els.length; y += 1) {

          // add attribute
          els[y].setAttribute('editor-sortable', '');

        }

      }

      // wrap elements in the sortable class
      els = document.querySelectorAll('[editor-sortable] > *');

      // wrap editable items
      for (y = 0; y < els.length; y += 1) {

        editor.setupElementMenu(els[y]);

      }

      // get all sortable elements
      els = document.querySelectorAll('[editor] [editor-sortable]');

      // walk through elements
      for (x = 0; x < els.length; x += 1) {

        el = els[x];

        obj = new Sortable(el, {
          group: "editor-sortable", // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
          sort: true, // sorting inside list
          delay: 0, // time in milliseconds to define when the sorting should start
          disabled: false, // Disables the sortable if set to true.
          store: null, // @see Store
          animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
          handle: ".editor-move", // Drag handle selector within list items
          ghostClass: "editor-highlight", // Class name for the drop placeholder

          scroll: true, // or HTMLElement
          scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
          scrollSpeed: 10, // px

          // dragging ended
          onEnd: function(evt) {

            // get item
            item = evt.item;

            // handle empty
            editor.setupEmpty();

          }

        });

      }

      // set the display of empty columns
      editor.setupEmpty();

    },

    /**
     * Create the menu
     */
    setupMenu: function() {

      var menu, data, xhr, url, help, els, x, title = '', arr;

      // create menu
      menu = document.createElement('menu');
      menu.setAttribute('class', 'editor-menu');
      menu.innerHTML =
        '<div class="editor-menu-body"></div>';

      // append menu
      editor.current.container.appendChild(menu);

      // focused
      if(document.querySelector('.editor-focused') != null) {

        var el = document.querySelector('.editor-focused');

        if(document.querySelector('[focused-content]') == null) {
          el.style.display = 'none';
        }

        el.addEventListener('click', function(e) {

          var url = window.location.href.replace('mode=page', 'mode=focused');

          var iframe = window.parent.document.getElementsByTagName('iframe')[0];

          iframe.setAttribute('src', url);

          console.log(iframe);

          });

      }

    },

    /**
     * Shows the menu
     */
    showMenu: function() {

      var menu = document.querySelector('.editor-menu');

      if(menu.hasAttribute('active') == true) {
        menu.removeAttribute('active');
      }
      else {
        menu.setAttribute('active', true);
      }

    },

    /**
     * Updates the UI with the attributes
     * obj = { properties: {id, cssClass, html, alt, title, src}, attributes: { custom1, custom2, custom3 } }
     */
    update: function(obj) {

      let el = editor.current.node;

      if(obj.type == null || obj.type == 'undefined') {
        obj.type = 'element';
      }

      // set el to the current link
      if(obj.type == 'link') {
        el = editor.currLink;
      }

      if(obj.type == 'add-block') {

        editor.appendBlock(obj.properties.html);
        return;

      }

      if(obj.properties != null && obj.properties != undefined) {
        Object.keys(obj.properties).forEach(function(key,index) {

            if(key == 'id') {
              el.id = obj.properties.id || '';
            }
            else if(key == 'cssClass') {
              el.className = obj.properties.cssClass || '';
            }
            else if(key == 'html') {
              el.innerHTML = obj.properties.html || '';
            }
            else if(key == 'alt') {
              el.alt = obj.properties.alt || '';
            }
            else if(key == 'title') {
              el.title = obj.properties.title || '';
            }
            else if(key == 'src') {
              el.src = obj.properties.src || '';
            }
            else if(key == 'target') {
              el.setAttribute('target', (obj.properties.target || ''));
            }
            else if(key == 'href') {
              el.href = obj.properties.href || '';
            }

            });
      }

      if(obj.attributes != null && obj.attributes != undefined) {
        Object.keys(obj.attributes).forEach(function(key,index) {

            el.setAttribute(obj.attributes[index].attr, obj.attributes[index].value);

            });
      }

      if(obj.type == 'element') {
        editor.setupElementMenu(el);
      }

    },

    /**
      * Saves the content
      */
    save: function() {

      var data, xhr;

      data = editor.retrieveUpdateArray();

      if (editor.saveUrl) {

        // construct an HTTP request
        xhr = new XMLHttpRequest();
        xhr.open('post', editor.saveUrl, true);

        // set token
        if(editor.useToken == true) {
          xhr.setRequestHeader(editor.authHeader, editor.authHeaderPrefix + ' ' + localStorage.getItem(editor.tokenName));
        }

        // send the collected data as JSON
        xhr.send(JSON.stringify(data));

        xhr.onloadend = function() {

          location.reload();

        };

      }

    },

    /**
     * Setup draggable events on menu items
     */
    setupDraggable: function() {

      var x, el, selector, sortable, item, action, html;

      // setup sortable on the menu
      el = document.querySelector('.editor-menu-body');

      sortable = new Sortable(el, {
        group: {
          name: 'editor-sortable',
          pull: 'clone',
          put: false
        },
        draggable: 'a',
        sort: false, // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        disabled: false, // Disables the sortable if set to true.
        animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
        ghostClass: "editor-highlight", // Class name for the drop placeholder

        scroll: true, // or HTMLElement
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px

        onStart: function(evt) {

          document.querySelector('.editor-menu').removeAttribute('active');

        },

        // dragging ended
        onEnd: function(evt) {

          // get item
          item = evt.item;

          if (editor.debug === true) {
            console.log(item);
          }

          // get action
          selector = item.getAttribute('data-selector');

          // append html associated with action
          for (x = 0; x < editor.menu.length; x += 1) {
            if (editor.menu[x].selector == selector) {
              html = editor.menu[x].html;
              html = editor.replaceAll(html, '{{path}}', editor.path);
              html = editor.replaceAll(html, '{{framework.image}}', editor.frameworkDefaults[editor.framework].image);
              html = editor.replaceAll(html, '{{framework.table}}', editor.frameworkDefaults[editor.framework].table);
              html = editor.replaceAll(html, '{{framework.code}}', editor.frameworkDefaults[editor.framework].code);

              var node = editor.append(html);

              // add
              if(editor.menu[x].view != undefined) {
                node.innerHTML += editor.menu[x].view;
              }

              editor.setupElementMenu(node);

            }
          }

          // setup empty columns
          editor.setupEmpty();

          return false;

        }
      });
    },

    /**
     * Setup the text menu
     */
    setupTextMenu: function() {

      // setup menu
      var x, wrapper, menu = '<div id="editor-text-settings" class="editor-config editor-element-config"><div class="editor-context-body"><a data-action="editor.text.bold"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path></g></svg></a><a data-action="editor.text.italic"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path></g></svg></a><a data-action="editor.text.strike"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"></path></g></svg></a><a data-action="editor.text.underline"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path></g></svg></a><a data-action="editor.text.link"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g></svg></a><a data-action="editor.text.image"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: block;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></g></svg></a><a data-action="editor.text.code"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"></path></g></svg></a><a data-action="editor.text.alignLeft"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"></path></g></svg></a><a data-action="editor.text.alignCenter"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"></path></g></svg></a><a data-action="editor.text.alignRight"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"></path></g></svg></a></div></div>';

      wrapper = document.createElement('div');
      wrapper.innerHTML = menu;

      for (x = 0; x < wrapper.childNodes.length; x += 1) {
        editor.current.container.appendChild(wrapper.childNodes[x]);
        console.log('append count');
      }

      // init menu
      for (x = 0; x < editor.menu.length; x += 1) {

        // initialize
        if (editor.menu[x].init) {
          editor.menu[x].init();
        }

      }

      // setup events
      editor.setupTextEvents();

    },

    /**
     * Create menu
     */
    createMenu: function() {

      var x, item, a, div;

      // setup menu
      var menu = [
        {
          separator: editor.i18n('Text')
        },
        {
          selector: "H1",
          title: "H1 Headline",
          display: "H1",
          html: '<h1>' + editor.i18n('Tap to update') + '</h1>'
        }, {
          selector: "h2",
          title: "H2 Headline",
          display: "H2",
          html: '<h2>' + editor.i18n('Tap to update') + '</h2>'
        }, {
          selector: "h3",
          title: "H3 Headline",
          display: "H3",
          html: '<h3>' + editor.i18n('Tap to update') + '</h3>'
        }, {
          selector: "h4",
          title: "H4 Headline",
          display: "H4",
          html: '<h4>' + editor.i18n('Tap to update') + '</h4>'
        }, {
          selector: "h5",
          title: "H5 Headline",
          display: "H5",
          html: '<h5>' + editor.i18n('Tap to update') + '</h5>'
        }, {
          selector: "p",
          title: "Paragraph",
          display: "P",
          html: '<p>' + editor.i18n('Tap to update') + '</p>'
        }, {
          selector: "blockquote",
          title: "Blockquote",
          display: "<i class=\"material-icons\">format_quote</i>",
          html: '<blockquote>' + editor.i18n('Tap to update') + '</blockquote>'
        },{
          selector: "pre",
          title: "Code",
          display: "<i class=\"material-icons\">code</i>",
          html: "<pre>Start adding code</pre>"
        },
        {
          separator: editor.i18n('Lists')
        },
        {
          selector: "ul",
          title: "Unordered List",
          display: "<i class=\"material-icons\">format_list_bulleted</i>",
          html: '<ul><li>' + editor.i18n('Tap to update') + '</li></ul>'
        }, {
          selector: "ol",
          title: "Ordered List",
          display: "<i class=\"material-icons\">format_list_numbered</i>",
          html: "<ol><li></li></ol>"
        },
        {
          separator: editor.i18n('Design')
        },
        {
          selector: "hr",
          title: "Break",
          display: "<i class=\"material-icons\">remove</i>",
          html: "<hr>"
        },{
          selector: "img",
          title: "Image",
          display: "<i class=\"material-icons\">insert_photo</i>",
          html: '<p><img src="{{path}}images/placeholder.png" class="{{framework.image}}"></p>'
        }, {
          selector: "table[rows]",
          title: "Table",
          display: "<i class=\"material-icons\">grid_on</i>",
          html: '<table class="{{framework.table}}" rows="1" columns="2"><thead><tr><th>Header</th><th>Header</th></tr></thead><tbody><tr><td>Content</td><td>Content</td></tr></tbody></table>',
          attributes: [
            {
              attr: 'rows',
              label: 'Rows',
              type: 'select',
              values: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
            }  ,
            {
              attr: 'columns',
              label: 'Columns',
              type: 'select',
              values: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
            }
          ],
          change: function(attr, newValue, oldValue) {

            var x, y, rows, curr_rows, columns, curr_columns, toBeAdded,
              toBeRemoved, table, trs, th, tr, td, tbody;

            if (newValue != oldValue) {

              if (attr == 'columns') {

                columns = newValue;
                curr_columns = oldValue;

                if (columns > curr_columns) { // add columns

                  toBeAdded = columns - curr_columns;

                  table = editor.current.node;
                  trs = editor.current.node.getElementsByTagName('tr');

                  // walk through table
                  for (x = 0; x < trs.length; x += 1) {

                    // add columns
                    for (y = 0; y < toBeAdded; y += 1) {
                      if (trs[x].parentNode.nodeName == 'THEAD') {

                        th = document.createElement('th');
                        th.setAttribute('contentEditable', 'true');
                        th.innerHTML = 'New Header';

                        trs[x].appendChild(th);
                      } else {
                        td = document.createElement('td');
                        td.setAttribute('contentEditable', 'true');
                        td.innerHTML = 'Content';

                        trs[x].appendChild(td);
                      }
                    }
                  }

                } else if (columns < curr_columns) { // remove columns

                  toBeRemoved = curr_columns - columns;

                  table = editor.current.node;
                  trs = editor.current.node.getElementsByTagName('tr');

                  // walk through table
                  for (x = 0; x < trs.length; x += 1) {

                    // remove columns
                    for (y = 0; y < toBeRemoved; y += 1) {
                      if (trs[x].parentNode.nodeName == 'THEAD') {
                        trs[x].querySelector('th:last-child').remove();
                      } else {
                        trs[x].querySelector('td:last-child').remove();
                      }
                    }
                  }

                }

              } else if (attr == 'rows') {

                rows = newValue;
                curr_rows = oldValue;
                table = editor.current.node;
                columns = table.querySelectorAll('thead tr:first-child th').length;

                if (rows > curr_rows) { // add rows

                  toBeAdded = rows - curr_rows;

                  // add rows
                  for (y = 0; y < toBeAdded; y += 1) {
                    tr = document.createElement('tr');

                    for (x = 0; x < columns; x += 1) {
                      td = document.createElement('td');
                      td.setAttribute('contentEditable', 'true');
                      td.innerHTML = 'Content';
                      tr.appendChild(td);
                    }

                    tbody = table.getElementsByTagName('tbody')[0];
                    tbody.appendChild(tr);
                  }

                } else if (rows < curr_rows) { // remove columns

                  toBeRemoved = curr_rows - rows;

                  // remove rows
                  for (y = 0; y < toBeRemoved; y += 1) {
                    tr = table.querySelector('tbody tr:last-child');

                    if (tr !== null) {
                      tr.remove();
                    }
                  }

                }

              }

            }

          }
        },{
          selector: "[respond-html]",
          title: "HTML",
          display: "HTML",
          html: '<div respond-html>' + editor.i18n('Tap settings to edit HTML') + '</div>'
        },
        {
          separator: editor.i18n('Plugins')
        }];

      editor.menu = menu.concat(editor.menu);

      // walk through plugins
      for (x = 0; x < editor.menu.length; x += 1) {

        item = editor.menu[x];

        if(item.separator != undefined) {

          div = document.createElement('div');
          div.innerHTML = '<div class="separator"><h4>' + menu[x].separator + '</h4></div>';

          // append the child to the menu
          document.querySelector('.editor-menu-body').appendChild(div);

        }
        else {
          // create a menu item
          a = document.createElement('a');
          a.setAttribute('title', item.title);
          a.setAttribute('data-selector', item.selector);
          a.innerHTML = '<span class="icon">' + item.display + '</span><span class="title">' + item.title + '</span>';

          // append the child to the menu
          document.querySelector('.editor-menu-body').appendChild(a);
        }

      }

      // make the menu draggable
      editor.setupDraggable();

    },

    /**
     * Setup view
     */
    setupView: function() {

      var x, y, item, els;

      // walk through plugins
      for (x = 0; x < editor.menu.length; x += 1) {

        if(editor.menu[x].view !== undefined) {

          els = document.querySelectorAll(editor.menu[x].selector);

          for(y=0; y<els.length; y++) {
            els[y].innerHTML = editor.menu[x].view;
          }
        }

      }

    },

    /**
     * Shows the text options
     */
    showTextOptions: function(element) {

      var x, link, image, text, fields;

      // set current element and node
      editor.current.element = element;
      editor.current.node = element;

      // if the current element is not a [editor-element], find the parent that matches
      if(editor.current.element.hasAttribute('editor-element') === false) {
        editor.current.element = editor.findParentBySelector(element, '[editor-element]');
      }

      // get #editor-config
      text = document.querySelector('#editor-text-settings');
      text.setAttribute('visible', '');

    },

    /**
     * Setup contentEditable events for the editor
     */
    setupContentEditableEvents: function() {

      var x, y, z, arr, edits, isEditable, configs, isConfig, el, html,li, parent, els, isDefault, removeElement, element, modal, body, attr, div, label, control, option, menuItem, els, text, block;


      // clean pasted text, #ref: http://bit.ly/1Tr8IR3
      document.addEventListener('paste', function(e) {

        if(e.target.nodeName == 'TEXTAREA') {
          // do nothing
        }
        else {
          // cancel paste
          e.preventDefault();

          // get text representation of clipboard
          var text = e.clipboardData.getData("text/plain");

          // insert text manually
          document.execCommand("insertHTML", false, text);
        }

      });


      // get contentEditable elements
      arr = document.querySelectorAll('body');

      for (x = 0; x < arr.length; x += 1) {

        // delegate CLICK, FOCUS event
        ['click', 'focus'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            if (e.target.hasAttribute('editor-element')) {
              element = e.target;

              // get value of text node
              var text = editor.getTextNodeValue(element);

              // if text is set to "Tap to update" select all the text
              if(text === editor.i18n('Tap to update')) {
                document.execCommand('selectAll', false, null);
              }

            }
            else {
              element = editor.findParentBySelector(e.target, '[editor-element]');
            }

            // remove all current elements
            els = document.querySelectorAll('[current-editor-element]');

            for (y = 0; y < els.length; y += 1) {
              els[y].removeAttribute('current-editor-element');
            }

            // set current element
            if (element) {
              element.setAttribute('current-editor-element', 'true');
            }

            // check for remove element
            if (e.target.matches('.editor-remove')  || editor.findParentBySelector(e.target, '.editor-remove') !== null) {
              element.remove();
            }
            // check for properties element
            else if (e.target.matches('.editor-properties')  ||  editor.findParentBySelector(e.target, '.editor-properties') !== null) {

              let selector = null, attributes = [], title = "Element";

              // set current node
              editor.current.node = element;

              // see if the element matches a plugin selector
              for (x = 0; x < editor.menu.length; x += 1) {
                if (element.matches(editor.menu[x].selector)) {
                  title = editor.menu[x].title;
                  selector = editor.menu[x].selector;

                  // get null or not defined
                  if(editor.menu[x].attributes != null && editor.menu[x].attributes != undefined) {
                    attributes = editor.menu[x].attributes;
                  }

                }
              }

              // get current values for each attribute
              for (x = 0; x < attributes.length; x++) {
                attributes[x].value = element.getAttribute(attributes[x].attr) || '';
              }

              // get the html of the element
              let html = element.innerHTML;
              var i = html.indexOf('<span class="editor-element-menu"');
              html = html.substring(0, i);

              window.parent.postMessage({
                type: 'element',
                selector: selector,
                title: title,
                properties: {
                  id: element.id,
                  cssClass: element.className,
                  html: html
                },
                attributes: attributes
              }, '*');

              return;

            }
            // properites block
            else if (e.target.matches('.editor-block-properties') || editor.findParentBySelector(e.target, '.editor-block-properties') !== null) {

              block = editor.findParentBySelector(e.target, '[editor-block]');

              if(block !== null) {

                // set current node to block
                editor.current.node = block;

                // post message to app
                window.parent.postMessage({
                  type: 'block',
                  selector: '.block',
                  title: 'Block',
                  properties: {
                    id: block.id,
                    cssClass: block.className
                  },
                  attributes: []
                }, '*');

              }

            }
            // move block up
            else if (e.target.matches('.editor-block-up') ||  editor.findParentBySelector(e.target, '.editor-block-up') !== null) {

              block = editor.findParentBySelector(e.target, '[editor-block]');

              if(block.previousElementSibling != null) {

                if(block.previousElementSibling.hasAttribute('editor-block') === true) {
                  block.parentNode.insertBefore(block, block.previousElementSibling);
                }

              }

              editor.setupBlocks();

            }
            // move block down
            else if (e.target.matches('.editor-block-down') ||  editor.findParentBySelector(e.target, '.editor-block-down') !== null) {

              block = editor.findParentBySelector(e.target, '[editor-block]');

              if(block.nextElementSibling != null) {

                if(block.nextElementSibling.hasAttribute('editor-block') === true) {
                  block.nextElementSibling.parentNode.insertBefore(block.nextElementSibling, block);
                }

              }

              editor.setupBlocks();

            }
            // remove block
            else if (e.target.matches('.editor-block-remove') ||  editor.findParentBySelector(e.target, '.editor-block-remove') !== null) {

              block = editor.findParentBySelector(e.target, '[editor-block]');
              block.remove();

              editor.setupBlocks();

            }
            // remove block
            else if (editor.findParentBySelector(e.target, '.editor-block-duplicate') !== null) {

              block = editor.findParentBySelector(e.target, '[editor-block]');

              editor.duplicateBlock(block, 'before');

              editor.setupBlocks();

            }
            // handle links
            else if (e.target.nodeName == 'A') {

                // hide .editor-config
                edits = document.querySelectorAll('[editor]');

                // determines whether the element is a configuration
                isEditable = false;

                for (x = 0; x < edits.length; x += 1) {

                  if (edits[x].contains(e.target) === true) {
                    isEditable = true;
                  }

                }

                if (isEditable) {
                  editor.showLinkDialog();
                }
            }
            else if (e.target.nodeName == 'IMG') {
                editor.current.node = e.target;
                editor.current.image = e.target;
                element = e.target;

                window.parent.postMessage({
                  type: 'image',
                  selector: 'img',
                  title: 'Image',
                  properties: {
                    id: element.id,
                    cssClass: element.className,
                    src: element.getAttribute('src'),
                    alt: element.getAttribute('alt'),
                    title: element.getAttribute('title')
                  },
                  attributes: []
                }, '*');

            }
            else if (e.target.hasAttribute('contentEditable')) {

              // shows the text options
              editor.showTextOptions(e.target);

            }
            else if (e.target.parentNode.hasAttribute('contentEditable') && e.target.parentNode) {

              // shows the text options
              editor.showTextOptions(e.target);

            }
            else if (e.target.className == 'dz-hidden-input') {
              // do nothing
            }
            else {
              // hide .editor-config
              configs = document.querySelectorAll(
                '.editor-config, .editor-menu'
              );

              // determines whether the element is a configuration
              isConfig = false;

              for (x = 0; x < configs.length; x += 1) {

                if (configs[x].contains(e.target) === true) {
                  isConfig = true;
                }

              }

              // hide if not in config
              if (isConfig === false) {

                for (x = 0; x < configs.length; x += 1) {
                  configs[x].removeAttribute('visible');
                }

              }
            }

          });

        });


        // delegate INPUT event
        ['input'].forEach(function(e) {
          arr[x].addEventListener(e, function(e) {

            if (e.target.hasAttribute('contentEditable')) {

              el = e.target;

              while (el !== null) {

                var node = el.childNodes[0];

                if (editor.debug === true) {
                  console.log('input event');
                  console.log(el.nodeName);
                }

                // get value of text node
                var text = editor.getTextNodeValue(el);

                // if text is blank and the element has only one child node, add "Tap to update" to prevent the editor from breaking
                if(text === '' && el.childNodes.length == 1) {
                  text = document.createTextNode(editor.i18n('Tap to update'));
                  el.insertBefore(text, el.firstChild);
                  document.execCommand('selectAll', false, null);
                }

                html = el.innerHTML;

                // strip out &nbsps
                html = editor.replaceAll(html, '&nbsp;', ' ');

                // trim
                html = html.trim();

                // set to null
                el = null;
              }

            }


          });

        });

        // delegate INPUT event
        ['keydown'].forEach(function(e) {
          arr[x].addEventListener(e, function(e) {

            if (e.target.hasAttribute('contentEditable')) {

              el = e.target;

              // ENTER key
              if (e.keyCode === 13) {

                if (el.nodeName == 'LI') {

                  // create LI
                  li = document.createElement('li');
                  li.setAttribute('contentEditable', true);

                  // append LI
                  el.parentNode.appendChild(li);

                  el.parentNode.lastChild.focus();

                  e.preventDefault();
                  e.stopPropagation();

                }
                else if (el.nodeName == 'P') {

                  var node = editor.append('<p>' + editor.i18n('Tap to update') + '</p>');

                  editor.current.node = node;

                  editor.setupElementMenu(node);

                  e.preventDefault();
                  e.stopPropagation();

                }

              }

              // DELETE key
              if (e.keyCode === 8) {

                if (el.nodeName == 'LI') {

                  if (el.innerHTML === '') {

                    if (el.previousSibling !== null) {

                      parent = el.parentNode;

                      el.remove();

                      parent.lastChild.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                  }

                } // end LI

              }

            }


          });

        });

      }

    },

    /**
     * Returns the value of the text node
     */
    getTextNodeValue: function(el) {

      var text = '';

      for (var i = 0; i < el.childNodes.length; i++) {
          var curNode = el.childNodes[i];
          var whitespace = /^\s*$/;

          if(curNode === undefined) {
            text = "";
            break;
          }

          if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
              text = curNode.nodeValue;
              break;
          }
      }

      return text;

    },

    /**
     * Selects element contents
     */
    selectElementContents: function(el) {
      var range, sel;

      range = document.createRange();
      range.selectNodeContents(el);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },

    /**
     * Appends items to the editor
     */
    append: function(html) {

      var x, newNode, node, firstChild;

      // create a new node
      newNode = document.createElement('div');
      newNode.innerHTML = html;

      // get new new node
      newNode = newNode.childNodes[0];
      newNode.setAttribute('editor-element', '');

      // get existing node
      node = document.querySelector('[editor-sortable] [data-selector]');

      if (node === null) {

        if (editor.current.node !== null) {

          // insert after current node
          editor.current.node.parentNode.insertBefore(newNode, editor.current.node.nextSibling);

        }

      }
      else {
        // replace existing node with newNode
        node.parentNode.replaceChild(newNode, node);
      }

      var types = 'p, h1, h2, h3, h4, h5, li, td, th, blockquote, pre';

      // set editable children
      var editable = newNode.querySelectorAll(types);

      for (x = 0; x < editable.length; x += 1) {
        editable[x].setAttribute('contentEditable', 'true');
      }

      if (types.indexOf(newNode.nodeName.toLowerCase()) != -1) {
        newNode.setAttribute('contentEditable', 'true');
      }

      // select element
      function selectElementContents(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // focus on first element
      if (editable.length > 0) {

        editable[0].focus();
        selectElementContents(editable[0]);

        // show edit options for the text
        editor.showTextOptions(editable[0]);

        // select editable contents, #ref: http://bit.ly/1jxd8er
        editor.selectElementContents(editable[0]);
      }
      else {

        if(newNode.matches(types)) {

          newNode.focus();
          editor.selectElementContents(newNode);

        }

      }

      return newNode;

    },

    /**
     * Duplicates a block and appends it to the editor
     */
    duplicateBlock: function(current, position) {

      var x, newNode, node, firstChild;

      // create a new node
      newNode = current.cloneNode(true);

      // create new node in mirror
      if (position == 'before') {

        // insert element
        current.parentNode.insertBefore(newNode, current);

      }

      // re-init sortable
      editor.setupSortable();

      return newNode;

    },

    /**
     * Appends blocks to the editor
     */
    appendBlock: function(html) {

      var el = document.querySelector('[editor]'), x, newNode, node, firstChild;

      // create a new node
      newNode = document.createElement('div');
      newNode.innerHTML = html;

      // get new new node
      newNode = newNode.childNodes[0];

      el.insertBefore(newNode, el.childNodes[0]);

      // re-init sortable
      editor.setupSortable();

      // setup blocks
      editor.setupBlocks();

      return newNode;

    },


    /**
     * Setup text events (e.g. bold, italic, etc)
     */
    setupTextEvents: function() {

      var x, arr, el, action, text, html, input, value;

      arr = document.querySelectorAll('.editor-config');

      for (x = 0; x < arr.length; x += 1) {

        // delegate on .editor-config
        ['mousedown', 'touchstart'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            el = e.target;

            if (el.nodeName !== 'A') {
              el = editor.findParentBySelector(el, '[data-action]');
            }

            // look for [data-model]
            if (el.hasAttribute('data-action')) {

              action = el.getAttribute('data-action');

              if (action == 'editor.text.bold') {
                document.execCommand("Bold", false, null);
                return false;
              } else if (action == 'editor.text.italic') {
                document.execCommand("Italic", false, null);
                return false;
              } else if (action == 'editor.text.strike') {
                document.execCommand("strikeThrough", false, null);
                return false;
              } else if (action == 'editor.text.subscript') {
                document.execCommand("subscript", false, null);
                return false;
              } else if (action == 'editor.text.superscript') {
                document.execCommand("superscript", false, null);
                return false;
              } else if (action == 'editor.text.underline') {
                document.execCommand("underline", false, null);
                return false;
              }
              else if (action == 'editor.text.link') {

                // add link html
                text = editor.getSelectedText();
                html = '<a>' + text + '</a>';

                document.execCommand("insertHTML", false, html);

                // shows/manages the link dialog
                editor.showLinkDialog();

                return false;
              }
              else if (action == 'editor.text.image') {

                // add link html
                text = editor.getSelectedText();
                html = '<img src="{{path}}images/placeholder-inline.png" class="pull-left">';
                html = editor.replaceAll(html, '{{path}}', editor.path);

                document.execCommand("insertHTML", false, html);


                return false;
              }
              else if (action == 'editor.text.code') {

                // create code html
                text = editor.getSelectedText();
                html = '<code>' + text + '</code>';

                document.execCommand("insertHTML", false, html);
                return false;
              }
              else if (action == 'editor.text.alignLeft') {
                input = document.querySelector('.editor-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = editor.replaceAll(value,'text-center', '');
                value = editor.replaceAll(value,'text-left', '');
                value = editor.replaceAll(value,'text-right', '');
                value += ' text-left';

                console.log(value);

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              }
              else if (action == 'editor.text.alignRight') {
                input = document.querySelector('.editor-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = editor.replaceAll(value, 'text-center', '');
                value = editor.replaceAll(value, 'text-left', '');
                value = editor.replaceAll(value, 'text-right', '');
                value += ' text-right';

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              }
              else if (action == 'editor.text.alignCenter') {
                input = document.querySelector(
                  '.editor-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = editor.replaceAll(value,
                  'text-center', '');
                value = editor.replaceAll(value,
                  'text-left', '');
                value = editor.replaceAll(value,
                  'text-right', '');
                value += ' text-center';

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              } else if (action == 'editor.text.undo') {
                document.execCommand("undo", false, null);
                return false;
              }


            }

          }, false);

        });

      }

    },

    /**
     * Sets up the link dialog
     */
    showLinkDialog: function() {

      var id, cssClass, href, target, title, link, element;

      // get selected link
      editor.currLink = editor.getLinkFromSelection();

      // populate link values
      if (editor.currLink !== null) {

        element = editor.currLink;

        // pass message to parent window
        window.parent.postMessage({
          type: 'link',
          selector: 'a',
          title: 'Link',
          properties: {
            id: element.id || '',
            cssClass: element.className,
            href: element.getAttribute('href'),
            target: element.getAttribute('target'),
            title: element.getAttribute('title')
          },
          attributes: []
        }, '*');

      }

    },

    /**
     * Executes a function by its name and applies arguments
     * @param {String} functionName
     * @param {String} context
     */
    executeFunctionByName: function(functionName, context /*, args */ ) {

      var i, args, namespaces, func;

      args = [].slice.call(arguments).splice(2);
      namespaces = functionName.split(".");

      func = namespaces.pop();
      for (i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }

      return context[func].apply(this, args);
    },

    /**
     * Retrieves selected text
     */
    getSelectedText: function() {

      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type !=
        "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    },

    /**
     * Saves text selection
     */
    saveSelection: function() {

      var ranges, i, sel, len;

      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          ranges = [];
          len = sel.rangeCount;
          for (i = 0; i < len; i += 1) {
            ranges.push(sel.getRangeAt(i));
          }
          return ranges;
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
      }
      return null;
    },

    /**
     * Retrieve a link from the selection
     */
    getLinkFromSelection: function() {

      var parent, selection, range, div, links;

      parent = null;

      if (document.selection) {
        parent = document.selection.createRange().parentElement();
      } else {
        selection = window.getSelection();
        if (selection.rangeCount > 0) {
          parent = selection.getRangeAt(0).startContainer.parentNode;
        }
      }

      if (parent !== null) {
        if (parent.tagName == 'A') {
          return parent;
        }
      }

      if (window.getSelection) {
        selection = window.getSelection();

        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
          div = document.createElement('DIV');
          div.appendChild(range.cloneContents());
          links = div.getElementsByTagName("A");

          if (links.length > 0) {
            return links[0];
          } else {
            return null;
          }

        }
      }

      return null;
    },

    /**
     * Restore the selection
     * @param {?} savedSelection
     */
    restoreSelection: function(savedSel) {
      var i, len, sel;

      if (savedSel) {
        if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          len = savedSel.length;
          for (i = 0; i < len; i += 1) {
            sel.addRange(savedSel[i]);
          }
        } else if (document.selection && savedSel.select) {
          savedSel.select();
        }
      }
    },

    /**
     * Executes a function by its name and applies arguments
     * @param {HTMLElement} node
     */
    createTextStyle: function(node) {

      var style, textColor, textSize, textShadowColor, textShadowHorizontal, textShadowVertical, textShadowBlur;

      // get current node
      style = '';

      // build a style attribute for (text-color, text-size, text-shadow-color, text-shadow-vertical, text-shadow-horizontal, text-shadow-blur)
      textColor = node.getAttribute('text-color') || '';
      textSize = node.getAttribute('text-size') || '';
      textShadowColor = node.getAttribute('text-shadow-color') || '';
      textShadowHorizontal = node.getAttribute('text-shadow-horizontal') || '';
      textShadowVertical = node.getAttribute('text-shadow-horizontal') || '';
      textShadowBlur = node.getAttribute('text-shadow-blur') || '';

      if (textColor !== '') {
        style += 'color:' + textColor + ';';
      }

      if (textSize !== '') {
        style += 'font-size:' + textSize + ';';
      }

      if (textShadowColor !== '') {
        style += 'text-shadow: ' + textShadowHorizontal + ' ' +
          textShadowVertical + ' ' + textShadowBlur + ' ' +
          textShadowColor + ';';
      }

      return style;

    },

    /**
     * Retrieves a QS by name
     * @param {String} name
     */
    getQueryStringByName: function(name) {

      var regexS, regex, results;

      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      regexS = "[\\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(window.location.href);

      if (results === null) {
        return '';
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
    },

    /**
     * Retrieve changes
     */
    retrieveUpdateArray: function() {

      var x, y, data, els, el, refs, actions;

      els = document.querySelectorAll('[editor]');
      data = [];

      for (x = 0; x < els.length; x += 1) {

        // remove action
        actions = els[x].querySelectorAll('.editor-edit');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.editor-move');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.editor-properties');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.editor-remove');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove block menus
        actions = els[x].querySelectorAll('.editor-block-menu');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove block menus
        actions = els[x].querySelectorAll('.editor-element-menu');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove attributes
        actions = els[x].querySelectorAll('[editor-block]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('editor-block');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[editor-element]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('editor-element');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[editor-sortable]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('editor-sortable');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[editor-empty]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('editor-empty');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[contenteditable]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('contenteditable');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[current-editor-element]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('current-editor-element');
        }


        el = {
          'selector': els[x].getAttribute('editor-selector'),
          'html': els[x].innerHTML
        };

        if(editor.debug === true) {
          console.log('update array');
          console.log(el);
        }

        data.push(el);
      }

      return {
        url: editor.url,
        changes: data
      };

    },

    /**
     * Setup the editor
     * @param {Array} incoming
     */
    setup: function(incoming) {

      var body, attr, path, stylesheet, sortable, demo, url, login, blocks, grid;

      // get body
      body = document.querySelector('body');

      // production
      login = '/login';
      path = '/node_modules/editor/';
      stylesheet = ['/node_modules/editor/dist/editor-min.css'];
      sortable = ['.sortable'];
      demo = false;
      url = null;
      blocks = [];

      // get attributes
      if(body != null) {

        // setup development
        if(incoming.dev) {
          path = '/dev/editor/';
          stylesheet = ['/dev/editor/css/editor.css'];
        }

        if(incoming.path) {
          path = incoming.path;
        }

        if(incoming.stylesheet) {
          stylesheet = incoming.stylesheet;
        }

        // setup demo
        if(body.hasAttribute('editor-demo') == true) {
          demo = true;
        }

        // setup framework
        if(incoming.framework) {
          editor.framework = incoming.framework;
        }

        // setup sortable
        if(incoming.sortable) {

          if(incoming.sortable != '') {
            sortable = incoming.sortable.split(',');
          }

        }

        // setup blocks
        if(incoming.blocks) {

          if(incoming.blocks != '') {
            blocks = incoming.blocks.split(',');
          }

        }

        // setup grid
        if(incoming.grid) {

          if(incoming.grid != '') {
            grid = incoming.grid;
          }

        }

        // setup editable
        if(incoming.editable) {

          if(incoming.editable != '') {
            editable = incoming.editable.split(',');
          }

        }

        // set url
        if(incoming.url) {
          url = incoming.url;
        }

        // set previewUrl
        if(incoming.previewUrl) {
          editor.previewUrl = incoming.previewUrl;
        }
        else {
          editor.previewUrl = url;
        }

        // set title
        if(incoming.title) {
          editor.title = incoming.title;
        }

        // set login
        if(incoming.login) {
          login = incoming.login;
        }

        // handle alternative auth types (e.g. token based auth)
        if(incoming.auth) {

          // setup token auth
          if(incoming.auth === 'token') {

            // defaults
            editor.useToken = true;
            editor.authHeader = 'Authorization';
            editor.authHeaderPrefix = 'Bearer';
            editor.tokenName = 'id_token';

            // override defaults
            if(incoming.authHeader) {
              editor.authHeader = incoming.authHeader;
            }

            if(incoming.authHeaderPrefix) {
              editor.authHeaderPrefix = incoming.authHeaderPrefix;
            }

            if(incoming.tokenName) {
              editor.tokenName = incoming.tokenName;
            }

          }

        }

        // handle language
        if(incoming.translate) {

          editor.canTranslate = true;
          editor.language = 'en';
          editor.languagePath = '/i18n/{{language}}.json';

          if(incoming.languagePath) {
            editor.languagePath = incoming.languagePath;
          }

          // get language
          if(localStorage['user_language'] != null){
    				editor.language = localStorage['user_language'];
    			}
    		}

    		if(incoming.saveUrl) {
      		editor.saveUrl = incoming.saveUrl;
    		}

      }

      // setup config
      var config = {
        path: path,
        login: login,
        stylesheet: stylesheet,
        sortable: sortable,
        blocks: blocks,
        grid: grid,
        demo: demo
      };

      // set url
      if (url != null) {
        config.url = url;
      }

      // setup editor
      editor.setupEditor(config);

    },

    /**
     * Setup the editor
     * @param {Array} config.sortable
     */
    setupEditor: function(config) {

      var x, style;

      // save config
      editor.config = config;

      // set path
      if (config.path != null) {
        editor.path = config.path;
      }

      // set login
      if (config.login != null) {
        editor.loginUrl = config.login;
      }

      // set grid
      if (config.grid != null) {
        editor.grid = config.grid;
      }

      // create container
      editor.current.container = document.createElement('div');
      editor.current.container.setAttribute('class', 'editor-container');
      editor.current.container.setAttribute('id', 'editor-container');

      // set stylesheet
      if (config.stylesheet !== null) {
        editor.stylesheet = config.stylesheet;
      }

      // set url
      if (config.url !== null) {
        editor.url = config.url;
      }

      // append container to body
      document.body.appendChild(editor.current.container);

      // create style
      style = document.createElement('style');

      // append scoped stylesheet to container
      for (x = 0; x < editor.stylesheet.length; x++) {
        style.innerHTML += '@import url(' + editor.stylesheet[x] + ');';
      }

      editor.current.container.appendChild(style);

      // check auth
      if (config.demo === true) {

        editor.demo = true;

        // init editor
        editor.setActive();
        editor.setupView();
        editor.setupSortable();
        editor.setupBlocks();
        editor.setContentEditable();
        editor.setupContentEditableEvents();
        editor.setupMenu(config.path);
        editor.setupToast();
        editor.createMenu(config.path);
        editor.setupTextMenu();
        editor.translate();

      }
      else {

        // set default auth
        var obj = {
          credentials: 'include'
        }

        // enable token based auth
        if(editor.useToken) {

          // set obj headers
          obj = {
            headers: {}
          };

          obj.headers[editor.authHeader] = editor.authHeaderPrefix + ' ' + localStorage.getItem(editor.tokenName);
        }

        // check auth
        fetch(editor.authUrl, obj)
          .then(function(response) {

            if (response.status !== 200) {
              editor.showAuth();
            }
            else {

              // init editor
              editor.setActive();
              editor.setupView();
              editor.setupSortable();
              editor.setupBlocks();
              editor.setContentEditable();
              editor.setupContentEditableEvents();
              editor.setupMenu(config.path);
              editor.setupToast();
              editor.createMenu(config.path);
              editor.setupTextMenu();
              editor.translate();

              // setup loaded event
              var event = new Event('editor.loaded');
              document.dispatchEvent(event);

            }

          });
      }

    },

    /**
     * Wrap an HTMLElement around each element in an HTMLElement array.
     * @param {Array} config.sortable
     */
    wrap: function(node, elms) {
      var i, child, el, parent, sibling;

      // Convert `elms` to an array, if necessary.
      if (!elms.length) {
        elms = [elms];
      }

      // Loops backwards to prevent having to clone the wrapper on the
      // first element (see `child` below).
      for (i = elms.length - 1; i >= 0; i--) {
        child = (i > 0) ? node.cloneNode(true) : node;
        el = elms[i];

        // Cache the current parent and sibling.
        parent = el.parentNode;
        sibling = el.nextSibling;

        // Wrap the element (is automatically removed from its current
        // parent).
        child.appendChild(el);

        // If the element had a sibling, insert the wrapper before
        // the sibling to maintain the HTML structure; otherwise, just
        // append it to the parent.
        if (sibling) {
          parent.insertBefore(child, sibling);
        } else {
          parent.appendChild(child);
        }
      }
    },

    /**
     * Generates a uniqueid
     */
    guid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + s4() + s4();
    },

    /**
     * Redirect to login URL
     */
    showAuth: function() {
      window.location = editor.loginUrl;
    },

    /**
     * Create the toast
     */
    setupToast: function() {

      var toast;

      toast = document.createElement('div');
      toast.setAttribute('class', 'editor-toast');
      toast.innerHTML = 'Sample Toast';

      // append toast
      if (editor.current) {
        editor.current.container.appendChild(toast);
      } else {
        document.body.appendChild(toast);
      }

    },

    /**
     * Replace all occurrences of a string
     * @param {String} src - Source string (e.g. haystack)
     * @param {String} stringToFind - String to find (e.g. needle)
     * @param {String} stringToReplace - String to replacr
     */
    replaceAll: function(src, stringToFind, stringToReplace) {

      var temp, index;

      temp = src;
      index = temp.indexOf(stringToFind);

      while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
      }

      return temp;
    },

    /**
     * Find the parent by a selector ref: http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
     * @param {Array} config.sortable
     */
    findParentBySelector: function(elm, selector) {
      var all, cur;

      all = document.querySelectorAll(selector);
      cur = elm.parentNode;

      while (cur && !editor.collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
    },

    /**
     * Helper for findParentBySelecotr
     * @param {Array} config.sortable
     */
    collectionHas: function(a, b) { //helper function (see below)
      var i, len;

      len = a.length;

      for (i = 0; i < len; i += 1) {
        if (a[i] == b) {
          return true;
        }
      }
      return false;
    },

    // translates a page
  	translate: function(language){

  	  var els, x, id, html;

  		// select elements
  		els = document.querySelectorAll('[data-i18n]');

  		// walk through elements
  		for(x=0; x<els.length; x++){
  			id = els[x].getAttribute('data-i18n');

  			// set id to text if empty
  			if(id == ''){
  				id = els[x].innerText();
  			}

  			// translate
  			html = editor.i18n(id);

  			els[x].innerHTML = html;
  		}

  	},

  	// translates a text string
  	i18n: function(text){

    	var options, language, path;

			language = editor.language;

      // translatable
      if(editor.canTranslate === true) {

    		// make sure library is installed
        if(i18n !== undefined) {

          if(editor.isI18nInit === false) {

            // get language path
            path = editor.languagePath;
            path = editor.replaceAll(path, '{{language}}', editor.language);

      			// set language
      			options = {
      		        lng: editor.language,
      		        getAsync : false,
      		        useCookie: false,
      		        useLocalStorage: false,
      		        fallbackLng: 'en',
      		        resGetPath: path,
      		        defaultLoadingValue: ''
      		    };

            // init
      			i18n.init(options);

      			// set flag
      			editor.isI18nInit = true;
    			}
    		}

  		}

  		return i18n.t(text);
  	},

  };

}());