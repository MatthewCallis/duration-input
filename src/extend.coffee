# https://github.com/dansdom/extend/blob/master/extend.js
# http://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
# http://gomakethings.com/ditching-jquery/#extend
extend = (target, source) ->
  output = Object.create(target)
  Object.keys(source).map (property) ->
    property of output and (output[property] = source[property])
    return
  output

merge_no_fn: (input, objects...) ->
  output = JSON.parse(JSON.stringify(input))
  for obj in objects
    output[k] = v for k, v of obj
  output

merge_any: ->
  result = {}
  i = 0
  while i < arguments.length
    obj = arguments[i]
    for key of obj
      if Object::toString.call(obj[key]) is '[object Object]'
        if typeof result[key] is 'undefined'
          result[key] = {}
        result[key] = merge_any(result[key], obj[key])
      else
        result[key] = obj[key]
    i += 1
  result
