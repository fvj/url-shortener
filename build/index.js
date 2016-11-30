'use strict';

var route = require('spirit-router');
var http = require('http');

var _require$node = require('spirit').node,
    adapter = _require$node.adapter,
    redirect = _require$node.redirect;

var _require = require('crypto'),
    randomBytes = _require.randomBytes;

var _require2 = require('spirit-body'),
    body = _require2.default;

var _require3 = require('querystring'),
    parseString = _require3.parse;

var _require4 = require('./bimap'),
    BiMap = _require4.default;

var mapping = new BiMap();
var notFound = {
	status: 404,
	body: 'Not Found',
	headers: { 'Content-Type': 'text/plain; charset=utf-8' }
};

var index = '\n\t<form method="post">\n\t\t<input type="text" name="url" />\n\t\t<input type="submit" />\n\t</form>'.trim().replace(/\t/g, '');

var lookup = function lookup(url) {
	if (mapping.has(url)) return redirect(mapping.get(url));
	return notFound;
};

var save = function save(body, _ref, protocol) {
	var host = _ref.host;

	var _parseString = parseString(body),
	    url = _parseString.url;

	if (mapping.has(url)) return protocol + '://' + host + '/' + mapping.get(url);

	var token = randomBytes(4).toString('hex');
	while (mapping.has(token)) {
		// don't map two urls to the same token
		token = randomBytes(4).toString('hex');
	}mapping.set(url, token);

	return '<input type="text" onclick="this.select();" value="' + protocol + '://' + host + '/' + mapping.get(url) + '" readonly />';
};

var app = route.define([route.get('/', index), route.wrap(route.post('/', ['body', 'headers', 'protocol'], save), [body]), route.get('/:url', ['url'], lookup), route.any('*', notFound)]);

http.createServer(adapter(app)).listen(3000);