import test from 'ava';
import sinon from 'sinon';
import DurationInput from '../src/duration-input';

let input;
let duration_input;
let input_spy;
let change_spy;

test.before(() => {
  const root = document.createElement('div');
  root.id = 'root';
  root.innerHTML = '';
  document.body.appendChild(root);
});

test.beforeEach((_t) => {
  input = document.createElement('input');
  input.id = 'input-1';
  input.type = 'text';
  input.name = 'input-1';

  const root = document.querySelector('#root');
  root.innerHTML = '';
  root.appendChild(input);

  input_spy = sinon.spy();
  change_spy = sinon.spy();
  input.addEventListener('input', input_spy);
  input.addEventListener('change', change_spy);
});

test.afterEach((_t) => {
  input.removeEventListener('input', input_spy);
  input.removeEventListener('change', change_spy);

  const root = document.querySelector('#root');
  root.innerHTML = '';
});

test('#constructor: should render', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(duration_input.settings.duration, 0);
  t.truthy(document.querySelector('.duration-container'));
});

test('#constructor: should do nothing if there is no element', (t) => {
  duration_input = new DurationInput();
  t.falsy(document.querySelector('.duration-container'));
});

test('#constructor: should allow options', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 120 });
  t.is(duration_input.settings.duration, 120);
});

test('#constructor: should work with floats', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 90001 });
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should round floats', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 90000 });
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should allow setting required', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 90000, required: true });
  t.is(document.querySelector('input.duration').getAttribute('data-msg'), duration_input.settings.required_text);
});

test('#constructor: should fire events on initilization', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(input_spy.callCount, 1);
  t.is(change_spy.callCount, 1);
});

test('#constructor: should fire events on text input', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 60 });
  t.is(input_spy.callCount, 1);
  t.is(change_spy.callCount, 1);

  // Trigger Input
  input = document.querySelector('.duration-container input');
  input.value = 3;
  const event = document.createEvent('HTMLEvents');
  event.initEvent('input', true, false);
  event.which = 51;
  event.keyCode = 51;
  input.dispatchEvent(event);

  t.is(input_spy.callCount, 2);
  t.is(change_spy.callCount, 2);

  t.is(document.getElementById('input-1').value, '180');
});

test('#constructor: should keep its value', (t) => {
  document.getElementById('input-1').value = 120;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.getElementById('input-1').value, '120');
});

test('#constructor: should hide the input when not debugging', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { debug: false });
  t.is(document.getElementById('input-1').style.visibility, 'hidden');
  t.is(document.getElementById('input-1').style.position, 'absolute');
  t.is(document.getElementById('input-1').style.height, '0px');
  t.is(document.getElementById('input-1').style.width, '0px');
});

test('#constructor: should show the input when debugging', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { debug: true });
  t.is(document.getElementById('input-1').style.visibility, '');
  t.is(document.getElementById('input-1').style.position, '');
  t.is(document.getElementById('input-1').style.height, '');
  t.is(document.getElementById('input-1').style.width, '');
});

test('#constructor: should default to the settings.duration value when no valid value', (t) => {
  document.getElementById('input-1').value = 'test';
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.getElementById('input-1').value, '0');
});

test('#constructor: should parse and show the correct value for different durations: day', (t) => {
  document.getElementById('input-1').value = 86400;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should parse and show the correct value for different durations: hour', (t) => {
  document.getElementById('input-1').value = 3600;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should parse and show the correct value for different durations: minute', (t) => {
  document.getElementById('input-1').value = 60;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should parse and show the correct value for different durations: second', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.querySelector('input.duration').value, '1');
});

test('#constructor: should parse and show the correct value for different durations: immediately', (t) => {
  document.getElementById('input-1').value = -1;
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(document.querySelector('input.duration').value, '-1');
});

test('#constructor: should parse and show the correct value for different durations: no immediately', (t) => {
  document.getElementById('input-1').value = 0;
  duration_input = new DurationInput(document.getElementById('input-1'), { allowedFields: ['days', 'hours', 'minutes'] });
  t.is(document.querySelector('input.duration').value, '0');
  t.is(document.querySelector('input.duration').style.display, '');
});

test('#constructor: should allow changing the type to change the value: days', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'));

  const type = document.querySelector('select.type');
  type.value = 'days';
  DurationInput.triggerEvents(['input', 'change'], type);
  t.is(document.getElementById('input-1').value, '86400');
});

test('#constructor: should allow changing the type to change the value: hours', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'));

  const type = document.querySelector('select.type');
  type.value = 'hours';
  DurationInput.triggerEvents(['input', 'change'], type);
  t.is(document.getElementById('input-1').value, '3600');
});

test('#constructor: should allow changing the type to change the value: minutes', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'));

  const type = document.querySelector('select.type');
  type.value = 'minutes';
  DurationInput.triggerEvents(['input', 'change'], type);
  t.is(document.getElementById('input-1').value, '60');
});

test('#constructor: should allow changing the type to change the value: immediately', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'));

  const type = document.querySelector('select.type');
  type.value = 'immediately';
  DurationInput.triggerEvents(['input', 'change'], type);
  t.is(document.getElementById('input-1').value, '0');
});

test('#constructor: should show the type drop down when more than 1 option is avaliable', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'), { allowedFields: ['days', 'minutes'] });
  t.is(document.querySelector('select.type').style.display, '');
});

test('#constructor: should hide the type drop down when only 1 option is avaliable', (t) => {
  document.getElementById('input-1').value = 1;
  duration_input = new DurationInput(document.getElementById('input-1'), { allowedFields: ['days'] });
  t.is(document.querySelector('select.type').style.display, 'none');
});

test('#toSeconds: should convert durations to seconds', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'));
  t.is(DurationInput.toSeconds(1, 0, 0, 0), 86400);
  t.is(DurationInput.toSeconds(0, 1, 0, 0), 3600);
  t.is(DurationInput.toSeconds(0, 0, 1, 0), 60);
  t.is(DurationInput.toSeconds(0, 0, 0, 1), 1);
  t.is(DurationInput.toSeconds(4, 3, 2, 1), 356521);
  t.is(DurationInput.toSeconds(2), 172800);
  t.is(DurationInput.toSeconds(), 0);
});

test('#triggerEvents: should trigger events on a given element', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'));

  // DOM Setup
  const input_events = document.createElement('input');
  input_events.id = 'input-events';
  input_events.type = 'text';
  input_events.name = 'input-events';

  const root = document.querySelector('#root');
  root.appendChild(input_events);

  // Spy Setup
  const events_input_spy = sinon.spy();
  const events_change_spy = sinon.spy();
  const events_flap_spy = sinon.spy();
  input_events.addEventListener('input', events_input_spy);
  input_events.addEventListener('change', events_change_spy);
  input_events.addEventListener('flap', events_flap_spy);

  DurationInput.triggerEvents(['input'], input_events);
  t.is(events_input_spy.callCount, 1);
  t.is(events_change_spy.callCount, 0);
  t.is(events_flap_spy.callCount, 0);

  DurationInput.triggerEvents(['change'], input_events);
  t.is(events_input_spy.callCount, 1);
  t.is(events_change_spy.callCount, 1);
  t.is(events_flap_spy.callCount, 0);

  DurationInput.triggerEvents(['flap'], input_events);
  t.is(events_input_spy.callCount, 1);
  t.is(events_change_spy.callCount, 1);
  t.is(events_flap_spy.callCount, 1);

  input_events.removeEventListener('input', events_input_spy);
  input_events.removeEventListener('change', events_change_spy);
  input_events.removeEventListener('flap', events_flap_spy);
});

test('#numericOnly: should allow Backspace, Delete, Tab, Escape, Enter, Return as valid input', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 0 });
  const output = document.querySelector('input.duration');
  t.is(output.value, '0');

  t.falsy(DurationInput.numericOnly({ which: 46 }));
  t.falsy(DurationInput.numericOnly({ which: 8 }));
  t.falsy(DurationInput.numericOnly({ which: 9 }));
  t.falsy(DurationInput.numericOnly({ which: 27 }));
  t.falsy(DurationInput.numericOnly({ which: 13 }));
  t.falsy(DurationInput.numericOnly({ which: 110 }));
});

test('#numericOnly: should allow one decimal', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 0 });
  const output = document.querySelector('input.duration');
  t.is(output.value, '0');

  const spy = sinon.spy();
  t.falsy(DurationInput.numericOnly({ which: 190, currentTarget: { value: '1' }, preventDefault: spy }));
  t.falsy(DurationInput.numericOnly({ which: 190, currentTarget: { value: '1.' }, preventDefault: spy }));
  t.is(spy.callCount, 1);
});

test('#numericOnly: should allow Ctrl or Command + [A,C,V,X,Z]', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 0 });
  const output = document.querySelector('input.duration');
  t.is(output.value, '0');

  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: false, which: 65 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: false, which: 67 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: false, which: 86 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: false, which: 88 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: false, which: 90 }));

  t.falsy(DurationInput.numericOnly({ ctrlKey: false, metaKey: true, which: 65 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: false, metaKey: true, which: 67 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: false, metaKey: true, which: 86 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: false, metaKey: true, which: 88 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: false, metaKey: true, which: 90 }));

  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: true, which: 65 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: true, which: 67 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: true, which: 86 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: true, which: 88 }));
  t.falsy(DurationInput.numericOnly({ ctrlKey: true, metaKey: true, which: 90 }));
});

test('#numericOnly: should allow Up, Down, Home, End, Left, Right', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 0 });
  const output = document.querySelector('input.duration');
  t.is(output.value, '0');

  t.falsy(DurationInput.numericOnly({ which: 35 }));
  t.falsy(DurationInput.numericOnly({ which: 36 }));
  t.falsy(DurationInput.numericOnly({ which: 37 }));
  t.falsy(DurationInput.numericOnly({ which: 38 }));
  t.falsy(DurationInput.numericOnly({ which: 39 }));
  t.falsy(DurationInput.numericOnly({ which: 40 }));
});

test('#numericOnly: should allow 0 - 9 as valid input', (t) => {
  duration_input = new DurationInput(document.getElementById('input-1'), { duration: 0 });
  const output = document.querySelector('input.duration');
  t.is(output.value, '0');

  t.falsy(DurationInput.numericOnly({ which: 48 }));
  t.falsy(DurationInput.numericOnly({ which: 49 }));
  t.falsy(DurationInput.numericOnly({ which: 50 }));
  t.falsy(DurationInput.numericOnly({ which: 51 }));
  t.falsy(DurationInput.numericOnly({ which: 52 }));
  t.falsy(DurationInput.numericOnly({ which: 53 }));
  t.falsy(DurationInput.numericOnly({ which: 54 }));
  t.falsy(DurationInput.numericOnly({ which: 55 }));
  t.falsy(DurationInput.numericOnly({ which: 56 }));
});
