import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';

const svgHTML = require('../../../src/components/icons/svg.html');

// For FilterMode "contains" tests
const newTemplateHTML = require('../../../app/views/components/autocomplete/example-contains.html');
const statesData = require('../../../app/data/states-all.json');

let autocompleteInputEl;
let autocompleteAPI;

describe('Autocomplete API', () => {
  it('can provide search results with a "contains" filter', () => {
    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', newTemplateHTML);

    // remove unncessary stuff
    const inlineScripts = document.body.querySelector('#test-scripts');
    inlineScripts.parentNode.removeChild(inlineScripts);

    autocompleteInputEl = document.body.querySelector('#autocomplete-default');
    autocompleteInputEl.classList.add('no-init');
    autocompleteInputEl.removeAttribute('data-options');

    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: statesData
    });

    // Try opening the list with text content that will not match a "startsWith" filter
    autocompleteAPI.openList('ia', statesData);
    let autocompleteListEl = document.querySelector('#autocomplete-list');
    let resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(0);

    // Update the component with a "contains" filterMode
    autocompleteAPI.updated({
      filterMode: 'contains'
    });
    autocompleteAPI.openList('ia', statesData);
    autocompleteListEl = document.querySelector('#autocomplete-list');
    resultItems = autocompleteListEl.querySelectorAll('li');

    // Results should be present
    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(10);
    expect(resultItems[7].innerText.trim()).toBe('Pennsylvania');
  });
});
