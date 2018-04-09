# url-shortener

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> A minimalistic url-shortener using PostgreSQL.

## Background

This is one of the first JS projects I finished. Around two years later I wanted to experiment with AWS RDS
and this project was still using a hacky filesystem persistency solution. Now, it uses PostgreSQL as database,
in my case hosted at AWS, but any instance will suffice.

## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Maintainers](#maintainers)
* [Contribute](#contribute)
* [License](#license)

## Usage

To run, simply supply node with environment variables pointing at your PostgreSQL instance, or by using
[dotenv](https://github.com/motdotla/dotenv). Then, simply run the server: `node src`. By default,
the url shortener is exposed on port 3000.

## Maintainers

[@fvj](https://github.com/fvj)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Julius von Froreich
