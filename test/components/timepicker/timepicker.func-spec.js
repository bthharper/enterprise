import { TimePicker } from '../../../src/components/timepicker/timepicker';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let timepickerEl;
let svgEl;
let timepickerObj;

describe('TimePicker Methods', () => {
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
    timepickerObj.settings.timeFormat = 'h:mm a';// TODO: this should set by default
  });

  afterEach(() => {
    timepickerObj.destroy();
    timepickerEl.parentNode.removeChild(timepickerEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should checks a time format value to see if it is a Military (24-hour) format', () => {
    expect(timepickerObj.is24HourFormat()).toBe(false);
    expect(timepickerObj.is24HourFormat('h:mm a')).toBe(false);
    expect(timepickerObj.is24HourFormat('hh:mm:ss')).toBe(false);
    expect(timepickerObj.is24HourFormat('HH:mm')).toBe(true);
  });

  it('Should get hour text', () => {
    expect(timepickerObj.hourText(12)).toEqual('12');
    expect(timepickerObj.hourText(5)).toEqual('5');

    timepickerObj.settings.timeFormat = 'hh:mm:ss';

    expect(timepickerObj.hourText(12)).toEqual('12');
    expect(timepickerObj.hourText(5)).toEqual('05');
  });

  it('Should checks time format to see if it includes seconds', () => {
    expect(timepickerObj.hasSeconds()).toBe(false);
    expect(timepickerObj.hasSeconds('h:mm a')).toBe(false);
    expect(timepickerObj.hasSeconds('hh:mm:ss')).toBe(true);
    expect(timepickerObj.hasSeconds('HH:mm')).toBe(false);
  });

  it('Should checks time format contains a space for presenting the day period', () => {
    expect(timepickerObj.hasDayPeriods()).toBe(true);
    expect(timepickerObj.hasDayPeriods('h:mm a')).toBe(true);
    expect(timepickerObj.hasDayPeriods('hh:mm:ss')).toBe(false);
    expect(timepickerObj.hasDayPeriods('HH:mm')).toBe(false);
  });

  it('Should rounds the minutes picker to its nearest interval value', () => {
    timepickerEl.value = '12:32 PM';
    timepickerObj.roundMinutes();

    expect(timepickerEl.value).toEqual('12:30 PM');

    timepickerEl.value = '12:34 PM';
    timepickerObj.roundMinutes();

    expect(timepickerEl.value).toEqual('12:35 PM');
  });

  it('Should separate value to object as hours, minutes, seconds and day period', () => {
    timepickerObj.dayPeriods = ['AM', 'PM'];// TODO: this should set by default
    let in1 = '2:15 AM';
    let in2 = '12:30 PM';
    let out1 = { hours: '2', minutes: 15, period: 'AM' };
    let out2 = { hours: '12', minutes: 30, period: 'PM' };

    expect(timepickerObj.getTimeFromField(in1)).toEqual(out1);
    expect(timepickerObj.getTimeFromField(in2)).toEqual(out2);

    timepickerObj.settings.timeFormat = 'hh:mm:ss';
    in1 = '2:15:20 AM';
    in2 = '12:30:55 PM';
    out1 = { hours: '02', minutes: 15, seconds: 20, period: 'AM' };
    out2 = { hours: '12', minutes: 30, seconds: 55, period: 'PM' };

    expect(timepickerObj.getTimeFromField(in1)).toEqual(out1);
    expect(timepickerObj.getTimeFromField(in2)).toEqual(out2);
  });

  it('Should check for remove punctuation from value', () => {
    let input = '1:00 AM';
    let output = '0100AM';
    timepickerEl.value = input;

    expect(timepickerObj.value(true)).toEqual(output);

    input = '24:00';
    output = '2400';
    timepickerEl.value = input;

    expect(timepickerObj.value(true)).toEqual(output);

    input = '4:00';
    output = '0400';
    timepickerEl.value = input;

    expect(timepickerObj.value(true)).toEqual(output);

    // This one something special
    // https://jira.infor.com/browse/SOHO-7589
    input = '01:00 AM';
    output = '0100 AM';
    timepickerEl.value = input;

    expect(timepickerObj.value(true)).toEqual(output);
  });
});
