import path from 'path'

import {helmetGuard, htmlMiddleware, httpLogger, renderMiddleware} from '@batman/middlewares'
import compression from 'compression'
import express from 'express'

import ReactApp, {ReduxProvider} from '../App'

const publicPath = path.join(__dirname, '/public')
const theme = {}
const renderOptions = {
  app: (
    <ReduxProvider value={theme}>
      <ReactApp />
    </ReduxProvider>
  ),
  errorStatusCode: 206,
}

const app = express()

app.use(compression())
app.use(httpLogger(process.env.NODE_ENV === 'development'))
app.use(helmetGuard)

app.use('/app', htmlMiddleware, renderMiddleware(renderOptions))
// TODO: this works in production mode but not dev
app.use('/', express.static(publicPath))

export default app