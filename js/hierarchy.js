/**
* Hierarchy Chart - For Org Charts and Trees ect...
*/

/* start-amd-strip-block */
(function(factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function($) {
/* end-amd-strip-block */

 $.fn.hierarchy = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'hierarchy',
        defaults = {
          legend: [],
          legendKey: '',
          dataset: [],
          newData: [],
          templateId: '',  //Id to the Html Template
          mobileView: false,
          mouseEnterTarget: '',
          rightClickTarget: '',
          leafHeight: null,
          leafWidth: null,
          beforeExpand: null  // A callback that fires before node expansion of a node.
        },
        settings = $.extend({}, defaults, options);

    var colorClass = [
      'azure', 'amber', 'ruby', 'emerald', 'turquoise', 'amethyst', 'graphite'
    ];

    var constants = {
      container       : 'container',
      chart           : 'content',
      toplevel        : 'top-level',
      sublevel        : 'sub-level',
      noSublevel      : 'no-sublevel',
      sublist         : 'sublist',
      button          : 'button',
      leaf            : 'leaf',
      inner           : 'inner',
      multiRoot       : 'multi-root',
      root            : 'root',
      back            : 'back',
      activeBranch    : 'active-branch',
      branchExpanded  : 'branch-expanded',
      branchCollapsed : 'branch-collapsed',
      collapsedLeaf   : 'collapsed-leaf',
      treeClosed      : 'tree-closed',
      expanded        : 'expanded',
      collapsed       : 'collapsed',
      close           : 'close',
      open            : 'open',
      shadow          : 'shadow',
      line            : 'line',
      selected        : 'selected',
      show            : 'show',
      hide            : 'hide'
    };

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {
      init: function() {
        var isMobile = $(this.element).parent().width() < 610; //Phablet down

        if (isMobile) {
          this.mobileView = true;
        } else {
          this.mobileView = false;
        }

        this.handleEvents();

        if (settings.dataset) {
          if (settings.dataset[0].children.length > 0) {
            var data = settings.dataset[0] === undefined ? settings.dataset : settings.dataset[0];

            data.isRootNode = true;
            data.isExpanded = true;
            this.render(data);
          } else {
            $(this.element).append('<p style=\'padding:10px;\'>No data available</p>');
          }
        }

        if (settings.leafHeight !== null && settings.leafWidth !== null) {

          var style = 'body .hierarchy .leaf,' +
                'body .hierarchy .sublevel .leaf,' +
                'body .hierarchy .container .root.leaf { width: ' + settings.leafWidth + 'px; ' + ' height: ' + settings.leafHeight + 'px; ' + ' }';

          $('<style type=\'text/css\' id=\'hierarchyLeafStyles\'>' + style + '</style>').appendTo('body');
        }
      },

      // Attach all event handlers
      handleEvents: function() {
        var self = this;

        // Expand or Collapse
        self.element.on('click', '.' + constants.button, function(event) {

          if (settings.newData.length > 0) {
            settings.newData = [];
          }

          var nodeId     = $(this).closest('.' + constants.leaf).attr('id');
          var dataObject = self.data(nodeId, settings.dataset, settings.newData);
          var domObject  = {
            branch: $(this).closest('li'),
            leaf: $(this).closest('.' + constants.leaf),
            button: $(this)
          };

          if (dataObject.isExpanded) {
            self.collapse(event, dataObject, domObject);
          } else {
            self.expand(event, dataObject, domObject);
          }

        });

        self.element.on('click', '.' + constants.back, function() {
          var nodeId     = $(this).parent().find('.' + constants.leaf).attr('id');
          var nodeData   = self.data(nodeId, settings.dataset, settings.newData);
          var domObject  = {
            branch: $(this).closest('li'),
            leaf: $(this).closest('.' + constants.leaf),
            button: $(this)
          };

          self.collapse(event, nodeData, domObject);
        });

        self.element.on('keypress', '.' + constants.leaf, function(event) {
          var nodeId     = $(this).attr('id');
          var nodeData   = self.data(nodeId, settings.dataset, settings.newData);

          if (event.which === 13) {
            if (nodeData.isExpanded) {
              self.collapse(event, nodeData);
            } else {
              self.expand(event, nodeData);
            }
          }
        });

        // Select
        self.element.on('click', '.' + constants.leaf, function(event) {
          var nodeData = $(this).data();
          var element = {target: event.target, pageX: event.pageX, pageY: event.pageY};

          $('.' + constants.selected).removeClass(constants.selected);
          $('#' + nodeData.id).addClass(constants.selected);

          $(this).trigger('selected', nodeData, element);
        });

        // Right Click
        var rightClickTarget = settings.rightClickTarget === '' ? '.' + constants.leaf : settings.rightClickTarget;
        self.element.on('mousedown', rightClickTarget, function(event) {
          var nodeData = $(this).data();
          var element = {target: event.target, pageX: event.pageX, pageY: event.pageY};
          if (event.which === 1) {
            $(this).trigger('click');
          }
          if (event.which === 3) {
            $(this).trigger('rightClick', [nodeData, element]);
          }
        });

        // Mouseenter
        var mouseEnterTarget = settings.mouseEnterTarget === '' ? '.' + constants.leaf : settings.mouseEnterTarget;
        self.element.on('mouseenter', mouseEnterTarget, function(event) {
          var nodeData = $(this).data();
          var element = {target: event.target, pageX: event.pageX, pageY: event.pageY};

          if (event.which !== 3) {
            $(this).trigger('mouseEnter', [nodeData, element]);
          }
        });

        // Double Click
        self.element.on('dblclick', '.' + constants.leaf, function(event) {
          var nodeData  = $(this).data();
          var element = {target: event.target, clientX: event.clientX, clientY: event.clientY};

          $(this).trigger('doubleClick', nodeData, element);
        });

        // Remove Leaf
        $('body').on('removeLeaf', function(event, data) {
          var nodeData = data;
          $('#' + nodeData.id).closest('li').remove();
        });

        // Insert Leaf
        $('body').on('insertLeaf', function(event, parentId, data) {
          var button = $('#' + parentId).find('.' + constants.button);
          button.removeClass(constants.hide).addClass(constants.expanded);

          self.data(parentId, settings.dataset, data, {insert:true});
          self.setColor(data);
          self.add(parentId, settings.dataset, data);
        });
      },

      // Process data attached through jquery data
      data: function(nodeId, currentDataObject, newDataObject, params) {

        if (params === undefined) {
          params = {};
        }

        var obj = currentDataObject.isRootNode ? currentDataObject : currentDataObject[0];
        var nodeData = [];

        if (settings.newData.length > 0) {
          settings.newData = [];
        }

        function processData(self, obj, newDataObject) {
          if (obj.length === undefined) {
            checkForChildren(self, obj, newDataObject);
          } else {
            for (var i = 0, l = obj.length; i < l; i++) {
              var o = obj[i];
              checkForChildren(self, o, newDataObject);
            }
          }
        }

        if (newDataObject !== undefined) {
          processData(this, obj, newDataObject);
        }

        function checkForChildren(self, obj, newDataObject) {
          for (var prop in obj) {
            if (prop === 'id' && nodeId === obj.id) {
              if (!obj.isLoaded && !obj.isRootNode) {
                if (params.updateDisplay) {
                  obj.displayClass = constants.hide + ' ' + constants.collapsed;
                }
                else {
                  addChildrenToObject(obj, params);
                }
              }
              nodeData.push(obj);
            }
          }
          if (obj.children) {
            processData(self, obj.children, newDataObject);
          }
        }

        function addChildrenToObject(obj, params) {
          if (params.insert) {
            delete obj.isLeaf;
            delete obj.displayClass;
            obj.displayClass = constants.expanded;
            obj.isExpanded = true;
          }
          if (newDataObject.length !== 0 && params.insert) {
            obj.children = [newDataObject];
          } else {
            obj.children = newDataObject;
          }
        }

        if (nodeData.length !== 0) {
          $('#' + nodeData[0].id).data(nodeData[0]);
        }

        return nodeData[0];
      },

      // Add data as children for the given nodeId.
      add: function (nodeId, currentDataObject, newDataObject) {
        var self            = this;
        var id              = currentDataObject.id !== undefined ? currentDataObject.id : nodeId;
        var node            = $('#' + id);
        var parentContainer = node.parent().hasClass('leaf-container') ? node.parent().parent() : node.parent();
        var selectorObject  = {};
        var isSubLevelChild = parentContainer.parent().attr('class') !== constants.sublevel;
        var subListExists   = parentContainer.children('.' + constants.sublist).length === 1;

        if (isSubLevelChild) {
          if (subListExists) {
            selectorObject.element = parentContainer.children('.' + constants.sublist);
          } else {
            selectorObject.el = parentContainer.append('<ul class=\'' + constants.sublist + '\'></ul>');
            selectorObject.element = $(selectorObject.el).find('.' + constants.sublist);
          }
        } else {
          selectorObject.el = parentContainer.children('ul');
          selectorObject.element = $(selectorObject.el);
        }

        if (!currentDataObject.isRootNode) {
          for(var i = 0, l = newDataObject.length; i < l; i++) {
            settings.newData.push(newDataObject[i]);
          }
          self.createLeaf(newDataObject, selectorObject.element);
        }
      },

      // Expand the nodes until nodeId is displayed on the page.
      expand: function(event, nodeData, domObject) {
        var self           = this;
        var nodeParent     = domObject.branch;
        var button         = domObject.button;
        var animationParam = 'expand';
        var dataWasLoaded  = false;

        if (self.mobileView && !nodeData.isRootNode) {
          var currentActiveBranch = $('.' + constants.activeBranch);

          // remove current active branch state and back button
          currentActiveBranch.removeClass(constants.activeBranch);
          currentActiveBranch.find('.' + constants.back).remove();

          // add back button, set branch to active, remove collapsed state
          nodeParent.prepend('<span class=\'' + constants.back + '\'><span></span><span></span></span>');
          nodeParent.addClass(constants.activeBranch);
          nodeParent.removeClass(constants.branchCollapsed);
          nodeParent.addClass(constants.branchExpanded);
        }

        nodeParent.removeClass(constants.treeClosed);
        self.animateExpandCollapse(nodeParent, animationParam);

        nodeParent.children('.' + constants.close).removeClass(constants.close);
        nodeParent.children('.' + constants.shadow).remove();
        button.removeClass(constants.collapsed).addClass(constants.expanded);
        nodeData.isExpanded = true;

        if (nodeData.isRootNode) {
          nodeParent.removeClass(constants.treeClosed);
          nodeParent.children('.' + constants.close).removeClass(constants.close);
        }

        if (self.isLeaf(nodeData)) {
          self.element.trigger(constants.expanded, [nodeData, settings.dataset]);
          return;
        }

        function response(completeExpand) {
          if (completeExpand) {
            nodeParent.addClass(constants.branchExpanded);
            nodeParent.removeClass(constants.branchCollapsed);
            nodeParent.children('.' + constants.shadow).remove();
            button.removeClass(constants.collapsed).addClass(constants.expanded);

            nodeData.isLoaded = true;
            dataWasLoaded = true;

            setButtonState(nodeData);
          }
        }

        function setButtonState(nodeData) {
          if (dataWasLoaded) {
            delete nodeData.isLeaf;

            nodeData.isExpanded = true;
            nodeData.displayClass = constants.show + ' ' + constants.expanded;
            button.removeClass(constants.hide);
            button.removeClass(constants.collapsed);
            button.addClass(nodeData.displayClass);

            self.element.trigger(constants.expanded, [nodeData, settings.dataset]);
          } else {
            nodeData.isExpanded = false;

            nodeData.isLeaf = true;
            nodeData.displayClass = constants.hide + ' ' + constants.collapsed;

            button.removeClass(constants.show);
            button.removeClass(constants.expanded);
            button.addClass(nodeData.displayClass);

            return nodeData;
          }
        }

        if (settings.beforeExpand) {
          settings.beforeExpand(nodeData.id, nodeData, response);

          nodeData = setButtonState(nodeData);

          self.element.trigger(constants.expanded, [nodeData, settings.dataset]);
        } else {
          response(true);
        }
      },

      // Collapse the passed in nodeId.
      collapse: function(event, nodeData, domObject) {
        var self           = this;
        var node           = domObject.leaf;
        var nodeParent     = domObject.branch;
        var button         = domObject.button;
        var nodeTopLevel   = node.next().not('.' + constants.line);
        var nodeSubLevel   = node.next().next();
        var animationParam = 'collapse';

        if (event && this.mobileView && !nodeData.isRootNode) {
          if (event.type === 'click') {
            nodeParent.removeClass(constants.activeBranch);
            nodeParent.find('.' + constants.back).remove();

            //var parentBranch = nodeParent.parent('ul').parent('li');
            //parentBranch.addClass(constants.activeBranch);
            //parentBranch.prepend('<span class=\'' + constants.back + '\'><span></span><span></span></span>');
          }
        }

        if (nodeData.isRootNode) {
          nodeParent.addClass(constants.treeClosed);
          nodeSubLevel.addClass(constants.close).removeClass(constants.open);
          nodeTopLevel.addClass(constants.close).removeClass(constants.open);
        } else {
          nodeParent.removeClass(constants.open);
          nodeParent.removeClass(constants.branchExpanded);
          nodeParent.addClass(constants.branchCollapsed);
          nodeData.displayClass = constants.show + ' ' + constants.collapsed;
          self.animateExpandCollapse(nodeParent, animationParam);
        }

        nodeParent.removeClass(constants.branchExpanded);

        setTimeout(function() {
          nodeParent.addClass(constants.branchCollapsed);

          var isNotWrapped = node.closest('li').find('.leaf-container').length === 0;
          var isRoot = node.hasClass(constants.root);

          if (isNotWrapped) {
            if (isRoot) {
              node.wrap('<div class=\'leaf-container root\'>');
              node.removeClass(constants.root);
            }
            else {
              node.wrap('<div class=\'leaf-container\'>');
            }

            nodeParent.children('.leaf-container').append('<div class=\'' + constants.shadow + '\'></div>');
          }

        }, 400); //400 to give css animation time to finish

        button.removeClass(constants.expanded).addClass(constants.collapsed);
        nodeData.isExpanded = false;

        node.removeData();
        self.setNodeData(nodeData);

        self.element.trigger(constants.collapsed, [nodeData, settings.dataset]);
      },

      //Animate and toggle the node branch
      animateExpandCollapse: function(branch, param) {
        var leafs = '';

        if (param === 'expand') {
          leafs = branch.children('ul').children('li');
        }
        if (param === 'collapse') {
          leafs = branch.children('ul').find('li');
        }

        function animate(element, param) {
          if (param === 'expand') {
            element.removeClass(constants.collapsedLeaf);
            if (element.hasClass(constants.branchExpanded)) {
              element.children('.' + constants.sublist).children('li').removeClass(constants.collapsedLeaf);
            }
          }

          if (param === 'collapse') {
            element.addClass(constants.collapsedLeaf);
          }
        }

        var i = leafs.length;
        while(i--){
          var element = leafs.eq(i);
          animate(element, param);
        }

      },

      //Main render method
      render: function (data) {
        var legend       = settings.legend;
        var children     = data.children;
        var hasTopLevel  = this.checkChildren(children, 'top-level');
        var hasSubLevel  = this.checkChildren(children, 'sub-level');
        var rootNodeHTML = [];
        var structure    = {
          legend    : '<legend><ul></ul></legend>',
          chart     : '<ul class=\'' + constants.container + '\'>'+ '<li class=\'' + constants.chart + '\'></li></ul>',
          toplevel  : '<ul class=\'' + constants.toplevel + '\'></ul>',
          sublevel  : '<ul class=\'' + constants.sublevel + '\'></ul>'
        };

        var chartContainer  = this.element.append(structure.chart);
        var chart = $('.' + constants.chart, chartContainer);

        if (legend.length !== 0) {
          this.element.prepend(structure.legend);
          var element = $('legend', chartContainer);
          this.createLegend(element);
        }

        // Create root node
        this.setColor(data);
        this.displayButton(data);

        if (data.isMultiRoot) {
          var multiRootHTML = '<div class=\'' + constants.leaf + ' ' + constants.multiRoot + '\'><div class=\'' +
            constants.inner + '\'><h2>' +
            data.multiRootText +'</h2></div></div>';

          rootNodeHTML.push(multiRootHTML);
          $(rootNodeHTML[0]).addClass(constants.root).appendTo(chart);

        } else {
          var leafTemplate = this.template(settings.templateId);
          rootNodeHTML.push(leafTemplate(data));

          $(rootNodeHTML[0]).addClass(constants.root).appendTo(chart);
          this.setNodeData(data);
        }

        if (!hasTopLevel) {
          $('<div class=\'' + constants.line + '\'></div>').insertAfter('.' + constants.root);
        }

        function renderSubChildren(self, subArray, data) {
          if (subArray !== null && subArray !== undefined) {
            for (var i = 0, l = subArray.length; i < l; i++) {
              var obj = subArray[i];
              subArrayChildren(self, obj, data);
            }
          }
        }

        // Create children nodes
        if (children.length > 0) {
          for (var i = 0, l = children.length; i < l; i++) {

            var childObject = data.children[i].children;

            if (this.isLeaf(children[i])) {
              this.createLeaf(data.children[i], $(structure.toplevel));
            }
            else {
              this.createLeaf(data.children[i], $(structure.sublevel));
            }

            if (childObject !== undefined && childObject !== null) {
              var subArray = data.children[i].children;
              var self = this;
              renderSubChildren(self, subArray, data);
            }
          }
        }

        function subArrayChildren(self, obj, data) {
          for(var prop in obj) {
            if (prop === 'children') {
              var nodeId = obj.id;
              var currentDataObject = obj;
              var newDataObject = obj.children;

              if (newDataObject !== null && newDataObject !== undefined) {
                if (newDataObject.length > 0) {
                  self.add(nodeId, currentDataObject, newDataObject);
                }
              }

              return renderSubChildren(self, newDataObject, data);
            }
          }
        }

        if (!hasSubLevel) {
          $('.' + constants.topLevel).addClass(constants.noSublevel);
        }

        var containerWidth = this.element.find('.' + constants.container).outerWidth();
        var windowWidth = $(window).width();
        var center = (containerWidth - windowWidth) / 2;
        this.element.scrollLeft(center);

      },

      checkChildren : function(children, param) {
        var n = 0;
        var i = children.length;
        while(i--) {
          if (param === 'top-level') {
            if (children[i].isLeaf) {
              n += 1;
            }
          }
          if (param === 'subLevel') {
            if (children[i].children) {
              n += 1;
            }
          }
        }
        return n > 0;
      },

      // Add the legend from the Settings
      createLegend : function(element) {
        var mod      = 4;
        var index    = 0;

        for (var i = 0, l = settings.legend.length; i < l; i++) {
          var label  = settings.legend[i].label;
          var color  = colorClass[i];

          if (i - 1 % mod + 1 === mod) {
            element.append('<ul></ul>');
            index++;
          }

          element.children('ul').eq(index).append(
            '<li>' +
            '<span>' + label + '</span>' +
            '<span class=\'key ' + color + '\'></span>' +
            '</li>'
          );
        }
      },

      // Creates a leaf node under element for nodeData
      createLeaf: function(nodeData, container) {
        var self           = this;
        //console.log(nodeData.id);
        var chartClassName = self.element.attr('class');
        var chart          = $('.' + chartClassName + ' .' + constants.chart, self.container);
        var elClassName    = container.attr('class');
        var el             = elClassName !== undefined ? $('.' + elClassName) : container;

        if (el.length < 1) {
          if (elClassName === constants.toplevel) {
            container.insertAfter('.' + constants.root);
          } else {
            container.appendTo(chart);
          }
        }

        function processDataForleaf(nodeData, isLast) {
          self.setColor(nodeData);
          self.displayButton(nodeData);

          var leafTemplate = self.template(settings.templateId);
          var leaf         = leafTemplate(nodeData);
          var animateParam = nodeData.isExpanded || nodeData.isExpanded === undefined ? 'expand' : 'collapse';
          var parent       = el.length === 1 ? el : container;
          var lineHtml     = '';

          parent.children('li').children('.ln').removeClass('last-line');

          //TODO: We dont need?

          if (isLast) {
            lineHtml += '<span class=\'ln last-line\'></span>';
          } else {
            lineHtml += '<span class=\'ln\'></span>';
          }

          var lf = $(leaf);

          if (elClassName !== constants.sublevel && elClassName !== constants.toplevel) {
            $(lf).append('<span class=\'horizontal-line\'></span>');
          }

          var branchState = nodeData.isExpanded || nodeData.isExpanded === undefined ? constants.branchExpanded : constants.branchCollapsed;
          if (nodeData.isLeaf) {
            branchState = '';
          }

          parent.append('<li class=' + branchState + '>' + lineHtml + $(lf)[0].outerHTML + '</li>');

          self.setNodeData(nodeData);

          if (nodeData.children) {
            var childrenNodes = '';
            nodeData.isLoaded = true;

            if (nodeData.displayClass === constants.expanded || nodeData.isExpanded) {
              nodeData.isExpanded = true;

              $('#' + nodeData.id).data(nodeData);
            }
            else {
              nodeData.isExpanded = false;
            }

            for (var j = 0, l = nodeData.children.length; j < l; j++) {
              self.setColor(nodeData.children[j]);
              self.displayButton(nodeData.children[j]);

              var childleaf = leafTemplate(nodeData.children[j]);
              var c = $(childleaf);

              $(c).append('<span class=\'horizontal-line\'></span>');

              if (j === nodeData.children.length - 1) {
                childrenNodes += '<li><span class=\'ln last-line\'></span>' + $(c)[0].outerHTML + '</li>';
              }
              else {
                childrenNodes += '<li><span class=\'ln\'></span>' + $(c)[0].outerHTML + '</li>';
              }
            }

            parent = $('#' + nodeData.id).parent();
            parent.append('<ul>' + childrenNodes + '</ul>');

            var childLength = nodeData.children.length;
            while (childLength--) {
              self.setNodeData(nodeData.children[childLength]);
            }

            if (!nodeData.isExpanded && !nodeData.isLeaf) {
              self.animateExpandCollapse($('#' + nodeData.id).parent(), animateParam);
            }
          }
        }

        if (nodeData.length) {
          for (var i = 0, l = nodeData.length; i < l; i++) {
            var isLast = i === nodeData.length -1;
            processDataForleaf(nodeData[i], isLast);
          }
        } else {
          processDataForleaf(nodeData, true);
        }

      },

      // Determine the color from settings
      setColor: function(data) {
        for (var i = 0, l = settings.legend.length; i < l; i++) {
          if (data[settings.legendKey] === settings.legend[i].value) {
            data.colorClass = colorClass[i];
            break;
          }
          else if (data[settings.legendKey] === '') {
            data.colorClass =  'default-color';
          }
        }

        if (data.children && !data.isRootNode) {
          for (var k = 0, ln = data.children.length; k < ln; k++) {
            for (var j = 0, x = settings.legend.length; j < x; j++) {
              if (data.children[k][settings.legendKey] === settings.legend[j].value) {
                data.children[k].colorClass = colorClass[j];
              }
            }
          }
        }
      },

      setNodeData: function(nodeData) {
        var leafObject   = $('#' + nodeData.id).data(nodeData);
        leafObject.data  = nodeData;
      },

      // Return whether or not a particular node is a leaf
      isLeaf: function(dataNode) {

        if (dataNode.children === undefined) {
          dataNode.isLeaf = true;
          return dataNode.isLeaf;
        }

        if (settings.beforeExpand) {
          return dataNode.isLeaf;
        }

        if (dataNode.children && dataNode.children.length > 0) {
          return false;
        }

        return true;
      },

      // Determine the state of the expand collapse button and show it
      displayButton: function(data) {
        if (data.isLeaf) {
          data.displayClass = constants.hide;
        } else {
          data.displayClass = constants.show;
        }

        if (data.isExpanded) {
          data.displayClass += ' ' + constants.expanded;
        } else {
          data.displayClass += ' ' + constants.collapsed;
        }

        if (data.isExpanded === undefined) {
          if (!data.isLeaf && data.children && !data.isRootNode) {
            data.displayClass = constants.expanded;
          }
        }
      },

      //John Resig(http://ejohn.org/)MIT Licensed
      template: function(str, data) {
        var cache = {};
        var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
        this.template(document.getElementById(str).innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>')) :

        new Function('obj', 'var p=[], print=function(){ p.push.apply(p, arguments);}; with(obj){p.push(\'' + str
            .replace(/[\r\t\n]/g, ' ')
            .split('<%').join('\t')
            .replace(/((^|%>)[^\t]*)'/g, '$1\r')
            .replace(/\t=(.*?)%>/g, '\',$1, \'')
            .split('\t').join('\');')
            .split('%>').join('p.push(\'')
            .split('\r').join('\\\'') +
            '\');}return p.join(\'\');');

        return data ? fn(data) : fn;
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);

      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }

    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
