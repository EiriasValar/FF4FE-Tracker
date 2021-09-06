(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.as.U === region.aB.U)
	{
		return 'on line ' + region.as.U;
	}
	return 'on lines ' + region.as.U + ' through ' + region.aB.U;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.be,
		impl.bB,
		impl.bz,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		bi: func(record.bi),
		bx: record.bx,
		bt: record.bt
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.bi;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bx;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bt) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.be,
		impl.bB,
		impl.bz,
		function(sendToApp, initialModel) {
			var view = impl.bD;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.be,
		impl.bB,
		impl.bz,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ar && impl.ar(sendToApp)
			var view = impl.bD;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.a4);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.O) && (_VirtualDom_doc.title = title = doc.O);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bo;
	var onUrlRequest = impl.bp;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ar: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aR === next.aR
							&& curr.aF === next.aF
							&& curr.aO.a === next.aO.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		be: function(flags)
		{
			return A3(impl.be, flags, _Browser_getUrl(), key);
		},
		bD: impl.bD,
		bB: impl.bB,
		bz: impl.bz
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bb: 'hidden', a6: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bb: 'mozHidden', a6: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bb: 'msHidden', a6: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bb: 'webkitHidden', a6: 'webkitvisibilitychange' }
		: { bb: 'hidden', a6: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aV: _Browser_getScene(),
		aZ: {
			a$: _Browser_window.pageXOffset,
			a0: _Browser_window.pageYOffset,
			a_: _Browser_doc.documentElement.clientWidth,
			aE: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		a_: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aE: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aV: {
				a_: node.scrollWidth,
				aE: node.scrollHeight
			},
			aZ: {
				a$: node.scrollLeft,
				a0: node.scrollTop,
				a_: node.clientWidth,
				aE: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aV: _Browser_getScene(),
			aZ: {
				a$: x,
				a0: y,
				a_: _Browser_doc.documentElement.clientWidth,
				aE: _Browser_doc.documentElement.clientHeight
			},
			a8: {
				a$: x + rect.left,
				a0: y + rect.top,
				a_: rect.width,
				aE: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.bj) { flags += 'm'; }
	if (options.a5) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.d) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.d * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.d);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{j: nodeList, d: (len / $elm$core$Array$branchFactor) | 0, g: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aD: fragment, aF: host, aM: path, aO: port_, aR: protocol, aS: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Value$Characters = 0;
var $author$project$Value$Chests = 3;
var $author$project$Value$Hide = 1;
var $author$project$Value$KeyItems = 2;
var $author$project$Value$Show = 0;
var $author$project$Value$Healing = function (a) {
	return {$: 3, a: a};
};
var $author$project$Value$JItem = function (a) {
	return {$: 4, a: a};
};
var $author$project$Location$Location = $elm$core$Basics$identity;
var $author$project$Location$Locations = $elm$core$Basics$identity;
var $author$project$Location$Moon = 2;
var $author$project$Value$Other = function (a) {
	return {$: 5, a: a};
};
var $author$project$Location$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Value$Shop = function (a) {
	return {$: 5, a: a};
};
var $author$project$Location$Surface = 0;
var $author$project$Location$Underground = 1;
var $author$project$Status$Unseen = {$: 0};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{j: nodeList, d: nodeListSize, g: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $pzp1997$assoc_list$AssocList$D = $elm$core$Basics$identity;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $pzp1997$assoc_list$AssocList$remove = F2(
	function (targetKey, _v0) {
		var alist = _v0;
		return A2(
			$elm$core$List$filter,
			function (_v1) {
				var key = _v1.a;
				return !_Utils_eq(key, targetKey);
			},
			alist);
	});
var $pzp1997$assoc_list$AssocList$insert = F3(
	function (key, value, dict) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$remove, key, dict);
		var alteredAlist = _v0;
		return A2(
			$elm$core$List$cons,
			_Utils_Tuple2(key, value),
			alteredAlist);
	});
var $pzp1997$assoc_list$AssocList$fromList = function (alist) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, result) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($pzp1997$assoc_list$AssocList$insert, key, value, result);
			}),
		_List_Nil,
		alist);
};
var $Gizra$elm_all_set$EverySet$EverySet = $elm$core$Basics$identity;
var $pzp1997$assoc_list$AssocList$empty = _List_Nil;
var $Gizra$elm_all_set$EverySet$empty = $pzp1997$assoc_list$AssocList$empty;
var $Gizra$elm_all_set$EverySet$insert = F2(
	function (k, _v0) {
		var d = _v0;
		return A3($pzp1997$assoc_list$AssocList$insert, k, 0, d);
	});
var $Gizra$elm_all_set$EverySet$fromList = function (xs) {
	return A3($elm$core$List$foldl, $Gizra$elm_all_set$EverySet$insert, $Gizra$elm_all_set$EverySet$empty, xs);
};
var $author$project$ConsumableItems$ConsumableItems = $elm$core$Basics$identity;
var $author$project$ConsumableItems$healingItems = $elm$core$Array$fromList(
	A2(
		$elm$core$List$map,
		function (_v0) {
			var name = _v0.bk;
			var tier = _v0.f;
			return {ac: false, bk: name, aW: $author$project$Status$Unseen, f: tier};
		},
		_List_fromArray(
			[
				{bk: 'Cure2', f: 3},
				{bk: 'Cure3', f: 4},
				{bk: 'Life', f: 2},
				{bk: 'Tent', f: 2},
				{bk: 'Cabin', f: 4},
				{bk: 'Ether', f: 3},
				{bk: 'Status-healing', f: 1}
			])));
var $author$project$ConsumableItems$jItems = $elm$core$Array$fromList(
	A2(
		$elm$core$List$map,
		function (_v0) {
			var name = _v0.bk;
			var tier = _v0.f;
			return {ac: true, bk: name, aW: $author$project$Status$Unseen, f: tier};
		},
		_List_fromArray(
			[
				{bk: 'Bacchus', f: 5},
				{bk: 'Coffin', f: 5},
				{bk: 'Hourglass', f: 5},
				{bk: 'Moonveil', f: 7},
				{bk: 'Siren', f: 5},
				{bk: 'Starveil', f: 2},
				{bk: 'Vampire', f: 4}
			])));
var $author$project$Objective$Bahamut = 27;
var $author$project$Value$Boss = function (a) {
	return {$: 1, a: a};
};
var $author$project$Location$CaveBahamut = 54;
var $author$project$Objective$CaveBahamut = 18;
var $author$project$Value$Character = function (a) {
	return {$: 0, a: a};
};
var $author$project$Value$Chest = function (a) {
	return {$: 3, a: a};
};
var $author$project$Objective$DLunars = 33;
var $author$project$Objective$DefeatBoss = function (a) {
	return {$: 5, a: a};
};
var $author$project$Objective$DoQuest = function (a) {
	return {$: 6, a: a};
};
var $author$project$Value$Gated = 1;
var $author$project$Location$Hummingway = 53;
var $author$project$Value$Item = {$: 2};
var $author$project$Value$KeyItem = function (a) {
	return {$: 2, a: a};
};
var $author$project$Location$LunarPath = 55;
var $author$project$Location$LunarSubterrane = 56;
var $author$project$Location$MasamuneAltar = 61;
var $author$project$Objective$MasamuneAltar = 23;
var $author$project$Flags$MoonBoss = 3;
var $author$project$Location$MurasameAltar = 57;
var $author$project$Objective$MurasameAltar = 19;
var $author$project$Value$Objective = function (a) {
	return {$: 7, a: a};
};
var $author$project$Objective$Ogopogo = 34;
var $author$project$Objective$PaleDim = 30;
var $author$project$Objective$Plague = 32;
var $author$project$Location$RibbonRoom = 60;
var $author$project$Objective$RibbonRoom = 22;
var $author$project$Flags$Summon = 2;
var $author$project$Value$TrappedChest = function (a) {
	return {$: 4, a: a};
};
var $author$project$Location$WhiteSpearAltar = 59;
var $author$project$Objective$WhiteSpearAltar = 21;
var $author$project$Objective$Wyvern = 31;
var $author$project$Location$WyvernAltar = 58;
var $author$project$Objective$WyvernAltar = 20;
var $author$project$Location$moon = _List_fromArray(
	[
		{
		r: 53,
		bk: 'Hummingway',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 54,
		bk: 'Cave Bahamut',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 174, ax: 13, b: 35000, c: 0, bc: 99, aG: 37000, bg: 17, aI: 27, ag: 27, bC: 170}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(27)),
				$author$project$Value$KeyItem(2),
				$author$project$Value$Chest(4),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(18))
			])
	},
		{
		r: 55,
		bk: 'Lunar Path',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(2),
				$author$project$Value$TrappedChest(1)
			])
	},
		{
		r: 56,
		bk: 'Lunar Palace',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Character(1),
				$author$project$Value$Chest(21),
				$author$project$Value$TrappedChest(9)
			])
	},
		{
		r: 57,
		bk: 'Altar 1 (Murasame)',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 144, ax: 11, b: 59000, c: 0, bc: 85, aG: 27300, bg: 31, aI: 43, ag: 40, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(30)),
				$author$project$Value$KeyItem(3),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(19))
			])
	},
		{
		r: 58,
		bk: 'Altar 2 (Crystal Sword)',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 160, ax: 12, b: 64300, c: 0, bc: 90, aG: 25000, bg: 8, aI: 46, ag: 43, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(31)),
				$author$project$Value$KeyItem(3),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(20))
			])
	},
		{
		r: 59,
		bk: 'Altar 3 (White Spear)',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 146, ax: 11, b: 31200, c: 550, bc: 90, aG: 28000, bg: 96, aI: 32, ag: 29, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(32)),
				$author$project$Value$KeyItem(3),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(21))
			])
	},
		{
		r: 60,
		bk: 'Altar 4 (Ribbons)',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 144, ax: 11, b: 100000, c: 0, bc: 85, aG: 42000, bg: 36, aI: 30, ag: 30, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(33)),
				$author$project$Value$KeyItem(3),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(22))
			])
	},
		{
		r: 61,
		bk: 'Altar 5 (Masamune)',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 150, ax: 11, b: 61100, c: 0, bc: 99, aG: 37000, bg: 127, aI: 38, ag: 38, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(34)),
				$author$project$Value$KeyItem(3),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(23))
			])
	}
	]);
var $author$project$Location$AdamantGrotto = 33;
var $author$project$Location$Agart = 29;
var $author$project$Location$AgartShops = 30;
var $author$project$Objective$Antlion = 3;
var $author$project$Location$AntlionCave = 10;
var $author$project$Objective$AntlionCave = 2;
var $author$project$Value$Armour = {$: 1};
var $author$project$Objective$Baigan = 12;
var $author$project$Location$Baron = 18;
var $author$project$Location$BaronBasement = 22;
var $author$project$Objective$BaronBasement = 16;
var $author$project$Location$BaronCastle = 21;
var $author$project$Objective$BaronCastle = 7;
var $author$project$Objective$BaronInn = 6;
var $author$project$Requirement$BaronKey = {$: 2};
var $author$project$Location$BaronSewer = 20;
var $author$project$Location$BaronShop = 19;
var $author$project$Objective$BigWhale = 32;
var $author$project$Objective$CPU = 29;
var $author$project$Location$CastleEblan = 34;
var $author$project$Location$CaveEblan = 35;
var $author$project$Location$CaveEblanShops = 36;
var $author$project$Location$CaveMagnes = 27;
var $author$project$Objective$CaveMagnes = 8;
var $author$project$Objective$ClassicGiant = {$: 1};
var $author$project$Objective$DMist = 0;
var $author$project$Location$Damcyan = 9;
var $author$project$Objective$DarkElf = 14;
var $author$project$Objective$DarkKnight = 9;
var $author$project$Requirement$DarknessCrystal = {$: 6};
var $author$project$Requirement$EarthCrystal = {$: 7};
var $author$project$Objective$Elements = 28;
var $author$project$Objective$Fabul = 4;
var $author$project$Location$FabulDefence = 13;
var $author$project$Location$FabulShops = 12;
var $author$project$Objective$Falcon = 12;
var $author$project$Requirement$Falcon = 5;
var $author$project$Flags$Free = 5;
var $author$project$Value$GatedValue = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Objective$Gauntlet = 6;
var $author$project$Location$Giant = 38;
var $author$project$Objective$Giant = 17;
var $author$project$Objective$Guards = 10;
var $author$project$Requirement$Hook = {$: 9};
var $author$project$Objective$KQEblan = 21;
var $author$project$Objective$Kainazzo = 13;
var $author$project$Location$Kaipo = 5;
var $author$project$Location$KaipoShops = 6;
var $author$project$Objective$Karate = 11;
var $author$project$Objective$MagmaKey = 29;
var $author$project$Requirement$MagmaKey = {$: 4};
var $author$project$Objective$MagusSisters = 15;
var $author$project$Flags$Main = 0;
var $author$project$Objective$Milon = 7;
var $author$project$Objective$MilonZ = 8;
var $author$project$Location$MistCave = 0;
var $author$project$Objective$MistCave = 0;
var $author$project$Requirement$MistDragon = 1;
var $author$project$Location$MistVillage = 1;
var $author$project$Location$MistVillageMom = 4;
var $author$project$Location$MistVillagePackage = 3;
var $author$project$Location$MistVillageShops = 2;
var $author$project$Objective$MomBomb = 5;
var $author$project$Location$MtHobs = 11;
var $author$project$Objective$MtHobs = 3;
var $author$project$Location$MtOrdeals = 17;
var $author$project$Objective$MtOrdeals = 5;
var $author$project$Location$Mysidia = 15;
var $author$project$Location$MysidiaShops = 16;
var $author$project$Objective$Octomamm = 2;
var $author$project$Objective$Odin = 26;
var $author$project$Objective$Officer = 1;
var $author$project$Objective$Package = 24;
var $author$project$Requirement$Package = {$: 0};
var $author$project$Objective$PanReturn = 36;
var $author$project$Objective$Pass = 38;
var $author$project$Requirement$Pass = 0;
var $author$project$Objective$PinkTail = 37;
var $author$project$Requirement$PinkTail = {$: 16};
var $author$project$Requirement$Pseudo = function (a) {
	return {$: 17, a: a};
};
var $author$project$Objective$RatTail = 33;
var $author$project$Requirement$RatTail = {$: 12};
var $author$project$Value$Requirement = function (a) {
	return {$: 6, a: a};
};
var $author$project$Objective$Rubicant = 22;
var $author$project$Objective$SandRuby = 25;
var $author$project$Requirement$SandRuby = {$: 1};
var $author$project$Location$Sheila = 14;
var $author$project$Location$Silvera = 31;
var $author$project$Location$SilveraShops = 32;
var $author$project$Location$Toroia = 23;
var $author$project$Location$ToroiaCastle = 25;
var $author$project$Location$ToroiaShops = 24;
var $author$project$Location$ToroiaTreasury = 26;
var $author$project$Objective$TowerZot = 9;
var $author$project$Objective$Treasury = 28;
var $author$project$Objective$TwinHarp = 27;
var $author$project$Requirement$TwinHarp = {$: 10};
var $author$project$Value$Ungated = 0;
var $author$project$Objective$UnlockSewer = 26;
var $author$project$Location$UpperBabil = 37;
var $author$project$Objective$Valvalis = 16;
var $author$project$Flags$Vanilla = 6;
var $author$project$Location$Waterfall = 8;
var $author$project$Objective$Waterfall = 1;
var $author$project$Location$WateryPass = 7;
var $author$project$Value$Weapon = {$: 0};
var $author$project$Requirement$YangBonk = 4;
var $author$project$Requirement$YangTalk = 3;
var $author$project$Location$Zot = 28;
var $author$project$Location$surface = _List_fromArray(
	[
		{
		r: 0,
		bk: 'Mist Cave',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 16, ax: 2, b: 700, c: 200, bc: 90, aG: 465, bg: 10, aI: 5, ag: 5, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(0)),
				$author$project$Value$Chest(4),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(0))
			])
	},
		{
		r: 1,
		bk: 'Mist Village',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(7)
			])
	},
		{
		r: 2,
		bk: 'Mist Village',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour)
			])
	},
		{
		r: 3,
		bk: 'Mist - Package',
		a: _List_fromArray(
			[$author$project$Requirement$Package]),
		at: _List_fromArray(
			[
				$author$project$Value$Character(1),
				$author$project$Value$Boss(
				{ab: 26, ax: 3, b: 880, c: 245, bc: 75, aG: 302, bg: 11, aI: 4, ag: 2, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(1)),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(24))
			])
	},
		{
		r: 4,
		bk: 'Mist - Mom',
		a: _List_fromArray(
			[
				$author$project$Requirement$Pseudo(1)
			]),
		at: _List_fromArray(
			[
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6)
			])
	},
		{
		r: 5,
		bk: 'Kaipo',
		a: _List_Nil,
		at: _List_fromArray(
			[
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$SandRuby,
				$author$project$Value$Character(1)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$SandRuby,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(25))),
				$author$project$Value$Chest(1)
			])
	},
		{
		r: 6,
		bk: 'Kaipo',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 7,
		bk: 'Watery Pass',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Character(0),
				$author$project$Value$Chest(19)
			])
	},
		{
		r: 8,
		bk: 'Waterfall',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 22, ax: 2, b: 1200, c: 500, bc: 99, aG: 2350, bg: 10, aI: 31, ag: 31, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(2)),
				$author$project$Value$Chest(4),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(1))
			])
	},
		{
		r: 9,
		bk: 'Damcyan',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Character(0),
				$author$project$Value$Chest(13)
			])
	},
		{
		r: 10,
		bk: 'Antlion Cave',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 11, ax: 2, b: 1500, c: 800, bc: 85, aG: 1000, bg: 1, aI: 5, ag: 5, bC: 170}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(3)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Chest(13),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(2))
			])
	},
		{
		r: 11,
		bk: 'Mt. Hobs',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 30, ax: 3, b: 4360, c: 1755, bc: 80, aG: 1250, bg: 5, aI: 7, ag: 7, bC: 174}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(5)),
				$author$project$Value$Character(1),
				$author$project$Value$Chest(5),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(3))
			])
	},
		{
		r: 12,
		bk: 'Fabul',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 13,
		bk: 'Fabul Defence',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 36, ax: 3, b: 5590, c: 1425, bc: 90, aG: 1880, bg: 15, aI: 9, ag: 6, bC: 254}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(6)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$Chest(10),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(4))
			])
	},
		{
		r: 14,
		bk: 'Sheila',
		a: _List_Nil,
		at: _List_fromArray(
			[
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(3),
				$author$project$Value$KeyItem(0)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(3),
				$author$project$Value$KeyItem(6)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(4),
				$author$project$Value$KeyItem(0)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(4),
				$author$project$Value$KeyItem(6)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(4),
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(36)))
			])
	},
		{
		r: 15,
		bk: 'Mysidia',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Character(0),
				$author$project$Value$Character(0),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$DarknessCrystal,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(32)))
			])
	},
		{
		r: 16,
		bk: 'Mysidia',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 17,
		bk: 'Mt. Ordeals',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Character(0),
				$author$project$Value$Boss(
				{ab: 19, ax: 1, b: 3800, c: 3300, bc: 75, aG: 2780, bg: 14, aI: 8, ag: 8, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(7)),
				$author$project$Value$Boss(
				{ab: 44, ax: 3, b: 4000, c: 3000, bc: 99, aG: 3000, bg: 31, aI: 9, ag: 9, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(8)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Boss(
				{ab: 46, ax: 3, b: 0, c: 0, bc: 99, aG: 1000, bg: 17, aI: 5, ag: 5, bC: 254}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(9)),
				$author$project$Value$Chest(4),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(5))
			])
	},
		{
		r: 18,
		bk: 'Baron Town',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 46, ax: 3, b: 1440, c: 1000, bc: 99, aG: 400, bg: 26, aI: 14, ag: 11, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(10)),
				$author$project$Value$Boss(
				{ab: 86, ax: 6, b: 0, c: 0, bc: 99, aG: 4000, bg: 31, aI: 7, ag: 4, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(11)),
				$author$project$Value$Character(1),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Chest(13),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(6)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$BaronKey,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(26)))
			])
	},
		{
		r: 19,
		bk: 'Baron',
		a: _List_Nil,
		at: _List_fromArray(
			[
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$BaronKey,
				$author$project$Value$Shop($author$project$Value$Weapon)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$BaronKey,
				$author$project$Value$Shop($author$project$Value$Armour)),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 20,
		bk: 'Baron Sewer',
		a: _List_fromArray(
			[$author$project$Requirement$BaronKey]),
		at: _List_fromArray(
			[
				$author$project$Value$Chest(9)
			])
	},
		{
		r: 21,
		bk: 'Baron Castle',
		a: _List_fromArray(
			[$author$project$Requirement$BaronKey]),
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 52, ax: 4, b: 4820, c: 3000, bc: 99, aG: 4200, bg: 9, aI: 8, ag: 8, bC: 254}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(12)),
				$author$project$Value$Boss(
				{ab: 44, ax: 3, b: 5500, c: 4000, bc: 99, aG: 4000, bg: 29, aI: 15, ag: 15, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(13)),
				$author$project$Value$Character(1),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Chest(20),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(7))
			])
	},
		{
		r: 22,
		bk: 'Baron Basement',
		a: _List_fromArray(
			[$author$project$Requirement$BaronKey]),
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 116, ax: 9, b: 18000, c: 0, bc: 85, aG: 20500, bg: 95, aI: 46, ag: 43, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(26)),
				$author$project$Value$KeyItem(2),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(16))
			])
	},
		{
		r: 23,
		bk: 'Toroia',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(4),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(0),
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(38)))
			])
	},
		{
		r: 24,
		bk: 'Toroia',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 25,
		bk: 'Toroia Castle',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$KeyItem(5),
				$author$project$Value$Chest(9)
			])
	},
		{
		r: 26,
		bk: 'Toroia Treasury',
		a: _List_fromArray(
			[$author$project$Requirement$EarthCrystal]),
		at: _List_fromArray(
			[
				$author$project$Value$Chest(18),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(28))
			])
	},
		{
		r: 27,
		bk: 'Cave Magnes',
		a: _List_Nil,
		at: _List_fromArray(
			[
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$Boss(
					{ab: 54, ax: 4, b: 7000, c: 9000, bc: 99, aG: 5000, bg: 15, aI: 11, ag: 11, bC: 255})),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$Objective(
					$author$project$Objective$DefeatBoss(14))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$KeyItem(0)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$KeyItem(6)),
				$author$project$Value$Chest(10),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(8))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$TwinHarp,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(27)))
			])
	},
		{
		r: 28,
		bk: 'Tower of Zot',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 60, ax: 5, b: 9000, c: 9000, bc: 80, aG: 9000, bg: 11, aI: 7, ag: 7, bC: 254}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(15)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$Character(1)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$Character(1)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$Boss(
					{ab: 70, ax: 5, b: 9500, c: 5500, bc: 99, aG: 6000, bg: 63, aI: 18, ag: 18, bC: 255})),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$Objective(
					$author$project$Objective$DefeatBoss(16))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$KeyItem(0)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$KeyItem(6)),
				$author$project$Value$Chest(5),
				$author$project$Value$TrappedChest(1),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$EarthCrystal,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(9)))
			])
	},
		{
		r: 29,
		bk: 'Agart',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(1),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$MagmaKey,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(29)))
			])
	},
		{
		r: 30,
		bk: 'Agart',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 31,
		bk: 'Silvera',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(3)
			])
	},
		{
		r: 32,
		bk: 'Silvera',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 33,
		bk: 'Adamant Grotto',
		a: _List_fromArray(
			[$author$project$Requirement$Hook]),
		at: _List_fromArray(
			[
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$RatTail,
				$author$project$Value$KeyItem(0)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$RatTail,
				$author$project$Value$KeyItem(6)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$RatTail,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(33))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$PinkTail,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(37)))
			])
	},
		{
		r: 34,
		bk: 'Castle Eblan',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(19),
				$author$project$Value$TrappedChest(3)
			])
	},
		{
		r: 35,
		bk: 'Cave Eblan',
		a: _List_fromArray(
			[$author$project$Requirement$Hook]),
		at: _List_fromArray(
			[
				$author$project$Value$Character(1),
				$author$project$Value$Chest(21),
				$author$project$Value$TrappedChest(1)
			])
	},
		{
		r: 36,
		bk: 'Eblan',
		a: _List_fromArray(
			[$author$project$Requirement$Hook]),
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 37,
		bk: 'Upper Bab-il',
		a: _List_fromArray(
			[$author$project$Requirement$Hook]),
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 116, ax: 9, b: 0, c: 0, bc: 85, aG: 6000, bg: 15, aI: 53, ag: 53, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(21)),
				$author$project$Value$Boss(
				{ab: 88, ax: 7, b: 25000, c: 700, bc: 80, aG: 25200, bg: 16, aI: 38, ag: 38, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(22)),
				$author$project$Value$Chest(7),
				$author$project$Value$TrappedChest(1),
				$author$project$Value$Requirement(
				$author$project$Requirement$Pseudo(5)),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(12))
			])
	},
		{
		r: 38,
		bk: 'Giant of Bab-il',
		a: _List_fromArray(
			[$author$project$Requirement$DarknessCrystal]),
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 128, ax: 10, b: 102500, c: 20000, bc: 80, aG: 65000, bg: 15, aI: 89, ag: 89, bC: 86}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(28)),
				$author$project$Value$Boss(
				{ab: 174, ax: 13, b: 150000, c: 10333, bc: 99, aG: 24000, bg: 127, aI: 38, ag: 38, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(29)),
				$author$project$Value$Character(1),
				$author$project$Value$Chest(7),
				$author$project$Value$TrappedChest(1),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(17)),
				$author$project$Value$Objective($author$project$Objective$ClassicGiant)
			])
	}
	]);
var $author$project$Requirement$Adamant = {$: 13};
var $author$project$Objective$Asura = 24;
var $author$project$Objective$Calbrena = 17;
var $author$project$Objective$ClassicForge = {$: 0};
var $author$project$Objective$DarkImps = 20;
var $author$project$Objective$DrLugae = 19;
var $author$project$Location$DwarfCastle = 39;
var $author$project$Objective$DwarfCastle = 10;
var $author$project$Location$DwarfCastleShops = 40;
var $author$project$Objective$EvilWall = 23;
var $author$project$Location$Feymarch = 44;
var $author$project$Location$FeymarchKing = 46;
var $author$project$Objective$FeymarchKing = 15;
var $author$project$Location$FeymarchQueen = 47;
var $author$project$Objective$FeymarchQueen = 14;
var $author$project$Location$FeymarchShops = 45;
var $author$project$Objective$Forge = 34;
var $author$project$Requirement$Forge = 6;
var $author$project$Objective$Golbez = 18;
var $author$project$Location$Kokkol = 51;
var $author$project$Location$KokkolShop = 52;
var $author$project$Requirement$LegendSword = {$: 14};
var $author$project$Objective$Leviatan = 25;
var $author$project$Location$LowerBabil = 41;
var $author$project$Objective$LowerBabil = 11;
var $author$project$Location$LowerBabilCannon = 42;
var $author$project$Requirement$LucaKey = {$: 3};
var $author$project$Requirement$Pan = {$: 11};
var $author$project$Objective$PanWake = 35;
var $author$project$Location$SealedCave = 50;
var $author$project$Objective$SealedCave = 13;
var $author$project$Objective$SuperCannon = 30;
var $author$project$Location$SylphCave = 43;
var $author$project$Location$Tomra = 48;
var $author$project$Location$TomraShops = 49;
var $author$project$Requirement$TowerKey = {$: 5};
var $author$project$Objective$UnlockSealedCave = 31;
var $author$project$Flags$Warp = 1;
var $author$project$Location$underground = _List_fromArray(
	[
		{
		r: 39,
		bk: 'Dwarf Castle',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 96, ax: 7, b: 21000, c: 8000, bc: 99, aG: 8524, bg: 41, aI: 11, ag: 11, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(17)),
				$author$project$Value$Character(1),
				$author$project$Value$Boss(
				{ab: 68, ax: 5, b: 20000, c: 11000, bc: 99, aG: 3002, bg: 1, aI: 27, ag: 27, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(18)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$KeyItem(1),
				$author$project$Value$Chest(18),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(10))
			])
	},
		{
		r: 40,
		bk: 'Dwarf Castle',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 41,
		bk: 'Lower Bab-il',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 86, ax: 6, b: 26020, c: 11000, bc: 99, aG: 18943, bg: 7, aI: 27, ag: 27, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(19)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Chest(12),
				$author$project$Value$TrappedChest(4),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(11))
			])
	},
		{
		r: 42,
		bk: 'Super Cannon',
		a: _List_fromArray(
			[$author$project$Requirement$TowerKey]),
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 56, ax: 5, b: 5820, c: 135, bc: 70, aG: 597, bg: 16, aI: 21, ag: 18, bC: 0}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(20)),
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(30))
			])
	},
		{
		r: 43,
		bk: 'Sylph Cave',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Requirement(
				$author$project$Requirement$Pseudo(3)),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pan,
				$author$project$Value$Requirement(
					$author$project$Requirement$Pseudo(4))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pan,
				$author$project$Value$KeyItem(2)),
				$author$project$Value$Chest(25),
				$author$project$Value$TrappedChest(7),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pan,
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(35)))
			])
	},
		{
		r: 44,
		bk: 'Feymarch',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Chest(20),
				$author$project$Value$TrappedChest(1)
			])
	},
		{
		r: 45,
		bk: 'Feymarch',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 46,
		bk: 'Feymarch King',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 174, ax: 13, b: 28000, c: 0, bc: 99, aG: 35000, bg: 34, aI: 53, ag: 53, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(25)),
				$author$project$Value$KeyItem(2),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(15))
			])
	},
		{
		r: 47,
		bk: 'Feymarch Queen',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Boss(
				{ab: 134, ax: 10, b: 20000, c: 0, bc: 99, aG: 23000, bg: 69, aI: 66, ag: 66, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(24)),
				$author$project$Value$KeyItem(2),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(14))
			])
	},
		{
		r: 48,
		bk: 'Tomra',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(6)
			])
	},
		{
		r: 49,
		bk: 'Tomra',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	},
		{
		r: 50,
		bk: 'Sealed Cave',
		a: _List_fromArray(
			[$author$project$Requirement$LucaKey]),
		at: _List_fromArray(
			[
				$author$project$Value$KeyItem(0),
				$author$project$Value$KeyItem(6),
				$author$project$Value$Boss(
				{ab: 84, ax: 6, b: 23000, c: 8000, bc: 90, aG: 19000, bg: 79, aI: 66, ag: 66, bC: 255}),
				$author$project$Value$Objective(
				$author$project$Objective$DefeatBoss(23)),
				$author$project$Value$Chest(19),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(13)),
				$author$project$Value$Objective(
				$author$project$Objective$DoQuest(31))
			])
	},
		{
		r: 51,
		bk: 'Kokkol',
		a: _List_Nil,
		at: _List_fromArray(
			[
				$author$project$Value$Chest(4),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(6),
				$author$project$Value$Objective(
					$author$project$Objective$DoQuest(34))),
				A2(
				$author$project$Value$GatedValue,
				$author$project$Requirement$Pseudo(6),
				$author$project$Value$Objective($author$project$Objective$ClassicForge))
			])
	},
		{
		r: 52,
		bk: 'Kokkol',
		a: _List_fromArray(
			[$author$project$Requirement$LegendSword, $author$project$Requirement$Adamant]),
		at: _List_fromArray(
			[
				$author$project$Value$Shop($author$project$Value$Weapon),
				$author$project$Value$Shop($author$project$Value$Armour),
				$author$project$Value$Shop($author$project$Value$Item)
			])
	}
	]);
var $author$project$Location$all = function () {
	var isShop = function (value) {
		if (value.$ === 5) {
			return true;
		} else {
			return false;
		}
	};
	var expandShop = function (value) {
		if ((value.$ === 5) && (value.a.$ === 2)) {
			var _v1 = value.a;
			return _List_fromArray(
				[
					$author$project$Value$Shop(
					$author$project$Value$Healing($author$project$ConsumableItems$healingItems)),
					$author$project$Value$Shop(
					$author$project$Value$JItem($author$project$ConsumableItems$jItems))
				]);
		} else {
			return _List_fromArray(
				[value]);
		}
	};
	var addOther = function (vals) {
		return A2($elm$core$List$any, isShop, vals) ? _Utils_ap(
			vals,
			_List_fromArray(
				[
					$author$project$Value$Shop(
					$author$project$Value$Other(''))
				])) : vals;
	};
	var finish = F2(
		function (area, l) {
			return {
				H: area,
				ad: A2($elm$core$List$any, isShop, l.at),
				r: l.r,
				bk: l.bk,
				k: $elm$core$Array$fromList(
					A2(
						$elm$core$List$map,
						$author$project$Location$Property($author$project$Status$Unseen),
						addOther(
							A2($elm$core$List$concatMap, expandShop, l.at)))),
				a: $Gizra$elm_all_set$EverySet$fromList(l.a),
				aW: $author$project$Status$Unseen
			};
		});
	return $pzp1997$assoc_list$AssocList$fromList(
		$elm$core$List$reverse(
			A2(
				$elm$core$List$map,
				function (l) {
					return _Utils_Tuple2(l.r, l);
				},
				_Utils_ap(
					A2(
						$elm$core$List$map,
						finish(0),
						$author$project$Location$surface),
					_Utils_ap(
						A2(
							$elm$core$List$map,
							finish(1),
							$author$project$Location$underground),
						A2(
							$elm$core$List$map,
							finish(2),
							$author$project$Location$moon))))));
}();
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Colour$Colours = F3(
	function (background, hoverBackground, text) {
		return {a3: background, T: hoverBackground, bA: text};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Colour$decoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Colour$Colours,
	A2($elm$json$Json$Decode$field, 'background', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'hoverBackground', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'text', $elm$json$Json$Decode$string));
var $author$project$Colour$darkText = '#000000';
var $author$project$Colour$lightHover = '#e2e3e4';
var $author$project$Colour$defaults = {a3: '#ffffff', T: $author$project$Colour$lightHover, bA: $author$project$Colour$darkText};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Colour$decode = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$map(
		$elm$json$Json$Decode$decodeValue($author$project$Colour$decoder)),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$andThen($elm$core$Result$toMaybe),
		$elm$core$Maybe$withDefault($author$project$Colour$defaults)));
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Colour$encode = function (colours) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'background',
				$elm$json$Json$Encode$string(colours.a3)),
				_Utils_Tuple2(
				'hoverBackground',
				$elm$json$Json$Encode$string(colours.T)),
				_Utils_Tuple2(
				'text',
				$elm$json$Json$Encode$string(colours.bA))
			]));
};
var $author$project$Objective$Boss = 1;
var $author$project$Objective$Character = 0;
var $author$project$Objective$Fiends = {$: 2};
var $author$project$Objective$GatedQuest = 3;
var $author$project$Flags$None = 0;
var $author$project$Objective$Quest = 2;
var $author$project$Flags$Win = 1;
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.g)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.g, tail);
		return (notAppended < 0) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			d: builder.d + 1,
			g: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			d: builder.d + 1,
			g: $elm$core$Elm$JsArray$empty
		} : {j: builder.j, d: builder.d, g: appended});
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		j: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		d: (len / $elm$core$Array$branchFactor) | 0,
		g: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $author$project$Objective$Waterhag = 4;
var $author$project$Objective$bosses = function () {
	var fromTuple = function (_v0) {
		var key = _v0.a;
		var flag = _v0.b;
		var name = _v0.c;
		return {
			aA: 'Defeat ' + name,
			K: 'boss_' + flag,
			L: false,
			r: $author$project$Objective$DefeatBoss(key)
		};
	};
	return A2(
		$elm$core$List$map,
		fromTuple,
		_List_fromArray(
			[
				_Utils_Tuple3(0, 'dmist', 'D. Mist'),
				_Utils_Tuple3(1, 'officer', 'Officer'),
				_Utils_Tuple3(2, 'octomamm', 'Octomamm'),
				_Utils_Tuple3(3, 'antlion', 'Antlion'),
				_Utils_Tuple3(4, 'waterhag', 'Waterhag'),
				_Utils_Tuple3(5, 'mombomb', 'MomBomb'),
				_Utils_Tuple3(6, 'fabulgauntlet', 'the Fabul Gauntlet'),
				_Utils_Tuple3(7, 'milon', 'Milon'),
				_Utils_Tuple3(8, 'milonz', 'Milon Z.'),
				_Utils_Tuple3(9, 'mirrorcecil', 'D.Knight'),
				_Utils_Tuple3(10, 'guard', 'the Guards'),
				_Utils_Tuple3(11, 'karate', 'Karate'),
				_Utils_Tuple3(12, 'baigan', 'Baigan'),
				_Utils_Tuple3(13, 'kainazzo', 'Kainazzo'),
				_Utils_Tuple3(14, 'darkelf', 'the Dark Elf'),
				_Utils_Tuple3(15, 'magus', 'the Magus Sisters'),
				_Utils_Tuple3(16, 'valvalis', 'Valvalis'),
				_Utils_Tuple3(17, 'calbrena', 'Calbrena'),
				_Utils_Tuple3(18, 'golbez', 'Golbez'),
				_Utils_Tuple3(19, 'lugae', 'Dr. Lugae'),
				_Utils_Tuple3(20, 'darkimp', 'the Dark Imps'),
				_Utils_Tuple3(21, 'kingqueen', 'K.Eblan and Q.Eblan'),
				_Utils_Tuple3(22, 'rubicant', 'Rubicant'),
				_Utils_Tuple3(23, 'evilwall', 'EvilWall'),
				_Utils_Tuple3(24, 'asura', 'Asura'),
				_Utils_Tuple3(25, 'leviatan', 'Leviatan'),
				_Utils_Tuple3(26, 'odin', 'Odin'),
				_Utils_Tuple3(27, 'bahamut', 'Bahamut'),
				_Utils_Tuple3(28, 'elements', 'Elements'),
				_Utils_Tuple3(29, 'cpu', 'CPU'),
				_Utils_Tuple3(30, 'paledim', 'Pale Dim'),
				_Utils_Tuple3(31, 'wyvern', 'Wyvern'),
				_Utils_Tuple3(32, 'plague', 'Plague'),
				_Utils_Tuple3(33, 'dlunar', 'the D.Lunars'),
				_Utils_Tuple3(34, 'ogopogo', 'Ogopogo')
			]));
}();
var $pzp1997$assoc_list$AssocList$get = F2(
	function (targetKey, _v0) {
		get:
		while (true) {
			var alist = _v0;
			if (!alist.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = alist.a;
				var key = _v2.a;
				var value = _v2.b;
				var rest = alist.b;
				if (_Utils_eq(key, targetKey)) {
					return $elm$core$Maybe$Just(value);
				} else {
					var $temp$targetKey = targetKey,
						$temp$_v0 = rest;
					targetKey = $temp$targetKey;
					_v0 = $temp$_v0;
					continue get;
				}
			}
		}
	});
var $pzp1997$assoc_list$AssocList$member = F2(
	function (targetKey, dict) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$get, targetKey, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $pzp1997$assoc_list$AssocList$diff = F2(
	function (_v0, rightDict) {
		var leftAlist = _v0;
		return A2(
			$elm$core$List$filter,
			function (_v1) {
				var key = _v1.a;
				return !A2($pzp1997$assoc_list$AssocList$member, key, rightDict);
			},
			leftAlist);
	});
var $Gizra$elm_all_set$EverySet$diff = F2(
	function (_v0, _v1) {
		var d1 = _v0;
		var d2 = _v1;
		return A2($pzp1997$assoc_list$AssocList$diff, d1, d2);
	});
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $pzp1997$assoc_list$AssocList$isEmpty = function (dict) {
	return _Utils_eq(dict, _List_Nil);
};
var $Gizra$elm_all_set$EverySet$isEmpty = function (_v0) {
	var d = _v0;
	return $pzp1997$assoc_list$AssocList$isEmpty(d);
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $Gizra$elm_all_set$EverySet$member = F2(
	function (k, _v0) {
		var d = _v0;
		return A2($pzp1997$assoc_list$AssocList$member, k, d);
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Flags$memberOf = F2(
	function (xs, x) {
		return A2($elm$core$List$member, x, xs);
	});
var $author$project$Flags$parseB = F2(
	function (_switch, flags) {
		if (_switch === 'vanilla') {
			return _Utils_update(
				flags,
				{au: true});
		} else {
			return flags;
		}
	});
var $author$project$Flags$parseC = F2(
	function (opts, flags) {
		var _v0 = A2($elm$core$String$split, ':', opts);
		if ((((_v0.b && (_v0.a === 'party')) && _v0.b.b) && (_v0.b.a === '1')) && (!_v0.b.b.b)) {
			var _v1 = _v0.b;
			return _Utils_update(
				flags,
				{bl: true});
		} else {
			return flags;
		}
	});
var $author$project$Flags$parseG = F2(
	function (_switch, flags) {
		if (_switch === 'warp') {
			return _Utils_update(
				flags,
				{
					aH: A2($Gizra$elm_all_set$EverySet$insert, 1, flags.aH),
					av: true
				});
		} else {
			return flags;
		}
	});
var $author$project$Flags$Trapped = 4;
var $author$project$Flags$parseK = F2(
	function (_switch, flags) {
		switch (_switch) {
			case 'vanilla':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$insert, 6, flags.aH)
					});
			case 'main':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$insert, 0, flags.aH)
					});
			case 'summon':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$insert, 2, flags.aH)
					});
			case 'moon':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$insert, 3, flags.aH)
					});
			case 'trap':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$insert, 4, flags.aH)
					});
			default:
				return flags;
		}
	});
var $Gizra$elm_all_set$EverySet$remove = F2(
	function (k, _v0) {
		var d = _v0;
		return A2($pzp1997$assoc_list$AssocList$remove, k, d);
	});
var $author$project$Flags$parseN = F2(
	function (_switch, flags) {
		switch (_switch) {
			case 'chars':
				return _Utils_update(
					flags,
					{ai: true});
			case 'key':
				return _Utils_update(
					flags,
					{
						aH: A2($Gizra$elm_all_set$EverySet$remove, 5, flags.aH)
					});
			default:
				return flags;
		}
	});
var $author$project$Flags$Crystal = 0;
var $author$project$Objective$Cecil = 0;
var $author$project$Objective$Cid = 9;
var $author$project$Objective$Edge = 10;
var $author$project$Objective$Edward = 4;
var $author$project$Objective$FuSoYa = 11;
var $author$project$Objective$GetCharacter = function (a) {
	return {$: 4, a: a};
};
var $author$project$Objective$Kain = 1;
var $author$project$Objective$Palom = 7;
var $author$project$Objective$Porom = 8;
var $author$project$Objective$Rosa = 5;
var $author$project$Objective$Rydia = 2;
var $author$project$Objective$Tellah = 3;
var $author$project$Objective$Yang = 6;
var $elm$core$String$toLower = _String_toLower;
var $author$project$Objective$characters = function () {
	var fromTuple = function (_v0) {
		var key = _v0.a;
		var name = _v0.b;
		return {
			aA: 'Get ' + name,
			K: 'char_' + $elm$core$String$toLower(name),
			L: A2(
				$elm$core$List$member,
				key,
				_List_fromArray(
					[10, 11])),
			r: $author$project$Objective$GetCharacter(key)
		};
	};
	return A2(
		$elm$core$List$map,
		fromTuple,
		_List_fromArray(
			[
				_Utils_Tuple2(0, 'Cecil'),
				_Utils_Tuple2(1, 'Kain'),
				_Utils_Tuple2(2, 'Rydia'),
				_Utils_Tuple2(3, 'Tellah'),
				_Utils_Tuple2(4, 'Edward'),
				_Utils_Tuple2(5, 'Rosa'),
				_Utils_Tuple2(6, 'Yang'),
				_Utils_Tuple2(7, 'Palom'),
				_Utils_Tuple2(8, 'Porom'),
				_Utils_Tuple2(9, 'Cid'),
				_Utils_Tuple2(10, 'Edge'),
				_Utils_Tuple2(11, 'FuSoYa')
			]));
}();
var $author$project$Objective$DarkMatterHunt = {$: 3};
var $author$project$Objective$classic = function () {
	var fromTuple = function (_v0) {
		var key = _v0.a;
		var flag = _v0.b;
		var desc = _v0.c;
		return {aA: desc, K: flag, L: false, r: key};
	};
	return A2(
		$elm$core$List$map,
		fromTuple,
		_List_fromArray(
			[
				_Utils_Tuple3($author$project$Objective$ClassicForge, 'classicforge', 'Classic Forge the Crystal'),
				_Utils_Tuple3($author$project$Objective$ClassicGiant, 'classicgiant', 'Classic Giant%'),
				_Utils_Tuple3($author$project$Objective$Fiends, 'fiends', 'Fiends%'),
				_Utils_Tuple3($author$project$Objective$DarkMatterHunt, 'dkmatter', 'Deliver 30 Dark Matter')
			]));
}();
var $author$project$Objective$quests = function () {
	var ungated = _List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 38]);
	var fromTuple = function (_v0) {
		var key = _v0.a;
		var flag = _v0.b;
		var desc = _v0.c;
		return {
			aA: desc,
			K: 'quest_' + flag,
			L: !A2($elm$core$List$member, key, ungated),
			r: $author$project$Objective$DoQuest(key)
		};
	};
	return A2(
		$elm$core$List$map,
		fromTuple,
		_List_fromArray(
			[
				_Utils_Tuple3(0, 'mistcave', 'Defeat the boss of the Mist Cave'),
				_Utils_Tuple3(1, 'waterfall', 'Defeat the boss of the Waterfall'),
				_Utils_Tuple3(2, 'antlionnest', 'Complete the Antlion Nest'),
				_Utils_Tuple3(3, 'hobs', 'Rescue the hostage on Mt. Hobs'),
				_Utils_Tuple3(4, 'fabul', 'Defend Fabul'),
				_Utils_Tuple3(5, 'ordeals', 'Complete Mt. Ordeals'),
				_Utils_Tuple3(6, 'baroninn', 'Defeat the bosses of Baron Inn'),
				_Utils_Tuple3(7, 'baroncastle', 'Liberate Baron Castle'),
				_Utils_Tuple3(8, 'magnes', 'Complete Cave Magnes'),
				_Utils_Tuple3(9, 'zot', 'Complete the Tower of Zot'),
				_Utils_Tuple3(10, 'dwarfcastle', 'Defeat the bosses of Dwarf Castle'),
				_Utils_Tuple3(11, 'lowerbabil', 'Defeat the boss of Lower Bab-il'),
				_Utils_Tuple3(12, 'falcon', 'Launch the Falcon'),
				_Utils_Tuple3(13, 'sealedcave', 'Complete the Sealed Cave'),
				_Utils_Tuple3(14, 'monsterqueen', 'Defeat the queen at the Town of Monsters'),
				_Utils_Tuple3(15, 'monsterking', 'Defeat the king at the Town of Monsters'),
				_Utils_Tuple3(16, 'baronbasement', 'Defeat the Baron Castle basement throne'),
				_Utils_Tuple3(17, 'giant', 'Complete the Giant of Bab-il'),
				_Utils_Tuple3(18, 'cavebahamut', 'Complete Cave Bahamut'),
				_Utils_Tuple3(19, 'murasamealtar', 'Conquer the vanilla Murasame altar'),
				_Utils_Tuple3(20, 'crystalaltar', 'Conquer the vanilla Crystal Sword altar'),
				_Utils_Tuple3(21, 'whitealtar', 'Conquer the vanilla White Spear altar'),
				_Utils_Tuple3(22, 'ribbonaltar', 'Conquer the vanillla Ribbon room'),
				_Utils_Tuple3(23, 'masamunealtar', 'Conquer the vanilla Masamune Altar'),
				_Utils_Tuple3(24, 'burnmist', 'Burn village Mist with the Package'),
				_Utils_Tuple3(25, 'curefever', 'Cure the fever with the SandRuby'),
				_Utils_Tuple3(26, 'unlocksewer', 'Unlock the sewer with the Baron Key'),
				_Utils_Tuple3(27, 'music', 'Break the Dark Elf\'s spell with the TwinHarp'),
				_Utils_Tuple3(28, 'toroiatreasury', 'Open the Toroia treasury with the Earth Crystal'),
				_Utils_Tuple3(29, 'magma', 'Drop the Magma Key into the Agart well'),
				_Utils_Tuple3(30, 'supercannon', 'Destroy the Super Cannon'),
				_Utils_Tuple3(31, 'unlocksealedcave', 'Unlock the Sealed Cave'),
				_Utils_Tuple3(32, 'bigwhale', 'Raise the Big Whale'),
				_Utils_Tuple3(33, 'traderat', 'Trade away the Rat Tail'),
				_Utils_Tuple3(34, 'forge', 'Have Kokkol forge Legend Sword with Adamant'),
				_Utils_Tuple3(35, 'wakeyang', 'Wake Yang with the Pan'),
				_Utils_Tuple3(36, 'tradepan', 'Return the Pan to Yang\'s wife'),
				_Utils_Tuple3(37, 'tradepink', 'Trade away the Pink Tail'),
				_Utils_Tuple3(38, 'pass', 'Unlock the Pass door in Toroia')
			]));
}();
var $author$project$Objective$allObjectives = _Utils_ap(
	$author$project$Objective$classic,
	_Utils_ap(
		$author$project$Objective$characters,
		_Utils_ap($author$project$Objective$bosses, $author$project$Objective$quests)));
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Objective$allObjectivesByFlag = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (o) {
			return _Utils_Tuple2(o.K, o);
		},
		$author$project$Objective$allObjectives));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Objective$fromFlag = function (flag) {
	return A2($elm$core$Dict$get, flag, $author$project$Objective$allObjectivesByFlag);
};
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$Flags$parseO = F2(
	function (opts, incomingFlags) {
		var parseRandom = F2(
			function (_switch, flags) {
				switch (_switch) {
					case 'char':
						return _Utils_update(
							flags,
							{
								bu: A2($Gizra$elm_all_set$EverySet$insert, 0, flags.bu)
							});
					case 'boss':
						return _Utils_update(
							flags,
							{
								bu: A2($Gizra$elm_all_set$EverySet$insert, 1, flags.bu)
							});
					case 'quest':
						return _Utils_update(
							flags,
							{
								bu: A2($Gizra$elm_all_set$EverySet$insert, 2, flags.bu)
							});
					case 'gated_quest':
						return _Utils_update(
							flags,
							{
								bu: A2($Gizra$elm_all_set$EverySet$insert, 3, flags.bu)
							});
					default:
						var num = _switch;
						var _v11 = $elm$core$String$toInt(num);
						if (!_v11.$) {
							var n = _v11.a;
							return _Utils_update(
								flags,
								{s: n});
						} else {
							return flags;
						}
				}
			});
		var parseMode = F2(
			function (mode, flags) {
				var _v9 = $author$project$Objective$fromFlag(mode);
				if (!_v9.$) {
					var objective = _v9.a;
					return _Utils_update(
						flags,
						{
							aK: A2($elm$core$Array$push, objective, flags.aK)
						});
				} else {
					return flags;
				}
			});
		var _v0 = A2($elm$core$String$split, ':', opts);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			switch (_v0.a) {
				case 'mode':
					var _v1 = _v0.b;
					var modes = _v1.a;
					return A3(
						$elm$core$List$foldl,
						parseMode,
						incomingFlags,
						A2($elm$core$String$split, ',', modes));
				case 'random':
					var _v2 = _v0.b;
					var subopts = _v2.a;
					return A3(
						$elm$core$List$foldl,
						parseRandom,
						incomingFlags,
						A2($elm$core$String$split, ',', subopts));
				case 'req':
					var _v3 = _v0.b;
					var count = _v3.a;
					var _v4 = $elm$core$String$toInt(count);
					if (!_v4.$) {
						var c = _v4.a;
						return _Utils_update(
							incomingFlags,
							{aq: c});
					} else {
						return incomingFlags;
					}
				case 'win':
					var _v5 = _v0.b;
					var reward = _v5.a;
					switch (reward) {
						case 'game':
							return _Utils_update(
								incomingFlags,
								{am: 1});
						case 'crystal':
							return _Utils_update(
								incomingFlags,
								{am: 0});
						default:
							return incomingFlags;
					}
				default:
					var num = _v0.a;
					var _v7 = _v0.b;
					var objectiveStr = _v7.a;
					var _v8 = _Utils_Tuple2(
						$elm$core$String$toInt(num),
						$author$project$Objective$fromFlag(objectiveStr));
					if ((!_v8.a.$) && (!_v8.b.$)) {
						var objective = _v8.b.a;
						return _Utils_update(
							incomingFlags,
							{
								aK: A2($elm$core$Array$push, objective, incomingFlags.aK)
							});
					} else {
						return incomingFlags;
					}
			}
		} else {
			return incomingFlags;
		}
	});
var $author$project$Flags$parseOther = F2(
	function (_switch, flags) {
		switch (_switch) {
			case 'exp:nokeybonus':
				return _Utils_update(
					flags,
					{bf: false});
			case 'pushbtojump':
				return _Utils_update(
					flags,
					{ap: true});
			case 'wacky:nightmode':
				return _Utils_update(
					flags,
					{ah: true});
			case 'wacky:kleptomania':
				return _Utils_update(
					flags,
					{ae: true});
			default:
				return flags;
		}
	});
var $author$project$Flags$parseP = F2(
	function (_switch, flags) {
		switch (_switch) {
			case 'shop':
				return _Utils_update(
					flags,
					{br: true, bs: true});
			case 'key':
				return _Utils_update(
					flags,
					{br: true, ao: true});
			case 'chests':
				return _Utils_update(
					flags,
					{br: true});
			default:
				return flags;
		}
	});
var $author$project$Flags$Cabins = 5;
var $author$project$Flags$Empty = 6;
var $author$project$Flags$Pro = 3;
var $author$project$Flags$Shuffle = 1;
var $author$project$Flags$Standard = 2;
var $author$project$Flags$Wild = 4;
var $author$project$Flags$parseS = F2(
	function (opts, flags) {
		var parseNo = F2(
			function (no, newFlags) {
				switch (no) {
					case 'j':
						return _Utils_update(
							newFlags,
							{aj: true});
					case 'sirens':
						return _Utils_update(
							newFlags,
							{al: true});
					case 'life':
						return _Utils_update(
							newFlags,
							{ak: true});
					default:
						return newFlags;
				}
			});
		var _v0 = A2($elm$core$String$split, ':', opts);
		_v0$8:
		while (true) {
			if (_v0.b) {
				if (!_v0.b.b) {
					switch (_v0.a) {
						case 'vanilla':
							return _Utils_update(
								flags,
								{bw: 0});
						case 'shuffle':
							return _Utils_update(
								flags,
								{bw: 1});
						case 'standard':
							return _Utils_update(
								flags,
								{bw: 2});
						case 'pro':
							return _Utils_update(
								flags,
								{bw: 3});
						case 'wild':
							return _Utils_update(
								flags,
								{bw: 4});
						case 'cabins':
							return _Utils_update(
								flags,
								{bw: 5});
						case 'empty':
							return _Utils_update(
								flags,
								{bw: 6});
						default:
							break _v0$8;
					}
				} else {
					if ((_v0.a === 'no') && (!_v0.b.b.b)) {
						var _v1 = _v0.b;
						var subopts = _v1.a;
						return A3(
							$elm$core$List$foldl,
							parseNo,
							flags,
							A2($elm$core$String$split, ',', subopts));
					} else {
						break _v0$8;
					}
				}
			} else {
				break _v0$8;
			}
		}
		return flags;
	});
var $author$project$Flags$parseT = F2(
	function (_switch, flags) {
		if (_switch === 'empty') {
			return _Utils_update(
				flags,
				{bm: true});
		} else {
			return flags;
		}
	});
var $author$project$Flags$parseFlag = F2(
	function (flag, flags) {
		var _v0 = $elm$core$String$uncons(flag);
		_v0$10:
		while (true) {
			if (!_v0.$) {
				switch (_v0.a.a) {
					case 'O':
						var _v1 = _v0.a;
						var opts = _v1.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseO,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'K':
						var _v2 = _v0.a;
						var opts = _v2.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseK,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'P':
						var _v3 = _v0.a;
						var opts = _v3.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseP,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'C':
						var _v4 = _v0.a;
						var opts = _v4.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseC,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'T':
						var _v5 = _v0.a;
						var opts = _v5.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseT,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'S':
						var _v6 = _v0.a;
						var opts = _v6.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseS,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'B':
						var _v7 = _v0.a;
						var opts = _v7.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseB,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'N':
						var _v8 = _v0.a;
						var opts = _v8.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseN,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'G':
						var _v9 = _v0.a;
						var opts = _v9.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseG,
							flags,
							A2($elm$core$String$split, '/', opts));
					case '-':
						var _v10 = _v0.a;
						var opt = _v10.b;
						return A2($author$project$Flags$parseOther, opt, flags);
					default:
						break _v0$10;
				}
			} else {
				break _v0$10;
			}
		}
		return flags;
	});
var $pzp1997$assoc_list$AssocList$singleton = F2(
	function (key, value) {
		return _List_fromArray(
			[
				_Utils_Tuple2(key, value)
			]);
	});
var $Gizra$elm_all_set$EverySet$singleton = function (k) {
	return A2($pzp1997$assoc_list$AssocList$singleton, k, 0);
};
var $elm$core$String$words = _String_words;
var $author$project$Flags$parse = function (flagString) {
	var fixupRequiredObjectives = function (flags) {
		var requiredObjectives = (!flags.aq) ? ($elm$core$Array$length(flags.aK) + flags.s) : flags.aq;
		return _Utils_update(
			flags,
			{aq: requiredObjectives});
	};
	var fixupObjectiveTypes = function (flags) {
		return $Gizra$elm_all_set$EverySet$isEmpty(flags.bu) ? _Utils_update(
			flags,
			{
				bu: $Gizra$elm_all_set$EverySet$fromList(
					_List_fromArray(
						[0, 1, 2]))
			}) : (A2($Gizra$elm_all_set$EverySet$member, 2, flags.bu) ? _Utils_update(
			flags,
			{
				bu: A2($Gizra$elm_all_set$EverySet$remove, 3, flags.bu)
			}) : flags);
	};
	var fixupKeyItems = function (flags) {
		var keyItems = A2($Gizra$elm_all_set$EverySet$member, 6, flags.aH) ? A2(
			$Gizra$elm_all_set$EverySet$diff,
			flags.aH,
			$Gizra$elm_all_set$EverySet$fromList(
				_List_fromArray(
					[0, 2, 3]))) : A2($Gizra$elm_all_set$EverySet$insert, 0, flags.aH);
		return _Utils_update(
			flags,
			{aH: keyItems});
	};
	var fixupFiends = function (flags) {
		var fiends = _List_fromArray(
			[
				$author$project$Objective$DefeatBoss(7),
				$author$project$Objective$DefeatBoss(8),
				$author$project$Objective$DefeatBoss(13),
				$author$project$Objective$DefeatBoss(16),
				$author$project$Objective$DefeatBoss(22),
				$author$project$Objective$DefeatBoss(28)
			]);
		var expandFiends = F2(
			function (objective, objectives) {
				return _Utils_eq(objective.r, $author$project$Objective$Fiends) ? A2(
					$elm$core$Array$append,
					objectives,
					$elm$core$Array$fromList(
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.r;
								},
								$author$project$Flags$memberOf(fiends)),
							$author$project$Objective$bosses))) : A2($elm$core$Array$push, objective, objectives);
			});
		return _Utils_update(
			flags,
			{
				aK: A3($elm$core$Array$foldl, expandFiends, $elm$core$Array$empty, flags.aK)
			});
	};
	var _default = {
		bf: true,
		aH: $Gizra$elm_all_set$EverySet$singleton(5),
		ae: false,
		ah: false,
		bl: false,
		ai: false,
		aj: false,
		ak: false,
		al: false,
		bm: false,
		am: 1,
		aK: $elm$core$Array$empty,
		br: false,
		bs: false,
		ao: false,
		ap: false,
		bu: $Gizra$elm_all_set$EverySet$empty,
		s: 0,
		aq: 0,
		bw: 0,
		au: false,
		av: false
	};
	return fixupKeyItems(
		fixupFiends(
			fixupRequiredObjectives(
				fixupObjectiveTypes(
					A3(
						$elm$core$List$foldl,
						$author$project$Flags$parseFlag,
						_default,
						$elm$core$String$words(flagString))))));
};
var $author$project$Ports$setColours = _Platform_outgoingPort('setColours', $elm$core$Basics$identity);
var $author$project$App$Unset = {$: 1};
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						j: _List_Nil,
						d: 0,
						g: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$App$updateRandomObjectives = F2(
	function (flags, objectives) {
		var delta = flags.s - $elm$core$Array$length(objectives);
		return (delta > 0) ? A2(
			$elm$core$Array$append,
			objectives,
			A2($elm$core$Array$repeat, delta, $author$project$App$Unset)) : ((delta < 0) ? A3($elm$core$Array$slice, 0, delta, objectives) : objectives);
	});
var $author$project$App$with = F2(
	function (b, a) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$App$init = function (savedColours) {
	var flagString = 'Kmain/summon/moon Sstandard Gwarp Nkey O1:char_kain/2:quest_antlionnest/random:3/req:4';
	var flags = $author$project$Flags$parse(flagString);
	var randomObjectives = A2($author$project$App$updateRandomObjectives, flags, $elm$core$Array$empty);
	var colours = $author$project$Colour$decode(savedColours);
	return A2(
		$author$project$App$with,
		$author$project$Ports$setColours(
			$author$project$Colour$encode(colours)),
		{
			n: $Gizra$elm_all_set$EverySet$empty,
			I: colours,
			h: $Gizra$elm_all_set$EverySet$empty,
			_: flagString,
			l: flags,
			x: $pzp1997$assoc_list$AssocList$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(0, 0),
						_Utils_Tuple2(2, 0),
						_Utils_Tuple2(3, 1)
					])),
			i: $author$project$Location$all,
			s: randomObjectives,
			M: $pzp1997$assoc_list$AssocList$empty,
			w: $elm$core$Maybe$Nothing,
			Q: false
		});
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$App$CloseShopMenu = {$: 10};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aN: pids, aX: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aC: event, r: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aN,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.r;
		var event = _v0.aC;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.aX);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onClick = A2($elm$browser$Browser$Events$on, 0, 'click');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, 0, 'keyup');
var $author$project$App$subscriptions = function (model) {
	var shopMenuEscape = $elm$browser$Browser$Events$onKeyUp(
		A2(
			$elm$json$Json$Decode$andThen,
			function (key) {
				if (key === 'Escape') {
					return $elm$json$Json$Decode$succeed($author$project$App$CloseShopMenu);
				} else {
					return $elm$json$Json$Decode$fail('');
				}
			},
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
	var shopMenuClick = $elm$browser$Browser$Events$onClick(
		$elm$json$Json$Decode$succeed($author$project$App$CloseShopMenu));
	var _v0 = model.w;
	if (!_v0.$) {
		return $elm$core$Platform$Sub$batch(
			_List_fromArray(
				[shopMenuClick, shopMenuEscape]));
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $author$project$App$DoNothing = {$: 15};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$App$focus = function (id) {
	return A2(
		$elm$core$Task$attempt,
		$elm$core$Basics$always($author$project$App$DoNothing),
		$elm$browser$Browser$Dom$focus(id));
};
var $author$project$Value$Checked = 5;
var $author$project$Requirement$Crystal = {$: 8};
var $author$project$App$Items = function (a) {
	return {$: 0, a: a};
};
var $author$project$App$Set = function (a) {
	return {$: 0, a: a};
};
var $author$project$Location$Shops = 1;
var $author$project$App$Text = function (a) {
	return {$: 1, a: a};
};
var $author$project$Objective$allObjectivesByDescription = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (o) {
			return _Utils_Tuple2(o.aA, o);
		},
		$author$project$Objective$allObjectives));
var $author$project$Objective$fromDescription = function (description) {
	return A2($elm$core$Dict$get, description, $author$project$Objective$allObjectivesByDescription);
};
var $author$project$Location$get = F2(
	function (key, _v0) {
		var locations = _v0;
		return A2($pzp1997$assoc_list$AssocList$get, key, locations);
	});
var $author$project$Location$Checks = 0;
var $author$project$App$randomObjectiveKeys = function () {
	var toMaybeKey = function (o) {
		if (!o.$) {
			var objective = o.a;
			return $elm$core$Maybe$Just(objective.r);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Array$toList,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$filterMap(toMaybeKey),
			$Gizra$elm_all_set$EverySet$fromList));
}();
var $author$project$App$getContextFor = F2(
	function (locClass, model) {
		return {
			n: model.n,
			h: model.h,
			ba: function () {
				if (!locClass) {
					return model.x;
				} else {
					return model.M;
				}
			}(),
			l: model.l,
			s: $author$project$App$randomObjectiveKeys(model.s),
			Q: model.Q
		};
	});
var $author$project$App$getContext = $author$project$App$getContextFor(0);
var $author$project$Location$GatedShop = 1;
var $author$project$Location$SmithyShop = 2;
var $author$project$Location$UngatedShop = 0;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Array$toIndexedList = function (array) {
	var len = array.a;
	var helper = F2(
		function (entry, _v0) {
			var index = _v0.a;
			var list = _v0.b;
			return _Utils_Tuple2(
				index - 1,
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(index, entry),
					list));
		});
	return A3(
		$elm$core$Array$foldr,
		helper,
		_Utils_Tuple2(len - 1, _List_Nil),
		array).b;
};
var $author$project$ConsumableItems$filter = F2(
	function (fn, _v0) {
		var items = _v0;
		return A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeR, $elm$core$Tuple$second, fn),
			$elm$core$Array$toIndexedList(items));
	});
var $pzp1997$assoc_list$AssocList$union = F2(
	function (_v0, rightDict) {
		var leftAlist = _v0;
		return A3(
			$elm$core$List$foldr,
			F2(
				function (_v1, result) {
					var lKey = _v1.a;
					var lValue = _v1.b;
					return A3($pzp1997$assoc_list$AssocList$insert, lKey, lValue, result);
				}),
			rightDict,
			leftAlist);
	});
var $Gizra$elm_all_set$EverySet$union = F2(
	function (_v0, _v1) {
		var d1 = _v0;
		var d2 = _v1;
		return A2($pzp1997$assoc_list$AssocList$union, d1, d2);
	});
var $pzp1997$assoc_list$AssocList$values = function (_v0) {
	var alist = _v0;
	return A2($elm$core$List$map, $elm$core$Tuple$second, alist);
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Location$vanillaShops = $pzp1997$assoc_list$AssocList$fromList(
	A2(
		$elm$core$List$map,
		$elm$core$Tuple$mapSecond($Gizra$elm_all_set$EverySet$fromList),
		_List_fromArray(
			[
				_Utils_Tuple2(
				6,
				_List_fromArray(
					['Life', 'Tent', 'Status-healing'])),
				_Utils_Tuple2(
				12,
				_List_fromArray(
					['Life', 'Tent', 'Status-healing'])),
				_Utils_Tuple2(
				16,
				_List_fromArray(
					['Cure2', 'Life', 'Tent', 'Cabin', 'Status-healing'])),
				_Utils_Tuple2(
				19,
				_List_fromArray(
					['Life', 'Tent', 'Status-healing'])),
				_Utils_Tuple2(
				24,
				_List_fromArray(
					['Life', 'Tent', 'Status-healing'])),
				_Utils_Tuple2(
				30,
				_List_fromArray(
					['Life', 'Tent', 'Status-healing'])),
				_Utils_Tuple2(
				32,
				_List_fromArray(
					['Status-healing'])),
				_Utils_Tuple2(
				36,
				_List_fromArray(
					['Status-healing'])),
				_Utils_Tuple2(
				40,
				_List_fromArray(
					['Cure2', 'Life', 'Tent', 'Cabin', 'Status-healing'])),
				_Utils_Tuple2(
				45,
				_List_fromArray(
					['Cure2', 'Life', 'Tent', 'Cabin', 'Status-healing'])),
				_Utils_Tuple2(
				49,
				_List_fromArray(
					['Cure2', 'Life', 'Tent', 'Cabin', 'Status-healing'])),
				_Utils_Tuple2(52, _List_Nil),
				_Utils_Tuple2(
				53,
				_List_fromArray(
					['Cure2', 'Life', 'Cabin', 'Ether']))
			])));
var $author$project$Location$filterItems = F3(
	function (_v0, _v1, items) {
		var flags = _v0.l;
		var location = _v1;
		var vanillaItems = A2(
			$elm$core$Maybe$withDefault,
			$Gizra$elm_all_set$EverySet$empty,
			A2($pzp1997$assoc_list$AssocList$get, location.r, $author$project$Location$vanillaShops));
		var shopType = (location.r === 52) ? 2 : (($Gizra$elm_all_set$EverySet$isEmpty(location.a) && (!location.H)) ? 0 : 1);
		var allVanillaItems = A3(
			$elm$core$List$foldl,
			$Gizra$elm_all_set$EverySet$union,
			$Gizra$elm_all_set$EverySet$empty,
			$pzp1997$assoc_list$AssocList$values($author$project$Location$vanillaShops));
		var exists = function (item) {
			if ((item.bk === 'Life') && flags.ak) {
				return false;
			} else {
				if ((item.bk === 'Siren') && flags.al) {
					return false;
				} else {
					if (item.ac && flags.aj) {
						return false;
					} else {
						var _v2 = _Utils_Tuple2(flags.bw, shopType);
						switch (_v2.a) {
							case 0:
								var _v3 = _v2.a;
								return A2($Gizra$elm_all_set$EverySet$member, item.bk, vanillaItems);
							case 1:
								var _v4 = _v2.a;
								return A2($Gizra$elm_all_set$EverySet$member, item.bk, allVanillaItems);
							case 2:
								switch (_v2.b) {
									case 0:
										var _v5 = _v2.a;
										var _v6 = _v2.b;
										return item.f <= 4;
									case 1:
										var _v7 = _v2.a;
										var _v8 = _v2.b;
										return item.f <= 5;
									default:
										var _v9 = _v2.a;
										var _v10 = _v2.b;
										return item.f === 6;
								}
							case 3:
								switch (_v2.b) {
									case 0:
										var _v11 = _v2.a;
										var _v12 = _v2.b;
										return item.f <= 3;
									case 1:
										var _v13 = _v2.a;
										var _v14 = _v2.b;
										return item.f <= 4;
									default:
										var _v15 = _v2.a;
										var _v16 = _v2.b;
										return A2(
											$elm$core$List$member,
											item.f,
											_List_fromArray(
												[5, 6]));
								}
							default:
								return true;
						}
					}
				}
			}
		};
		return A2($author$project$ConsumableItems$filter, exists, items);
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Location$getItems = F3(
	function (context, valueIndex, _v0) {
		var location = _v0;
		var _v1 = A2($elm$core$Array$get, valueIndex, location.k);
		_v1$2:
		while (true) {
			if ((!_v1.$) && (_v1.a.b.$ === 5)) {
				switch (_v1.a.b.a.$) {
					case 3:
						var _v2 = _v1.a;
						var items = _v2.b.a.a;
						return A3($author$project$Location$filterItems, context, location, items);
					case 4:
						var _v3 = _v1.a;
						var items = _v3.b.a.a;
						return A3($author$project$Location$filterItems, context, location, items);
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return _List_Nil;
	});
var $author$project$Objective$keys = A2(
	$elm$core$Basics$composeR,
	$elm$core$Array$toList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(
			function ($) {
				return $.r;
			}),
		$Gizra$elm_all_set$EverySet$fromList));
var $author$project$Location$combinedObjectives = function (context) {
	return A2(
		$Gizra$elm_all_set$EverySet$union,
		context.s,
		$author$project$Objective$keys(context.l.aK));
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Value$Bosses = 1;
var $author$project$Value$TrappedChests = 4;
var $author$project$Value$toFilter = function (value) {
	toFilter:
	while (true) {
		switch (value.$) {
			case 0:
				return $elm$core$Maybe$Just(0);
			case 1:
				return $elm$core$Maybe$Just(1);
			case 2:
				return $elm$core$Maybe$Just(2);
			case 3:
				return $elm$core$Maybe$Just(3);
			case 4:
				return $elm$core$Maybe$Just(4);
			case 5:
				return $elm$core$Maybe$Nothing;
			case 6:
				return $elm$core$Maybe$Nothing;
			case 7:
				return $elm$core$Maybe$Nothing;
			default:
				var val = value.b;
				var $temp$value = val;
				value = $temp$value;
				continue toFilter;
		}
	}
};
var $author$project$Location$getProperties_ = F3(
	function (c, unwrapGatedValues, _v0) {
		var location = _v0;
		var unwrapGatedValue = function (value) {
			var _v17 = _Utils_Tuple2(unwrapGatedValues, value);
			if (_v17.a && (_v17.b.$ === 8)) {
				var _v18 = _v17.b;
				var v = _v18.b;
				return v;
			} else {
				return value;
			}
		};
		var toRecord = function (_v15) {
			var index = _v15.a;
			var _v16 = _v15.b;
			var status = _v16.a;
			var value = _v16.b;
			return {
				A: index,
				aW: status,
				at: unwrapGatedValue(value)
			};
		};
		var fixupShopOther = function (list) {
			if (((list.b && (list.a.b.b.$ === 5)) && (list.a.b.b.a.$ === 5)) && (!list.b.b)) {
				var _v13 = list.a;
				var _v14 = _v13.b;
				return _List_Nil;
			} else {
				return list;
			}
		};
		var context = _Utils_update(
			c,
			{
				n: (A2($Gizra$elm_all_set$EverySet$member, $author$project$Requirement$LegendSword, c.n) && A2($Gizra$elm_all_set$EverySet$member, $author$project$Requirement$Adamant, c.n)) ? A2(
					$Gizra$elm_all_set$EverySet$insert,
					$author$project$Requirement$Pseudo(6),
					c.n) : c.n
			});
		var notFilteredOut = function (_v11) {
			var value = _v11.b;
			return 1 !== A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$andThen,
					function (filter) {
						return A2($pzp1997$assoc_list$AssocList$get, filter, context.ba);
					},
					$author$project$Value$toFilter(value)));
		};
		var objectives = $author$project$Location$combinedObjectives(context);
		var exists = function (value) {
			exists:
			while (true) {
				switch (value.$) {
					case 0:
						if (!value.a) {
							var _v2 = value.a;
							return !context.l.ai;
						} else {
							var _v3 = value.a;
							return !(A2($Gizra$elm_all_set$EverySet$member, $author$project$Objective$ClassicGiant, objectives) && (location.r === 38));
						}
					case 2:
						var itemClass = value.a;
						return (!(context.Q && (location.r === 50))) && ((!((location.r === 21) && ((itemClass === 6) && (!context.l.ao)))) && A2($Gizra$elm_all_set$EverySet$member, itemClass, context.l.aH));
					case 7:
						if (value.a.$ === 5) {
							var obj = value.a.a;
							return context.l.au && A2(
								$Gizra$elm_all_set$EverySet$member,
								$author$project$Objective$DefeatBoss(obj),
								objectives);
						} else {
							var obj = value.a;
							return A2($Gizra$elm_all_set$EverySet$member, obj, objectives);
						}
					case 8:
						var required = value.a;
						var v = value.b;
						var _v4 = _Utils_Tuple3(context.l.ap, location.r, v);
						_v4$2:
						while (true) {
							if (_v4.a) {
								switch (_v4.b) {
									case 28:
										var _v5 = _v4.b;
										var $temp$value = v;
										value = $temp$value;
										continue exists;
									case 27:
										if (_v4.c.$ === 2) {
											var _v6 = _v4.b;
											var $temp$value = v;
											value = $temp$value;
											continue exists;
										} else {
											break _v4$2;
										}
									default:
										break _v4$2;
								}
							} else {
								break _v4$2;
							}
						}
						return A2($Gizra$elm_all_set$EverySet$member, required, context.n) && exists(v);
					case 5:
						var shopValue = value.a;
						var hasValue = function () {
							switch (shopValue.$) {
								case 0:
									return !context.l.ae;
								case 1:
									return !context.l.ae;
								case 3:
									var items = shopValue.a;
									return !$elm$core$List$isEmpty(
										A3($author$project$Location$filterItems, context, location, items));
								case 4:
									var items = shopValue.a;
									return !$elm$core$List$isEmpty(
										A3($author$project$Location$filterItems, context, location, items));
								default:
									return true;
							}
						}();
						var baronNightShop = function () {
							switch (shopValue.$) {
								case 0:
									return true;
								case 1:
									return true;
								case 5:
									return true;
								default:
									return false;
							}
						}();
						var passesNightMode = (!context.l.ah) || ((!(!location.H)) || (((location.r === 19) && baronNightShop) || ((location.r === 36) || ((location.r === 24) && (!A2(
							$elm$core$List$member,
							shopValue,
							_List_fromArray(
								[$author$project$Value$Weapon, $author$project$Value$Armour])))))));
						return passesNightMode && hasValue;
					default:
						return true;
				}
			}
		};
		return A2(
			$elm$core$List$map,
			toRecord,
			fixupShopOther(
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeR, $elm$core$Tuple$second, notFilteredOut),
					A2(
						$elm$core$List$filter,
						function (_v9) {
							var _v10 = _v9.b;
							var value = _v10.b;
							return exists(value);
						},
						$elm$core$Array$toIndexedList(location.k)))));
	});
var $author$project$Location$getProperties = F2(
	function (context, location) {
		return A3($author$project$Location$getProperties_, context, true, location);
	});
var $author$project$Location$getProperty = F3(
	function (key, index, _v0) {
		var locations = _v0;
		return A2(
			$elm$core$Maybe$map,
			function (_v2) {
				var status = _v2.a;
				var value = _v2.b;
				if (value.$ === 8) {
					var v = value.b;
					return _Utils_Tuple2(status, v);
				} else {
					return _Utils_Tuple2(status, value);
				}
			},
			A2(
				$elm$core$Maybe$andThen,
				function (_v1) {
					var location = _v1;
					return A2($elm$core$Array$get, index, location.k);
				},
				A2($pzp1997$assoc_list$AssocList$get, key, locations)));
	});
var $author$project$Location$getStatus = function (_v0) {
	var location = _v0;
	return location.aW;
};
var $author$project$Location$getKey = function (_v0) {
	var location = _v0;
	return location.r;
};
var $pzp1997$assoc_list$AssocList$update = F3(
	function (targetKey, alter, dict) {
		var alist = dict;
		var maybeValue = A2($pzp1997$assoc_list$AssocList$get, targetKey, dict);
		if (!maybeValue.$) {
			var _v1 = alter(maybeValue);
			if (!_v1.$) {
				var alteredValue = _v1.a;
				return A2(
					$elm$core$List$map,
					function (entry) {
						var key = entry.a;
						return _Utils_eq(key, targetKey) ? _Utils_Tuple2(targetKey, alteredValue) : entry;
					},
					alist);
			} else {
				return A2($pzp1997$assoc_list$AssocList$remove, targetKey, dict);
			}
		} else {
			var _v2 = alter($elm$core$Maybe$Nothing);
			if (!_v2.$) {
				var alteredValue = _v2.a;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(targetKey, alteredValue),
					alist);
			} else {
				return dict;
			}
		}
	});
var $author$project$Location$update = F3(
	function (key, fn, _v0) {
		var locations = _v0;
		return A3($pzp1997$assoc_list$AssocList$update, key, fn, locations);
	});
var $author$project$Location$insert = F2(
	function (location, locations) {
		return A3(
			$author$project$Location$update,
			$author$project$Location$getKey(location),
			$elm$core$Basics$always(
				$elm$core$Maybe$Just(location)),
			locations);
	});
var $pzp1997$assoc_list$AssocList$intersect = F2(
	function (_v0, rightDict) {
		var leftAlist = _v0;
		return A2(
			$elm$core$List$filter,
			function (_v1) {
				var key = _v1.a;
				return A2($pzp1997$assoc_list$AssocList$member, key, rightDict);
			},
			leftAlist);
	});
var $Gizra$elm_all_set$EverySet$intersect = F2(
	function (_v0, _v1) {
		var d1 = _v0;
		var d2 = _v1;
		return A2($pzp1997$assoc_list$AssocList$intersect, d1, d2);
	});
var $author$project$App$modelFoldl = F3(
	function (fn, list, model) {
		return A3($elm$core$List$foldl, fn, model, list);
	});
var $author$project$Value$objective = function (value) {
	if (value.$ === 7) {
		var obj = value.a;
		return $elm$core$Maybe$Just(obj);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Status$Dismissed = {$: 3};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $pzp1997$assoc_list$AssocList$map = F2(
	function (alter, _v0) {
		var alist = _v0;
		return A2(
			$elm$core$List$map,
			function (_v1) {
				var key = _v1.a;
				var value = _v1.b;
				return _Utils_Tuple2(
					key,
					A2(alter, key, value));
			},
			alist);
	});
var $author$project$Location$objectiveToggled = F3(
	function (objective, complete, _v0) {
		var locations = _v0;
		var updateProperty = function (_v4) {
			var status = _v4.a;
			var value = _v4.b;
			var statusFor = function (o) {
				var _v3 = _Utils_Tuple2(
					_Utils_eq(objective, o),
					complete);
				if (_v3.a) {
					if (_v3.b) {
						return $author$project$Status$Dismissed;
					} else {
						return $author$project$Status$Unseen;
					}
				} else {
					return status;
				}
			};
			var newStatus = function () {
				_v2$2:
				while (true) {
					switch (value.$) {
						case 7:
							var o = value.a;
							return statusFor(o);
						case 8:
							if (value.b.$ === 7) {
								var o = value.b.a;
								return statusFor(o);
							} else {
								break _v2$2;
							}
						default:
							break _v2$2;
					}
				}
				return status;
			}();
			return A2($author$project$Location$Property, newStatus, value);
		};
		var updateLocation = function (_v1) {
			var l = _v1;
			return _Utils_update(
				l,
				{
					k: A2($elm$core$Array$map, updateProperty, l.k)
				});
		};
		return A2(
			$pzp1997$assoc_list$AssocList$map,
			$elm$core$Basics$always(updateLocation),
			locations);
	});
var $author$project$Value$requirement = function (value) {
	if (value.$ === 6) {
		var req = value.a;
		return $elm$core$Maybe$Just(req);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm_community$array_extra$Array$Extra$update = F3(
	function (n, f, a) {
		var element = A2($elm$core$Array$get, n, a);
		if (element.$ === 1) {
			return a;
		} else {
			var element_ = element.a;
			return A3(
				$elm$core$Array$set,
				n,
				f(element_),
				a);
		}
	});
var $author$project$Location$setText = F3(
	function (valueIndex, newText, _v0) {
		var location = _v0;
		var set = function (_v2) {
			var value = _v2.b;
			var newValue = function () {
				if ((value.$ === 5) && (value.a.$ === 5)) {
					return $author$project$Value$Shop(
						$author$project$Value$Other(newText));
				} else {
					return value;
				}
			}();
			var newStatus = (newText === '') ? $author$project$Status$Unseen : $author$project$Status$Dismissed;
			return A2($author$project$Location$Property, newStatus, newValue);
		};
		return _Utils_update(
			location,
			{
				k: A3($elm_community$array_extra$Array$Extra$update, valueIndex, set, location.k)
			});
	});
var $pzp1997$assoc_list$AssocList$size = function (_v0) {
	var alist = _v0;
	return $elm$core$List$length(alist);
};
var $Gizra$elm_all_set$EverySet$size = function (_v0) {
	var d = _v0;
	return $pzp1997$assoc_list$AssocList$size(d);
};
var $author$project$ConsumableItems$anyDismissed = function (_v0) {
	var items = _v0;
	return A2(
		$elm$core$List$any,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.aW;
			},
			$elm$core$Basics$eq($author$project$Status$Dismissed)),
		$elm$core$Array$toList(items));
};
var $author$project$Status$toggle = F2(
	function (on, existing) {
		return _Utils_eq(on, existing) ? $author$project$Status$Unseen : on;
	});
var $author$project$ConsumableItems$update = F3(
	function (index, fn, _v0) {
		var items = _v0;
		return A3($elm_community$array_extra$Array$Extra$update, index, fn, items);
	});
var $author$project$Location$toggleItem = F3(
	function (valueIndex, itemIndex, _v0) {
		var location = _v0;
		var toggle = function (_v3) {
			var status = _v3.a;
			var value = _v3.b;
			var fromItems = function (items) {
				var newItems = A3(
					$author$project$ConsumableItems$update,
					itemIndex,
					function (item) {
						return _Utils_update(
							item,
							{
								aW: A2($author$project$Status$toggle, $author$project$Status$Dismissed, item.aW)
							});
					},
					items);
				var newStatus_ = $author$project$ConsumableItems$anyDismissed(newItems) ? $author$project$Status$Dismissed : $author$project$Status$Unseen;
				return _Utils_Tuple2(newStatus_, newItems);
			};
			var _v1 = function () {
				_v2$2:
				while (true) {
					if (value.$ === 5) {
						switch (value.a.$) {
							case 3:
								var items = value.a.a;
								return A2(
									$elm$core$Tuple$mapSecond,
									A2($elm$core$Basics$composeL, $author$project$Value$Shop, $author$project$Value$Healing),
									fromItems(items));
							case 4:
								var items = value.a.a;
								return A2(
									$elm$core$Tuple$mapSecond,
									A2($elm$core$Basics$composeL, $author$project$Value$Shop, $author$project$Value$JItem),
									fromItems(items));
							default:
								break _v2$2;
						}
					} else {
						break _v2$2;
					}
				}
				return _Utils_Tuple2(status, value);
			}();
			var newStatus = _v1.a;
			var newValue = _v1.b;
			return A2($author$project$Location$Property, newStatus, newValue);
		};
		return _Utils_update(
			location,
			{
				k: A3($elm_community$array_extra$Array$Extra$update, valueIndex, toggle, location.k)
			});
	});
var $author$project$Status$SeenSome = function (a) {
	return {$: 2, a: a};
};
var $author$project$Value$countable = function (value) {
	switch (value.$) {
		case 3:
			var c = value.a;
			return $elm$core$Maybe$Just(c);
		case 4:
			var c = value.a;
			return $elm$core$Maybe$Just(c);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Location$toggleProperty = F3(
	function (index, hard, _v0) {
		var location = _v0;
		var _v1 = A2($elm$core$Array$get, index, location.k);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var status = _v2.a;
			var value = _v2.b;
			var newStatus = function () {
				var _v3 = _Utils_Tuple3(
					hard,
					$author$project$Value$countable(value),
					status);
				_v3$3:
				while (true) {
					switch (_v3.c.$) {
						case 0:
							if ((!_v3.a) && (!_v3.b.$)) {
								var total = _v3.b.a;
								var _v4 = _v3.c;
								return (total > 1) ? $author$project$Status$SeenSome(1) : $author$project$Status$Dismissed;
							} else {
								break _v3$3;
							}
						case 2:
							if ((!_v3.a) && (!_v3.b.$)) {
								var total = _v3.b.a;
								var seen = _v3.c.a;
								return (_Utils_cmp(seen + 1, total) < 0) ? $author$project$Status$SeenSome(seen + 1) : $author$project$Status$Dismissed;
							} else {
								break _v3$3;
							}
						case 3:
							var _v5 = _v3.c;
							return $author$project$Status$Unseen;
						default:
							break _v3$3;
					}
				}
				return $author$project$Status$Dismissed;
			}();
			return _Utils_update(
				location,
				{
					k: A3(
						$elm$core$Array$set,
						index,
						A2($author$project$Location$Property, newStatus, value),
						location.k)
				});
		} else {
			return location;
		}
	});
var $author$project$Location$toggleStatus = F3(
	function (context, status, _v0) {
		var location = _v0;
		var newStatus = A2($author$project$Status$toggle, status, location.aW);
		var dismissSpecialValue = function (_v4) {
			var propStatus = _v4.a;
			var value = _v4.b;
			var newPropStatus = function () {
				switch (value.$) {
					case 6:
						return $author$project$Status$Dismissed;
					case 8:
						var required = value.a;
						var v = value.b;
						var _v2 = _Utils_Tuple3(
							A2($Gizra$elm_all_set$EverySet$member, required, context.n),
							v,
							location.r);
						_v2$2:
						while (true) {
							if (_v2.a) {
								switch (_v2.b.$) {
									case 6:
										return $author$project$Status$Dismissed;
									case 2:
										if (_v2.c === 14) {
											var _v3 = _v2.c;
											return $author$project$Status$Dismissed;
										} else {
											break _v2$2;
										}
									default:
										break _v2$2;
								}
							} else {
								break _v2$2;
							}
						}
						return propStatus;
					default:
						return propStatus;
				}
			}();
			return A2($author$project$Location$Property, newPropStatus, value);
		};
		var properties = _Utils_eq(newStatus, $author$project$Status$Dismissed) ? A2($elm$core$Array$map, dismissSpecialValue, location.k) : location.k;
		return _Utils_update(
			location,
			{k: properties, aW: newStatus});
	});
var $author$project$Location$undismissByGatingRequirement = F3(
	function (context, requirement, _v0) {
		var locations = _v0;
		var isMatchingGatedValue = function (value) {
			if (value.$ === 8) {
				var req = value.a;
				return _Utils_eq(req, requirement);
			} else {
				return false;
			}
		};
		var hasMatchingGatedValue = A2(
			$elm$core$Basics$composeR,
			A2($author$project$Location$getProperties_, context, false),
			$elm$core$List$any(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.at;
					},
					isMatchingGatedValue)));
		var updateLocation = function (location) {
			var l = location;
			return hasMatchingGatedValue(location) ? _Utils_update(
				l,
				{aW: $author$project$Status$Unseen}) : location;
		};
		return A2(
			$pzp1997$assoc_list$AssocList$map,
			$elm$core$Basics$always(updateLocation),
			locations);
	});
var $author$project$App$innerUpdate = F2(
	function (msg, model) {
		var updateCrystal = function (newModel) {
			var fn = (!newModel.l.am) ? ((_Utils_cmp(
				$Gizra$elm_all_set$EverySet$size(newModel.h),
				newModel.l.aq) > -1) ? $Gizra$elm_all_set$EverySet$insert($author$project$Requirement$Crystal) : $Gizra$elm_all_set$EverySet$remove($author$project$Requirement$Crystal)) : $elm$core$Basics$identity;
			return _Utils_update(
				newModel,
				{
					n: fn(newModel.n)
				});
		};
		var removeRequirement = F2(
			function (requirement, newModel) {
				return _Utils_update(
					newModel,
					{
						n: A2($Gizra$elm_all_set$EverySet$remove, requirement, model.n)
					});
			});
		var removeObjective = F2(
			function (objective, newModel) {
				return updateCrystal(
					_Utils_update(
						newModel,
						{
							h: A2($Gizra$elm_all_set$EverySet$remove, objective, newModel.h),
							i: A3($author$project$Location$objectiveToggled, objective, false, newModel.i)
						}));
			});
		var attainRequirement = F2(
			function (requirement, newModel) {
				var attainedRequirements = A2($Gizra$elm_all_set$EverySet$insert, requirement, newModel.n);
				var context = $author$project$App$getContext(
					_Utils_update(
						newModel,
						{n: attainedRequirements}));
				var locations = A3($author$project$Location$undismissByGatingRequirement, context, requirement, newModel.i);
				return _Utils_update(
					newModel,
					{n: attainedRequirements, i: locations});
			});
		var toggleProperty = F4(
			function (key, index, hard, newModel) {
				var locations = A3(
					$author$project$Location$update,
					key,
					$elm$core$Maybe$map(
						A2($author$project$Location$toggleProperty, index, hard)),
					newModel.i);
				var updateObjectives = function () {
					var _v13 = A3($author$project$Location$getProperty, key, index, locations);
					_v13$2:
					while (true) {
						if ((!_v13.$) && (_v13.a.b.$ === 7)) {
							switch (_v13.a.a.$) {
								case 0:
									var _v14 = _v13.a;
									var _v15 = _v14.a;
									var objective = _v14.b.a;
									return $Gizra$elm_all_set$EverySet$remove(objective);
								case 3:
									var _v16 = _v13.a;
									var _v17 = _v16.a;
									var objective = _v16.b.a;
									return $Gizra$elm_all_set$EverySet$insert(objective);
								default:
									break _v13$2;
							}
						} else {
							break _v13$2;
						}
					}
					return $elm$core$Basics$identity;
				}();
				var updateRequirements = function () {
					var _v8 = A3($author$project$Location$getProperty, key, index, locations);
					_v8$2:
					while (true) {
						if ((!_v8.$) && (_v8.a.b.$ === 6)) {
							switch (_v8.a.a.$) {
								case 0:
									var _v9 = _v8.a;
									var _v10 = _v9.a;
									var requirement = _v9.b.a;
									return removeRequirement(requirement);
								case 3:
									var _v11 = _v8.a;
									var _v12 = _v11.a;
									var requirement = _v11.b.a;
									return attainRequirement(requirement);
								default:
									break _v8$2;
							}
						} else {
							break _v8$2;
						}
					}
					return $elm$core$Basics$identity;
				}();
				return updateCrystal(
					updateRequirements(
						_Utils_update(
							newModel,
							{
								h: updateObjectives(newModel.h),
								i: locations
							})));
			});
		var attainObjective = F2(
			function (objective, newModel) {
				return updateCrystal(
					_Utils_update(
						newModel,
						{
							h: A2($Gizra$elm_all_set$EverySet$insert, objective, newModel.h),
							i: A3($author$project$Location$objectiveToggled, objective, true, newModel.i)
						}));
			});
		switch (msg.$) {
			case 0:
				var objective = msg.a;
				return A2($Gizra$elm_all_set$EverySet$member, objective, model.h) ? A2(removeObjective, objective, model) : A2(attainObjective, objective, model);
			case 1:
				var index = msg.a;
				var description = msg.b;
				var _v1 = $author$project$Objective$fromDescription(description);
				if (!_v1.$) {
					var objective = _v1.a;
					return _Utils_update(
						model,
						{
							s: A3(
								$elm$core$Array$set,
								index,
								$author$project$App$Set(objective),
								model.s)
						});
				} else {
					return model;
				}
			case 2:
				var index = msg.a;
				return _Utils_update(
					model,
					{
						s: A3($elm$core$Array$set, index, $author$project$App$Unset, model.s)
					});
			case 3:
				var requirement = msg.a;
				return A2($Gizra$elm_all_set$EverySet$member, requirement, model.n) ? A2(removeRequirement, requirement, model) : A2(attainRequirement, requirement, model);
			case 4:
				var locClass = msg.a;
				var filter = msg.b;
				var toggle = function (state) {
					if (state.$ === 1) {
						return $elm$core$Maybe$Just(0);
					} else {
						if (!state.a) {
							var _v4 = state.a;
							return (filter === 5) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(1);
						} else {
							var _v5 = state.a;
							return A2(
								$elm$core$List$member,
								filter,
								_List_fromArray(
									[0, 2])) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing;
						}
					}
				};
				if (!locClass) {
					return _Utils_update(
						model,
						{
							x: A3($pzp1997$assoc_list$AssocList$update, filter, toggle, model.x)
						});
				} else {
					return _Utils_update(
						model,
						{
							M: A3($pzp1997$assoc_list$AssocList$update, filter, toggle, model.M)
						});
				}
			case 5:
				var location = msg.a;
				var status = msg.b;
				var newLocation = A3(
					$author$project$Location$toggleStatus,
					$author$project$App$getContext(model),
					status,
					location);
				var newModel = _Utils_update(
					model,
					{
						i: A2($author$project$Location$insert, newLocation, model.i)
					});
				var properties = A2(
					$author$project$Location$getProperties,
					$author$project$App$getContext(newModel),
					newLocation);
				var objectives = A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.at;
						},
						$author$project$Value$objective),
					properties);
				var requirements = A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.at;
						},
						$author$project$Value$requirement),
					properties);
				var _v6 = $author$project$Location$getStatus(newLocation);
				if (_v6.$ === 3) {
					return A3(
						$author$project$App$modelFoldl,
						attainObjective,
						objectives,
						A3($author$project$App$modelFoldl, attainRequirement, requirements, newModel));
				} else {
					return newModel;
				}
			case 6:
				var key = msg.a;
				var index = msg.b;
				return A4(toggleProperty, key, index, false, model);
			case 7:
				var key = msg.a;
				var index = msg.b;
				return A4(toggleProperty, key, index, true, model);
			case 8:
				var key = msg.a;
				var index = msg.b;
				return A4(
					toggleProperty,
					key,
					index,
					false,
					_Utils_update(
						model,
						{Q: !model.Q}));
			case 9:
				var newShop = msg.a;
				var shopMenu = function () {
					var _v7 = model.w;
					if (!_v7.$) {
						var existingShop = _v7.a;
						return (_Utils_eq(existingShop.r, newShop.r) && _Utils_eq(existingShop.A, newShop.A)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(newShop);
					} else {
						return $elm$core$Maybe$Just(newShop);
					}
				}();
				return _Utils_update(
					model,
					{w: shopMenu});
			case 10:
				return _Utils_update(
					model,
					{w: $elm$core$Maybe$Nothing});
			case 11:
				var menu = msg.a;
				var itemIndex = msg.b;
				var locations = A3(
					$author$project$Location$update,
					menu.r,
					$elm$core$Maybe$map(
						A2($author$project$Location$toggleItem, menu.A, itemIndex)),
					model.i);
				var shopMenu = A2(
					$elm$core$Maybe$map,
					function (items) {
						return _Utils_update(
							menu,
							{
								S: $author$project$App$Items(items)
							});
					},
					A2(
						$elm$core$Maybe$map,
						A2(
							$author$project$Location$getItems,
							A2($author$project$App$getContextFor, 1, model),
							menu.A),
						A2($author$project$Location$get, menu.r, locations)));
				return _Utils_update(
					model,
					{i: locations, w: shopMenu});
			case 12:
				var menu = msg.a;
				var newText = msg.b;
				var locations = A3(
					$author$project$Location$update,
					menu.r,
					$elm$core$Maybe$map(
						A2($author$project$Location$setText, menu.A, newText)),
					model.i);
				return _Utils_update(
					model,
					{
						i: locations,
						w: $elm$core$Maybe$Just(
							_Utils_update(
								menu,
								{
									S: $author$project$App$Text(newText)
								}))
					});
			case 13:
				var flagString = msg.a;
				var flags = $author$project$Flags$parse(flagString);
				var randomObjectives = A2($author$project$App$updateRandomObjectives, flags, model.s);
				var filterChests = (flags.bm && (!_Utils_eq(
					A2($pzp1997$assoc_list$AssocList$get, 3, model.x),
					$elm$core$Maybe$Just(0)))) ? A2($pzp1997$assoc_list$AssocList$insert, 3, 1) : $elm$core$Basics$identity;
				var filterCharacters = flags.bl ? A2($pzp1997$assoc_list$AssocList$insert, 0, 1) : $elm$core$Basics$identity;
				var locationFilterOverrides = filterCharacters(
					filterChests(model.x));
				var completedObjectives = A2(
					$Gizra$elm_all_set$EverySet$intersect,
					model.h,
					A2(
						$Gizra$elm_all_set$EverySet$union,
						$author$project$Objective$keys(flags.aK),
						$author$project$App$randomObjectiveKeys(randomObjectives)));
				return updateCrystal(
					_Utils_update(
						model,
						{h: completedObjectives, _: flagString, l: flags, x: locationFilterOverrides, s: randomObjectives, w: $elm$core$Maybe$Nothing}));
			case 14:
				return model;
			default:
				return model;
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm_community$string_extra$String$Extra$breaker = F3(
	function (width, string, acc) {
		breaker:
		while (true) {
			if (string === '') {
				return $elm$core$List$reverse(acc);
			} else {
				var $temp$width = width,
					$temp$string = A2($elm$core$String$dropLeft, width, string),
					$temp$acc = A2(
					$elm$core$List$cons,
					A3($elm$core$String$slice, 0, width, string),
					acc);
				width = $temp$width;
				string = $temp$string;
				acc = $temp$acc;
				continue breaker;
			}
		}
	});
var $elm_community$string_extra$String$Extra$break = F2(
	function (width, string) {
		return ((!width) || (string === '')) ? _List_fromArray(
			[string]) : A3($elm_community$string_extra$String$Extra$breaker, width, string, _List_Nil);
	});
var $author$project$Colour$darkHover = '#797a7b';
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $author$project$Colour$lightText = '#ffffff';
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Colour$setContrastText = function (colours) {
	var rgb = A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			$rtfeldman$elm_hex$Hex$fromString,
			$elm$core$Result$withDefault(0)),
		A2(
			$elm_community$string_extra$String$Extra$break,
			2,
			A2($elm$core$String$dropLeft, 1, colours.a3)));
	var yiq = function () {
		if (((rgb.b && rgb.b.b) && rgb.b.b.b) && (!rgb.b.b.b.b)) {
			var red = rgb.a;
			var _v1 = rgb.b;
			var green = _v1.a;
			var _v2 = _v1.b;
			var blue = _v2.a;
			return ((((red * 299) + (green * 587)) + (blue * 114)) / 1000) | 0;
		} else {
			return 128;
		}
	}();
	return (yiq >= 128) ? _Utils_update(
		colours,
		{T: $author$project$Colour$lightHover, bA: $author$project$Colour$darkText}) : _Utils_update(
		colours,
		{T: $author$project$Colour$darkHover, bA: $author$project$Colour$lightText});
};
var $author$project$Colour$set = F3(
	function (_for, colour, colours) {
		if (!_for) {
			return $author$project$Colour$setContrastText(
				_Utils_update(
					colours,
					{a3: colour}));
		} else {
			return _Utils_update(
				colours,
				{bA: colour});
		}
	});
var $author$project$App$shopMenuID = 'shop-menu-input';
var $author$project$App$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 9:
				return A2(
					$author$project$App$with,
					$author$project$App$focus($author$project$App$shopMenuID),
					A2($author$project$App$innerUpdate, msg, model));
			case 14:
				var _for = msg.a;
				var colour = msg.b;
				var colours = A3($author$project$Colour$set, _for, colour, model.I);
				return A2(
					$author$project$App$with,
					$author$project$Ports$setColours(
						$author$project$Colour$encode(colours)),
					_Utils_update(
						model,
						{I: colours}));
			default:
				return A2(
					$author$project$App$with,
					$elm$core$Platform$Cmd$none,
					A2($author$project$App$innerUpdate, msg, model));
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Colour$Background = 0;
var $author$project$App$SetColour = F2(
	function (a, b) {
		return {$: 14, a: a, b: b};
	});
var $author$project$Colour$Text = 1;
var $author$project$App$UpdateFlags = function (a) {
	return {$: 13, a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$App$displayIf = F2(
	function (predicate, html) {
		return predicate ? html : $elm$html$Html$text('');
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$App$ToggleFilter = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Icon$img = F2(
	function (src_, attrs) {
		return A2(
			$elm$html$Html$img,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$src(src_),
				attrs),
			_List_Nil);
	});
var $author$project$Icon$boss = {
	Z: 'boss',
	aa: $author$project$Icon$img('img/sprites/Monster3-Front.gif'),
	O: 'Boss'
};
var $author$project$Icon$character = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Mini1-Front.gif'),
	O: 'Character'
};
var $author$project$Icon$chest = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/BlueChest1.gif'),
	O: 'Untrapped chests'
};
var $author$project$Icon$keyItem = {
	Z: 'key-item',
	aa: $author$project$Icon$img('img/sprites/Key-gold.gif'),
	O: 'Key item check'
};
var $author$project$Icon$trappedChest = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/RedChest2.gif'),
	O: 'Trapped chests'
};
var $author$project$Icon$visible = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/SecurityEye.gif'),
	O: 'Dismissed locations'
};
var $author$project$Icon$fromFilter = function (filter) {
	switch (filter) {
		case 0:
			return $author$project$Icon$character;
		case 1:
			return $author$project$Icon$boss;
		case 2:
			return $author$project$Icon$keyItem;
		case 3:
			return $author$project$Icon$chest;
		case 4:
			return $author$project$Icon$trappedChest;
		default:
			return $author$project$Icon$visible;
	}
};
var $author$project$Icon$no = A2(
	$elm$html$Html$img,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('no'),
			$elm$html$Html$Attributes$src('img/no.png')
		]),
	_List_Nil);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$App$viewFilters = F2(
	function (model, locClass) {
		var _v0 = function () {
			if (!locClass) {
				return _Utils_Tuple2(
					_List_fromArray(
						[0, 2, 1, 3, 4, 5]),
					model.x);
			} else {
				return _Utils_Tuple2(
					_List_fromArray(
						[5]),
					model.M);
			}
		}();
		var filters = _v0.a;
		var overrides = _v0.b;
		var viewFilter = function (filter) {
			var icon = $author$project$Icon$fromFilter(filter);
			var _v2 = function () {
				var _v3 = A2($pzp1997$assoc_list$AssocList$get, filter, overrides);
				if (!_v3.$) {
					if (!_v3.a) {
						var _v4 = _v3.a;
						return _Utils_Tuple2('show', false);
					} else {
						var _v5 = _v3.a;
						return _Utils_Tuple2('hide', true);
					}
				} else {
					return _Utils_Tuple2('unset', false);
				}
			}();
			var stateClass = _v2.a;
			var hide = _v2.b;
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('icon filter'),
						$elm$html$Html$Attributes$class(stateClass),
						$elm$html$Html$Attributes$class(icon.Z),
						$elm$html$Html$Attributes$title(icon.O),
						$elm$html$Html$Events$onClick(
						A2($author$project$App$ToggleFilter, locClass, filter))
					]),
				_List_fromArray(
					[
						icon.aa(_List_Nil),
						A2($author$project$App$displayIf, hide, $author$project$Icon$no)
					]));
		};
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('filters')
				]),
			A2($elm$core$List$map, viewFilter, filters));
	});
var $author$project$Requirement$Spoon = {$: 15};
var $author$project$App$ToggleRequirement = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$App$displayCellIf = F2(
	function (predicate, html) {
		return predicate ? html : A2($elm$html$Html$div, _List_Nil, _List_Nil);
	});
var $pzp1997$assoc_list$AssocList$filter = F2(
	function (isGood, _v0) {
		var alist = _v0;
		return A2(
			$elm$core$List$filter,
			function (_v1) {
				var key = _v1.a;
				var value = _v1.b;
				return A2(isGood, key, value);
			},
			alist);
	});
var $Gizra$elm_all_set$EverySet$filter = F2(
	function (p, _v0) {
		var d = _v0;
		return A2(
			$pzp1997$assoc_list$AssocList$filter,
			F2(
				function (k, _v1) {
					return p(k);
				}),
			d);
	});
var $author$project$Icon$requirements = $pzp1997$assoc_list$AssocList$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			$author$project$Requirement$Adamant,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-13Adamant-Color-Alt.png'),
				O: 'Adamant'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$BaronKey,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-9BaronKey-Color.png'),
				O: 'Baron Key'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Crystal,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-1THECrystal-Color.png'),
				O: 'Crystal'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$DarknessCrystal,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-4DarkCrystal-Color.png'),
				O: 'Darkness Crystal'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$EarthCrystal,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-5EarthCrystal-Color.png'),
				O: 'Earth Crystal'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Hook,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-3Hook-Color.png'),
				O: 'Hook'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$LegendSword,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-14LegendSword-Color.png'),
				O: 'Legend Sword'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$LucaKey,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-12LucaKey-Color.png'),
				O: 'Luca Key'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$MagmaKey,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-10MagmaKey-Color.png'),
				O: 'Magma Key'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Pseudo(1),
			{
				Z: '',
				aa: $author$project$Icon$img('img/sprites/MistDragon1.gif'),
				O: 'D.Mist Defeated'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Package,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-7Package-Color.png'),
				O: 'Package'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Pan,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-15Pan-Color-Alt.png'),
				O: 'Pan'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Pseudo(0),
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-2Pass-Color.png'),
				O: 'Pass'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$PinkTail,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-18PinkTail-Color.png'),
				O: 'Pink Tail'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$RatTail,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-17RatTail-Color.png'),
				O: 'Rat Tail'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$SandRuby,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-8SandRuby-Color.png'),
				O: 'Sand Ruby'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$Spoon,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-16Spoon-Color.png'),
				O: 'Spoon'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$TowerKey,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-11TowerKey-Color.png'),
				O: 'Tower Key'
			}),
			_Utils_Tuple2(
			$author$project$Requirement$TwinHarp,
			{
				Z: '',
				aa: $author$project$Icon$img('img/schalakitty/FFIVFE-Icons-6TwinHarp-Color.png'),
				O: 'Twin Harp'
			})
		]));
var $author$project$Icon$fromRequirement = function (requirement) {
	return A2($pzp1997$assoc_list$AssocList$get, requirement, $author$project$Icon$requirements);
};
var $author$project$Requirement$isPseudo = function (requirement) {
	if (requirement.$ === 17) {
		return true;
	} else {
		return false;
	}
};
var $author$project$App$viewKeyItems = F2(
	function (flags, attained) {
		var req_ = F2(
			function (requirement, readonly) {
				var _v0 = $author$project$Icon$fromRequirement(requirement);
				if (!_v0.$) {
					var icon = _v0.a;
					var readonlyAttr = readonly ? _List_fromArray(
						[
							$elm$html$Html$Attributes$title(icon.O + ' (can\'t be toggled directly)'),
							$elm$html$Html$Attributes$class('readonly')
						]) : _List_fromArray(
						[
							$elm$html$Html$Attributes$title(icon.O),
							$elm$html$Html$Events$onClick(
							$author$project$App$ToggleRequirement(requirement))
						]);
					return icon.aa(
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('requirement'),
									$elm$html$Html$Attributes$class(icon.Z),
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'disabled',
											!A2($Gizra$elm_all_set$EverySet$member, requirement, attained))
										]))
								]),
							readonlyAttr));
				} else {
					return A2($elm$html$Html$div, _List_Nil, _List_Nil);
				}
			});
		var req = function (requirement) {
			return A2(req_, requirement, false);
		};
		var numAttained = $Gizra$elm_all_set$EverySet$size(
			A2(
				$Gizra$elm_all_set$EverySet$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Requirement$isPseudo),
				attained));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('requirements')
				]),
			_List_fromArray(
				[
					(!flags.am) ? A2(req_, $author$project$Requirement$Crystal, true) : A2(req_, $author$project$Requirement$Crystal, false),
					A2(
					$author$project$App$displayCellIf,
					flags.br,
					req(
						$author$project$Requirement$Pseudo(0))),
					req($author$project$Requirement$Hook),
					req($author$project$Requirement$DarknessCrystal),
					req($author$project$Requirement$EarthCrystal),
					req($author$project$Requirement$TwinHarp),
					req($author$project$Requirement$Package),
					req($author$project$Requirement$SandRuby),
					req($author$project$Requirement$BaronKey),
					req($author$project$Requirement$MagmaKey),
					req($author$project$Requirement$TowerKey),
					req($author$project$Requirement$LucaKey),
					req($author$project$Requirement$Adamant),
					req($author$project$Requirement$LegendSword),
					req($author$project$Requirement$Pan),
					req($author$project$Requirement$Spoon),
					A2(
					$author$project$App$displayCellIf,
					!A2($Gizra$elm_all_set$EverySet$member, 5, flags.aH),
					req(
						$author$project$Requirement$Pseudo(1))),
					req($author$project$Requirement$RatTail),
					A2(
					$author$project$App$displayCellIf,
					!A2($Gizra$elm_all_set$EverySet$member, 6, flags.aH),
					req($author$project$Requirement$PinkTail)),
					A2(
					$author$project$App$displayCellIf,
					flags.bf,
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('requirement readonly total'),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('key-bonus-reached', numAttained >= 10)
									]))
							]),
						_List_fromArray(
							[
								A2(
								$author$project$App$displayIf,
								numAttained > 0,
								$elm$html$Html$text(
									$elm$core$String$fromInt(numAttained)))
							])))
				]));
	});
var $author$project$Location$areaToString = function (area) {
	switch (area) {
		case 0:
			return 'surface';
		case 1:
			return 'underground';
		default:
			return 'moon';
	}
};
var $author$project$Requirement$UndergroundAccess = 2;
var $author$project$Location$areaAccessible = F2(
	function (attained, _v0) {
		var location = _v0;
		var _v1 = location.H;
		switch (_v1) {
			case 0:
				return true;
			case 1:
				return A2(
					$Gizra$elm_all_set$EverySet$member,
					$author$project$Requirement$Pseudo(2),
					attained);
			default:
				return A2($Gizra$elm_all_set$EverySet$member, $author$project$Requirement$DarknessCrystal, attained);
		}
	});
var $author$project$Location$huntingDMist = function (context) {
	return !(A2($Gizra$elm_all_set$EverySet$member, 5, context.l.aH) || A2(
		$Gizra$elm_all_set$EverySet$member,
		$author$project$Requirement$Pseudo(1),
		context.n));
};
var $author$project$Objective$isBoss = function (key) {
	switch (key.$) {
		case 2:
			return true;
		case 5:
			return true;
		default:
			return false;
	}
};
var $author$project$Location$outstandingObjectives = function (context) {
	return (_Utils_cmp(
		$Gizra$elm_all_set$EverySet$size(context.h),
		context.l.aq) > -1) ? $Gizra$elm_all_set$EverySet$empty : A2(
		$Gizra$elm_all_set$EverySet$diff,
		$author$project$Location$combinedObjectives(context),
		context.h);
};
var $author$project$Location$defaultFiltersFrom = function (context) {
	var trappedKeyItems = A2($Gizra$elm_all_set$EverySet$member, 4, context.l.aH);
	var outstanding = $author$project$Location$outstandingObjectives(context);
	var onDarkMatterHunt = A2($Gizra$elm_all_set$EverySet$member, $author$project$Objective$DarkMatterHunt, outstanding);
	var bossesHaveValue = function () {
		var activeBossHunt = !$Gizra$elm_all_set$EverySet$isEmpty(
			A2($Gizra$elm_all_set$EverySet$filter, $author$project$Objective$isBoss, outstanding));
		return (!context.l.au) && (activeBossHunt || $author$project$Location$huntingDMist(context));
	}();
	return $Gizra$elm_all_set$EverySet$fromList(
		A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2(
				$elm$core$List$filter,
				$elm$core$Tuple$second,
				_List_fromArray(
					[
						_Utils_Tuple2(0, true),
						_Utils_Tuple2(1, bossesHaveValue),
						_Utils_Tuple2(2, true),
						_Utils_Tuple2(3, onDarkMatterHunt),
						_Utils_Tuple2(4, trappedKeyItems)
					]))));
};
var $pzp1997$assoc_list$AssocList$foldl = F3(
	function (func, initialResult, _v0) {
		var alist = _v0;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, result) {
					var key = _v1.a;
					var value = _v1.b;
					return A3(func, key, value, result);
				}),
			initialResult,
			alist);
	});
var $author$project$Location$filtersFrom = function (context) {
	return A3(
		$pzp1997$assoc_list$AssocList$foldl,
		F2(
			function (filter, type_) {
				if (!type_) {
					return $Gizra$elm_all_set$EverySet$insert(filter);
				} else {
					return $Gizra$elm_all_set$EverySet$remove(filter);
				}
			}),
		$author$project$Location$defaultFiltersFrom(context),
		context.ba);
};
var $author$project$Location$isClass = F2(
	function (_class, _v0) {
		var location = _v0;
		return _Utils_eq(_class === 1, location.ad);
	});
var $author$project$Location$requirementsMet = F2(
	function (attained, _v0) {
		var location = _v0;
		return $Gizra$elm_all_set$EverySet$isEmpty(
			A2($Gizra$elm_all_set$EverySet$diff, location.a, attained));
	});
var $author$project$Location$filterByContext = F3(
	function (_class, c, _v0) {
		var locations = _v0;
		var undergroundAccess = c.l.ap || (A2($Gizra$elm_all_set$EverySet$member, $author$project$Requirement$MagmaKey, c.n) || A2(
			$Gizra$elm_all_set$EverySet$member,
			$author$project$Requirement$Pseudo(5),
			c.n));
		var jumpable = $Gizra$elm_all_set$EverySet$fromList(
			_List_fromArray(
				[20, 21, 22, 35, 36, 37]));
		var attainedRequirements = undergroundAccess ? A2(
			$Gizra$elm_all_set$EverySet$insert,
			$author$project$Requirement$Pseudo(2),
			c.n) : c.n;
		var context = _Utils_update(
			c,
			{n: attainedRequirements});
		var filters = $author$project$Location$filtersFrom(context);
		var outstanding = $author$project$Location$outstandingObjectives(context);
		var propertyHasValue = function (_v3) {
			var status = _v3.aW;
			var value = _v3.at;
			var _v1 = _Utils_Tuple2(
				value,
				$author$project$Value$toFilter(value));
			switch (_v1.a.$) {
				case 6:
					if ((_v1.a.a.$ === 17) && (_v1.a.a.a === 5)) {
						var _v2 = _v1.a.a.a;
						return _Utils_eq(status, $author$project$Status$Dismissed) || (!undergroundAccess);
					} else {
						return true;
					}
				case 7:
					var obj = _v1.a.a;
					return A2($Gizra$elm_all_set$EverySet$member, obj, outstanding);
				case 5:
					return true;
				default:
					if (!_v1.b.$) {
						var filter = _v1.b.a;
						return A2($Gizra$elm_all_set$EverySet$member, filter, filters);
					} else {
						return false;
					}
			}
		};
		var isRelevant = function (location) {
			var l = location;
			return (!A2($author$project$Location$isClass, _class, location)) ? false : (_Utils_eq(l.aW, $author$project$Status$Dismissed) ? (!A2(
				$elm$core$Maybe$withDefault,
				1,
				A2($pzp1997$assoc_list$AssocList$get, 5, context.ba))) : ((context.l.au && ((!l.r) && $author$project$Location$huntingDMist(context))) ? true : (A2(
				$elm$core$List$any,
				propertyHasValue,
				A2($author$project$Location$getProperties, context, location)) && (A2($author$project$Location$areaAccessible, attainedRequirements, location) && ((context.l.ap && A2($Gizra$elm_all_set$EverySet$member, l.r, jumpable)) || A2($author$project$Location$requirementsMet, attainedRequirements, location))))));
		};
		return A2(
			$pzp1997$assoc_list$AssocList$filter,
			$elm$core$Basics$always(isRelevant),
			locations);
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm_community$list_extra$List$Extra$gatherWith = F2(
	function (testFn, list) {
		var helper = F2(
			function (scattered, gathered) {
				if (!scattered.b) {
					return $elm$core$List$reverse(gathered);
				} else {
					var toGather = scattered.a;
					var population = scattered.b;
					var _v1 = A2(
						$elm$core$List$partition,
						testFn(toGather),
						population);
					var gathering = _v1.a;
					var remaining = _v1.b;
					return A2(
						helper,
						remaining,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(toGather, gathering),
							gathered));
				}
			});
		return A2(helper, list, _List_Nil);
	});
var $elm_community$list_extra$List$Extra$gatherEqualsBy = F2(
	function (extract, list) {
		return A2(
			$elm_community$list_extra$List$Extra$gatherWith,
			F2(
				function (a, b) {
					return _Utils_eq(
						extract(a),
						extract(b));
				}),
			list);
	});
var $author$project$Location$getArea = function (_v0) {
	var location = _v0;
	return location.H;
};
var $author$project$Location$values = function (_v0) {
	var locations = _v0;
	return $pzp1997$assoc_list$AssocList$values(locations);
};
var $author$project$Location$groupByArea = A2(
	$elm$core$Basics$composeR,
	$author$project$Location$values,
	A2(
		$elm$core$Basics$composeR,
		$elm_community$list_extra$List$Extra$gatherEqualsBy($author$project$Location$getArea),
		$elm$core$List$map(
			function (_v0) {
				var loc = _v0.a;
				var locs = _v0.b;
				return _Utils_Tuple2(
					$author$project$Location$getArea(loc),
					A2($elm$core$List$cons, loc, locs));
			})));
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {A: index, bh: match, bn: number, by: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{a5: false, bj: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm_community$string_extra$String$Extra$regexFromString = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$fromString,
	$elm$core$Maybe$withDefault($elm$regex$Regex$never));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm_community$string_extra$String$Extra$changeCase = F2(
	function (mutator, word) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var head = _v0.a;
					var tail = _v0.b;
					return A2(
						$elm$core$String$cons,
						mutator(head),
						tail);
				},
				$elm$core$String$uncons(word)));
	});
var $elm$core$Char$toUpper = _Char_toUpper;
var $elm_community$string_extra$String$Extra$toSentenceCase = function (word) {
	return A2($elm_community$string_extra$String$Extra$changeCase, $elm$core$Char$toUpper, word);
};
var $elm_community$string_extra$String$Extra$toTitleCase = function (ws) {
	var uppercaseMatch = A2(
		$elm$regex$Regex$replace,
		$elm_community$string_extra$String$Extra$regexFromString('\\w+'),
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bh;
			},
			$elm_community$string_extra$String$Extra$toSentenceCase));
	return A3(
		$elm$regex$Regex$replace,
		$elm_community$string_extra$String$Extra$regexFromString('^([a-z])|\\s+([a-z])'),
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bh;
			},
			uppercaseMatch),
		ws);
};
var $author$project$Status$Seen = {$: 1};
var $author$project$App$ToggleLocationStatus = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm_community$maybe_extra$Maybe$Extra$filter = F2(
	function (f, m) {
		var _v0 = A2($elm$core$Maybe$map, f, m);
		if ((!_v0.$) && _v0.a) {
			return m;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Location$getName = function (_v0) {
	var location = _v0;
	return location.bk;
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$App$onRightClick = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'contextmenu',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$Status$toString = function (status) {
	switch (status.$) {
		case 0:
			return 'unseen';
		case 1:
			return 'seen';
		case 2:
			return 'seen-some';
		default:
			return 'dismissed';
	}
};
var $author$project$App$ToggleShopItem = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$App$UpdateShopText = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $elm$html$Html$Attributes$cols = function (n) {
	return A2(
		_VirtualDom_attribute,
		'cols',
		$elm$core$String$fromInt(n));
};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $author$project$App$onClickNoBubble = function (msg) {
	return A2(
		$elm$html$Html$Events$custom,
		'click',
		$elm$json$Json$Decode$succeed(
			{bi: msg, bt: true, bx: true}));
};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $author$project$App$viewMenu = function (menu) {
	var viewItem = function (_v1) {
		var itemIndex = _v1.a;
		var item = _v1.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('shop-item'),
					$elm$html$Html$Attributes$class(
					$author$project$Status$toString(item.aW)),
					$author$project$App$onClickNoBubble(
					A2($author$project$App$ToggleShopItem, menu, itemIndex))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('name')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(item.bk)
						]))
				]));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('shop-menu')
			]),
		function () {
			var _v0 = menu.S;
			if (!_v0.$) {
				var items = _v0.a;
				return A2($elm$core$List$map, viewItem, items);
			} else {
				var shopText = _v0.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$textarea,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id($author$project$App$shopMenuID),
								$elm$html$Html$Attributes$rows(3),
								$elm$html$Html$Attributes$cols(10),
								$elm$html$Html$Attributes$autocomplete(false),
								$elm$html$Html$Attributes$spellcheck(false),
								$elm$html$Html$Attributes$value(shopText),
								$elm$html$Html$Events$onInput(
								$author$project$App$UpdateShopText(menu)),
								$author$project$App$onClickNoBubble($author$project$App$DoNothing)
							]),
						_List_Nil)
					]);
			}
		}());
};
var $author$project$App$HardToggleProperty = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$App$ToggleProperty = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$App$ToggleShopMenu = function (a) {
	return {$: 9, a: a};
};
var $author$project$App$ToggleWarpGlitchUsed = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Icon$check = A2(
	$elm$html$Html$img,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('check'),
			$elm$html$Html$Attributes$src('img/check.png')
		]),
	_List_Nil);
var $author$project$Icon$armour = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Armor.gif'),
	O: 'Armour'
};
var $author$project$Icon$falcon = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Falcon-Left-still.png'),
	O: 'Launch the Falcon'
};
var $author$project$Icon$healing = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/RecoveryItem.gif'),
	O: 'Healing consumables'
};
var $author$project$Icon$jItem = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Hourglass.gif'),
	O: 'J-items'
};
var $author$project$Icon$objective = {
	Z: 'objective-icon',
	aa: $author$project$Icon$img('img/sprites/Crystal-still.png'),
	O: 'Objective'
};
var $author$project$Icon$other = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Summon.gif'),
	O: 'Other'
};
var $author$project$Icon$weapon = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/KnightSword.gif'),
	O: 'Weapon'
};
var $author$project$Icon$yangBonk = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Yang-Front.gif'),
	O: 'Bonk Yang'
};
var $author$project$Icon$yangTalk = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Yang-KO1.gif'),
	O: 'Talk to Yang'
};
var $author$project$Icon$fromValue = function (value) {
	_v0$14:
	while (true) {
		switch (value.$) {
			case 0:
				return $elm$core$Maybe$Just($author$project$Icon$character);
			case 1:
				return $elm$core$Maybe$Just($author$project$Icon$boss);
			case 2:
				return $elm$core$Maybe$Just($author$project$Icon$keyItem);
			case 3:
				return $elm$core$Maybe$Just($author$project$Icon$chest);
			case 4:
				return $elm$core$Maybe$Just($author$project$Icon$trappedChest);
			case 6:
				if (value.a.$ === 17) {
					switch (value.a.a) {
						case 3:
							var _v1 = value.a.a;
							return $elm$core$Maybe$Just($author$project$Icon$yangTalk);
						case 4:
							var _v2 = value.a.a;
							return $elm$core$Maybe$Just($author$project$Icon$yangBonk);
						case 5:
							var _v3 = value.a.a;
							return $elm$core$Maybe$Just($author$project$Icon$falcon);
						default:
							break _v0$14;
					}
				} else {
					break _v0$14;
				}
			case 7:
				return $elm$core$Maybe$Just($author$project$Icon$objective);
			case 5:
				switch (value.a.$) {
					case 0:
						var _v4 = value.a;
						return $elm$core$Maybe$Just($author$project$Icon$weapon);
					case 1:
						var _v5 = value.a;
						return $elm$core$Maybe$Just($author$project$Icon$armour);
					case 3:
						return $elm$core$Maybe$Just($author$project$Icon$healing);
					case 4:
						return $elm$core$Maybe$Just($author$project$Icon$jItem);
					case 5:
						return $elm$core$Maybe$Just($author$project$Icon$other);
					default:
						break _v0$14;
				}
			default:
				break _v0$14;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Icon$dkc = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Cecil1-Front.gif'),
	O: 'Dark Knight Cecil Darkwave damage'
};
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $author$project$Icon$kainazzo = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Cagnazzo.gif'),
	O: 'Kainazzo Wave damage at max HP'
};
var $elm$core$String$reverse = _String_reverse;
var $author$project$Icon$toImg = function (icon) {
	return icon.aa(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(icon.Z),
				$elm$html$Html$Attributes$title(icon.O)
			]));
};
var $author$project$Icon$valvalis = {
	Z: '',
	aa: $author$project$Icon$img('img/sprites/Barbariccia.gif'),
	O: 'Valvalis MDef'
};
var $author$project$App$viewBossStats = function (stats) {
	var waveDmg = function () {
		var min = $elm$core$Basics$ceiling(stats.aG / 25);
		var max = $elm$core$Basics$ceiling(min * 1.5);
		return $elm$core$String$fromInt(min) + ('-' + $elm$core$String$fromInt(max));
	}();
	var formatSpeed = _Utils_eq(stats.ag, stats.aI) ? $elm$core$String$fromInt(stats.ag) : ($elm$core$String$fromInt(stats.ag) + ('-' + $elm$core$String$fromInt(stats.aI)));
	var formatHP = $elm$core$String$reverse(
		A2(
			$elm$core$String$join,
			',',
			A2(
				$elm_community$string_extra$String$Extra$break,
				3,
				$elm$core$String$reverse(
					$elm$core$String$fromInt(stats.aG)))));
	var darkwaveDmg = function () {
		var min = $elm$core$Basics$ceiling((stats.ab * stats.ax) / 2);
		var max = min + stats.ab;
		return $elm$core$String$fromInt(min) + ('-' + $elm$core$String$fromInt(max));
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('boss-stats'),
				$author$project$App$onClickNoBubble($author$project$App$DoNothing)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Approximate stats:')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('HP: ' + formatHP)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Atk: ' + ($elm$core$String$fromInt(stats.ab) + ('x' + ($elm$core$String$fromInt(stats.ax) + (', ' + ($elm$core$String$fromInt(stats.bc) + '%'))))))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Mag: ' + $elm$core$String$fromInt(stats.bg))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Speed: ' + formatSpeed)
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('icon')
							]),
						_List_fromArray(
							[
								$author$project$Icon$toImg($author$project$Icon$kainazzo)
							])),
						$elm$html$Html$text('Dmg: ' + waveDmg)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('icon')
							]),
						_List_fromArray(
							[
								$author$project$Icon$toImg($author$project$Icon$dkc)
							])),
						$elm$html$Html$text('Dmg: ' + darkwaveDmg)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('icon')
							]),
						_List_fromArray(
							[
								$author$project$Icon$toImg($author$project$Icon$valvalis)
							])),
						$elm$html$Html$text(
						'MDef: ' + $elm$core$String$fromInt(stats.bC))
					]))
			]));
};
var $author$project$App$viewProperty = F3(
	function (context, location, _v0) {
		var index = _v0.A;
		var status = _v0.aW;
		var value = _v0.at;
		var key = $author$project$Location$getKey(location);
		var extraClass = function () {
			if ((value.$ === 2) && (value.a === 1)) {
				var _v9 = value.a;
				return 'warp';
			} else {
				return '';
			}
		}();
		var count = function () {
			var _v7 = _Utils_Tuple2(
				$author$project$Value$countable(value),
				status);
			if (!_v7.a.$) {
				if (_v7.b.$ === 2) {
					var total = _v7.a.a;
					var seen = _v7.b.a;
					return total - seen;
				} else {
					var total = _v7.a.a;
					return total;
				}
			} else {
				return 0;
			}
		}();
		var clickHandler = function () {
			var toggleShopMenu = function (content) {
				return $author$project$App$ToggleShopMenu(
					{S: content, A: index, r: key});
			};
			var shopItems = A2(
				$elm$core$Basics$composeL,
				$author$project$App$Items,
				A2($author$project$Location$filterItems, context, location));
			_v5$4:
			while (true) {
				switch (value.$) {
					case 2:
						if (value.a === 1) {
							var _v6 = value.a;
							return $elm$html$Html$Events$onClick(
								A2($author$project$App$ToggleWarpGlitchUsed, key, index));
						} else {
							break _v5$4;
						}
					case 5:
						switch (value.a.$) {
							case 3:
								var items = value.a.a;
								return $author$project$App$onClickNoBubble(
									toggleShopMenu(
										shopItems(items)));
							case 4:
								var items = value.a.a;
								return $author$project$App$onClickNoBubble(
									toggleShopMenu(
										shopItems(items)));
							case 5:
								var shopText = value.a.a;
								return $author$project$App$onClickNoBubble(
									toggleShopMenu(
										$author$project$App$Text(shopText)));
							default:
								break _v5$4;
						}
					default:
						break _v5$4;
				}
			}
			return $elm$html$Html$Events$onClick(
				A2($author$project$App$ToggleProperty, key, index));
		}();
		var _v1 = $author$project$Icon$fromValue(value);
		if (!_v1.$) {
			var icon = _v1.a;
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('icon'),
						$elm$html$Html$Attributes$class(icon.Z),
						$elm$html$Html$Attributes$class(extraClass),
						$elm$html$Html$Attributes$class(
						$author$project$Status$toString(status)),
						$elm$html$Html$Attributes$title(
						function () {
							if ((value.$ === 2) && (value.a === 1)) {
								var _v3 = value.a;
								return 'Sealed Cave key item check';
							} else {
								return icon.O;
							}
						}()),
						clickHandler,
						$author$project$App$onRightClick(
						A2($author$project$App$HardToggleProperty, key, index))
					]),
				_List_fromArray(
					[
						icon.aa(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('value')
							])),
						A2(
						$author$project$App$displayIf,
						_Utils_eq(status, $author$project$Status$Dismissed),
						$author$project$Icon$check),
						A2(
						$author$project$App$displayIf,
						count > 0,
						A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('count')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(count))
								]))),
						function () {
						if (value.$ === 1) {
							var stats = value.a;
							return $author$project$App$viewBossStats(stats);
						} else {
							return $elm$html$Html$text('');
						}
					}()
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$App$viewLocation = F3(
	function (shopMenu, context, location) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('name'),
						$elm$html$Html$Attributes$class(
						$author$project$Status$toString(
							$author$project$Location$getStatus(location))),
						$elm$html$Html$Events$onClick(
						A2($author$project$App$ToggleLocationStatus, location, $author$project$Status$Dismissed)),
						$author$project$App$onRightClick(
						A2($author$project$App$ToggleLocationStatus, location, $author$project$Status$Seen))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Location$getName(location))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('icons-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('icons')
							]),
						A2(
							$elm$core$List$map,
							A2($author$project$App$viewProperty, context, location),
							A2($author$project$Location$getProperties, context, location))),
						A2(
						$elm$core$Maybe$withDefault,
						$elm$html$Html$text(''),
						A2(
							$elm$core$Maybe$map,
							$author$project$App$viewMenu,
							A2(
								$elm_community$maybe_extra$Maybe$Extra$filter,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.r;
									},
									$elm$core$Basics$eq(
										$author$project$Location$getKey(location))),
								shopMenu)))
					]))
			]);
	});
var $author$project$App$viewLocations = F2(
	function (model, locClass) {
		var context = A2($author$project$App$getContextFor, locClass, model);
		var viewArea = function (_v0) {
			var area = _v0.a;
			var locations = _v0.b;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h4,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm_community$string_extra$String$Extra$toTitleCase(
									$author$project$Location$areaToString(area)))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('area-locations')
							]),
						A2(
							$elm$core$List$concatMap,
							A2($author$project$App$viewLocation, model.w, context),
							locations))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('locations')
				]),
			A2(
				$elm$core$List$map,
				viewArea,
				$author$project$Location$groupByArea(
					A3($author$project$Location$filterByContext, locClass, context, model.i))));
	});
var $elm$html$Html$datalist = _VirtualDom_node('datalist');
var $author$project$Objective$gatedQuests = A2(
	$elm$core$List$filter,
	function ($) {
		return $.L;
	},
	$author$project$Objective$quests);
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			j: _List_Nil,
			d: 0,
			g: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.d * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						j: A2($elm$core$List$cons, mappedLeaf, builder.j),
						d: builder.d + 1,
						g: builder.g
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$App$objectivesDatalistId = 'objective-options';
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Flags$rewardToString = function (reward) {
	if (!reward) {
		return 'crystal';
	} else {
		return 'win';
	}
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$App$SetRandomObjective = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$Attributes$list = _VirtualDom_attribute('list');
var $author$project$App$ToggleObjective = function (a) {
	return {$: 0, a: a};
};
var $author$project$App$UnsetRandomObjective = function (a) {
	return {$: 2, a: a};
};
var $author$project$Icon$trash = {
	Z: 'trash',
	aa: $author$project$Icon$img('img/sprites/TrashCan.gif'),
	O: 'Delete objective'
};
var $author$project$App$viewObjective = F3(
	function (objective, completed, randomIndex) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('objective', true),
							_Utils_Tuple2('completed', completed)
						])),
					$elm$html$Html$Events$onClick(
					$author$project$App$ToggleObjective(objective.r))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('icon')
						]),
					_List_fromArray(
						[
							$author$project$Icon$toImg($author$project$Icon$objective)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(objective.aA)
						])),
					function () {
					var _v0 = _Utils_Tuple3(completed, randomIndex, $author$project$Icon$trash);
					if ((!_v0.a) && (!_v0.b.$)) {
						var index = _v0.b.a;
						var icon = _v0.c;
						return icon.aa(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(icon.Z),
									$elm$html$Html$Attributes$title(icon.O),
									$author$project$App$onClickNoBubble(
									$author$project$App$UnsetRandomObjective(index))
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$App$viewEditableObjective = F3(
	function (index, randomObjective, completedObjectives) {
		if (!randomObjective.$) {
			var objective = randomObjective.a;
			return A3(
				$author$project$App$viewObjective,
				objective,
				A2($Gizra$elm_all_set$EverySet$member, objective.r, completedObjectives),
				$elm$core$Maybe$Just(index));
		} else {
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('objective unset')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$list($author$project$App$objectivesDatalistId),
								$elm$html$Html$Events$onInput(
								$author$project$App$SetRandomObjective(index))
							]),
						_List_Nil)
					]));
		}
	});
var $author$project$App$viewObjectives = function (model) {
	var viewArray = function (fn) {
		return A2(
			$elm$core$Basics$composeR,
			$elm$core$Array$indexedMap(fn),
			$elm$core$Array$toList);
	};
	var random = F2(
		function (i, o) {
			return A3($author$project$App$viewEditableObjective, i, o, model.h);
		});
	var numRequired = model.l.aq;
	var numCompleted = $Gizra$elm_all_set$EverySet$size(model.h);
	var listFor = F2(
		function (objectiveType, objectives) {
			return A2($Gizra$elm_all_set$EverySet$member, objectiveType, model.l.bu) ? A2(
				$elm$core$List$map,
				function (o) {
					return A2(
						$elm$html$Html$option,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(o.aA)
							]));
				},
				objectives) : _List_Nil;
		});
	var fixed = F2(
		function (_v0, o) {
			return A3(
				$author$project$App$viewObjective,
				o,
				A2($Gizra$elm_all_set$EverySet$member, o.r, model.h),
				$elm$core$Maybe$Nothing);
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('objectives')
			]),
		(model.l.aq > 0) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Objectives'),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('progress'),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'complete',
										_Utils_cmp(numCompleted, numRequired) > -1)
									]))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'(' + ($elm$core$String$fromInt(numCompleted) + ('/' + ($elm$core$String$fromInt(numRequired) + (' to ' + ($author$project$Flags$rewardToString(model.l.am) + ')'))))))
							]))
					])),
				A2(
				$elm$html$Html$datalist,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id($author$project$App$objectivesDatalistId)
					]),
				_Utils_ap(
					A2(listFor, 0, $author$project$Objective$characters),
					_Utils_ap(
						A2(listFor, 1, $author$project$Objective$bosses),
						_Utils_ap(
							A2(listFor, 2, $author$project$Objective$quests),
							A2(listFor, 3, $author$project$Objective$gatedQuests))))),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('objectives')
					]),
				_Utils_ap(
					A2(viewArray, fixed, model.l.aK),
					A2(viewArray, random, model.s)))
			]) : _List_Nil);
};
var $author$project$App$view = function (model) {
	return {
		a4: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('content')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('flagstring')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flagstring'),
										$elm$html$Html$Attributes$autocomplete(false),
										$elm$html$Html$Attributes$spellcheck(false),
										$elm$html$Html$Events$onInput($author$project$App$UpdateFlags)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(model._)
									]))
							])),
						$author$project$App$viewObjectives(model),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('key-items')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Key Items')
									])),
								A2($author$project$App$viewKeyItems, model.l, model.n)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('checks')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('locations-header')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Locations'),
										A2($author$project$App$viewFilters, model, 0)
									])),
								A2($author$project$App$viewLocations, model, 0)
							])),
						A2(
						$author$project$App$displayIf,
						!(A2(
							$elm$core$List$member,
							model.l.bw,
							_List_fromArray(
								[5, 6])) || model.l.bs),
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('shops')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('shops-header')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Shops'),
											A2($author$project$App$viewFilters, model, 1)
										])),
									A2($author$project$App$viewLocations, model, 1)
								])))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('footer')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('colour-pickers')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('colour-picker')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Background: '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('color'),
												$elm$html$Html$Attributes$value(model.I.a3),
												$elm$html$Html$Events$onInput(
												$author$project$App$SetColour(0))
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('colour-picker')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Text: '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('color'),
												$elm$html$Html$Attributes$value(model.I.bA),
												$elm$html$Html$Events$onInput(
												$author$project$App$SetColour(1))
											]),
										_List_Nil)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Please see the '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://github.com/EiriasValar/FF4FE-Tracker/tree/release#readme'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('GitHub repo')
									])),
								$elm$html$Html$text(' for documentation, credits, and contact info')
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://github.com/EiriasValar/FF4FE-Tracker/blob/release/CHANGELOG.md'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Changelog')
									]))
							]))
					]))
			]),
		O: 'FFIV Free Enterprise Tracker'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{be: $author$project$App$init, bz: $author$project$App$subscriptions, bB: $author$project$App$update, bD: $author$project$App$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$value)
			])))(0)}});}(this));