Tooltip = require('../../js/content_script/tooltip.coffee')

describe 'Tooltip', ->
  tooltip = {}
  beforeEach ->
    tooltip = new Tooltip()
  it 'should consctruct Tooltip on start', ->
    expect(tooltip != undefined).toBe(true)

  it 'should save given coordinates at start', ->
    coords = {mouseX: 1, mouseY: 2}
    tooltip = new Tooltip(coords)
    expect(tooltip.coordinates).toEqual(coords)

  it 'should set listeners on window and document to close tooltip', ->
    listenersSpy = sinon.spy(tooltip, 'setListeners')
    tooltip.constructor()
    expect(listenersSpy.called).toBeTruthy()

  it 'should initiate clickTarget field', ->
    
