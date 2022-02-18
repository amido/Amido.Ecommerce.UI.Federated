const React = require('react')

const {json} = require('body-parser')
const cors = require('cors')
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv').config()
const express = require('express')
const {renderToPipeableStream, renderToStaticMarkup} = require('react-dom/server')

const App = require('./dist/app').default
const remoteEntry = require('./dist/remote-entry')
const federationStats = require('./public/build/federation-stats.json')
const stats = require('./public/build/stats.json')

const PORT = dotenv.PORT || '3001'

const exposes = federationStats.federatedModules.find(m => m.remote === 'webpackRemote').exposes

function getChunksForExposed(exposed) {
  return exposes[exposed].reduce((p, c) => {
    p.push(...c.chunks)
    return p
  }, [])
}

const remoteInitPromise = remoteEntry.init({
  react: {
    [React.version]: {
      get: () => () => React,
    },
  },
})

const app = express()

app.use('/', cors(), express.static('./public'))

app.use('/prerender', json(), async (req, res, next) => {
  if (!req.body.module) {
    next()
    return
  }

  try {
    const chunks = getChunksForExposed(req.body.module)

    await remoteInitPromise

    const factory = await remoteEntry.get(req.body.module)
    let Component = factory()
    Component = (Component && Component.default) || Component

    const html = renderToStaticMarkup(React.createElement(Component, req.body.props || {}, `\u200Cchildren\u200C`))

    res.json({
      chunks,
      html,
    })
  } catch (err) {
    console.log('err', err)
    next(err)
  }
})

app.use('/', (req, res) => {
  if (req.path !== '/') {
    res.status(404)
    res.send()
    return
  }

  const chunksAppAndBootstrap = stats.assetsByChunkName.app.concat(stats.assetsByChunkName.bootstrap)
  const chunks = chunksAppAndBootstrap.concat(
    stats.chunks.reduce((r, chunk) => {
      if (chunk.runtime.includes('app')) {
        r.push(...chunk.files.filter(f => !chunksAppAndBootstrap.includes(f)))
      }

      return r
    }, []),
  )

  let didError = false
  const {pipe, abort} = renderToPipeableStream(React.createElement(App, {chunks}), {
    onCompleteShell() {
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200
      res.contentType('html')
      res.write('<!DOCTYPE html>')
      pipe(res)
    },
    onError(x) {
      didError = true
      console.error(x)
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  setTimeout(abort, 5000)
})

app.listen(PORT, () => console.log(`webpack remote: started at http://localhost:${PORT}`))
