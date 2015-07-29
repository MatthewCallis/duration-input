class DurationInput
  defaults =
    duration: 0
    debug: false
    allowedFields: ['immediately','days','hours','minutes']
    allowFloats: true
    minimum: null
    required: false
    required_text: 'Required'
    minimums:
      days: 0
      hours: 0
      minutes: 0
    classes:
      container: 'duration-container'
      input: ''
      select: ''
      days: 'days'
      hours: 'hours'
      minutes: 'minutes'
      immediately: 'immediately'
    text:
      days: 'days'
      hours: 'hours'
      minutes: 'minutes'
      immediately: 'Immediately'
    immediateCallback: ->
    notImmediateCallback: ->

  constructor: (element, options = {}) ->
    return unless element
    @element = element
    @settings = @merge(defaults, options)

    # Create the container.
    @container = document.createElement('div')
    @container.classList.add @settings.classes.container

    # Hide the input.
    unless @settings.debug
      @element.style.visibility = 'hidden'
      @element.style.position = 'absolute'
      @element.style.height = 0
      @element.style.width = 0

    # Check for DOM
    @element.parentNode.insertBefore(@container, @element.nextSibling)  if @element.parentNode

    value = @element.value
    try
      value = parseInt(value)
    catch error
      value = @settings.duration

    value = @settings.duration  if isNaN value

    if @settings.allowFloats
      d = value / 86400
      h = (value / 3600) % 24
      m = (value / 60) % 60
      s = value % 60
    else
      d = Math.floor(value / 86400)
      h = Math.floor((value / 3600) % 24)
      m = Math.floor((value / 60) % 60)
      s = Math.floor(value % 60)

    duration = document.createElement('input')
    duration.type = 'number'
    duration.name = "#{@element.name}_duration"
    duration.className = "duration #{@settings.classes.input}"
    if @settings.required
      duration.required = true
      duration.setAttribute 'data-msg', @settings.required_text
    duration.setAttribute 'step', 1
    duration.setAttribute 'min',  @settings.minimum or 0

    type = document.createElement('select')
    type.classNames = "type #{@settings.classes.select}"

    for field in @settings.allowedFields
      option = document.createElement('option')
      option.className   = @settings.classes[field]
      option.textContent = @settings.text[field]
      option.value       = field
      type.appendChild option

    type.addEventListener 'change', (ev) =>
      if type.value is 'immediately'
        duration.style.display = 'none'
        @settings.immediateCallback()
      else
        duration.style.display = null
        @settings.notImmediateCallback()

    type.style.display = 'none'  if @settings.allowedFields.length is 1

    if Math.floor(d) isnt 0
      type.value = 'days'
      duration.value = d
      duration.style.display = null
    else if Math.floor(h) isnt 0
      type.value = 'hours'
      duration.value = h
      duration.style.display = null
    else if m > 0 or s > 0
      type.value = 'minutes'
      duration.value = m
      duration.style.display = null
    else
      if @settings.allowedFields.indexOf('immediately') isnt -1
        type.value = 'immediately'
        duration.value = 0
        duration.style.display = 'none'
      else
        type.value = 'minutes'
        duration.value = s
        duration.style.display = null

    unless @settings.allowedFields.indexOf('immediately') isnt -1
      duration.style.display = null

    @container.appendChild duration
    @container.appendChild type

    # Events
    onInput = (ev) =>
      new_d = new_h = new_m = 0
      new_d = duration.value  if type.value is 'days'
      new_h = duration.value  if type.value is 'hours'
      new_m = duration.value  if type.value is 'minutes'
      new_d = new_h = new_m = 0  if type.value is 'immediately'
      @element.value = @toSeconds(new_d, new_h, new_m, 0)
      @triggerEvents(['input', 'change'], @element)

    # @container.addEventListener 'input, keyup, keydown, mouseup, mousedown, click, focus, blur, change', 'input, select',
    @container.addEventListener 'keydown', @numericOnly
    @container.addEventListener 'input', onInput
    @container.addEventListener 'change', onInput # Firefox does not fire 'input' on <select> changes.

    # Init
    @element.value = @toSeconds(d, h, m, null)
    @triggerEvents(['input', 'change'], @element)

  toSeconds: (d = 0, h = 0, m = 0, s = 0) ->
    time = (d * 24 * 60 * 60) +
           (h * 60 * 60) +
           (m * 60) +
           s
    parseInt(time)

  triggerEvents: (events, element) ->
    for event in events
      ev = document.createEvent('HTMLEvents')
      ev.initEvent(event, true, false)
      element.dispatchEvent ev
    return

  numericOnly: (e) ->
    # Allow: Backspace, Delete, Tab, Escape, Enter, Return
    return  if [46,8,9,27,13,110].indexOf(e.which) isnt -1
    # Allow: Only one Decimal
    return  if [190].indexOf(e.which) isnt -1 and !(e.currentTarget.value and e.currentTarget.value.match(/\./g))
    # Allow: Ctrl or Command + [A,C,V,X,Z]
    return  if (e.ctrlKey or e.metaKey) is true and [65,67,86,88,90].indexOf(e.which) isnt -1
    # Allow: Up, Down, Home, End, Left, Right
    return  if (e.which >= 35 and e.which <= 40)
    # Ensure that it is a number and stop the keypress.
    e.preventDefault()  if (e.shiftKey or (e.which < 48 or e.which > 57)) and (e.which < 96 or e.which > 105)
    return

  merge: ->
    result = {}
    i = 0
    while i < arguments.length
      obj = arguments[i]
      for key of obj
        if Object::toString.call(obj[key]) is '[object Object]'
          if typeof result[key] is 'undefined'
            result[key] = {}
          result[key] = @merge(result[key], obj[key])
        else
          result[key] = obj[key]
      i += 1
    result

(exports ? window).DurationInput = DurationInput

((factory) ->
  if typeof define is "function" and define.amd
    # AMD
    define ["jquery"], factory
  else if typeof exports is "object"
    # CommonJS
    factory require("jquery")
  else
    # Browser globals
    factory jQuery
  return
) ($) ->
  $.fn['durationInput'] = (options) ->
    @each ->
      unless $.data(this, 'plugin_durationInput') or $(this).parent().hasClass 'duration-container'
        $.data this, 'plugin_durationInput', new DurationInput(this, options)
      return
  return
