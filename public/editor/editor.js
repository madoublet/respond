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
      block: null,
      parent: null,
      element: null,
      image: null,
      menuItem: null,
      linkSelection: ''
    },

    // handles text selection
    selection: null,

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
          div = document.createElement('x-respond-menu');
          div.setAttribute('class', 'editor-block-menu');
          div.setAttribute('contentEditable', 'false');

          // create up
          span = document.createElement('x-respond-menu-item');
          span.setAttribute('class', 'editor-block-menu-item editor-block-up');
          span.innerHTML = '<x-respond-menu-icon class="material-icons">arrow_upward</x-respond-menu-icon> ' + editor.i18n('Move Up');

          // append the handle to the wrapper
          div.appendChild(span);

          // create down
          span = document.createElement('x-respond-menu-item');
          span.setAttribute('class', 'editor-block-menu-item editor-block-down');
          span.innerHTML = '<x-respond-menu-icon class="material-icons">arrow_downward</x-respond-menu-icon> ' + editor.i18n('Move Down');

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
      menu = document.createElement('x-respond-menu');
      menu.setAttribute('class', 'editor-element-menu');
      menu.setAttribute('contentEditable', 'false');

      // create a handle
      span = document.createElement('x-respond-menu-item');
      span.setAttribute('class', 'editor-element-menu-item editor-move');
      span.innerHTML = '<x-respond-menu-icon class="material-icons">apps</x-respond-menu-icon> ' + editor.i18n('Move');

      // append the handle to the wrapper
      menu.appendChild(span);

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

    /*
     * executes a command
     */
    execCommand: function(command) {

      var text, html, block = editor.current.block, element = editor.current.node;

      if(command.toUpperCase() == 'LINK') {
        // add link html
        text = editor.getSelectedText();
        html = '<a>' + text + '</a>';

        editor.current.linkSelection = html;

        document.execCommand("insertHTML", false, html);

        editor.current.linkSelection = '';

        // shows/manages the link dialog
        editor.showLinkDialog();
      }
      else if(command.toUpperCase() == 'ELEMENT.REMOVE') {
        if(element != null) {
          element.remove();
        }
      }
      else if(command.toUpperCase() == 'BLOCK.REMOVE') {
        block.remove();
        editor.setupBlocks();
      }
      else {
        document.execCommand(command, false, null);
      }

    },

    /**
     * Updates the UI with the attributes
     * obj = { properties: {id, cssClass, html, alt, title, src}, attributes: { custom1, custom2, custom3 } }
     */
    update: function(obj) {

      let el = editor.current.node, currentValue;

      if(obj.type == null || obj.type == 'undefined') {
        obj.type = 'element';
      }

      // set el to the current link
      if(obj.type == 'link') {
        el = editor.currLink;
      }

      // set el to the current block
      if(obj.type == 'block') {
        el = editor.current.block;
      }

      if(obj.type == 'add-block') {

        editor.appendBlock(obj.properties.html);
        return;

      }

      if(obj.properties != null && obj.properties != undefined) {

        var style = '';

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
            else if(key == 'backgroundImage') {
              if(obj.properties.backgroundImage != '') {
                el.setAttribute('data-background-image', obj.properties.backgroundImage);
                style += 'background-image: url(' + obj.properties.backgroundImage + ');';
              }
            }
            else if(key == 'backgroundColor') {
              if(obj.properties.backgroundColor != '') {
                el.setAttribute('data-background-color', obj.properties.backgroundColor);
                style += 'background-color: ' + obj.properties.backgroundColor + ';';
              }
            }
            else if(key == 'backgroundSize') {
              if(obj.properties.backgroundSize != '') {
                el.setAttribute('data-background-size', obj.properties.backgroundSize);
                style += 'background-size: ' + obj.properties.backgroundSize + ';';
              }
            }
            else if(key == 'backgroundPosition') {
              if(obj.properties.backgroundPosition != '') {
                el.setAttribute('data-background-position', obj.properties.backgroundPosition);
                style += 'background-position: ' + obj.properties.backgroundPosition + ';';
              }
            }
            else if(key == 'backgroundRepeat') {
              if(obj.properties.backgroundRepeat != '') {
                el.setAttribute('data-background-repeat', obj.properties.backgroundRepeat);
                style += 'background-repeat: ' + obj.properties.backgroundRepeat + ';';
              }
            }
            else if(key == 'textColor') {
              el.setAttribute('data-text-color', obj.properties.textColor);

              if(obj.properties.textColor != '') {
                style += 'color: ' + obj.properties.textColor + ';';
              }
            }
            else if(key == 'textAlignment') {
              if(obj.properties.textAlignment != '') {
                el.setAttribute('data-text-alignment', obj.properties.textAlignment);
                style += 'text-align: ' + obj.properties.textAlignment + ';';
              }
            }
            else if(key == 'textShadowColor') {
              el.setAttribute('data-text-shadow-color', obj.properties.textShadowColor);
            }
            else if(key == 'textShadowHorizontal') {
              el.setAttribute('data-text-shadow-horizontal', obj.properties.textShadowHorizontal);
            }
            else if(key == 'textShadowVertical') {
              el.setAttribute('data-text-shadow-vertical', obj.properties.textShadowVertical);
            }
            else if(key == 'textShadowBlur') {
              el.setAttribute('data-text-shadow-blur', obj.properties.textShadowBlur);
            }

            });
      }

      if((el.getAttribute('data-text-shadow-color') || '') != '') {
        var shadow = 'text-shadow: ';
        shadow += (el.getAttribute('data-text-shadow-horizontal') || '1') + 'px ';
        shadow += (el.getAttribute('data-text-shadow-vertical') || '1') + 'px ';
        shadow += (el.getAttribute('data-text-shadow-blur') || '1') + 'px ';
        shadow += (el.getAttribute('data-text-shadow-color') || '#555') + ';';

        style += shadow;
      }

      el.style = style;

      if(obj.attributes != null && obj.attributes != undefined) {
        Object.keys(obj.attributes).forEach(function(key,index) {

            currentValue = el.getAttribute(obj.attributes[index].attr);

            // set attribute
            el.setAttribute(obj.attributes[index].attr, obj.attributes[index].value);

            // call change
            if(editor.current.menuItem.change != undefined) {
              editor.current.menuItem.change(obj.attributes[index].attr, obj.attributes[index].value, currentValue);
            }

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
    setupSidebar: function() {

      // setup menu
      var x, wrapper, menu = '<div id="editor-text-settings" class="editor-config editor-element-config"></div>';

      wrapper = document.createElement('div');
      wrapper.innerHTML = menu;

      for (x = 0; x < wrapper.childNodes.length; x += 1) {
        editor.current.container.appendChild(wrapper.childNodes[x]);
      }

      // init menu
      for (x = 0; x < editor.menu.length; x += 1) {

        // initialize
        if (editor.menu[x].init) {
          editor.menu[x].init();
        }

      }

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
          html: '<p><img src="{{path}}images/placeholder.png" class="img-fluid img-responsive"></p>'
        }, {
          selector: "table[rows]",
          title: "Table",
          display: "<i class=\"material-icons\">grid_on</i>",
          html: '<table class="table" rows="1" columns="2"><thead><tr><th>Header</th><th>Header</th></tr></thead><tbody><tr><td>Content</td><td>Content</td></tr></tbody></table>',
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
     * Shows the sidebar
     */
    showSidebar: function(element) {

      /*
      var x, link, image, text, fields, menu = document.querySelector('.editor-menu');;

      // set current element and node
      editor.current.element = element;
      editor.current.node = element;

      // if the current element is not a [editor-element], find the parent that matches
      if(editor.current.element.hasAttribute('editor-element') === false) {
        editor.current.element = editor.findParentBySelector(element, '[editor-element]');
      }

      // get #editor-config
      text = document.querySelector('#editor-text-settings');
      text.setAttribute('visible', ''); */

      var menu = document.querySelector('.editor-menu');

      menu.removeAttribute('active');
      editor.showElementMenu();
      editor.showBlockMenu();

    },

    /**
     * Shows the element menu
     */
    showElementMenu: function() {

      // set current node
      var element = editor.current.node, x, title, selector, attributes = [];

      // see if the element matches a plugin selector
      for (x = 0; x < editor.menu.length; x += 1) {
        if (element.matches(editor.menu[x].selector)) {
          title = editor.menu[x].title;
          selector = editor.menu[x].selector;

          // get null or not defined
          if(editor.menu[x].attributes != null && editor.menu[x].attributes != undefined) {
            attributes = editor.menu[x].attributes;
          }

          editor.current.menuItem = editor.menu[x];
        }
      }

      // get current values for each attribute
      for (x = 0; x < attributes.length; x++) {
        attributes[x].value = element.getAttribute(attributes[x].attr) || '';
      }

      // get the html of the element
      let html = element.innerHTML;
      var i = html.indexOf('<x-respond-menu class="editor-element-menu"');
      html = html.substring(0, i);

      // get background image, background color
      var backgroundImage = element.getAttribute('data-background-image') || '';
      var backgroundColor = element.getAttribute('data-background-color') || '';
      var backgroundSize = element.getAttribute('data-background-size') || '';
      var backgroundPosition = element.getAttribute('data-background-position') || '';
      var backgroundRepeat = element.getAttribute('data-background-repeat') || '';
      var textColor = element.getAttribute('data-text-color') || '';
      var textAlignment = element.getAttribute('data-text-alignment') || '';
      var textShadowColor = element.getAttribute('data-text-shadow-color') || '';
      var textShadowHorizontal = element.getAttribute('data-text-shadow-horizontal') || '';
      var textShadowVertical = element.getAttribute('data-text-shadow-vertical') || '';
      var textShadowBlur = element.getAttribute('data-text-shadow-blur') || '';

      window.parent.postMessage({
        type: 'element',
        selector: selector,
        title: title,
        properties: {
          id: element.id,
          cssClass: element.className,
          backgroundImage: backgroundImage,
          backgroundColor: backgroundColor,
          backgroundSize: backgroundSize,
          backgroundPosition: backgroundPosition,
          backgroundRepeat: backgroundRepeat,
          textColor: textColor,
          textAlignment: textAlignment,
          textShadowColor: textShadowColor,
          textShadowHorizontal: textShadowHorizontal,
          textShadowVertical: textShadowVertical,
          textShadowBlur: textShadowBlur,
          html: html
        },
        attributes: attributes
      }, '*');


    },

    /**
     * Shows the block menu
     */
    showBlockMenu: function() {

      var block = editor.findParentBySelector(editor.current.node, '[editor-block]');

      if(block !== null) {

        // set current node to block
        editor.current.block = block;

        // get background image, background color
        var backgroundImage = block.getAttribute('data-background-image') || '';
        var backgroundColor = block.getAttribute('data-background-color') || '';
        var backgroundSize = block.getAttribute('data-background-size') || '';
        var backgroundPosition = block.getAttribute('data-background-position') || '';
        var backgroundRepeat = block.getAttribute('data-background-repeat') || '';

        // post message to app
        window.parent.postMessage({
          type: 'block',
          selector: '.block',
          title: 'Block',
          properties: {
            id: block.id,
            cssClass: block.className,
            backgroundImage: backgroundImage,
            backgroundColor: backgroundColor,
            backgroundSize: backgroundSize,
            backgroundPosition: backgroundPosition,
            backgroundRepeat: backgroundRepeat
          },
          attributes: []
        }, '*');

      }
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

            if (e.target.matches('.editor-block-up') ||  editor.findParentBySelector(e.target, '.editor-block-up') !== null) {

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
            else if (editor.findParentBySelector(e.target, '[respond-plugin]') !== null) {

                var parentNode = editor.findParentBySelector(e.target, '[respond-plugin]');

                // get current node
                editor.current.node = parentNode;

                // shows the text options
                editor.showSidebar(parentNode);
            }
            else if (e.target.hasAttribute('contentEditable')) {

              editor.current.node = e.target;

              // shows the text options
              editor.showSidebar(e.target);

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

                  if(editor.current.linkSelection != '') {
                    el.innerHTML = editor.current.linkSelection;
                    editor.current.linkSelection = '';
                    editor.setupElementMenu(el);
                  }
                  else {
                    text = document.createTextNode(editor.i18n('Tap to update'));
                    el.insertBefore(text, el.firstChild);
                  }
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

      // setup contentEditable
      var types = 'p, h1, h2, h3, h4, h5, li, td, th, blockquote, pre';

      // set editable children
      var editable = newNode.querySelectorAll(types);

      for (x = 0; x < editable.length; x += 1) {
        editable[x].setAttribute('contentEditable', 'true');
      }

      if (types.indexOf(newNode.nodeName.toLowerCase()) != -1) {
        newNode.setAttribute('contentEditable', 'true');
      }

      // re-init sortable
      editor.setupSortable();

      // setup blocks
      editor.setupBlocks();

      return newNode;

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

      var body, attr, path, stylesheet, sortable, url, login, blocks;

      // get body
      body = document.querySelector('body');

      // register dom elements
      if(window.customElements) {
        window.customElements.define('fx-respond-menu', class extends HTMLElement {});
        window.customElements.define('fx-respond-menu-item', class extends HTMLElement {});
        window.customElements.define('fx-respond-menu-label', class extends HTMLElement {});
        window.customElements.define('fx-respond-menu-icon', class extends HTMLElement {});
      }
      else if(document.registerElement) {
        document.registerElement('x-respond-menu');
        document.registerElement('x-respond-menu-item');
        document.registerElement('x-respond-menu-label');
        document.registerElement('x-respond-menu-icon');
      }

      // production
      login = '/login';
      path = '/node_modules/editor/';
      stylesheet = ['/node_modules/editor/dist/editor-min.css'];
      sortable = ['.sortable'];
      url = null;
      blocks = [];

      // get attributes
      if(body != null) {

        if(incoming.path) {
          path = incoming.path;
        }

        if(incoming.stylesheet) {
          stylesheet = incoming.stylesheet;
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
        blocks: blocks
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
            editor.setupSidebar();
            editor.translate();

            // setup loaded event
            var event = new Event('editor.loaded');
            document.dispatchEvent(event);

          }

        });


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