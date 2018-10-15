import { BusyIndicator } from '../../../src/components/busyindicator/busyindicator';

const busyindicatorHTML = require('../../../app/views/components/busyindicator/example-index.html');

let busyindicatorEl;
let busyindicatorObj;

describe('Busy Indicator API', () => {
  beforeEach(() => {
    busyindicatorEl = null;
    busyindicatorObj = null;
    document.body.insertAdjacentHTML('afterbegin', busyindicatorHTML);

    busyindicatorEl = document.body.querySelector('#busy-form');
    busyindicatorObj = new BusyIndicator(busyindicatorEl);
  });

  afterEach(() => {
    if (busyindicatorObj) {
      busyindicatorObj.destroy();
    }

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(busyindicatorObj).toEqual(jasmine.any(Object));
  });

  it('Should return correct value for isActive', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      expect(busyindicatorObj.isActive()).toEqual(true);
      done();
    }, 1000);
  });

  it('Should display busy indicator when triggering "start.busyindicator"', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      expect(document.body.querySelector('.busy-indicator-container')).toBeTruthy();
      done();
    }, 1000);
  });

  it('Should hide busy indicator when triggering complete/close', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.close(true);

      setTimeout(() => {
        expect(document.querySelector('.busy-indicator-container')).toBeFalsy();
        done();
      }, 1000);
    }, 1000);
  });

  it('Should update text of busy indicator', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.updated({ text: 'Custom Text 1' });
    }, 1000);

    setTimeout(() => {
      const customTextEl = $('.busy-indicator-container > span');

      expect(customTextEl.text()).toEqual('Custom Text 1');
      busyindicatorObj.destroy();
      done();
    }, 1000);
  });

  it('Should destroy busy indicator', (done) => {
    busyindicatorObj.activate();

    setTimeout(() => {
      busyindicatorObj.destroy();

      setTimeout(() => {
        expect(document.querySelector('.busy-indicator-container')).toBeFalsy();
        done();
      }, 1000);
    }, 1000);
  });
});
