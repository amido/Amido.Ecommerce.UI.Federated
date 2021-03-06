import {Provider as ReduxProvider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'

import {Logger} from '@batman/core-logger'
import {configureStore} from '@reduxjs/toolkit'
//@ts-ignore
import headerReducer from 'mfe_header/store'
import {hydrateRoot} from 'react-dom/client'

import counterSlice from '../ducks/counter'
import reportWebVitals from '../reportWebVitals'
import {combineInitialState} from '../utils/combineInitialStates'
import {spliceAllToHead} from '../utils/spliceAllToHead'
import App from './client_app'

const links = document.body.getElementsByTagName('link')
const scripts = document.body.getElementsByTagName('script')
const state = document.querySelectorAll('div.hidden-state')

spliceAllToHead(links)
spliceAllToHead(scripts)

const root = document.getElementById('federated_modules_root_id')

const {initialState} = window as any

const combinedStates = combineInitialState(initialState, state)

const store = configureStore({
  reducer: {counter: counterSlice, headerCounter: headerReducer},
  preloadedState: combinedStates,
})
delete (window as any).initialState

hydrateRoot(
  root!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(Logger.info)
