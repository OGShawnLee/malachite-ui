/** Removes white space and unnecessary spaces between words.
 * @param str - string to clear
 * */
export function clearString(str: string) {
	return str.trim().replace(/\s\s+/g, ' ');
}
