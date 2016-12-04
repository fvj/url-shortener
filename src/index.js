const route = require('spirit-router')
const http = require('http')
const {adapter, redirect} = require('spirit').node
const {randomBytes} = require('crypto')
const {default: body} = require('spirit-body')
const {parse: parseString} = require('querystring')
const {default: SimpleBiMap} = require('./sbimap')
const {existsSync: fileExists} = require('fs')

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
		return `<input type="text" onclick="this.select();"
			 value="${protocol}://${host}/${mapping.get(url)} readyonly />`

	let token = randomBytes(4).toString('hex')
	while (mapping.has(token))
		token = randomBytes(4).toString('hex')

	mapping.set(url, token)

	return `<input type="text" onclick="this.select();"
		value="${protocol}://${host}/${mapping.get(url)}" readonly />`
}

const constructApp = (path) => {
	if (!fileExists(path))
		(new SimpleBiMap()).dumpToFile(path)
	mapping = new SimpleBiMap().importFromFile(path)
	return route.define([
		route.get('/', index),
		route.wrap(route.post('/', ['body', 'headers', 'protocol'], save), [body]),
		route.get('/:url', ['url'], lookup),
		route.any('*', notFound)
	])
}

const databasePath = './database.json'
const port = 3000
let mapping = undefined
const app = constructApp(databasePath)

http.createServer(adapter(app)).listen(port, () => {
	console.log(`Running server on port ${port}, database path: ${databasePath}`)
})

process.on('SIGINT', () => {
	console.log(`Caught SIGINT. Dumping database to ${databasePath}`)
	mapping.dumpToFile(databasePath)
	console.log(`Dump complete. Godspeed.`)
	process.exit(1)
})
