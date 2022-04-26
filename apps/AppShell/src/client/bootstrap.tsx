import {Provider as ReduxProvider} from 'react-redux'

import {Logger} from '@batman/core-logger'
import {configureStore} from '@reduxjs/toolkit'
import {hydrateRoot} from 'react-dom/client'

import counterSlice from '../ducks/counter'
import reportWebVitals from '../reportWebVitals'
import {spliceAllToHead} from '../utils/spliceAllToHead'
import App from './client_app'

const links = document.body.getElementsByTagName('link')
const scripts = document.body.getElementsByTagName('script')

spliceAllToHead(links)
spliceAllToHead(scripts)

const root = document.getElementById('federated_modules_root_id')

// TODO: type this properly
// TODO: generate from arbitrary reducers
const store = configureStore({reducer: {counter: counterSlice}, preloadedState: (window as any).initialState})
delete (window as any).initialState

hydrateRoot(
  root!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(Logger.info)