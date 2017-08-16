/* jshint node:true */

// set variables for environment
var express = require('express'),
  extend = require('extend'), // equivalent of $.extend()
  app = express(),
  path = require('path'),
  mmm = require('mmm'),
  fs = require('fs'),
  http = require('http'),
  git = require('git-rev-sync'),
  BASE_PATH = process.env.BASEPATH || '/',
  fullBasePath = function (req) {
    var fullPath = (req.protocol + '://' + req.headers.host.replace('/', '') + BASE_PATH);
    return fullPath;
  },
  getJSONFile = require(path.resolve(__dirname, 'demoapp', 'js', 'getJSONFile')),
  packageJSON = getJSONFile(path.resolve('package.json'));

  app.set('view engine', 'html');
  app.set('views', [path.join(__dirname, 'components'), path.join(__dirname, 'views')]);
  mmm.setEngine('hogan.js');
  app.engine('html', mmm.__express);

  // Because you're the type of developer who cares about this sort of thing!
  app.enable('strict routing');

  // instruct express to server up static assets
  app.use(express.static('public'));

  // Create the express router with the same settings as the app.
  var router = express.Router({
    'strict': true
  });

  // ===========================================
  // Default Options / Custom Middleware
  // ===========================================
  var defaults = {
    enableLiveReload: true,
    layout: 'layout',
    locale: 'en-US',
    title: 'SoHo XI',
    basepath: BASE_PATH,
    version: packageJSON.version,
    commit: git.long(),
  };

  // Option Handling - Custom Middleware
  // Writes a set of default options the 'req' object.  These options are always eventually passed to the HTML template.
  // In some cases, these options can be modified based on query parameters.  Check the default route for these options.
  var optionHandler = function(req, res, next) {
    res.opts = extend({}, defaults);

    // Change Locale (which also changes right-to-left text setting)
    if (req.query.locale && req.query.locale.length > 0) {
      res.opts.locale = req.query.locale;
      console.log('Changing Route Parameter "locale" to be "' + res.opts.locale + '".');
    }

    // Normally we will use an external file for loading SVG Icons and Patterns.
    // Setting 'inlineSVG' to true will use the deprecated method of using SVG icons, which was to bake them into the HTML markup.
    res.opts.inlineSVG = true;

    // Global settings for forcing a 'no frills' layout for test pages.
    // This means no header with page title, hamburger, theme swap settings, etc.
    if (req.query.nofrills && req.query.nofrills.length > 0) {
      res.opts.nofrillslayout = true;
      console.log('"No-frills" layout active.');
    }

    // Set the theme and colorScheme
    //Fx: http://localhost:4000/controls/modal?colors=9279a6,ffffff&theme=dark
    if (req.query.theme && req.query.theme.length  > 0) {
      res.opts.theme = req.query.theme;
      console.log('Setting Theme to ' + res.opts.theme);
    } else {
      res.opts.theme = 'light';
    }

    if (req.query.colors && req.query.colors.length > 0) {
      res.opts.colors = req.query.colors;
      console.log('Setting Colors to ' + res.opts.colors);
    }

    // Sets a simulated response delay for API Calls
    if (req.query.delay && !isNaN(req.query.delay) && req.query.delay.length > 0) {
      res.opts.delay = req.query.delay;
    }

    next();
  };

  // Simple Middleware that simulates a delayed response by setting a timeout before returning the next middleware.
  var responseThrottler = function(req, res, next) {
    if (!res.opts.delay) {
      return next();
    }

    function delayedResponse() {
      console.log('Delayed request continuing...');
      return next();
    }

    console.log('Delaying the response time of this request by ' + res.opts.delay + 'ms...');
    setTimeout(delayedResponse, res.opts.delay);
  };

  // Simple Middleware that passes API data back as a template option if we're on a certain page
  var globalDataHandler = function(req, res, next) {
    var url = req.url;

    function isComponentRoute(componentName) {
      return new RegExp(componentName, 'g').test(url);
    }

    if (isComponentRoute('dropdown')) {
      res.opts.dropdownListData = require(path.resolve('demoapp', 'js', 'getJunkDropdownData'));
    }

    next();
  };

  // Simple Middleware for logging some meta-data about the request to the console
  var timestampLogger = function(req, res, next) {
    console.log(Date.now() + ' - ' + req.method + ': ' + req.url);
    next();
  };

  // Simple Middleware for handling errors
  var errorHandler = function(err, req, res, next) {
    if (!err) {
      return next();
    }

    console.error(err.stack);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).send('<h2>Internal Server Error</h2><p>' + err.stack +'</p>');
  };

  // place optionHandler() first to augment all 'res' objects with an 'opts' object
  app.use(optionHandler);
  app.use(globalDataHandler);
  app.use(responseThrottler);
  app.use(router);
  app.use(timestampLogger);
  app.use(errorHandler);

  // Strips the '.html' from a file path and returns the target route name without it
  function stripHtml(routeParam) {
    var noHtml = routeParam.replace(/\.html/, '');
    return noHtml;
  }

  function setHtml(routeParam) {
    return stripHtml(routeParam) + '.html';
  }

  function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  /**
   * Checks the target file path for its type (is it a file, a directory, etc)
   * http://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
   * @param {string} type - 'file' or 'folder'
   * @param {string} filePath - a string representing the relative path of the item to be checked
   * @returns {boolean}
   */
  function is(type, filePath) {
    var types = ['file', 'folder'],
      defaultType = types[0],
      mappings = {
        file: { methodName: 'isFile' },
        directory: { methodName: 'isDirectory' }
        // TODO: Add More (symbolic link, etc)
      };

    if (!type) {
      console.warn('No type defined. Using the default type of "' + defaultType + '".');
      type = defaultType;
    }

    if (!mappings[type]) {
      console.error('Provided type "' + type + '" is not in the list of valid types.');
      return false;
    }

    // Add beginning slash if it doesn't exist
    if (filePath.indexOf('/') !== 0) {
      filePath = '/' + filePath;
    }

    var targetPath = __dirname + filePath,
      methodName = mappings[type].methodName;

    try {
      return fs.statSync(targetPath)[methodName]();
    }
    catch (e) {
      console.info('File Path "' + targetPath + '" is not a ' + type + '.');
      return false;
    }
  }

  /**
   * Checks a path to see if it has a trailing slash.
   * @param {string} path
   * @returns {boolean}
   */
  function hasTrailingSlash(path) {
    if (!path || typeof path !== 'string') {
      return false;
    }

    return path.substr(path.length - 1) === '/';
  }

  /**
   * Filters an array of paths and detects if they actually exist
   * @private
   * @param {Object[]} pathDefs -
   * @param {String} link -
   */
  function filterUnusablePaths(pathDefs, excludes) {
    var truePaths = [];
    if (excludes === undefined) {
      excludes = [];
    }

    pathDefs.forEach(function pathIterator(pathDef) {
      pathDef.link = pathDef.link.replace(/\/\//g, '/');
      //console.log('Checking path: "' + pathDef.link + '"');

      var match = false;
      excludes.forEach(function(exclude) {
        if (pathDef.link.match(exclude)) {
          match = true;
          return;
        }
      });

      if (match) {
        return;
      }

      truePaths.push(pathDef);
    });

    return truePaths;
  }

  /**
   * @private
   * @param {String} text
   */
  function formatPath(text) {
    return text.replace(/-/g, ' ').replace(/\.html/, '');
  }

  /**
   * @private
   * @param {Object} pathDef
   * @param {String} pathDef.link
   * @param {String} pathDef.type
   * @param {String} pathDef.labelColor
   */
  function pathMapper(pathDef) {
    var href = pathDef.link.replace(/\\/g, '/').replace(/\/\//g, '/'),
      icon;

    if (href.indexOf(BASE_PATH) !== 0) {
      href = BASE_PATH + href;
    }

    if (is('directory', href.replace(BASE_PATH, ''))) {
      icon = '#icon-folder';

      if (href.charAt(href.length - 1) !== '/') {
        href = href + '/';
      }
    }

    var mappedPath = {
      href: href,
      text: formatPath(pathDef.link)
    };

    if (pathDef.text) {
      mappedPath.text = pathDef.text;
    }

    if (icon) {
      mappedPath.icon = icon;
    }

    if (pathDef.type && pathDef.type.length) {
      mappedPath.pageType = pathDef.type;
      mappedPath.labelColor = pathDef.labelColor || 'graphite07';
    }

    return mappedPath;
  }

  /**
   * Excluded file names that should never appear in the DemoApp List Pages
   */
  const GENERAL_LISTING_EXCLUDES = [
    /^(layout)(\s)?(\.html)?/gm, // matches any filename that begins with "layout" (fx: "layout***.html")
    /footer\.html/,
    /_header\.html/,
    /_layout\.html/,
    /(api.md$)/,
    /layout/,
    /partial/,
    /\.DS_Store/
  ];


  /**
   * @private
   * @param {String} type
   */
  function getFolderContents(type, dir) { //type, dir, folderName
    var paths = [];
    try {
      paths = fs.readdirSync(dir);
    } catch(e) {
      // Handle 'No Directory' errors
      if (e.code === 'ENOENT') {
        //console.log('No '+ folderName +' Folder found for "' + type + '');
        paths = [];
      } else {
        throw e;
      }
    }
    return paths;
  }

  /**
   * Returns a listing of both "examples" and "tests" for a particular type of component.
   * @param {String} type - the component/layout/pattern type
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @param {Array} [extraExcludes]
   * @returns {?}
   */
  function getFullListing(type, req, res, next, extraExcludes) {
    var allPaths = [],
      componentPaths,
      testPaths;

    if (!extraExcludes) {
      extraExcludes = [];
    }

    // Add Component-specific file name filters
    extraExcludes = extraExcludes.concat([
      new RegExp(type + '\\.html'),
      new RegExp('(\d|\w|\s|-)*?\.(scss)'),
      new RegExp(type + '\\.js'),
      new RegExp(type + '\\.md')
    ]);

    function componentTextFormatter(path) {
      path = path.replace('test-', '').replace('example-', '');
      return formatPath(path);
    }

    // Search the "/components/<type>" folder for all tests/examples located here
    componentPaths = getFolderContents(type, 'components/' + type + '/', 'Components');
    componentPaths.forEach(function(path, i) {
      var isTest = path.substr(0, 5) === 'test-';

      componentPaths[i] = {
        text: componentTextFormatter(path),
        link: 'components/' + type + '/' + path,
        type: isTest ? 'test' : 'example',
        labelColor: isTest ? 'azure07' : 'ruby07'
      };
    });
    componentPaths = filterUnusablePaths(componentPaths, GENERAL_LISTING_EXCLUDES.concat(extraExcludes).concat([
      /[^-.]index\.html/,
    ]));

    // TODO: Handle the test paths the same way as before.
    // Search the legacy "tests" folder for any relevant tests
    testPaths = getFolderContents(type, 'views/tests/' + type + '/', 'Tests');
    testPaths.forEach(function(path, i) {
      testPaths[i] = {
        text: formatPath(path),
        link: 'tests/' + type + '/' + path,
        type: 'test',
        labelColor: 'amber07'
      };
    });
    testPaths = filterUnusablePaths(testPaths, GENERAL_LISTING_EXCLUDES.concat(extraExcludes));

    // Combine the arrays and filter out the junk
    allPaths = allPaths.concat(componentPaths).concat(testPaths);

    var opts = extend({}, res.opts, {
      subtitle: 'All Examples & Tests for ' + type,
      paths: allPaths.map(pathMapper)
    });

    res.render('listing', opts);
    next();
  }

  /**
   * Returns a directory listing as page content with working links
   * @param {String} directory
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @param {Array} [extraExcludes] - List of files names to exclude
   */
  function getDirectoryListing(directory, req, res, next, extraExcludes) {
    if (!extraExcludes) {
      extraExcludes = [];
    }

    fs.readdir('./views/' + directory, function(err, paths) {
      if (err) {
        //console.log(err);
        res.render(err);
        return next();
      }

      // Strip out paths that aren't going to ever work
      paths.forEach(function pathIterator(path, i) {
        paths[i] = {
          text: path,
          link: '/' + directory + '/' + path
        };
      });

      paths = filterUnusablePaths(paths, GENERAL_LISTING_EXCLUDES.concat(extraExcludes));

      var opts = extend({}, res.opts, {
        subtitle: 'Listing for ' + directory,
        paths: paths.map(pathMapper)
      });

      res.render('listing', opts);
      next();
    });
  }

  // ======================================
  //  Main Routing and Param Handling
  // ======================================

  router.get('/', function(req, res, next) {
    var opts = res.opts;
    opts.basepath = fullBasePath(req);
    res.redirect(BASE_PATH + 'kitchen-sink');
    next();
  });

  router.get('/kitchen-sink', function(req, res, next) {
    var opts = res.opts;
    opts.basepath = fullBasePath(req);
    res.render('kitchen-sink', res.opts);
    next();
  });

  // ======================================
  //  Controls Section -> Now just in as a redirect
  // ======================================

  var controlOpts = {
    'layout': 'controls/layout',
    'subtitle': 'Style',
  };

  function defaultControlsRoute(req, res, next) {
    var opts = extend({}, res.opts, controlOpts);
    opts.subtitle = 'Full Index';

    res.render('components/index', opts);
    next();
  }

  router.get('/controls/:control', function(req, res, next) {
    var controlName = '',
      opts = extend({}, res.opts, controlOpts);

    if (!req.params.control) {
      return defaultControlsRoute(req, res, next);
    }

    controlName = stripHtml(req.params.control);
    opts.subtitle = toTitleCase(controlName.charAt(0).toUpperCase() + controlName.slice(1).replace('-',' '));

    // Specific Changes for certain controls
    opts.subtitle = opts.subtitle.replace('Contextualactionpanel', 'Contextual Action Panel');
    if (controlName.indexOf('masthead') !== -1) {
      opts.layout = 'controls/masthead-layout';
    }

    if (res.opts.nofrillslayout) {
      opts.layout = 'tests/layout-noheader';
    }

    // Handle Redirects to new Structure
    if (!fs.existsSync('views/controls/' + controlName + '.html')) {
      if (controlName === 'buttons') {
        controlName = 'button';
      }
      res.redirect(BASE_PATH + 'components/' + controlName + '/example-index');
    }

    res.render('controls/' + controlName, opts);
    next();
  });

  router.get('/controls/', defaultControlsRoute);
  router.get('/controls', defaultControlsRoute);


  // ======================================
  //  Components Section
  // ======================================

  var componentOpts = {
    'layout': 'layout',
    'subtitle': 'Style',
  };

  /**
   * Detects the existence of a layout file inside of a subfolder that should be used
   * instead of the default layout file in the root.
   * @param {Object} opts - Express's res.opts
   * @param {string} component - the name of the component
   * @returns {Object}
   */
  function addDefaultFolderLayout(opts, component) {
    let layoutFileNames = ['_layout.html', 'layout.html'],
      layoutPath;

    for (var i = 0; i < layoutFileNames.length; i++) {
      layoutPath = 'components/' + component + '/' + layoutFileNames[i];
      if (fs.existsSync(layoutPath)) {
        opts.layout = stripHtml('' + component + '/' + layoutFileNames[i]);
        console.log('layout for this folder changed to "' + opts.layout + '".');
      }
    }

    return opts;
  }

  function defaultDocsRoute(req, res, next) {
    var opts = extend({}, res.opts, componentOpts);
    opts.layout = 'doc-layout';
    opts.basepath = fullBasePath(req);

    res.render('index', opts);
    next();
  }

  //Docs Routers
  function docsStyleGuideRoute(req, res, next) {
    var opts = extend({}, res.opts, componentOpts);
    opts.subtitle = 'Doc Style Guide';
    opts.layout = 'doc-layout';
    opts.basepath = fullBasePath(req);

    res.render('doc-styleguide', opts);
    next();
  }

  function docsRoute(req, res, next) {
    var opts = extend({}, res.opts, componentOpts);
    opts.subtitle = 'Documentation';
    opts.layout = 'doc-layout';
    opts.basepath = fullBasePath(req);

    var componentName = stripHtml(req.params.component);
    opts.subtitle = toTitleCase(componentName.charAt(0).toUpperCase() + componentName.slice(1).replace('-',' '));

    res.render(componentName + '/doc', opts);
    next();
  }

  /**
   * Handles routing to the Components/Docs section.
   */
  function componentRoute(req, res, next) {
    var componentName = '',
      exampleName = '',
      opts = extend({}, res.opts, componentOpts);

    opts.basepath = fullBasePath(req);

    if (!req.params.component) {
      return defaultDocsRoute(req, res, next);
    }

    componentName = stripHtml(req.params.component);
    opts.subtitle = toTitleCase(componentName.charAt(0).toUpperCase() + componentName.slice(1).replace('-',' '));

    // If no example, end on the main component docs page.
    if (!req.params.example) {
      opts.showbacklink = true;
      opts.layout = 'doc-layout';

      if (req.params.component === 'doc-styleguide') {
        return docsStyleGuideRoute(req, res, next);
      }

      res.render(componentName, opts);
      next();
    }

    exampleName = req.params.example;

    if (req.params.example !== undefined && exampleName.substr(0, 7) === 'partial') {
      opts.layout = '';
    }

    if (exampleName && exampleName.substr() === 'doc' || exampleName === 'docs') {
      return docsRoute(req, res, next);
    }

    // Some specific text content will change the route
    if (exampleName === 'doc' || exampleName === 'docs') {
      return docsRoute(req, res, next);
    }
    if (exampleName === 'list') {
      return getFullListing(componentName, req, res, next);
    }

    // Double check this folder for an alternative layout file.
    opts = addDefaultFolderLayout(opts, componentName);

    if (componentName === 'applicationmenu' && (exampleName.indexOf('example-') > -1 || exampleName.indexOf('test-') > -1)) {
      opts.layout = null;
    }

    if (componentName === 'header') {
      if (exampleName.indexOf('test-header-gauntlet') > -1) {
        opts.layout = 'header/layout-header-gauntlet';
      }
    }

    if (req.params.example !== undefined) {
      res.render('' + componentName + '/' +  req.params.example, opts);
    }
    next();
  }

  function reDirectSlashRoute(req, res, next) {
    if (req.url.substr(-1) === '/' && req.url.length > 1) {
       res.redirect(301, req.url.slice(0, -1));
       next();
    }
  }

  router.get('/components/:component', componentRoute);
  router.get('/components/:component/', reDirectSlashRoute);
  router.get('/components/:component/:example', componentRoute);
  router.get('/components/:component/:example/', reDirectSlashRoute);
  router.get('/components/', defaultDocsRoute);
  router.get('/components', defaultDocsRoute);

  // ======================================
  //  Patterns Section
  // ======================================

  router.get('/patterns*', function(req, res, next) {
    var opts = extend({}, res.opts, {
      layout: 'patterns/layout',
      subtitle: 'Patterns'
    }),
      end = req.url.replace(/\/patterns(\/)?/g, '');

    // Don't capture any query params for the View Render
    end = end.replace(/\?(.*)/, '');

    if (!end || !end.length || end === '/') {
      var exclude = [
        'step-process.html',
        'step-process-markup.html'
      ];
      getDirectoryListing('patterns/', req, res, next, exclude);
      return;
    }

    res.render('patterns/' + end, opts);
    next();
  });

  // =========================================
  // Test Pages
  // =========================================

  var testOpts = {
    subtitle: 'Tests',
    layout: 'tests/layout'
  };

  function testsRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, testOpts),
      end = req.url.replace(/\/tests(\/)?/, '');

    // remove query params for our checking
    end = end.replace(/\?(.*)/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('tests/', req, res, next);
      return;
    }

    var directory = 'tests/' + end;
    if (hasTrailingSlash(directory)) {
      if (is('directory', '/views/' + directory) ) {
        getDirectoryListing(directory, req, res, next);
        return;
      }

      directory = directory.substr(0, directory.length - 1);
    }

    // Custom configurations for some test folders
    if (directory.match(/components\/base-tag/)) {
      opts.usebasehref = true;
    }
    if (directory.match(/tests\/composite-form/)) {
      opts.layout = 'tests/composite-form/_layout';
    }
    if (directory.match(/tests\/call-to-action-header/)) {
      opts.layout = 'tests/call-to-action-header/layout';
    }
    if (directory.match(/tests\/distribution/)) {
      opts.amd = true;
      opts.layout = null; // No layout for this one on purpose.
      opts.subtitle = 'AMD Tests';
    }

    if (directory.match(/tests\/datagrid-fixed-header/)) {
      opts.layout = 'tests/layout-noscroll';
    }
    if (directory.match(/tests\/masthead/)) {
      opts.layout = 'tests/masthead/layout';
    }
    if (directory.match(/tests\/place\/scrolling\/container-is-body/)) {
      opts.layout = 'tests/place/scrolling/layout-body';
    }
    if (directory.match(/tests\/place\/scrolling\/container-is-nested/)) {
      opts.layout = 'tests/place/scrolling/layout-nested';
    }
    if (directory.match(/tests\/signin/)) {
      opts.layout = 'tests/layout-noheader';
    }
    if (directory.match(/tests\/tabs-module/)) {
      opts.layout = 'tests/tabs-module/layout';
    }
    if (directory.match(/tests\/tabs-header/)) {
      opts.layout = 'tests/tabs-header/layout';
    }
    if (directory.match(/tests\/tabs-vertical/)) {
      opts.layout = 'tests/tabs-vertical/layout';
    }

    // Global 'no-header' layout setting takes precedent
    if (res.opts.nofrillslayout || directory.match(/tests\/patterns/)) {
      opts.layout = 'tests/layout-noheader';
    }

    // No trailing slash.  Check for an index file.  If no index file, do directory listing
    if (is('directory', '/views/' + directory)) {
      if (is('file', '/views/' + directory + '/index')) {
        res.render(directory + '/index', opts);
        return next();
      }

      getDirectoryListing(directory, req, res, next);
      return;
    }

    // Handle Redirects to new Structure
    var component = req.params.component,
      example = req.params.example;

    if (example && component) {
      var path = 'components/' + component + '/example-' + setHtml(example);
      if (fs.existsSync(path)) {
        res.redirect(BASE_PATH + path);
        next();
        return;
      }

      path = 'components/' + component + '/test-' + setHtml(example);
      if (fs.existsSync(path)) {
        res.redirect(BASE_PATH + path);
        next();
        return;
      }
    }

    res.render(directory, opts);
    next();
  }

  //Tests Index Page and controls sub pages
  router.get('/tests/:component/:example', testsRouteHandler);
  router.get('/tests/:component/', testsRouteHandler);
  router.get('/tests/:component', testsRouteHandler);
  router.get('/tests/', testsRouteHandler);
  router.get('/tests', testsRouteHandler);

  // =========================================
  // Layouts Pages
  // =========================================

  var layoutOpts = {
    subtitle: 'Layouts',
    layout: 'layouts/layout'
  };

  function defaultLayoutRouteHandler(req, res, next) {
    var exclude = [
      '_masthead.html',
      'header-only.html',
      'header-scroll.html',
      'header-sticky.html'
    ];

    getDirectoryListing('layouts/', req, res, next, exclude);
    return;
  }

  function layoutRouteHandler(req, res, next) {
    var pageName = '',
      opts = extend({}, res.opts, layoutOpts),
      layout = req.params.layout;

    if (!layout || !layout.length) {
      return defaultLayoutRouteHandler(req, res, next);
    }

    pageName = stripHtml(req.params.layout);
    opts.subtitle = toTitleCase(pageName.charAt(0).toUpperCase() +pageName.slice(1).replace('-',' '));
    res.render('layouts/' + layout, opts);
    next();
  }

  router.get('/layouts/:layout', layoutRouteHandler);
  router.get('/layouts/', defaultLayoutRouteHandler);
  router.get('/layouts', defaultLayoutRouteHandler);

  // =========================================
  // Examples Pages
  // =========================================

  var exampleOpts = {
    subtitle: 'Examples',
    layout: 'examples/layout'
  };

  function exampleRouteHandler(req, res, next) {
    var opts = extend({}, res.opts, exampleOpts),
      folder = req.params.folder,
      example = req.params.example,
      path = req.url;

    // A missing category means both no category and no test page.  Simply show the directory listing.
    if (!folder || !folder.length) {
      getDirectoryListing('examples/', req, res, next);
      return;
    }

    // A missing testpage with a category defined will either:
    // - Show a directory listing if there is no test page associated with the current path
    // - Show a test page
    if (!example || !example.length) {
      if (hasTrailingSlash(path)) {

        if (is('directory', 'examples/' + folder + '/')) {
          getDirectoryListing('examples/' + folder + '/', req, res, next);
          return;
        }

      }

      res.render('examples/' + folder, opts);
      next();
      return;
    }

    // if testpage and category are both defined, should be able to show a valid testpage
    res.render('examples/' + folder + '/' + example, opts);
    next();
  }

  router.get('/examples/:folder/:example', exampleRouteHandler);
  router.get('/examples/:folder/', exampleRouteHandler);
  router.get('/examples/:folder', exampleRouteHandler);
  router.get('/examples/', exampleRouteHandler);
  router.get('/examples', exampleRouteHandler);

  // =========================================
  // Collection of Performance Tests Pages
  // =========================================

  router.get('/performance-tests', function(req, res, next) {

    var performanceOpts = { subtitle: 'Performance Tests' },
      opts = extend({}, res.opts, performanceOpts);

    res.render('performance-tests/index', opts);
    next();
  });

  // =========================================
  // Angular Support Test Pages
  // =========================================

  var angularOpts = {
    subtitle: 'Angular',
    layout: 'angular/layout'
  };

  router.get('/angular*', function(req, res, next) {
    var opts = extend({}, res.opts, angularOpts),
      end = req.url.replace(/\/angular(\/)?/, '');

    if (!end || !end.length || end === '/') {
      getDirectoryListing('angular/', req, res, next);
      return;
    }

    res.render('angular/' + end, opts);
    next();
  });

  // =========================================
  // Fake 'API' Calls for use with AJAX-ready Controls
  // =========================================

  //Sample Json call that returns States
  //Example Call: http://localhost:4000/api/states?term=al
  router.get('/api/states', function(req, res, next) {
    var states = [],
      allStates = getJSONFile(path.resolve('demoapp', 'data', 'states.json'));

    function done() {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(states));
      next();
    }

    if (!req || !req.query || !req.query.term) {
      states = allStates;
      return done();
    }

    for (var i = 0; i < allStates.length; i++) {
      if (allStates[i].label.toLowerCase().indexOf(req.query.term.toLowerCase()) > -1) {
        states.push(allStates[i]);
      }
    }

    done();
  });

  // Sample People
  router.get('/api/people', function(req, res, next) {
    var people = getJSONFile(path.resolve('demoapp', 'data', 'people.json'));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(people));
    next();
  });

  // Sample Product
  router.get('/api/product', function(req, res, next) {
    var products = getJSONFile(path.resolve('demoapp', 'data', 'products.json'));

    if (req.query.limit) {
      products = products.slice(0,req.query.limit);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(products));
    next();
  });

  // Sample Supplies
  router.get('/api/supplies', function(req, res, next) {
    var supplies = getJSONFile(path.resolve('demoapp', 'data', 'supplies.json'));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(supplies));
    next();
  });

  // Sample Towns
  router.get('/api/towns', function(req, res, next) {
    var towns = getJSONFile(path.resolve('demoapp', 'data', 'towns.json'));

    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(towns));
    next();
  });

  // Sample Tasks
  router.get('/api/tasks', function(req, res, next) {
    var tasks = getJSONFile(path.resolve('demoapp', 'data', 'tasks.json'));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Sample Periods
  router.get('/api/periods', function(req, res, next) {
    var tasks = [{ id: 1, city: 'London', location: 'Corporate FY15', alert: true, alertClass: 'error', daysLeft: '3', hoursLeft: '23'},
     { id: 1, city: 'New York', location: 'Corporate FY15', alert: true, alertClass: 'alert', daysLeft: '25', hoursLeft: '11'},
     { id: 1, city: 'Vancouver', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '30', hoursLeft: '23'},
     { id: 1, city: 'Tokyo', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '35', hoursLeft: '13'}
   ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Sample Hierarchical Data
  // Sample Tasks
  router.get('/api/tree-tasks', function(req, res, next) {
    var tasks = [
      { id: 1, escalated: 2, depth: 1, expanded: false, taskName: 'Follow up action with HMM Global', desc: '', comments: null, orderDate: new Date(2014, 12, 8), time: '', children: [
        { id: 2, escalated: 1, depth: 2, taskName: 'Quotes due to expire', desc: 'Update pending quotes and send out again to customers.', comments: 3, orderDate: new Date(2015, 7, 3), time: '7:10 AM'},
        { id: 3, escalated: 0, depth: 2, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2014, 6, 3), time: '9:10 AM'},
        { id: 4, escalated: 0, depth: 2, taskName: 'Follow up action with Acme Trucking', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2015, 3, 4), time: '14:10 PM'},
      ]},
      { id: 5, escalated: 0, depth: 1, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2015, 5, 5), time: '18:10 PM'},
      { id: 6, escalated: 0, depth: 1, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2014, 6, 9), time: '20:10 PM', portable: true},
      { id: 7, escalated: 0, depth: 1, expanded: true, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2014, 6, 8), time: '22:10 PM', portable: true, children: [
        { id: 8, escalated: 0, depth: 2, taskName: 'Follow up action with Universal HMM Logistics', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 5, 2), time: '22:10 PM'},
        { id: 9, escalated: 0, depth: 2, taskName: 'Follow up action with Acme Shipping', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 6, 9), time: '22:10 PM'},
        { id: 10, escalated: 0, depth: 2, expanded: true, taskName: 'Follow up action with Residental Shipping Logistics ', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 2, 8), time: '7:04 AM', children: [
          { id: 11, escalated: 0, depth: 3, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2015, 10, 18), time: '14:10 PM', portable: true},
          { id: 12, escalated: 0, depth: 3, expanded: true,  taskName: 'Follow up action with Acme Universal Logistics Customers', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 3, 22), time: '7:04 AM', children: [
            { id: 13, escalated: 0, depth: 4, taskName: 'More Contact', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2015, 3, 8), time: '14:10 PM'},
            { id: 14, escalated: 0, depth: 4, taskName: 'More Follow up', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 3, 9), time: '7:04 AM'},
          ]},
        ]}
      ]},
      { id: 15, escalated: 0, depth: 1, expanded: true, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, orderDate: new Date(2015, 5, 23), time: '22:10 PM', children: [
        { id: 16, escalated: 0, depth: 2, taskName: 'Follow up action with Universal HMM Logistics', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 12, 18), time: '22:10 PM'},
        { id: 17, escalated: 0, depth: 2, taskName: 'Follow up action with Acme Shipping', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 4, 5), time: '22:10 PM', portable: true},
        { id: 18, escalated: 0, depth: 2, expanded: true, taskName: 'Follow up action with Residental Shipping Logistics ', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2015, 5, 5), time: '7:04 AM', children: [
          { id: 19, escalated: 0, depth: 3, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 5, 16), time: '14:10 PM'},
          { id: 20, escalated: 0, depth: 3, expanded: true,  taskName: 'Follow up action with Acme Universal Logistics Customers', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2015, 5, 28), time: '7:04 AM', portable: true, children: [
            { id: 21, escalated: 0, depth: 4, taskName: 'More Contact', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 1, 21), time: '14:10 PM'},
            { id: 22, escalated: 0, depth: 4, taskName: 'More Follow up', desc: 'Contact sales representative.', comments: 2, orderDate: new Date(2014, 9, 3), time: '7:04 AM'},
          ]},
        ]}
      ]}

    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
    next();
  });

  //Ajax Accordion Contents
  router.get('/api/nav-items', function(req, res, next) {
    res.render('tests/accordion/_ajax-results.html');
    next();
  });

  router.get('/api/fruits', function(req, res, next) {
    var resData,
      fruits = {
        main: ''+
          '<div class="accordion-header">'+
            '<a href="#"><span>Apples</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#" data-category-id="grapes"><span>Grapes</span></a>'+
          '</div>'+
          '<div class="accordion-pane"></div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Oranges</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#" data-category-id="Kiwi"><span>Kiwi</span></a>'+
          '</div>'+
          '<div class="accordion-pane"></div>',

        grapes: ''+
          '<div class="accordion-header">'+
            '<a href="#"><span>Concord</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>John Viola</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Merlot</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Cabernet</span></a>'+
          '</div>',

        Kiwi: ''+
          '<div class="accordion-header">'+
            '<a href="#"><span>Berries</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Blueberries</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Strawberries</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Blackberries</span></a>'+
          '</div>'+
          '<div class="accordion-header">'+
            '<a href="#"><span>Raspberries</span></a>'+
          '</div>'
      };

    resData = req.query.categoryId ? fruits[req.query.categoryId] : fruits.main;
    if (!resData) {
      resData = ''+
        '<div class="accordion-content" style="color: red;">'+
          '<p>Error: Couldn\'t find any fruits...</p>'+
        '</div>';
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resData));
    next();
  });

  // TODO: Make this work with XSS to return a copy of the SoHo Site Search Results for testing the Modal Search plugin.
  // Calls out to Craft CMS's search results page.
  // NOTE: Doesn't actually get rendered, just passed along.
  router.post('/api/site-search', function(req, res) {
    var opts = {
      host: 'usmvvwdev53',
      port: '80',
      path: '/search/results', // ?q=[SEARCH TERM GOES HERE]
      method: 'POST',
      headers: req.headers
    },
    creq = http.request(opts, function(cres) {
      // set encoding
      cres.setEncoding('utf8');

      // wait
      cres.on('data', function(chunk){
        res.write(chunk);
      });

      cres.on('close', function(){
        // closed, let's end client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

      cres.on('end', function(){
        // finished, let's finish client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

    }).on('error', function() {
      // we got an error, return 500 error to client and log error
      res.writeHead(500);
      res.end();
    });

    creq.end();
  });

  //Data Grid Paging Example
  // Example Call: http://localhost:4000/api/compressors?pageNum=1&sort=productId&pageSize=100
  router.get('/api/compressors', function(req, res, next) {

    var products = [], productsAll = [], term,
      start = (req.query.pageNum -1) * req.query.pageSize,
      end = req.query.pageNum * req.query.pageSize,
      total = 1000, i = 0, j = 0, filteredTotal = 0, seed = 1,
      statuses = ['OK', 'On Hold', 'Inactive', 'Active', 'Late' ,'Complete'];

    //TODO: if (req.query.filter) {
    for (j = 0; j < total; j++) {
      var filteredOut = false;

      //Just filter first four cols
      if (req.query.filter) {
        term = req.query.filter.replace('\'','');
        filteredOut = true;

        if ((214220+j).toString().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ('Compressor'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
         }

        if ('Assemble Paint'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ((1+(j/2)).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
      }

      //Filter Row simulation
      if (req.query.filterValue) {
        term = req.query.filterValue.replace('\'','').toLowerCase();
        filteredOut = true;

        if (req.query.filterColumn ==='productId' && req.query.filterOp === 'contains' && (214220+j).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn ==='productId' && req.query.filterOp === 'equals' && (214220+j).toString() === term) {
          filteredOut = false;
        }

        if (req.query.filterColumn ==='productName' && req.query.filterOp === 'contains' && 'compressor'.toString().indexOf(term) > -1) {
          filteredOut = false;
        }

        if (req.query.filterColumn ==='activity' && req.query.filterOp === 'contains' && 'assemble paint'.toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn ==='activity' && req.query.filterOp === 'equals' && 'assemble paint'.toString() === -1) {
          filteredOut = false;
        }

        if (req.query.filterColumn ==='quantity' && req.query.filterOp === 'contains' && (1+(j/2)).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn ==='quantity' && req.query.filterOp === 'equals' && (1+(j/2)).toString() === term) {
          filteredOut = false;
        }
      }

      var status = Math.floor(statuses.length / (start + seed)) + 1;

      if (!filteredOut) {
        filteredTotal++;
        productsAll.push({ id: j, productId: 214220+j, productName: 'Compressor ' + j, activity:  'Assemble Paint', quantity: 1+(j/2), price: 210.99-j, status: statuses[status], orderDate: new Date(2014, 12, seed), action: 'Action'});
      }

      seed ++;
    }

    var sortBy = function(field, reverse, primer){
       var key = function (x) {return primer ? primer(x[field]) : x[field];};

       return function (a,b) {
        var A = key(a), B = key(b);
        return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
       };
    };

    if (req.query.sortId) {
      productsAll.sort(sortBy(req.query.sortId, (req.query.sortAsc ==='true' ? true : false), function(a){return a.toString().toUpperCase();}));
    }

    for (i = start; i < end && i < total; i++) {
      if (productsAll[i]) {
        products.push(productsAll[i]);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({total: filteredTotal, data: products}));
    next();
  });

  router.get('/api/lookupInfo', function(req, res, next) {
    var columns = [],
      data = [];

    // Some Sample Data
    data.push({ id: 1, productId: 2142201, productName: 'Compressor', activity:  'Assemble Paint', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'});
    data.push({ id: 2, productId: 2241202, productName: 'Different Compressor', activity:  'Inspect and Repair', quantity: 2, price: 210.99, status: '', orderDate: new Date(2015, 7, 3), action: 'On Hold'});
    data.push({ id: 3, productId: 2342203, productName: 'Compressor', activity:  'Inspect and Repair', quantity: 1, price: 120.99, status: null, orderDate: new Date(2014, 6, 3), action: 'Action'});
    data.push({ id: 4, productId: 2445204, productName: 'Another Compressor', activity:  'Assemble Paint', quantity: 3, price: 210.99, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'Action'});
    data.push({ id: 5, productId: 2542205, productName: 'I Love Compressors', activity:  'Inspect and Repair', quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'On Hold'});
    data.push({ id: 5, productId: 2642205, productName: 'Air Compressors', activity:  'Inspect and Repair', quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});
    data.push({ id: 6, productId: 2642206, productName: 'Some Compressor', activity:  'inspect and Repair', quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});

    //Define Columns for the Grid.
    columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: 'SelectionCheckbox', align: 'center'});
    columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: 140, formatter: 'Readonly'});
    columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: 250, formatter: 'Hyperlink'});
    columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity', width: 125});
    columns.push({ id: 'quantity', name: 'Quantity', field: 'quantity', width: 125});
    columns.push({ id: 'price', name: 'Price', field: 'price', width: 125, formatter: 'Decimal'});
    columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: 'Date', dateFormat: 'M/d/yyyy'});

    var lookupInfo = [{ columns: columns, dataset: data}];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(lookupInfo));
    next();
  });

  // Used for Builder Pattern Example
  router.get('/api/construction-orders', function(req, res, next) {
    var companies = [
      { id: 1, orderId: '4231212-3', items: 0, companyName: 'John Smith Construction', total: '$0.00' },
      { id: 2, orderId: '1092212-3', items: 4, companyName: 'Top Grade Construction', total: '$10,000.00' },
      { id: 3, orderId: '6721212-3', items: 0, companyName: 'Riverhead Building Supply', total: '$0.00' },
      { id: 4, orderId: '6731212-3', items: 37, companyName: 'united Starwars Construction', total: '$22,509.99' },
      { id: 5, orderId: '5343890-3', items: 8, companyName: 'united Construction', total: '$1,550.00' },
      { id: 6, orderId: '4989943-3', items: 156, companyName: 'Top Grade-A Construction', total: '$800.00' },
      { id: 7, orderId: '8972384-3', items: 10, companyName: 'Top Grade Construction', total: '$1,300.00' },
      { id: 8, orderId: '2903866-3', items: 96, companyName: 'Top Grade-A Construction', total: '$1,900.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(companies));
    next();
  });

  router.get('/api/construction-cart-items', function(req, res, next) {
    var cartItems = [
      { id: 1, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 2, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 3, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 4, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 5, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 6, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 7, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 8, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/api/orgstructure', function(req, res, next) {
    var
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/' ,
      orgdata = [{
      id: '1', Name: 'Jonathan Cargill', Position: 'Director', EmploymentType: 'FT', Picture: menPath +'2.jpg',
      children:[
        { id: '1_1', Name: 'Partricia Clark', Position: 'Administration',     EmploymentType: 'FT', Picture: womenPath +'4.jpg', isLeaf:true},
        { id: '1_2', Name: 'Drew Buchanan',   Position: 'Assistant Director', EmploymentType: 'FT', Picture: menPath + '5.jpg', isLeaf:true},
        { id: '1_3', Name: 'Kaylee Edwards',  Position: 'Records Manager',    EmploymentType: 'FT', Picture: womenPath +'11.jpg',
          children:[
            { id: '1_3_1', Name: 'Tony Cleveland',    Position: 'Records Clerk', EmploymentType: 'C',  Picture: menPath + '6.jpg', isLeaf:true},
            { id: '1_3_2', Name: 'Julie Dawes',       Position: 'Records Clerk', EmploymentType: 'PT', Picture: womenPath +'5.jpg', isLeaf:true},
            { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: menPath + '7.jpg', isLeaf:true}
          ]
        },
        { id: '1_4', Name: 'Jason Ayers', Position: 'HR Manager', EmploymentType: 'FT', Picture: menPath + '12.jpg',
          children:[
            { id: '1_4_1', Name: 'William Moore',    Position: 'Benefits Specialist',   EmploymentType: 'FT', Picture: menPath + '8.jpg', isLeaf:true},
            { id: '1_4_2', Name: 'Rachel Smith',     Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: womenPath +'6.jpg', isLeaf:true},
            { id: '1_4_3', Name: 'Jessica Peterson', Position: 'Employment Specialist', EmploymentType: 'FT', Picture: womenPath +'7.jpg', isLeaf:true},
            { id: '1_4_4', Name: 'Sarah Lee',        Position: 'HR Specialist',         EmploymentType: 'FT', Picture: womenPath +'8.jpg', isLeaf:true},
            { id: '1_4_5', Name: 'Jacob Williams',   Position: 'HR Specialist',         EmploymentType: 'FT', Picture: menPath + '9.jpg', isLeaf:true}
          ]
        },
        { id: '1_5', Name: 'Daniel Calhoun',  Position: 'Manager', EmploymentType: 'FT', Picture: menPath + '4.jpg',
          children:[
            { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer',           EmploymentType: 'C',  Picture: menPath + '3.jpg',  isLeaf:true},
            { id: '1_5_2', Name: 'Emily Johnson',  Position: 'Senior Software Engineer',    EmploymentType: 'FT', Picture: womenPath +'9.jpg',  isLeaf:true},
            { id: '1_5_3', Name: 'Kari Anderson',  Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: womenPath +'10.jpg', isLeaf:true},
            { id: '1_5_4', Name: 'Michelle Bell',  Position: 'Software Engineer',           EmploymentType: 'PT', Picture: womenPath +'11.jpg', isLeaf:true},
            { id: '1_5_5', Name: 'Dave Davidson',  Position: 'Software Engineer',           EmploymentType: 'FT', Picture: menPath + '10.jpg', isLeaf:true}
          ]
        },
        { id: '1_6', Name: 'Amber Carter', Position: 'Library Manager', EmploymentType: 'FT', Picture: womenPath +'2.jpg',
          children:[
            { id: '1_6_1', Name: 'Hank Cruise', Position: 'Law Librarian', EmploymentType: 'C',  Picture: menPath + '11.jpg', isLeaf:true},
            { id: '1_6_2', Name: 'Peter Craig', Position: 'Law Librarian', EmploymentType: 'FT', Picture: menPath + '12.jpg', isLeaf:true}
          ]
        },
        { id: '1_7', Name: 'Mary Butler',  Position: 'Workers’ Compensation Manager', EmploymentType: 'FT', Picture: womenPath +'3.jpg',
          children:[
            { id: '1_7_1', Name: 'Katie Olland',  Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: womenPath +'12.jpg', isLeaf:true},
            { id: '1_7_2', Name: 'Tanya Wright',  Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: womenPath +'13.jpg', isLeaf:true},
            { id: '1_7_3', Name: 'OPEN', Position: 'Workers’ Compensation Specialist', EmploymentType: 'O', isLeaf:true}
          ]
        }
      ]
    }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/api/orgstructure-lazy', function(req, res, next) {
    var
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/' ,
      orgdata = [{
        id: '1', Name: 'Jonathan Cargill', Position: 'Director', EmploymentType: 'FT', Picture: menPath +'2.jpg',
        children:[
          { id: '1_3', Name: 'Kaylee Edwards',  Position: 'Records Manager',    EmploymentType: 'FT', Picture: womenPath +'11.jpg',
            children:[
              { id: '1_3_1', Name: 'Tony Cleveland',    Position: 'Records Clerk', EmploymentType: 'C',  Picture: menPath + '6.jpg', isLeaf:true},
              { id: '1_3_2', Name: 'Julie Dawes',       Position: 'Records Clerk', EmploymentType: 'PT', Picture: womenPath +'5.jpg', isLeaf:true},
              { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: menPath + '7.jpg'}
            ]
          },
          { id: '1_4', Name: 'Jason Ayers', Position: 'HR Manager', EmploymentType: 'FT', Picture: menPath + '12.jpg',
            children:[
              { id: '1_4_1', Name: 'William Moore',    Position: 'Benefits Specialist',   EmploymentType: 'FT', Picture: menPath + '8.jpg', isLeaf:true},
              { id: '1_4_2', Name: 'Rachel Smith',     Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: womenPath +'6.jpg', isLeaf:true},
            ]
          },
          { id: '1_5', Name: 'Daniel Calhoun',  Position: 'Manager', EmploymentType: 'FT', Picture: menPath + '4.jpg',
            children:[
              { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer',           EmploymentType: 'C',  Picture: menPath + '3.jpg',  isLeaf:true},
              { id: '1_5_2', Name: 'Emily Johnson',  Position: 'Senior Software Engineer',    EmploymentType: 'FT', Picture: womenPath +'9.jpg',  isLeaf:true},
              { id: '1_5_3', Name: 'Kari Anderson',  Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: womenPath +'10.jpg', isLeaf:true},
            ]
          }
        ]
      }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/api/orgstructure-children', function(req, res, next) {
    var
      womenPath = 'https://randomuser.me/api/portraits/med/women/' ,
      orgdata = [
        { id: 'AA' + (Math.floor(Math.random() * 1000)), Name: 'Kaylee Edwards',  Position: 'Records Manager',    EmploymentType: 'FT', Picture: womenPath +'11.jpg'},
        { id: 'BB' + (Math.floor(Math.random() * 1000)), Name: 'Emily Johnson',  Position: 'Senior Software Engineer',    EmploymentType: 'FT', Picture: womenPath +'9.jpg',  isLeaf:true},
        { id: 'CC' + (Math.floor(Math.random() * 1000)), Name: 'Kari Anderson',  Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: womenPath +'10.jpg', isLeaf:true}
      ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/api/servicerequests', function(req, res, next) {
    var cartItems = [
      { id: 1, type: 'Data Refresh', favorite: true, datetime: new Date(2014, 12, 8), requestor: 'Grant Lindsey', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 2, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Wilson Shelton', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'},
      { id: 3, type: 'Data Refresh', favorite: true, datetime: new Date(2015, 12, 8), requestor: 'Nicholas Wade', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 4, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lila Huff', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued'},
      { id: 5, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Ann Matthews', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 6, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lucia Nelson', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'},
      { id: 7, type: 'Data Refresh', datetime: new Date(2014, 12, 8), requestor: 'Vera Cunningham', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 8, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Dale Newman', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued'},
      { id: 9, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jessica Cain', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 10, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Jennie Kennedy', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'},
      { id: 11, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jason Adams', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success'}
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/api/garbage', function(req, res, next) {
    var amount = 25,
      paragraphs = 1,
      text = '',
      type = 'text',
      types = ['text', 'html', 'json'],
      garbageWords = ['garbage', 'junk', 'nonsense', 'trash', 'rubbish', 'debris', 'detritus', 'filth', 'waste', 'scrap', 'sewage', 'slop', 'sweepings', 'bits and pieces', 'odds and ends', 'rubble', 'clippings', 'muck', 'stuff'];

    function randomSeed() {
      return (Math.random() * (10 - 1) + 1) > 8;
    }

    function getWord() {
      return garbageWords[Math.floor(Math.random() * garbageWords.length)];
    }

    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.substr(1);
    }

    function done(content) {
      if (type === 'html') {
        res.send(content);
        return next();
      }

      if (type === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(content));
        return next();
      }

      res.setHeader('Content-Type', 'text/plain');
      res.end(JSON.stringify(content));
      next();
    }

    if (req && req.query) {
      if (req.query.size) {
        amount = req.query.size;
      }

      if (req.query.return && types.indexOf(req.query.return) > -1) {
        type = req.query.return;
      }

      if (req.query.paragraphs && !isNaN(req.query.paragraphs)) {
        paragraphs = parseInt(req.query.paragraphs);
      }
    }

    var word = '';

    if (type === 'json') {
      var data = [],
        objCount = 0;

      while (objCount < amount) {
        word = getWord();

        data.push({
          id: objCount,
          label: '' + capitalize(word),
          value: '' + objCount + '-' + word.split(' ').join('-'),
          selected: false
        });
        objCount = objCount + 1;
      }

      return done(data);
    }

    // Get a random word from the GarbageWords array
    var paragraph = '';

    while (paragraphs > 0) {
      if (type === 'html') {
        paragraph += '<p>';
      }

      if (type === 'text' && text.length > 0) {
        paragraph += ' ';
      }

      // if we serve html and the random seed is true, send a picture of garbage.
      if (type === 'html' && randomSeed()) {
        paragraph += '<img src="http://www.newmarket.ca/LivingHere/PublishingImages/Pages/Waste,%20Recycling%20and%20Organics/Garbage-collection-information/Open%20Top%20Garbage%20Can%20with%20Handles.jpg" alt="Picture of Garbage" width="499.5" height="375" />';
      } else {
      // in all other cases, generate the amount of words defined by the query for this paragraph.
        for (var i = 0; i < amount; i++) {
          word = getWord();

          if (!paragraph.length) {
            word = capitalize(word);
          } else {
            paragraph += ' ';
          }
          paragraph += word;
        }
      }

      paragraph += '.';

      if (type === 'html') {
        paragraph += '</p>';
      }

      // Add to text, reset
      text += paragraph;
      paragraph = '';

      paragraphs = (paragraphs - 1);
    }

    done(text);
  });

  function sendJSONFile(filename, req, res, next) {
    var data = getJSONFile(path.resolve('demoapp', 'data', filename + '.json'));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    next();
  }

  router.get('/api/year2014', function(req, res, next) {
    sendJSONFile('year2014', req, res, next);
  });

  router.get('/api/my-projects', function(req, res, next) {
    sendJSONFile('projects', req, res, next);
  });

  router.get('/api/accounts-sm', function(req, res, next) {
    sendJSONFile('accounts-sm', req, res, next);
  });

  router.get('/api/accounts', function(req, res, next) {
    sendJSONFile('accounts', req, res, next);
  });

  router.get('/api/assets', function(req, res, next) {
    sendJSONFile('assets', req, res, next);
  });

  router.get('/api/autocomplete/turkish', function(req, res, next) {
    sendJSONFile('autocomplete-turkish', req, res, next);
  });

  router.get('/api/bikes', function(req, res, next) {
    sendJSONFile('bikes', req, res, next);
  });

  router.get('/api/companies', function(req, res, next) {
    sendJSONFile('companies', req, res, next);
  });

  router.get('/api/construction', function(req, res, next) {
    sendJSONFile('construction', req, res, next);
  });

  router.get('/api/deployments', function(req, res, next) {
    sendJSONFile('deployments', req, res, next);
  });

  router.get('/api/dummy-dropdown-data', function(req, res, next) {
    var data = require(path.resolve('demoapp', 'js', 'getJunkDropdownData'));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    next();
  });

  router.get('/api/fires', function(req, res, next) {
    sendJSONFile('fires', req, res, next);
  });

  router.get('/api/incidents', function(req, res, next) {
    sendJSONFile('incidents', req, res, next);
  });

  router.get('/api/inventory-tasks', function(req, res, next) {
    sendJSONFile('inventory-tasks', req, res, next);
  });

  router.get('/api/jobs', function(req, res, next) {
    sendJSONFile('jobs', req, res, next);
  });

  router.get('/api/general/status-codes', function(req, res, next) {
    sendJSONFile('status-codes', req, res, next);
  });

module.exports = app;
