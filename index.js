const http = require('http')
const fs = require('fs')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
)
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
)
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
)

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

// createServer receives a callback function that will run every on every new request on the server
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' })

    const htmlCards = dataObj
      .map(card => replaceTemplate(templateCard, card))
      .join('')
    const overviewPage = templateOverview.replace(
      '{%PRODUCT_CARDS%}',
      htmlCards
    )

    res.end(overviewPage)
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' })
    const product = dataObj[query?.id]
    const productPage = replaceTemplate(templateProduct, product)
    res.end(productPage)
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    })
    res.end(data)
  } else {
    res.end('page not found')
  }
})

// adding the server port and a callback that will run on the first load
server.listen(8000, () => {
  console.log('Server listening on localhost:8000')
})
