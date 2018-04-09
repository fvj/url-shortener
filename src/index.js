const route = require('spirit-router')
const http = require('http')
const { adapter, redirect } = require('spirit').node
const { randomBytes } = require('crypto')
const { defaults } = require('spirit-common')
const { Pool, Client } = require('pg')
require('dotenv').load()

const middleware = defaults('api') // we don't need sessions for now
const JSON_USER_AGENT_FRAGMENTS = ['curl', 'httpie'] // user agent fragments, matching user-agents will receive json

const notFound = {
	status: 404,
	body: 'Not Found',
	headers: { 'Content-Type': 'text/plain; charset=utf-8' },
}

const badRequest = errors => ({
	status: 400,
	headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify(errors),
})

const index = `
	<form method="post">
		<input type="text" name="url" />
		<input type="submit" />
	</form>`
	.trim()
	.replace(/\t/g, '')

const generateId = () =>
	Math.random()
		.toString(36)
		.slice(2, 12) // max-length of 10 (12-2)

const lookup = id => {
	return pool.query('SELECT url FROM links WHERE id=$1;', [id]).then(res => {
		if (res.rows.length > 0 && 'url' in res.rows[0])
			return redirect(res.rows[0].url)
		return notFound
	})
}

const save = (body, headers, protocol, ip) => {
	const { url } = body
	const userAgent = headers['user-agent'].toLowerCase()
	let id = generateId()

	if (!url) return badRequest({ url: 'missing field' })

	return pool
		.query(
			'INSERT INTO links (id, url, ip, created_at, updated_at) VALUES ($1, $2, $3, current_timestamp, current_timestamp) RETURNING id;',
			[id, url, ip]
		)
		.then(res => {
			if (res.rows.length === 0 || !('id' in res.rows[0]))
				return { status: 500, body: 'Internal server error' }

			const tiny = `${protocol}://${headers.host}/${res.rows[0].id}`

			if (
				JSON_USER_AGENT_FRAGMENTS.find(
					fragment => userAgent.indexOf(fragment) != -1
				)
			)
				return {
					status: 200,
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
					body: tiny,
				}

			return `<input type="text" onclick="this.select();" value="${tiny}" readonly />`
		})
}

const port = 3000
const app = route.define([
	route.get('/', index),
	route.wrap(route.post('/', ['body', 'headers', 'protocol', 'ip'], save), [
		middleware,
	]),
	route.get('/:id', ['id'], lookup),
	route.any('*', notFound),
])

// gets its configuration from environment variables (PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT)
const pool = new Pool()

http.createServer(adapter(app)).listen(port, () => {
	console.log(`Running server on port ${port}`)
})
