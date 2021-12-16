// lisp interpreter has 2 parts - parser and an evaluator.

function tokenize (input) {
  let tokenizedInput = input.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ')
  let tokenizedArray = tokenizedInput.trim().split(/\s+/)
  return tokenizedArray
}

function atom (token) {
  let float
  if (!isNaN((float = parseFloat(token)))) return float
  return token
}

function readFromTokens (input) {
  const token = input.shift()
  if (token === '(') {
    let arr = []
    while (input[0] != ')') {
      arr.push(readFromTokens(input))
    }
    input.shift()
    return arr
  }
  return atom(token)
}

function parse (input) {
  return readFromTokens(tokenize(input))
}

const global_env = {
  '+': (a, b) => a + b,
  '-': (a, b) => (b === null ? -a : a - b),
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '%': (a, b) => a % b,
  pi: 3.14,
  pow: (a, b) => Math.pow(a, b),
  length: a => a.length,
  abs: a => Math.abs(a),
  'eq?': (a, b) => a == b,
  'equal?': (a, b) => a === b,
  sqrt: a => Math.sqrt(a),
  max: a => Math.max(a),
  min: a => Math.min(a),
  round: a => Math.round(a),
  not: a => !a,
  'number?': a => !isNaN(a),
  find: a => {
    if (a in global_env) return global_env
    else return null
  }
}

function Env (params, args, parentenv) {
  const environment = {}
  parentenv = parentenv || {}
  if (params.length != 0) {
    for (let i = 0; i < params.length; i += 1) {
      if (!Array.isArray(args)) environment[params[0]] = args
      else {
        for (let i = 0; i < params.length; i++) environment[params[i]] = args[i]
      }
    }
  }
  environment.find = function (variable) {
    if (variable in environment) return environment
    else return parentenv.find(variable)
  }
  return environment
}

function evaluate (x, env) {
  env = env || global_env
  if (typeof x === 'string') return env.find(x)[x]

  if (typeof x === 'number') return x

  if (x[0] === 'define') {
    env[x[1]] = evaluate(x[2], env)
    return
  }

  if (x[0] === 'if') {
    const test = x[1]
    const conseq = x[2]
    const alt = x[3]
    if (evaluate(test, env)) return evaluate(conseq, env)
    return evaluate(alt, env)
  }

  if (x[0] === 'begin') {
    let value
    for (let i = 1; i < x.length; i++) {
      value = evaluate(x[i], env)
    }
    return value
  }

  if (x[0] === 'quote') return x[1]

  if (x[0] === 'set!') {
    if (x[1] in env) {
      env[x[1]] = evaluate(x[2], env)
    }
    return
  }

  if (x[0] === 'lambda') {
    let params = x[1]
    return function (args) {
      return evaluate(x[2], new Env(params, args, env))
    }
  }

  let expression = []
  for (let i = 0; i < x.length; i++) {
    expression[i] = evaluate(x[i], env)
  }
  if (typeof expression[0] === 'function') {
    const proc = expression.shift()
    return proc(...expression)
  }
  return expression
}

const repl = require('repl')
function myEval (cmd, context, filename, callback) {
  callback(null, evaluate(parse(cmd)))
}
repl.start({ prompt: '> ', eval: myEval })
