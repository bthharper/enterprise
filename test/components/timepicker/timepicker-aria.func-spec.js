import { TimePicker } from '../../../src/components/timepicker/timepicker';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let timepickerEl;
let svgEl;
let timepickerObj;

describe('TimePicker ARIA', () => {
  beforeEach(() => {
    timepickerEl = null;
    svgEl = null;
    timepickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    svgEl = document.body.querySelector('.svg-icons');
    timepickerEl.classList.add('no-init');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    timepickerEl.parentNode.removeChild(timepickerEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set ARIA labels', () => {
    expect(document.querySelector('.timepicker[aria-expanded="false"]')).toBeTruthy();
    expect(document.querySelector('.timepicker[role="combobox"]')).toBeTruthy();
    expect(document.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(document.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });

  it('Should update ARIA labels with popup open', () => {
    timepickerObj.openTimePopup();

    expect(document.querySelector('.timepicker[aria-expanded="true"]')).toBeTruthy();
  });
});
