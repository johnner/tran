Tooltip = require('../../js/content_script/tooltip.coffee')

describe "Tooltip", ->
  it "should consctruct Tooltip on start", ->
    expect(Tooltip != undefined).toBe(true)