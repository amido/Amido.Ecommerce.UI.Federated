import React from 'react'

import {REMOTE_URLS} from '../config'
import federatedComponent, {context} from './federated-component'
import Header from './header'

export {context}

// const Paragraph = federatedComponent('webpackRemote2', './paragraph')

export const App = ({chunks}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Webpack Remote</title>

        {chunks.map(c => (c.endsWith('.css') ? <link key={c} rel="stylesheet" href={`build/${c}`} /> : null))}
      </head>
      <body>
        <React.Suspense fallback="">
          <Header>
            <h1>Header</h1>
            {/* <Paragraph>Paragraph from different remote</Paragraph> */}
          </Header>
        </React.Suspense>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.__CHUNKS__ = ${JSON.stringify(chunks)};`,
          }}
        />

        {chunks.map(c => (c.endsWith('.js') ? <script key={c} src={`build/${c}`} /> : null))}

        {Object.entries(REMOTE_URLS).map(([, entry]) => (
          <script key="$_url" src={`${entry}/build/remote-entry.js`} />
        ))}
      </body>
    </html>
  )
}

export default App
