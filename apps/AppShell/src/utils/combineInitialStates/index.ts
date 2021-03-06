import {Logger} from '@batman/core-logger'

export const combineInitialState = (initalState: any, state: any) => {
  const allstates: any = {}

  try {
    const keys = Object.keys(initalState)
    allstates[keys[0]] = initalState[keys[0]]

    Array.from(state).forEach((s: any) => {
      if (s.dataset.state) {
        const obj = JSON.parse(s.innerText.replaceAll('&quot;', '"'))
        const localKeys = Object.keys(obj)
        allstates[localKeys[0]] = obj[localKeys[0]]
        s.remove()
      }
    })
  } catch (err: any) {
    Logger.error(err.message)
  }

  return allstates
}
