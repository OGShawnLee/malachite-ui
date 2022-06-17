/** Trims and replaces whitespace with a single space.
 * @param str - string to clear
 * */
export function clearString(str: string) {
	return str.trim().replace(/\s\s+/g, ' ');
}
