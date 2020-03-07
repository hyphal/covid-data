const fs = require('fs')
const fsPromises = fs.promises

// const tinytime = require('tinytime')
const got = require('got')

async function download () {
  const bnoUrl = 'https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/'
  // const url = `http://archive.org/wayback/available?url=${bnoUrl}&timestamp=${'202003'}`
  const url = `http://web.archive.org/cdx/search/cdx?output=json&url=${bnoUrl}&collapse=timestamp:8`
  // const url = `http://archive.org/wayback/available?url=${bnoUrl}`

  const rr = await got(url).json()

  rr.forEach(async r => {
    const ts = r[1]
    const targetUrl = r[2]
    const archiveUrl = `https://web.archive.org/web/${ts}/${targetUrl}`
    const r2 = await got(archiveUrl)
    const filename = `output/bno-${ts}.html`
    await fsPromises.writeFile(filename, r2.body)
  })
}

download()

// const DAY = 1000 * 60 * 60 * 24

// async function downloadRange () {
//   // const start = new Date('2020-01-01').getTime()
//   const start = new Date('2020-03-03').getTime()
//   const end = new Date('2020-03-05').getTime()

//   const template = tinytime('{YYYY}{Mo}{DD}', { padMonth: true, padDays: true })
//   for (let i = start; i < end; i += DAY) {
//     const d = new Date(i)
//     const timestamp = template.render(d)
//     const page = await download(timestamp + '000000')
//     const filename = `output/bno-${timestamp}.html`
//     // await fsPromises.writeFile(filename, page)
//   }
// }

// downloadRange()
