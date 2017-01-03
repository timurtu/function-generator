/**
 * Created by timur on 1/2/17.
 */

const cheerio = require('cheerio')
const log = require('gutil-color-log')
const request = require('request-promise')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const path = './public/res/list.json'

function loadList() {
  return [].concat(JSON.parse(fs.readFileSync(path)))
}

function scrape(url, selector) {
  return request(url)
    .then(rawHTML => {

      const $ = cheerio.load(rawHTML)
      const items = loadList()

      $(selector).filter(function () {

        const text = removeQuotes($(this).text())

        if (!items.includes(text)) {
          items.push(text)
        }
      })

      return items

    }).catch(e => log('red', e))
}

const save = items => fs.writeFileSync(path, JSON.stringify(items))

const removeQuotes = str => str.split(/"/).length > 1 ? str.split(/"/)[1] : str

scrape('http://www.phrasemix.com/collections/50-more-of-the-most-important-english-proverbs', '.quoted-title')
  .then(save)
  .then(() => log('cyan', `Saved scraped contents to ${path}.`))
