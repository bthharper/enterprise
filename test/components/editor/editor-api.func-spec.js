import { Editor } from '../../../src/components/editor/editor';

const editorHTML = require('../../../app/views/components/editor/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let editorEl;
let svgEl;
let editorObj;

describe('Editor API', () => {
  beforeEach(() => {
    editorEl = null;
    svgEl = null;
    editorObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    editorEl = document.body.querySelector('.editor');
    svgEl = document.body.querySelector('.svg-icons');
    editorObj = new Editor(editorEl);
  });

  afterEach(() => {
    editorObj.destroy();
    editorEl.parentNode.removeChild(editorEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(editorObj).toEqual(jasmine.any(Object));
  });

  it('Should support pasting plain text', () => {
    const startHtml = '<meta charset="utf-8"><span> cutting-edge</span>';
    const endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });

  it('Should strip ng attributes on paste', () => {
    let startHtml = '<meta charset="utf-8" ng-test><span> cutting-edge</span>';
    let endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);

    startHtml = '<meta charset="utf-8" ng-app><span> cutting-edge</span>';
    endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });
});
