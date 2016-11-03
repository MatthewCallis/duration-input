var DurationInput = (function () {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var DurationInput = function () {
  function DurationInput(element) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, DurationInput);

    if (!element) {
      return;
    }
    this.element = element;

    var defaults$$1 = {
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
        immediately: 'immediately'
      },
      text: {
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        immediately: 'Immediately'
      }
    };
    this.settings = Object.assign({}, defaults$$1, options);

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
    var value = this.element.value;
    try {
      value = parseInt(value, 10);
    } catch (_e) {}

    if (isNaN(value) || value == null || value === undefined) {
      value = this.settings.duration;
    }

    var d = Math.floor(value / 86400);
    var h = Math.floor(value / 3600 % 24);
    var m = Math.floor(value / 60 % 60);
    var s = Math.floor(value % 60);

    var duration = document.createElement('input');
    duration.type = 'number';
    duration.name = this.element.name + '_duration';
    duration.className = 'duration ' + this.settings.classes.input;
    if (this.settings.required) {
      duration.required = true;
      duration.setAttribute('data-msg', this.settings.required_text);
    }
    duration.setAttribute('step', 1);
    duration.setAttribute('min', this.settings.minimum || 0);

    var type = document.createElement('select');
    type.className = 'type ' + this.settings.classes.select;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.settings.allowedFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        var option = document.createElement('option');
        option.className = this.settings.classes[field];
        option.textContent = this.settings.text[field];
        option.value = field;
        type.appendChild(option);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    type.addEventListener('change', function () {
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
    var onInput = function onInput() {
      var new_h = 0;
      var new_m = 0;
      var new_d = 0;
      if (type.value === 'days') {
        new_d = duration.value;
      }
      if (type.value === 'hours') {
        new_h = duration.value;
      }
      if (type.value === 'minutes') {
        new_m = duration.value;
      }
      if (type.value === 'immediately') {
        new_d = new_h = new_m = 0;
      }
      _this.element.value = DurationInput.toSeconds(new_d, new_h, new_m, 0);
      DurationInput.triggerEvents(['input', 'change'], _this.element);
    };

    this.container.addEventListener('keydown', DurationInput.numericOnly);
    this.container.addEventListener('input', onInput);
    this.container.addEventListener('change', onInput); // Firefox does not fire 'input' on <select> changes.

    this.element.value = DurationInput.toSeconds(d, h, m, s);
    DurationInput.triggerEvents(['input', 'change'], this.element);
  }

  createClass(DurationInput, null, [{
    key: 'toSeconds',
    value: function toSeconds() {
      var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var time = d * 24 * 60 * 60 + h * 60 * 60 + m * 60 + s;
      return parseInt(time, 10);
    }
  }, {
    key: 'triggerEvents',
    value: function triggerEvents(events, element) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var event = _step2.value;

          var ev = document.createEvent('HTMLEvents');
          ev.initEvent(event, true, false);
          element.dispatchEvent(ev);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'numericOnly',
    value: function numericOnly(e) {
      // Allow: Backspace, Delete, Tab, Escape, Enter, Return
      if ([46, 8, 9, 27, 13, 110].indexOf(e.which) !== -1) {
        return;
      }
      // Allow: Only one Decimal
      if ([190].indexOf(e.which) !== -1 && !(e.currentTarget.value && e.currentTarget.value.match(/\./g))) {
        return;
      }
      // Allow: Ctrl or Command + [A,C,V,X,Z]
      if ((e.ctrlKey || e.metaKey) === true && [65, 67, 86, 88, 90].indexOf(e.which) !== -1) {
        return;
      }
      // Allow: Up, Down, Home, End, Left, Right
      if (e.which >= 35 && e.which <= 40) {
        return;
      }
      // Ensure that it is a number and stop the keypress.
      if ((e.shiftKey || e.which < 48 || e.which > 57) && (e.which < 96 || e.which > 105)) {
        e.preventDefault();
      }
    }
  }]);
  return DurationInput;
}();

return DurationInput;

}());
