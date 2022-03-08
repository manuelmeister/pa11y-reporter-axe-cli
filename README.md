# Pa11y Axe CLI Reporter
[![NPM version][shield-npm]][info-npm]
[![LGPL-3.0 licensed][shield-license]][info-license]

## Table Of Contents

* [Requirements](#requirements)
  * [Compatibility chart](#compatibility-chart)
* [Usage](#usage)
  * [Command-Line](#command-line)
  * [JavaScript](#javascript)
* [Contributing](#contributing)
* [License](#license)

## Requirements

Pa11y CLI Reporter is compatible with Pa11y 5 and later versions. It will not work with older versions of Pa11y.

## Usage

### Command-Line

Install Pa11y and Pa11y CLI Reporter with [npm](https://www.npmjs.com/) (locally or globally is fine):

```sh
npm install -g pa11y pa11y-reporter-axe-cli
```

Run Pa11y using the CLI reporter:

```sh
pa11y --runner pa11y-reporter-axe-cli --reporter axe-cli http://example.com
```

## License

Pa11y CLI Reporter is licensed under the [Lesser General Public License (LGPL-3.0)][info-license].  
Copyright &copy; 2017, Team Pa11y

[info-license]: LICENSE
[info-npm]: https://www.npmjs.com/package/pa11y
[shield-license]: https://img.shields.io/badge/license-LGPL%203.0-blue.svg
[shield-npm]: https://img.shields.io/npm/v/pa11y-reporter-axe-cli.svg
