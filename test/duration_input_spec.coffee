# Are we in iojs?
if require?
  sinon = require('sinon')
  sinonChai = require('sinon-chai')
  chai = require('chai')
  chaiAsPromised = require('chai-as-promised')
  jsdom = require('mocha-jsdom')
  DurationInput = require('../build/duration-input').DurationInput
  $ = require('jquery')

  should = chai.should()
  expect = chai.expect
  chai.should()
  chai.use(sinonChai)
  chai.use(chaiAsPromised)

  jsdom()
else
  DurationInput = window.DurationInput
  sinon  = window.sinon

describe "DurationInput", ->
  # Globals
  root = duration_input = input = input_spy = change_spy = null

  beforeEach ->
    # DOM Setup
    input = document.createElement('input')
    input.id = 'input-1'
    input.type = 'text'
    input.name = 'input-1'
    root = document.querySelector('#root')
    root.appendChild input

    input_spy = sinon.spy()
    change_spy = sinon.spy()
    input.addEventListener('input', input_spy)
    input.addEventListener('change', change_spy)

  afterEach ->
    input.removeEventListener('input', input_spy)
    input.removeEventListener('change', change_spy)
    root.innerHTML = ''

  describe '#constructor', ->
    it 'should render', ->
      duration_input = new DurationInput(document.getElementById('input-1'))
      duration_input.settings.duration.should.equal 0
      document.querySelector('.duration-container input').should.exist
      return

    it 'should render', ->
      duration_input = new DurationInput(document.getElementById('input-1'))
      duration_input.settings.duration.should.equal 0
      document.querySelector('.duration-container input').should.exist
      return

    it 'should allow options', ->
      duration_input = new DurationInput(document.getElementById('input-1'), duration: 120)
      duration_input.settings.duration.should.equal 120
      return

    it 'should allow enabling allowFloats', ->
      duration_input = new DurationInput(document.getElementById('input-1'), duration: 90000, allowFloats: true)
      output = document.querySelector('input.duration')
      output.value.should.equal '1.0416666666666667'
      return

    it 'should allow disabling allowFloats', ->
      duration_input = new DurationInput(document.getElementById('input-1'), duration: 90000, allowFloats: false)
      output = document.querySelector('input.duration')
      output.value.should.equal '1'
      return

    it 'should allow setting required', ->
      duration_input = new DurationInput(document.getElementById('input-1'), duration: 90000, required: true)
      output = document.querySelector('input.duration')
      output.getAttribute('data-msg').should.equal duration_input.settings.required_text
      return

    # it 'should hide the type select when there is only 1 type allowed', ->
    #   duration_input = new DurationInput(document.getElementById('input-1'), duration: 120, allowedFields: ['immediately'])
    #   output = document.querySelector('select.type')
    #   output.style.display.should.equal 'none'
    #   return

    it 'should fire events on initilization', ->
      duration_input = new DurationInput(document.getElementById('input-1'))
      input_spy.callCount.should.equal 1
      change_spy.callCount.should.equal 1
      return

    it 'should fire events on text input', ->
      duration_input = new DurationInput(document.getElementById('input-1'), duration: 60)
      input_spy.callCount.should.equal 1
      change_spy.callCount.should.equal 1

      # Trigger Input
      input = document.querySelector('.duration-container input')
      input.value = 3
      event = document.createEvent("HTMLEvents")
      event.initEvent('input', true, false)
      event.which = 51
      event.keyCode = 51
      input.dispatchEvent event

      input_spy.callCount.should.equal 2

      document.getElementById('input-1').value.should.equal '180'

  describe '#toSeconds', ->
    it 'should convert durations to seconds', ->
      duration_input = new DurationInput(document.getElementById('input-1'))
      seconds = duration_input.toSeconds(1, 0, 0, 0)
      seconds.should.equal 86400
      seconds = duration_input.toSeconds(0, 1, 0, 0)
      seconds.should.equal 3600
      seconds = duration_input.toSeconds(0, 0, 1, 0)
      seconds.should.equal 60
      seconds = duration_input.toSeconds(0, 0, 0, 1)
      seconds.should.equal 1
      seconds = duration_input.toSeconds(4, 3, 2, 1)
      seconds.should.equal 356521
      seconds = duration_input.toSeconds(2)
      seconds.should.equal 172800
      seconds = duration_input.toSeconds()
      seconds.should.equal 0
      return
    return

  describe '#triggerEvents', ->
    it 'should trigger events on a given element', ->
      duration_input = new DurationInput(document.getElementById('input-1'))

      # DOM Setup
      input_events = document.createElement('input')
      input_events.id = 'input-events'
      input_events.type = 'text'
      input_events.name = 'input-events'
      root.appendChild input_events

      # Spy Setup
      events_input_spy = sinon.spy()
      events_change_spy = sinon.spy()
      events_flap_spy = sinon.spy()
      input_events.addEventListener('input', events_input_spy)
      input_events.addEventListener('change', events_change_spy)
      input_events.addEventListener('flap', events_flap_spy)

      duration_input.triggerEvents(['input'], input_events)
      events_input_spy.callCount.should.equal 1
      events_change_spy.callCount.should.equal 0
      events_flap_spy.callCount.should.equal 0

      duration_input.triggerEvents(['change'], input_events)
      events_input_spy.callCount.should.equal 1
      events_change_spy.callCount.should.equal 1
      events_flap_spy.callCount.should.equal 0

      duration_input.triggerEvents(['flap'], input_events)
      events_input_spy.callCount.should.equal 1
      events_change_spy.callCount.should.equal 1
      events_flap_spy.callCount.should.equal 1

      input_events.removeEventListener('input', events_input_spy)
      input_events.removeEventListener('change', events_change_spy)
      input_events.removeEventListener('flap', events_flap_spy)
      return

    return

  describe '#numericOnly', ->
    return

  describe '#merge', ->
    it 'should merge objects', ->
      duration_input = new DurationInput(document.getElementById('input-1'))

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

      options =
        duration: 1
        debug: true
        allowedFields: ['immediately','days','hours','minutes','seconds']
        allowFloats: false
        minimum: 1
        required: true
        required_text: 'MUST HAVE'
        minimums:
          days: 1
          hours: 1
          minutes: 1
        classes:
          container: 'duration-containerz'
          input: 'inputorz'
          select: 'selectorz'
          days: 'dayz'
          hours: 'hourz'
          minutes: 'minutez'
          immediately: 'now'
        text:
          days: 'dayz'
          hours: 'hourz'
          minutes: 'minutez'
          immediately: 'NOW'
        immediateCallback: ->
        notImmediateCallback: ->
        extraCallback: ->

      output = duration_input.merge(defaults, options)
      output.should.deep.equal options

      return

    return

  if $?
    describe 'jQuery Helper', ->
      it 'should create a duration input with options', ->
        $('#input-1').durationInput(duration: 0)
        $('.duration-container input').val().should.equal '0'
        return
      return

  return
