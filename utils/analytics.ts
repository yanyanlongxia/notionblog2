import ReactGA from 'react-ga'
import config from '../config'

const googleAnalyticsId = config.googleAnalyticsId

export const initGA = () => {
  ReactGA.initialize(googleAnalyticsId)
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
