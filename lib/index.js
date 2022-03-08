'use strict';

const runner = require('./runner');
const reporter = require('./reporter');


module.exports = {
	supports: '^6',
	run: runner.run,
	scripts: runner.scripts,
	begin: reporter.begin,
	error: reporter.error,
	debug: reporter.debug,
	info: reporter.info,
	results: reporter.results
};
