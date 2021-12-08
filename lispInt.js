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

var global_env = {
  '+': function (a, b) { return a+b },
  '-': function (a, b) { if (b == null) return -a; return a - b },
  '*': function (a, b) { return a * b },
  '/': function (a, b) { return a / b },
  '>': function (a, b) { return a > b },
  '>=': function (a, b) { return a >= b },
  '<': function (a, b) { return a < b },
  '<=': function (a, b) { return a <= b },
  '%': function(a, b) {return a % b },
  'pi': function () { return 3.14 },
  'pow': function (a, b) { return Math.pow(a,b) },
  'length': function (a) { return a.length },
  'abs': function (a) { return Math.abs(a) },
  'append': function (a, b) { return String(a)+String(b) },
  'eq?': function (a, b) { return a == b },
  'equal?': function (a, b) { return a === b },
  'car': function (a) { return a[0] },
  'cdr': function (a) { return a.slice(1) },
  'cons': function (a, b) { a.concat(b); return a },
  'sqrt': function (a) { return Math.sqrt(a) },
  'max': function (a) { return Math.max(a) },
  'min': function (a) { return Math.min(a) },
  'round': function (a) { return Math.round(a) },
  'not': function (a) { return !a },
  'number?': function (a) { return !isNaN(a) }
}

function eval(x, env) {
  env = global_env;
  if(typeof(x) === "string") {
    if(x in env) return env[x];
  }

  else if(typeof(x) === "number") {
    return x;
  }

  else if(x[0] === "define") {
    env[x[1]] = eval(x[2], env);
  }

  else if(x[0] === "if") {
    const test = x[1];
    const conseq = x[2];
    const alt = x[3];
    if(eval(test, env)) 
      return eval(conseq, env);
    return eval(alt, env);
  }

  else if(x[0] === "begin") {
    let value;
    for(let i=1; i<x.length; i++){
      value = eval(x[i], env)
    }
    return value;
  }

  else {
  let expr = [];
  for(let i=0; i<x.length; i++){
    expr[i] = eval(x[i], env);
  }
  const proc = expr.shift();
  return proc(...expr);
  }
}

program = '(begin (define r 3) (* 3.14 (* r r)))'
console.log(eval(parse(program)));

