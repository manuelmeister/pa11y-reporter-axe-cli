'use strict';

const path = require('path');
const axePath = path.dirname(require.resolve('axe-core'));

const runner = module.exports = {};

/**
 * Scripts which the test runner depends on.
 * @public
 * @type {Array}
 */
runner.scripts = [
	`${axePath}/axe.min.js`
];

/**
 * Run the test runner.
 * @public
 * @param {Object} options - A set of options to run the tests with.
 * @param {Object} pa11y - The Pa11y object, including helper methods.
 * @returns {Promise} Returns a promise which resolves with aXe issues.
 */
runner.run = async options => {

	// Configure and run aXe
	const results = await runAxeCore();
	return results;

	/**
     * Run aXe on the current page.
     * @private
     * @returns {Promise} Returns a promise which resolves with aXe issues.
     */
	async function runAxeCore() {
		const result = await window.axe.run(
			getAxeContext(),
			getAxeOptions()
		);
		return [].concat(
			...result.violations.map(processViolation),
			...result.incomplete.map(processIncomplete)
		);
	}

	/**
     * Get the proper context to pass to aXe, according to the specified Pa11y options. It can be an
     * HTML element or a CSS selector, ready to be used in axe.run().
     * @private
     * @returns {Node | string} Returns a context element
     */
	function getAxeContext() {
		return options.rootElement || window.document;
	}

	/**
     * Get the proper options to pass to aXe, according to the specified Pa11y options, ready to be
     * used in axe.run().
     * @private
     * @returns {RunOptions} Returns a configuration object.
     */
	function getAxeOptions() {
		const axeOptions = {};

		if (options.standard) {
			axeOptions.runOnly = pa11yStandardToAxe();
		}
		if (Array.isArray(options.rules)) {
			axeOptions.rules = pa11yRulesToAxe();
		}

		return axeOptions;
	}

	/**
     * Map the Pa11y standard option to the aXe runOnly option.
     * @private
     * @returns {RunOnly} Returns the aXe runOnly value.
     */
	function pa11yStandardToAxe() {
		switch (options.standard) {
			case 'Section508':
				return {
					type: 'tags',
					values: ['section508', 'best-practice']
				};
			case 'WCAG2A':
				return {
					type: 'tags',
					values: ['wcag2a', 'wcag21a', 'best-practice']
				};
			case 'WCAG2AA':
			case 'WCAG2AAA':
			default:
				return {
					type: 'tags',
					values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa', 'best-practice']
				};
		}
	}

	/**
     * Map the Pa11y rules option to the aXe rules option.
     * @returns {Object} Returns the aXe rules value.
     */
	function pa11yRulesToAxe() {
		const axeRules = {};
		options.rules.forEach(rule => (axeRules[rule] = {enabled: true}));
		return axeRules;
	}

	/**
     * Process an aXe issue with type of "violation".
     * @private
     * @param {Result} issue - An aXe issue to process.
     * @returns {Object} Returns the processed issue.
     */
	function processViolation(issue) {
		return processIssue(issue, 'violation');
	}

	/**
     * Process an aXe issue with type of "incomplete".
     * @private
     * @param {Result} issue - An aXe issue to process.
     * @returns {Object} Returns an array of processed issues.
     */
	function processIncomplete(issue) {
		return processIssue(issue, 'incomplete');
	}

	/**
     * Process an aXe issue.
     * @private
     * @param {Result} axeIssue - An aXe issue to process.
     * @param {string} type - An aXe issue to process.
     * @returns {Object[]} Returns an array of processed issues.
     */
	function processIssue(axeIssue, type) {

		/** @type {NodeResult} element */

		return axeIssue.nodes.map(element => ({
			code: axeIssue.id,
			message: `${axeIssue.help} (${axeIssue.helpUrl})`,
			type: type === 'violation' ? 'error' : 'warning',
			element: element.element,
			runnerExtras: {
				type,
				element,
				axeIssue
			}
		}));
	}

};
