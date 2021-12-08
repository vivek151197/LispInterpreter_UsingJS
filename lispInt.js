// lisp interpreter has 2 parts - parser and an executor.

function tokenize(input) {
	let tokenizedInput = (input.replace(/\(/g , " ( ")).replace(/\)/g , " ) ")
	let tokenizedArray = tokenizedInput.trim().split(/\s+/)
	return tokenizedArray;
}

function atom(token) {
  let float;
  if (!isNaN (float = parseFloat(token))) return float;
  return token;
}

function readFromTokens(input) {
	const token = input.shift();
	if(token === "("){
		let arr = [];
		while(input[0] != ")") {
			arr.push(readFromTokens(input));
		}
		input.shift();
		return arr;
	}
return atom(token);
}

function parse(input) {
	return readFromTokens(tokenize(input));
}

program = '(begin (define r 3) (* 3.14 (* r r)))'
console.log(parse(program));
