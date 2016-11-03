import $ from 'jquery';

export default class DurationInput {
  constructor(element, options = {}) {
    if (!element) { return; }
    this.element = element;

    const defaults = {
      duration: 0,
      debug: false,
      allowedFields: ['immediately', 'days', 'hours', 'minutes'],
      minimum: null,
      required: false,
      required_text: 'Required',
      classes: {
        container: 'duration-container',
        input: '',
        select: '',
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        immediately: 'immediately',
      },
      text: {
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        immediately: 'Immediately',
      },
    };
    this.settings = Object.assign({}, defaults, options);

    // Create the container.
    this.container = document.createElement('div');
    this.container.classList.add(this.settings.classes.container);
    this.element.parentNode.insertBefore(this.container, this.element.nextSibling);

    // Hide the input.
    if (!this.settings.debug) {
      this.element.style.visibility = 'hidden';
      this.element.style.position = 'absolute';
      this.element.style.height = 0;
      this.element.style.width = 0;
    }

    // Set the value.
    let value = this.element.value;
    try {
      value = parseInt(value, 10);
    } catch (_e) {}

    if (isNaN(value) || value == null || value === undefined) {
      value = this.settings.duration;
    }

    const d = Math.floor(value / 86400);
    const h = Math.floor((value / 3600) % 24);
    const m = Math.floor((value / 60) % 60);
    const s = Math.floor(value % 60);

    const duration = document.createElement('input');
    duration.type = 'number';
    duration.name = `${this.element.name}_duration`;
    duration.className = `duration ${this.settings.classes.input}`;
    if (this.settings.required) {
      duration.required = true;
      duration.setAttribute('data-msg', this.settings.required_text);
    }
    duration.setAttribute('step', 1);
    duration.setAttribute('min', this.settings.minimum || 0);

    const type = document.createElement('select');
    type.className = `type ${this.settings.classes.select}`;

    for (const field of this.settings.allowedFields) {
      const option = document.createElement('option');
      option.className = this.settings.classes[field];
      option.textContent = this.settings.text[field];
      option.value = field;
      type.appendChild(option);
    }

    type.addEventListener('change', () => {
      duration.style.display = type.value === 'immediately' ? 'none' : '';
    });

    if (this.settings.allowedFields.length === 1) {
      type.style.display = 'none';
    }

    if (Math.floor(d) !== 0) {
      type.value = 'days';
      duration.value = d;
      duration.style.display = null;
    } else if (Math.floor(h) !== 0) {
      type.value = 'hours';
      duration.value = h;
      duration.style.display = null;
    } else if (m > 0) {
      type.value = 'minutes';
      duration.value = m;
      duration.style.display = null;
    } else if (s > 0) {
      type.value = 'minutes';
      duration.value = s;
      duration.style.display = null;
    } else if (this.settings.allowedFields.indexOf('immediately') !== -1) {
      type.value = 'immediately';
      duration.value = 0;
      duration.style.display = 'none';
    } else {
      type.value = 'minutes';
      duration.value = s;
      duration.style.display = null;
    }

    if (this.settings.allowedFields.indexOf('immediately') === -1) {
      duration.style.display = null;
    }

    this.container.appendChild(duration);
    this.container.appendChild(type);

    // Events
    const onInput = () => {
      let new_h = 0;
      let new_m = 0;
      let new_d = 0;
      if (type.value === 'days') { new_d = duration.value; }
      if (type.value === 'hours') { new_h = duration.value; }
      if (type.value === 'minutes') { new_m = duration.value; }
      if (type.value === 'immediately') { new_d = new_h = new_m = 0; }
      this.element.value = DurationInput.toSeconds(new_d, new_h, new_m, 0);
      DurationInput.triggerEvents(['input', 'change'], this.element);
    };

    this.container.addEventListener('keydown', DurationInput.numericOnly);
    this.container.addEventListener('input', onInput);
    this.container.addEventListener('change', onInput); // Firefox does not fire 'input' on <select> changes.

    this.element.value = DurationInput.toSeconds(d, h, m, s);
    DurationInput.triggerEvents(['input', 'change'], this.element);
  }

  static toSeconds(d = 0, h = 0, m = 0, s = 0) {
    const time = (d * 24 * 60 * 60) + (h * 60 * 60) + (m * 60) + s;
    return parseInt(time, 10);
  }

  static triggerEvents(events, element) {
    for (const event of events) {
      const ev = document.createEvent('HTMLEvents');
      ev.initEvent(event, true, false);
      element.dispatchEvent(ev);
    }
  }

  static numericOnly(e) {
    // Allow: Backspace, Delete, Tab, Escape, Enter, Return
    if ([46, 8, 9, 27, 13, 110].indexOf(e.which) !== -1) { return; }
    // Allow: Only one Decimal
    if ([190].indexOf(e.which) !== -1 && !(e.currentTarget.value && e.currentTarget.value.match(/\./g))) { return; }
    // Allow: Ctrl or Command + [A,C,V,X,Z]
    if ((e.ctrlKey || e.metaKey) === true && [65, 67, 86, 88, 90].indexOf(e.which) !== -1) { return; }
    // Allow: Up, Down, Home, End, Left, Right
    if (e.which >= 35 && e.which <= 40) { return; }
    // Ensure that it is a number and stop the keypress.
    if ((e.shiftKey || (e.which < 48 || e.which > 57)) && (e.which < 96 || e.which > 105)) { e.preventDefault(); }
  }
}

/* istanbul ignore else */
if (typeof $ !== 'undefined') {
  $.fn.durationInput = function durationInput(options) {
    this.each(function each() {
      /* istanbul ignore else */
      if (!$.data(this, 'plugin_durationInput') && !$(this).parent().hasClass('duration-container')) {
        $.data(this, 'plugin_durationInput', new DurationInput(this, options));
      }
    });
  };
}
