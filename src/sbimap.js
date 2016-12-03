import {writeFileSync, readFileSync} from 'fs';

export default class SimpleBiMap {
	constructor (keys, values) {
		this.map = new Map();
		if (!keys || !values || keys.length != values.length)
			return this; // explicitly return without using the passed pairs
		this.import({keys, values});
	}

	set (key, val) {
		this.map.set(key, val);
		this.map.set(val, key);
		return this;
	}

	get (key) {
		return this.map.get(key);
	}

	delete (key) {
		return this.map.delete(key);
	}

	clear () {
		this.map.clear();
	}

	dump (filepath) {
		const dumped = {keys: Array.from(this.map.keys()), values: Array.from(this.map.values())};
		if (!filepath)
		  return dumped;
		writeFileSync(filepath, JSON.stringify(dumped));
	}

	import (obj, filepath) {
		let {keys, values} = obj;
		if (filepath) {
			const dumped = JSON.parse(readFileSync(filepath));
			keys = dumped.keys;
			values = dumped.values;
		}
		keys.forEach((key, index) => {
			this.map.set(key, values[index]);
			this.map.set(values[index], key);
		})
		return this;
	}
}
