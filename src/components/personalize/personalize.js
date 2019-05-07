import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { theme } from '../theme/theme';

// Component name as referenced by jQuery/event namespace/etc
const COMPONENT_NAME = 'personalize';

// Component Defaults
const PERSONALIZE_DEFAULTS = {
  colors: '',
  theme: '',
  font: '',
  blockUI: true
};

/**
 * The personalization routines for setting custom company colors.
 *
 * @class Personalize
 * @param {HTMLElement|jQuery[]} element The base element
 * @param {object} [settings] Incoming settings
 * @param {string} [settings.colors]  The list of colors
 * @param {string} [settings.theme='light'] The theme name (light, dark or high-contrast)
 * @param {string} [settings.font='Helvetica'] Use the newer source sans font
 * @param {boolean} [settings.blockUI=true] Cover the UI and animate when changing theme.
*/
function Personalize(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, PERSONALIZE_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Personalize.prototype = {

  /**
   * Runs on each initialization
   * @private
   * @returns {this} component instance
   */
  init() {
    // Set the default theme, or grab the theme from an external CSS stylesheet.
    const cssTheme = this.getThemeFromStylesheet();
    this.currentTheme = this.settings.theme || cssTheme;
    this.setTheme(this.currentTheme);

    if (this.settings.colors) {
      this.setColors(this.settings.colors);
    }

    if (this.settings.font) {
      $('html').addClass(`font-${this.settings.font}`);
    }

    this.handleEvents();

    return this;
  },

  /**
   * Sets up event handlers for this control and its sub-elements
   * @private
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element
      .off(`updated.${COMPONENT_NAME}`)
      .on(`updated.${COMPONENT_NAME}`, () => {
        self.updated();
      })
      .off(`changecolors.${COMPONENT_NAME}`)
      .on(`changecolors.${COMPONENT_NAME}`, (e, newColor, noAnimate) => {
        self.setColors(newColor, noAnimate);
      })
      .off(`changetheme.${COMPONENT_NAME}`)
      .on(`changetheme.${COMPONENT_NAME}`, (e, thisTheme) => {
        self.setTheme(thisTheme);
      });

    return this;
  },

  /**
   * Validates a string containing a hexadecimal number
   * @private
   * @param {string} hex A hex color.
   * @returns {string} a validated hexadecimal string.
   */
  validateHex(hex) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');

    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    return `#${hex}`;
  },

  /**
   * Create new CSS rules in head and override any existing
   * @private
   * @param {object} cssRules The rules to append.
   */
  appendStyleSheet(cssRules) {
    let sheet = document.getElementById('soho-personalization');
    if (sheet) {
      sheet.parentNode.removeChild(sheet);
    }

    // Create the <style> tag
    sheet = document.createElement('style');
    sheet.setAttribute('id', 'soho-personalization');
    sheet.appendChild(document.createTextNode(cssRules));

    // Add the <style> element to the page
    document.head.appendChild(sheet);
  },

  /**
   * Generate a style sheet to append in the page.
   * @private
   * @param {array} colors The rules to append.
   * @returns {string} The string of css to append.
   */
  getColorStyleSheet(colors) {
    if (!colors) {
      colors = {};
    }

    // Use an incoming `colors` param defined as a string, as the desired
    // "header" color (backwards compatibility)
    if (typeof colors === 'string') {
      colors = {
        header: colors
      };
    }

    if (!colors || colors === '') {
      return this;
    }

    // Default Colors...
    // (Color)07 for the main color (fx headers)
    // (Color)06 for the secondary color (fx sub-headers)
    // Light or Dark (fff or 000) for the contrast color

    // (Color)06 for the vertical borders between module tabs - 133C59
    // (Color)07 for the page header and active module tab - 2578A9 DEFAULT
    // (Color)08 for the inactive module tab - 1d5f8a
    // (Color)09 for the horizontal border - 134D71
    // (Color)10 for the hover state on module tab - 133C59
    const defaultColors = {
      header: '2578A9',
      subheader: '1d5f8a',
      text: 'ffffff',
      verticalBorder: '133C59',
      horizontalBorder: '134D71',
      inactive: '1d5f8a',
      hover: '133C59',
      btnColorHeader: '368AC0',
      btnColorSubheader: '54a1d3'
    };

    // If an event sends a blank string through instead of a hex,
    // reset any color values back to the theme defaults.  Otherwise, get a valid hex value.
    colors.header = this.validateHex(colors.header || defaultColors.header);
    colors.text = this.validateHex(colors.text || defaultColors.text);
    colors.subheader = this.validateHex(colors.subheader ||
      this.getLuminousColorShade(colors.header, 0.2));
    colors.button = this.validateHex(colors.button ||
      this.getLuminousColorShade(colors.text, -0.80));
    colors.inactive = this.validateHex(colors.inactive ||
      this.getLuminousColorShade(colors.header, -0.22));
    colors.verticalBorder = this.validateHex(colors.verticalBorder ||
      this.getLuminousColorShade(colors.header, 0.1));
    colors.horizontalBorder = this.validateHex(colors.horizontalBorder ||
      this.getLuminousColorShade(colors.header, -0.4));
    colors.hover = this.validateHex(colors.hover ||
      this.getLuminousColorShade(colors.header, -0.5));
    colors.btnColorHeader = this.validateHex(colors.btnColorHeader ||
      this.getLuminousColorShade(colors.subheader, -0.025));
    colors.btnColorSubheader = this.validateHex(colors.btnColorSubheader ||
      this.getLuminousColorShade(colors.header, -0.025));

    // note that the sheet is appended in backwards
    let cssRules = `.tab-container.module-tabs.is-personalizable { border-top: 1px solid ${colors.horizontalBorder} !important; border-bottom: 1px solid ${colors.horizontalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab:not(:first-child) { border-left: 1px solid ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable { background-color: ${colors.inactive} !important}` +
    ` .module-tabs.is-personalizable .tab.is-selected { background-color: ${colors.header} !important}` +
    ` .accordion.panel .accordion-header.is-selected { background-color: ${colors.subheader} !important; color: ${colors.text} !important}` +
    ` .builder-header.is-personalizable{ background-color: ${colors.subheader}}` +
    ` .header.is-personalizable { background-color: ${colors.header}}` +
    ` .header.is-personalizable .title { color: ${colors.text}}` +
    ` .header.is-personalizable h1 { color: ${colors.text}}` +
    ` .header.is-personalizable button:not(:disabled), .header.is-personalizable button:not(:disabled) .icon, .header.is-personalizable button:not(:disabled) .app-header.icon > span { color: ${colors.text} !important; opacity: .8}` +
    ` .header.is-personalizable .header.is-personalizable button:not(:disabled) .app-header.icon > span { background-color: ${colors.text} !important; opacity: .8}` +
    ` .header.is-personalizable button:not(:disabled):hover, .header.is-personalizable button:not(:disabled):hover .icon, .header.is-personalizable button:not(:disabled):hover .app-header.icon > span, .header.is-personalizable .toolbar [class^='btn']:hover:not([disabled]) { color: ${colors.text} !important; opacity: 1}` +
    ` .header.is-personalizable button:not(:disabled) .app-header.icon > span { background-color: ${colors.text} !important; opacity: 1}` +
    ` .header.is-personalizable .go-button.is-personalizable { background-color: ${colors.btnColorHeader}; border-color:${colors.btnColorHeader};color: ${colors.text}}` +
    ` .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab.is-selected:not(.is-disabled) { color: ${colors.text} !important }` +
    ` .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab { color: ${colors.text} !important; opacity: .8 }` +
    ` .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled) { color: ${colors.text} !important; opacity: 1 }` +
    ` .header.is-personalizable.has-tabs .tab-container.header-tabs > .tab-list-container .tab:hover:not(.is-disabled)::before { background-color: ${colors.text}}` +
    ` .header.is-personalizable.has-tabs .animated-bar { background-color: ${colors.text}}` +
    ` .header.is-personalizable.has-tabs .tab-list-container .tab.is-selected:not(.is-disabled):hover::before { background-color: ${colors.text} !important }` +
    ` .subheader.is-personalizable .go-button.is-personalizable { background-color: ${colors.btnColorSubheader}; border-color:${colors.btnColorSubheader};color: ${colors.text}}` +
    ` .module-tabs.is-personalizable .tab-more { border-left: ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab-more:hover { background-color: ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-open { background-color: ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-selected { background-color: ${colors.header} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield { background-color: ${colors.hover} !important; border-bottom-color: ${colors.hover} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield-category-button { background-color: ${colors.hover} !important; border-bottom-color: ${colors.hover} !important}` +
    ` .subheader.is-personalizable { background-color: ${colors.subheader} !important}` +
    ` .builder .sidebar .header {border-right: 1px solid ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab:hover { background-color: ${colors.hover} !important}` +
    ` .module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar { border-left: ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable [class^="btn"] { background-color: ${colors.inactive} !important; color: ${colors.text} !important}` +
    ` .module-tabs.is-personalizable .tab.is-disabled { background-color: ${colors.inactive} !important; color: ${colors.text} !important}` +
    ` .module-tabs.is-personalizable .tab.is-disabled > svg { fill: ${colors.text} !important}` +
    ` .module-tabs.is-personalizable .add-tab-button { border-left: ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable .add-tab-button:hover { background-color: ${colors.inactive} !important}` +
    ` .module-tabs.is-personalizable .toolbar-searchfield-wrapper > .searchfield { color: ${colors.text} !important}` +
    ` .module-tabs.is-personalizable .toolbar-searchfield-wrapper > svg { fill: ${colors.text} !important}` +
    ` .is-personalizable .tab-container.header-tabs::before { background-image: linear-gradient(to right, ${colors.header}, rgba(37, 120, 169, 0)) }` +
    ` .is-personalizable .tab-container.header-tabs::after { background-image: linear-gradient(to right, rgba(37, 120, 169, 0), ${colors.header}) }` +
    ` .hero-widget.is-personalizable { background-color: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .hero-bottom { background-color: ${colors.header} }` +
    ` .hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before { color: ${colors.verticalBorder} }` +
    ` .hero-widget.is-personalizable .chart-container .arc { stroke: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container .bar { stroke: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container.line-chart .dot { stroke: ${colors.subheader} }` +
    ` .application-menu.is-personalizable { border-right: ${colors.verticalBorder} }` +
    ` .application-menu.is-personalizable .application-menu-header { background-color: ${colors.subheader}; border-bottom-color: ${colors.verticalBorder} }` +
    ` .application-menu.is-personalizable .application-menu-footer { background-color: ${colors.subheader}; border-top-color: ${colors.verticalBorder} }` +
    ` .application-menu.is-personalizable button .icon, .application-menu.is-personalizable button span, .application-menu.is-personalizable .hyperlink { color: ${colors.text}; opacity: 0.8 }` +
    ` .application-menu.is-personalizable button:not(:disabled):hover .icon, .application-menu.is-personalizable button:not(:disabled):hover span, .application-menu.is-personalizable .hyperlink:hover  { color: ${colors.text}; opacity: 1 }` +
    ` .application-menu.is-personalizable .accordion.panel { background-color: ${colors.header} }` +
    ` .application-menu.is-personalizable .name-xl, .application-menu.is-personalizable .name, .application-menu.is-personalizable .accordion-heading { color: ${colors.text} }` +
    ` .application-menu.is-personalizable .accordion.panel .accordion-header { background-color: ${colors.header}; border-bottom-color: transparent; color: ${colors.text}; opacity: .8; }` +
    ` .application-menu.is-personalizable .accordion.panel .accordion-header .icon { color: ${colors.text} !important; }` +
    ` .application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a, .application-menu.is-personalizable .accordion.panel .accordion-header.is-selected:hover > a, .application-menu.is-personalizable .accordion.panel .accordion-header.is-selected > a, .application-menu.is-personalizable .accordion.panel .accordion-header.is-selected .icon { color: ${colors.text} !important; }` +
    ' .application-menu.is-personalizable .accordion.panel .accordion-header:hover { opacity: 1 }' +
    ` .application-menu.is-personalizable .accordion.panel .accordion-header.is-focused:not(.hide-focus) { border-color: ${colors.text}; opacity: 1; box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2); }` +
    ` .accordion.panel.inverse .accordion-pane.is-expanded + .accordion-header:not(.is-focused):not(.is-selected), .accordion.panel.inverse .accordion-pane.is-expanded + .accordion-content { border-color: ${colors.verticalBorder};}` +
    ` .application-menu.is-personalizable button:focus:not(.hide-focus), .application-menu.is-personalizable .hyperlink:focus:not(.hide-focus)::after { border-color: ${colors.text}; opacity: 1; box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2) }` +
    ` .application-menu.is-personalizable .application-menu-switcher-panel { border-top-color: ${colors.horizontalBorder} }` +
    ` .application-menu.is-personalizable .application-menu-switcher-panel .accordion-heading { border-top-color: ${colors.horizontalBorder} }` +
    ` .application-menu.is-personalizable .searchfield-wrapper { background-color: ${colors.header}; border-bottom: 1px solid ${colors.horizontalBorder} }` +
    ` .application-menu.is-personalizable .searchfield-wrapper .searchfield { color: ${colors.text} !important }` +
    ` .application-menu.is-personalizable .accordion-header.has-filtered-children > a, .application-menu.is-personalizable .accordion.panel .accordion-header.has-filtered-children.is-focused { color: ${colors.text} !important }` +
    ` .application-menu.is-personalizable .searchfield-wrapper .searchfield::placeholder { color: ${colors.text}; opacity: .8 }` +
    ` .application-menu.is-personalizable .searchfield-wrapper .icon { color: ${colors.text}; opacity: .8 }` +
    ` .application-menu.is-personalizable .searchfield-wrapper.active .icon { color: ${colors.text}; opacity: 1 }` +
    '';

    // Add reusable classes that can be used on some elements
    cssRules += `.is-personalizable .personalize-header { background-color: ${colors.header} }` +
      `.is-personalizable .personalize-subheader { background-color: ${colors.subheader} }` +
      `.is-personalizable .personalize-text { color: ${colors.text} }` +
      `.is-personalizable .personalize-actionable { color: ${colors.text}; opacity: .8 }` +
      `.is-personalizable .personalize-actionable:hover:not([disabled]) { color: ${colors.text}; opacity: 1 }` +
      `.is-personalizable .personalize-actionable.is-focused:not(.hide-focus), .is-personalizable .personalize-actionable:focus:not(.hide-focus) { border-color: ${colors.text}; box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2); }` +
      `.is-personalizable .personalize-actionable.hyperlink:focus:not(.hide-focus)::after { border-color: ${colors.text}; opacity: 1; box-shadow: 0 0 4px 3px rgba(0, 0, 0, 0.2); }` +
      `.is-personalizable .personalize-vertical-border { border-color: ${colors.verticalBorder}; }` +
      `.is-personalizable .personalize-horizontal-bottom-border { border-bottom: 1px solid ${colors.horizontalBorder}; }` +
      `.is-personalizable .personalize-horizontal-top-border { border-top: 1px solid: ${colors.horizontalBorder}; }` +
      '.is-personalizable .personalize-actionable-disabled, .is-personalizable .personalize-actionable-disabled:hover { opacity: .4 !important; cursor: default; }' +
    '';

    return cssRules;
  },

  /**
  * Sets the personalization color(s)
  * @param {array} colors The original hex color as a string or an object with all the Colors
  * @returns {this} component instance
  */
  setColors(colors) {
    if (!colors) {
      return this;
    }

    this.appendStyleSheet(this.getColorStyleSheet(colors));

    // record state of colors in settings
    this.settings.colors = colors;

    /**
    * Fires after the colors are changed.
    * @event colorschanged
    * @memberof Personalize
    * @property {object} event - The jquery event object
    * @property {object} args - The event args
    * @property {string} args.colors - The color(s) changed to.
    */
    this.element.triggerHandler('colorschanged', { colors });
    return this;
  },

  /**
  * Takes a color and performs a change in luminosity of that color programatically.
  * @private
  * @param {string} hex  The original Hexadecimal base color.
  * @param {string} lum  A percentage used to set luminosity
  * change on the base color:  -0.1 would be 10% darker, 0.2 would be 20% brighter
  * @returns {string} hexadecimal color.
  */
  getLuminousColorShade(hex, lum) {
    // validate hex string
    hex = this.validateHex(hex).substr(1);
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#';
    let c;
    let i;

    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += (`00${c}`).substr(c.length);
    }

    return rgb;
  },

  /**
   * Detect the current theme based on the style sheet.
   * @private
   * @returns {string} The current theme.
   */
  getThemeFromStylesheet() {
    const css = $('#stylesheet, #sohoxi-stylesheet');
    let thisTheme = '';

    if (css.length > 0) {
      const path = css.attr('href');
      thisTheme = path.substring(path.lastIndexOf('/') + 1);
      // trim query string off the end if it exists
      // something like ?v=123 may be used for cache busting or build identifiers
      const queryParamIndex = thisTheme.lastIndexOf('?');
      if (queryParamIndex > -1) {
        thisTheme = thisTheme.slice(0, queryParamIndex);
      }
      // trim the file extensions off the end and drop the -theme portion
      thisTheme = thisTheme.replace('.min.css', '').replace('.css', '').replace('-theme', '');
    }
    return thisTheme;
  },

  /**
  * Sets the current theme, blocking the ui during the change.
  * @param {string} incomingTheme  Represents the file name of a color
  * scheme (can be dark, light or high-contrast)
  */
  setTheme(incomingTheme) {
    if (theme.currentTheme.id === incomingTheme) {
      if (!$('html').hasClass(`${incomingTheme}-theme`)) {
        $('html').addClass(`${incomingTheme}-theme`);
      }
      return;
    }

    // Validate theme is supported
    const result = theme.themes().filter(themeObj => themeObj.id === incomingTheme);
    if (result.length === 0) {
      return;
    }

    $('html').removeClass('light-theme dark-theme high-contrast-theme').addClass(`${incomingTheme}-theme`);

    this.blockUi();

    const self = this;
    const originalCss = $('#stylesheet, #sohoxi-stylesheet');
    const newCss = $('<link rel="stylesheet">');
    const path = originalCss.attr('href');

    newCss.on('load', () => {
      originalCss.remove();
      self.unBlockUi();
    });

    const themePath = path ? path.substring(0, path.lastIndexOf('/')) : '';
    const isMin = path ? path.indexOf('.min') > -1 : false;

    newCss.attr({
      id: originalCss.attr('id'),
      href: xssUtils.stripTags(`${themePath}/${incomingTheme}-theme${isMin ? '.min' : ''}.css`)
    });
    originalCss.removeAttr('id');

    // Add new stylesheet before current stylesheet
    // to give it time to parse/render before revealing it
    originalCss.before(newCss);

    // record state of theme in settings
    this.settings.theme = incomingTheme;
    theme.setTheme(incomingTheme);

    /**
    * Fires after the theme is changed
    * @event themechanged
    * @memberof Personalize
    * @property {object} event - The jquery event object
    * @property {object} args - The event args
    * @property {string} args.theme - The theme id changed to.
    */
    this.element.triggerHandler('themechanged', { theme: incomingTheme });
  },

  /**
   * Builds a temporary page overlay that prevents end users from experiencing FOUC
   * @private
   * @returns {void}
   */
  blockUi() {
    const self = this;
    if (!self.settings.blockUI) {
      return;
    }

    let backgroundColor = '#bdbdbd';
    switch (theme) {
      case 'light':
        backgroundColor = '#f0f0f0';
        break;
      case 'dark':
        backgroundColor = '#313236';
        break;
      case 'high-contrast':
        backgroundColor = '#d8d8d8';
        break;
      default:
        backgroundColor = '#f0f0f0';
    }

    this.pageOverlay = this.pageOverlay || $('<div class="personalize-overlay"></div>');
    this.pageOverlay.css('background', backgroundColor);
    $('body').append(this.pageOverlay);
  },

  /**
   * Removes a temporary page overlay built by `blockUi()`
   * @private
   * @returns {void}
   */
  unBlockUi() {
    const self = this;
    if (!self.settings.blockUI) {
      return;
    }

    self.pageOverlay.fadeOut(300, () => {
      self.pageOverlay.remove();
      self.pageOverlay = undefined;
    });
  },

  /**
   * Handle Updating Settings
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * Ideally this will do non-destructive things that make it possible to easily rebuild
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Personalize, COMPONENT_NAME };
