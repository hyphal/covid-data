const fs = require('fs')
const xray = require('x-ray')()

function parseBNO (html) {
  xray(html, 'tr', [['td']])(function (err, r) {
    if (err) {
      console.log(err)
      return
    }
    console.log(r)
  })
}

const html = fs.readFileSync('wayback.html', 'utf8')
parseBNO(html)
