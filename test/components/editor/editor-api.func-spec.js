import { Editor } from '../../../src/components/editor/editor';
import { cleanup } from '../../helpers/func-utils';

const editorHTML = require('../../../app/views/components/editor/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let editorEl;
let editorObj;

describe('Editor API', () => {
  beforeEach(() => {
    editorEl = null;
    editorObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    editorEl = document.body.querySelector('.editor');
    editorObj = new Editor(editorEl);
  });

  afterEach(() => {
    cleanup(['.editor', '.svg-icons', '.modal', '.row', '.modal-page-container']);
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

  it('Should render preview mode', () => {
    editorObj.destroy();
    editorObj = new Editor(editorEl, { preview: true });

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
  });

  it('Should switch to preview mode', () => {
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
  });

  it('Should switch to preview and editable modes', () => {
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
    editorObj.enable();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('true');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeVisible();
  });
});
