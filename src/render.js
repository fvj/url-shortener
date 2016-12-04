import {readFileSync} from 'fs';

/* patterns:
 * consisting of a regexp, capturing the token in the first group,
 * and a function `apply` which transforms the token into the displayed text */
const patterns = [
	{
		regex: /\{\{\s*(\w+)\s*\}\}/g,
		apply: (val, args) => { return args[val]; }
	},
	{
		regex: /\{\{\=(.*)\}\}/g,
		apply: (val, args) => { return eval(val); }
	}
];

export const render = function (template, args) {
	patterns.forEach((curr) => {
		template = template.replace(curr.regex, (match, val) => {
			return curr.apply(val, args);
		})
	});
	return template;
}

export const renderTemplate = function (filepath, args) {
	return render(readFileSync(filepath, 'utf8'), args);
}
