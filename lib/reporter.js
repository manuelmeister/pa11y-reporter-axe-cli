'use strict';

const {cyan, green, grey, red, underline, yellow, bold, blue, italic} = require('kleur');

const report = module.exports = {};

// Helper strings for use in reporter methods
const start = cyan(' >');

const typeImpact = {
	critical: bold(red('⃠ Critical:')),
	serious: red('‼️Serious:'),
	moderate: yellow('⚠️Moderate:'),
	minor: blue('ℹ️Minor:')
};

// Output the welcome message once Pa11y begins testing
report.begin = () => {
	return cleanWhitespace(`

		${cyan(underline('Welcome to Pa11y'))}

	`);
};

const impactLevel = [
	'pass',
	'minor',
	'moderate',
	'serious',
	'critical'
];

const sortByImpactLevel = (o1, o2) => {
	return impactLevel.indexOf(o1.runnerExtras.element.impact) - impactLevel.indexOf(o2.runnerExtras.element.impact);
};

// Output formatted results
report.results = results => {
	if (results.issues.length) {
		return cleanWhitespace(`

			${underline(`Results for URL: ${results.pageUrl}`)}
			${results.issues.sort(sortByImpactLevel).map(report.issue).join('\n')}

			${report.totals(results)}

		`);
	}
	return cleanWhitespace(`

		${green('No issues found!')}

	`);
};

// Internal method used to report an individual result
report.issue = issue => {

	/**
     * @type {NodeResult} element
     */
	const element = issue.runnerExtras.element;
	const axeIssue = issue.runnerExtras.axeIssue;
	const type = issue.runnerExtras.type;
	return cleanWhitespace(`
${typeImpact[element.impact]} ${axeIssue.help} ${type === 'incomplete' ? yellow('(incomplete)') : ''}
[${axeIssue.id}](${axeIssue.helpUrl})
${grey(`[${element.target.join(' > ')}]`)} ${grey(`${element.html}`)}
${grey(italic(element.failureSummary))}

	`);
};

// Internal method used to report issue totals
report.totals = results => {
	const totals = {
		critical: results.issues.filter(issue => issue.runnerExtras.axeIssue.impact === 'critical'),
		serious: results.issues.filter(issue => issue.runnerExtras.axeIssue.impact === 'serious'),
		moderate: results.issues.filter(issue => issue.runnerExtras.axeIssue.impact === 'moderate'),
		minor: results.issues.filter(issue => issue.runnerExtras.axeIssue.impact === 'minor')
	};
	const output = [bold(underline('Totals count (incomplete count)'))];
	Object.entries(totals).forEach(([type, items]) => {
		const incomplete = items.filter(issue => issue.runnerExtras.type === 'incomplete').length;
		output.push(`${typeImpact[type]} ${items.length - incomplete} (${incomplete})`);
	});
	return output.join('\n');
};

// Output error messages
report.error = message => {
	if (!/^error:/i.test(message)) {
		message = `Error: ${message}`;
	}
	return cleanWhitespace(`

		${red(message)}

	`);
};

// Output debug messages
report.debug = message => {
	message = `Debug: ${message}`;
	return cleanWhitespace(`
		${start} ${grey(message)}
	`);
};

// Output information messages
report.info = message => {
	return cleanWhitespace(`
		${start} ${message}
	`);
};

// Clean whitespace from output. This function is used to keep
// the reporter code a little cleaner
function cleanWhitespace(string) {
	return string.replace(/\t+|^\t*\n|\n\t*$/g, '');
}
