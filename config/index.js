'use strict'

import dev from './Index-dev'
import prod from './Index-prod'

const prodEnvWord = 'production'
const prodEnv = process.env.NODE_ENV === prodEnvWord
const index = {
	api: {
		host: ''
	}
}

module.exports = Object.assign(index, prodEnv ? prod : dev)
