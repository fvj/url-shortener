const route = require('spirit-router')
const http = require('http')
const {adapter, redirect} = require('spirit').node
const {randomBytes} = require('crypto')
const {default: body} = require('spirit-body')
const {parse: parseString} = require('querystring')
const {default: BiMap} = require('./bimap')

const mapping = new BiMap()
const notFound = {
	status: 404,
	body: 'Not Found',
	headers: { 'Content-Type': 'text/plain; charset=utf-8' }
}

const index = `
	<form method="post">
		<input type="text" name="url" />
		<input type="submit" />
	</form>`.trim().replace(/\t/g, '')

const lookup = (url) => {
	if (mapping.has(url))
		return redirect(mapping.get(url))
	return notFound
}

const save = (body, {host}, protocol) => {
	const {url} = parseString(body)

	if (mapping.has(url))
		return `<input type="text" onclick="this.select();" value="${protocol}://${host}/${mapping.get(url)} readyonly />`

	let token = randomBytes(4).toString('hex')
	while (mapping.has(token))                  // don't map two urls to the same token
		token = randomBytes(4).toString('hex')

	mapping.set(url, token)

	return `<input type="text" onclick="this.select();" value="${protocol}://${host}/${mapping.get(url)}" readonly />`
}

const app = route.define([
	route.get('/', index),
	route.wrap(route.post('/', ['body', 'headers', 'protocol'], save), [body]),
	route.get('/:url', ['url'], lookup),
	route.any('*', notFound)
])

http.createServer(adapter(app)).listen(3000)