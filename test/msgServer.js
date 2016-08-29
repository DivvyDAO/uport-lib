const assert = require('chai').assert
const xhr = process.browser ? require('xhr') : require('request')
const MsgServer = require('../lib/msgServer.js')

const chasquiUrl = 'https://chasqui.uport.me/'
const testHref = 'http://not.real.url/'

let topic1 = ''
let topic2 = ''
let msgServer = ''

describe('MsgServer', function () {
  this.timeout(10000)

  describe('On desktop', () => {
    before(() => { msgServer = new MsgServer(chasquiUrl, false) })

    it('Creates new topics correctly', (done) => {
      topic1 = msgServer.newTopic('address')
      assert.equal(topic1.name, 'address')
      assert.equal(topic1.id.length, 16)
      assert.equal(topic1.url, chasquiUrl + 'addr/' + topic1.id)

      topic2 = msgServer.newTopic('tx')
      assert.equal(topic2.name, 'tx')
      assert.equal(topic2.id.length, 16)
      assert.equal(topic2.url, chasquiUrl + 'tx/' + topic2.id)

      done()
    })

    it('Correctly polls for data', (done) => {
      var data = '0x123456789'
      msgServer.waitForResult(topic1, function (err, res) {
        assert.equal(res, data, 'Should get correct data from server.')
        assert.isNull(err)
        done()
      })
      setTimeout(
        postData.bind(null, topic1, data),
        3000
      )
    })

    it('Gives error if polling yeilds error', (done) => {
      var data = 'some weird error'
      msgServer.waitForResult(topic2, function (err, res) {
        assert.equal(err, data)
        assert.isUndefined(res)
        done()
      })
      var errorTopic = topic2
      errorTopic.name = 'error'
      setTimeout(
        postData.bind(null, errorTopic, data),
        3000
      )
    })

    it('Has cleared topic', (done) => {
      postData(topic1, '0x234', (e, r, b) => {
        assert.equal(b, topic1.id + ' not found!')
        done()
      })
    })
  })

  describe('On Mobile', () => {
    before(() => {
      msgServer = new MsgServer(chasquiUrl, true)
      global.window = {}
      global.wimdow.location = { href: testHref }
    })

    it('Creates new topics correctly', (done) => {
      topic1 = msgServer.newTopic('address')
      assert.equal(topic1.name, 'address')
      assert.equal(topic1.url, testHref)

      topic2 = msgServer.newTopic('tx')
      assert.equal(topic2.name, 'tx')
      assert.equal(topic2.url, testHref)

      done()
    })

    it('Correctly waits for data', (done) => {
      var data = '0x123456789'
      msgServer.waitForResult(topic1, function (err, res) {
        assert.equal(res, data, 'Should get correct data.')
        assert.isNull(err)
        done()
      })
      global.window.location.hash = '#' + topic1.name + '=' + data
      global.window.onhashchange()
    })

    it('Gives error if error posted', (done) => {
      var data = 'some weird error'
      msgServer.waitForResult(topic2, function (err, res) {
        assert.equal(err, data)
        assert.isUndefined(res)
        done()
      })
      global.window.location.hash = '#error=' + data
      global.window.onhashchange()
    })
  })
})

function postData (topic, data, cb) {
  let body = {}
  body[topic.name] = data
  if (!cb) cb = () => {}
  xhr({
    uri: topic.url,
    method: 'POST',
    rejectUnautohorized: false,
    json: body
  }, cb)
}
