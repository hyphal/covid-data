const stream = require('stream')
const { promisify } = require('util')
const pipeline = promisify(stream.pipeline)

const fs = require('fs')
const fsp = fs.promises

const got = require('got')

const URLS = [
  { region: 'gb', url: 'https://www.gov.uk/guidance/coronavirus-covid-19-information-for-the-public' },
  { region: 'it', url: 'http://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5351&area=nuovoCoronavirus&menu=vuoto' },
  { region: 'de', url: 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html' },
  { region: 'de', url: 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Situationsberichte/2020-03-06-en.pdf?__blob=publicationFile', suffix: 'pdf' },
  { region: 'fr', url: 'https://solidarites-sante.gouv.fr/actualites/presse/communiques-de-presse/article/covid-19-ralentir-la-progression-de-l-epidemie-grace-aux-gestes-barrieres' },
  { region: 'fr', url: 'https://www.santepubliquefrance.fr/maladies-et-traumatismes/maladies-et-infections-respiratoires/infection-a-coronavirus/articles/infection-au-nouveau-coronavirus-sars-cov-2-covid-19-france-et-monde' },
  { region: 'ch', url: 'https://www.bag.admin.ch/bag/en/home/krankheiten/ausbrueche-epidemien-pandemien/aktuelle-ausbrueche-epidemien/novel-cov.html#903671355' },
  { region: 'au', url: 'https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert' },
  { region: 'es', url: 'https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/situacionActual.htm' },
  { region: 'es', url: 'https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/documentos/Actualizacion_38_COVID-19.pdf', suffix: 'pdf' },
  { region: 'sg', url: 'https://www.moh.gov.sg/covid-19' },
  { region: 'hk', url: 'https://chp-dashboard.geodata.gov.hk/covid-19/en.html' },
  { region: 'us', url: 'https://edition.cnn.com/2020/03/03/health/us-coronavirus-cases-state-by-state/index.html' },
  { region: 'us', url: 'https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html#2019coronavirus-summary' },
  { region: 'bno', url: 'https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/' },
  { region: 'kr', url: 'http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=' }
]

const timestampISO = new Date().toISOString()
const timestamp = timestampISO.slice(0, 13)

async function download (r, num) {
  const outdir = `output/downloads/${r.region}`
  console.log(`Downloading ${r.region}-${num}`)
  const suffix = r.suffix || 'html'
  const outfile = `${outdir}/${r.region}-${num}-${timestamp}.${suffix}`
  await fsp.mkdir(outdir, { recursive: true })
  await pipeline(
    got.stream(r.url),
    fs.createWriteStream(outfile)
  )
}

async function downloadAll () {
  const regionMap = {}
  await Promise.all(URLS.map(r => {
    const num = (regionMap[r.region] || 0) + 1
    regionMap[r.region] = num
    download(r, num).catch(e => {
      console.error(`[${timestampISO}] Failed to download for ${r.name}`)
      console.error(e)
    })
  }))
}

downloadAll()
