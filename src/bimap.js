const {writeFileSync, readFileSync} = require('fs')

export default class BiMap {
	constructor(keys, values) {
		this.mapL = new Map()
		this.mapR = new Map()
		if (!keys || !values || keys.length !== values.length)
		  return
		keys.forEach((key, index) => {
			this.mapL.set(key, values[index])
			this.mapR.set(values[index], key)
		})
	}

	set(key, val) {
		this.mapL.set(key, val)
		this.mapR.set(val, key)
		return this
	}

	has(key) {
		return this.mapL.has(key) || this.mapR.has(key)
	}

	get(key) {
		return this.mapL.get(key) || this.mapR.get(key)
	}

	remove(key) {
		this.mapL.delete(key)
		this.mapR.delete(key)
		return this
	}

	dump() {
		return {keys: Array.from(this.mapL.keys()), values: Array.from(this.mapL.values())}
	}

	import({keys, values}) {
		keys.forEach((key, index) => {
			this.mapL.set(key, values[index])
			this.mapR.set(values[index], key)
		})
		return this
	}

	dumpToFile(path) {
		writeFileSync(path, JSON.stringify(this.dump()))
	}

	importFromFile(path) {
		return this.import(JSON.parse(readFileSync(path)))
	}
}
