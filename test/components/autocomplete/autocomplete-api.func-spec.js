import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';

const svgHTML = require('../../../src/components/icons/svg.html');

// For basic API
const exampleHTML = require('../../../app/views/components/autocomplete/example-index.html');
const statesData = require('../../../app/data/states-all.json');

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;
let svgEl;

describe('Autocomplete API', () => {
  beforeEach(() => {
    autocompleteInputEl = null;
    autocompleteAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    svgEl = document.body.querySelector('.svg-icons');
    autocompleteLabelEl = document.body.querySelector('label[for="autocomplete-default"]');
    autocompleteInputEl = document.body.querySelector('.autocomplete');
    autocompleteInputEl.removeAttribute('data-options');
    autocompleteInputEl.classList.add('no-init');

    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: statesData
    });
  });

  afterEach(() => {
    autocompleteAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);

    const autocompleteListEl = document.querySelector('#autocomplete-list');
    if (autocompleteListEl) {
      autocompleteListEl.parentNode.removeChild(autocompleteListEl);
    }
    autocompleteLabelEl.parentNode.removeChild(autocompleteLabelEl);
    autocompleteInputEl.parentNode.removeChild(autocompleteInputEl);
  });

  it('can be invoked', () => {
    expect(autocompleteAPI).toEqual(jasmine.any(Object));
  });

  it('can be enabled/disabled', () => {
    autocompleteAPI.disable();

    expect(autocompleteInputEl.disabled).toBeTruthy();

    autocompleteAPI.enable();

    expect(autocompleteInputEl.disabled).toBeFalsy();
  });

  it('renders with proper ARIA attributes', () => {
    expect(autocompleteInputEl.getAttribute('autocomplete')).toBe('off');
    expect(autocompleteInputEl.getAttribute('role')).toBe('combobox');
  });

  it('can be updated with new settings', () => {
    const newSettings = {
      filterMode: 'contains',
      delay: 500
    };
    autocompleteAPI.updated(newSettings);

    expect(autocompleteAPI.settings.filterMode).toEqual(newSettings.filterMode);
  });

  it('can render a search result list', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeDefined();

    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(4);
  });

  it('can change the search terms and re-render its list with new results', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeDefined();

    let resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(4);
    expect(resultItems[1].innerText.trim()).toEqual('New Jersey');

    autocompleteAPI.openList('co', statesData);
    resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toEqual(3);
    expect(resultItems[2].innerText.trim()).toEqual('District Of Columbia');
  });

  it('can programmatically highlight an available search result item', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');
    autocompleteAPI.highlight($(resultItems[2].querySelector('a')));

    expect(resultItems[2].classList.contains('is-selected')).toBeTruthy();
  });

  it('can explain whether or not its list is open', () => {
    autocompleteAPI.openList('new', statesData);

    expect(autocompleteAPI.listIsOpen()).toBeTruthy();

    autocompleteAPI.closeList();

    expect(autocompleteAPI.listIsOpen()).toBeFalsy();
  });
});
