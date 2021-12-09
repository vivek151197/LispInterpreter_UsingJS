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

let global_env = {
  '+': function (a, b) { return a+b },
  '-': function (a, b) { if (b == null) return -a; return a - b },
  '*': function (a, b) { return a * b },
  '/': function (a, b) { return a / b },
  '>': function (a, b) { return a > b },
  '>=': function (a, b) { return a >= b },
  '<': function (a, b) { return a < b },
  '<=': function (a, b) { return a <= b },
  '%': function(a, b) {return a % b },
  'pi' : 3.14,
  'pow' : function (a, b) { return Math.pow(a,b) },
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

function evaluate(x, env) {

  env = env || global_env;

  if(typeof(x) === "string") {
    if(x in env) return env[x];
  }

  else if(typeof(x) === "number") {
    return x;
  }

  else if(x[0] === "define") {
    env[x[1]] = evaluate(x[2], env);
  }

  else if(x[0] === "if") {
    const test = x[1];
    const conseq = x[2];
    const alt = x[3];
    if(evaluate(test, env)) 
      return evaluate(conseq, env);
    return evaluate(alt, env);
  }

  else if(x[0] === "begin") {
    let value;
    for(let i=1; i<x.length; i++){
      value = evaluate(x[i], env)
    }
    return value;
  }

  else if(x[0] === "quote") {
    return x[1];
  }

  else if(x[0] === "set!") {
    if(x[1] in env) {
     env[x[1]] = evaluate(x[2], env);
    }
  }

  else if(x[0] === "lambda") {
    let params = x[1];
    return (
      function(args) {
        for (let i = 0; i < params.length; i++) {
          env[params[i]] = args;
        }
        return (evaluate(x[2], env))
      }
    )
  }

  else {
    let expr = [];
    for(let i=0; i<x.length; i++){
      expr[i] = evaluate(x[i], env);
    }
    const proc = expr.shift();
    return proc(...expr);
  }
}

evaluate(parse('(define repeat (lambda (f) (lambda (x) (f (f x)))))'));
evaluate(parse('(define twice (lambda (x) (* 2 x)))'));
console.log(evaluate(parse('((repeat twice) 10)')))
