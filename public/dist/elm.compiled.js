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
	if (region.de.aM === region.dy.aM)
	{
		return 'on line ' + region.de.aM;
	}
	return 'on lines ' + region.de.aM + ' through ' + region.dy.aM;
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
		impl.eO,
		impl.fn,
		impl.fg,
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
		T: func(record.T),
		dg: record.dg,
		c8: record.c8
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
		var message = !tag ? value : tag < 3 ? value.a : value.T;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.dg;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.c8) && event.preventDefault(),
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
		impl.eO,
		impl.fn,
		impl.fg,
		function(sendToApp, initialModel) {
			var view = impl.fp;
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
		impl.eO,
		impl.fn,
		impl.fg,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.dd && impl.dd(sendToApp)
			var view = impl.fp;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.eu);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.fj) && (_VirtualDom_doc.title = title = doc.fj);
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
	var onUrlChange = impl.e2;
	var onUrlRequest = impl.e3;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		dd: function(sendToApp)
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
							&& curr.d_ === next.d_
							&& curr.dE === next.dE
							&& curr.dW.a === next.dW.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		eO: function(flags)
		{
			return A3(impl.eO, flags, _Browser_getUrl(), key);
		},
		fp: impl.fp,
		fn: impl.fn,
		fg: impl.fg
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
		? { eK: 'hidden', ex: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { eK: 'mozHidden', ex: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { eK: 'msHidden', ex: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { eK: 'webkitHidden', ex: 'webkitvisibilitychange' }
		: { eK: 'hidden', ex: 'visibilitychange' };
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
		d6: _Browser_getScene(),
		el: {
			eo: _Browser_window.pageXOffset,
			ep: _Browser_window.pageYOffset,
			en: _Browser_doc.documentElement.clientWidth,
			dD: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		en: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dD: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			d6: {
				en: node.scrollWidth,
				dD: node.scrollHeight
			},
			el: {
				eo: node.scrollLeft,
				ep: node.scrollTop,
				en: node.clientWidth,
				dD: node.clientHeight
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
			d6: _Browser_getScene(),
			el: {
				eo: x,
				ep: y,
				en: _Browser_doc.documentElement.clientWidth,
				dD: _Browser_doc.documentElement.clientHeight
			},
			eC: {
				eo: x + rect.left,
				ep: y + rect.top,
				en: rect.width,
				dD: rect.height
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


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
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
	if (options.eT) { flags += 'm'; }
	if (options.ew) { flags += 'i'; }

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
var $author$project$Main$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 1, a: a};
};
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
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
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
					{j: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, i: tail});
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
		return {dA: fragment, dE: host, dU: path, dW: port_, d_: protocol, da: query};
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
var $elm$browser$Browser$application = _Browser_application;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$Model = F2(
	function (shared, page) {
		return {N: page, H: shared};
	});
var $author$project$Main$Pages = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$Shared = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Spa$Generated$Route$NotFound = 1;
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {aa: frag, e6: params, W: unvisited, d: value, af: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.W;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.d);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.d);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
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
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
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
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
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
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.dU),
					$elm$url$Url$Parser$prepareQuery(url.da),
					url.dA,
					$elm$core$Basics$identity)));
	});
var $author$project$Spa$Generated$Route$Top = 0;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.af;
		var unvisited = _v0.W;
		var params = _v0.e6;
		var frag = _v0.aa;
		var value = _v0.d;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.af;
			var unvisited = _v1.W;
			var params = _v1.e6;
			var frag = _v1.aa;
			var value = _v1.d;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
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
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.af;
		var unvisited = _v0.W;
		var params = _v0.e6;
		var frag = _v0.aa;
		var value = _v0.d;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Spa$Generated$Route$routes = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, 0, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			1,
			$elm$url$Url$Parser$s('not-found'))
		]));
var $author$project$Spa$Generated$Route$fromUrl = $elm$url$Url$Parser$parse($author$project$Spa$Generated$Route$routes);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$fromUrl = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Route$fromUrl,
	$elm$core$Maybe$withDefault(1));
var $author$project$Shared$Model = F2(
	function (url, key) {
		return {b: key, fo: url};
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Shared$init = F3(
	function (flags, url, key) {
		return _Utils_Tuple2(
			A2($author$project$Shared$Model, url, key),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Spa$Generated$Pages$NotFound__Model = function (a) {
	return {$: 1, a: a};
};
var $author$project$Spa$Generated$Pages$NotFound__Msg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Spa$Generated$Pages$Top__Model = function (a) {
	return {$: 0, a: a};
};
var $author$project$Spa$Generated$Pages$Top__Msg = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Spa$Page$ignoreEffect = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Spa$Page$static = function (page) {
	return {
		eO: F2(
			function (_v0, url) {
				return _Utils_Tuple2(url, $elm$core$Platform$Cmd$none);
			}),
		bN: $elm$core$Basics$always(
			A2($elm$core$Basics$composeR, $elm$core$Basics$identity, $author$project$Spa$Page$ignoreEffect)),
		cr: $elm$core$Basics$always($elm$core$Basics$identity),
		fg: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		fn: F2(
			function (_v2, model) {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}),
		fp: page.fp
	};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Pages$NotFound$view = function (_v0) {
	var params = _v0.e6;
	return {
		eu: _List_fromArray(
			[
				$elm$html$Html$text('Not found')
			]),
		fj: '404'
	};
};
var $author$project$Pages$NotFound$page = $author$project$Spa$Page$static(
	{fp: $author$project$Pages$NotFound$view});
var $author$project$Spa$Page$element = function (page) {
	return {
		eO: F2(
			function (_v0, params) {
				return page.eO(params);
			}),
		bN: $elm$core$Basics$always(
			A2($elm$core$Basics$composeR, $elm$core$Basics$identity, $author$project$Spa$Page$ignoreEffect)),
		cr: $elm$core$Basics$always($elm$core$Basics$identity),
		fg: page.fg,
		fn: F2(
			function (msg, model) {
				return A2(page.fn, msg, model);
			}),
		fp: page.fp
	};
};
var $author$project$Location$Characters = 0;
var $author$project$Location$Chests = 3;
var $author$project$Location$Hide = 1;
var $author$project$Location$KeyItems = 2;
var $author$project$Location$Show = 0;
var $author$project$Location$Healing = function (a) {
	return {$: 4, a: a};
};
var $author$project$Location$JItem = function (a) {
	return {$: 5, a: a};
};
var $author$project$Location$Location = $elm$core$Basics$identity;
var $author$project$Location$Locations = $elm$core$Basics$identity;
var $author$project$Location$Moon = 2;
var $author$project$Location$Other = function (a) {
	return {$: 6, a: a};
};
var $author$project$Location$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Location$Shop = function (a) {
	return {$: 5, a: a};
};
var $author$project$Location$Surface = 0;
var $author$project$Location$Underground = 1;
var $author$project$Location$Unseen = {$: 0};
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
					{j: nodeList, h: nodeListSize, i: jsArray});
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
var $author$project$Location$healingItems = $elm$core$Array$fromList(
	A2(
		$elm$core$List$map,
		function (_v0) {
			var name = _v0.a;
			var tier = _v0.n;
			return {a: name, O: $author$project$Location$Unseen, n: tier};
		},
		_List_fromArray(
			[
				{a: 'Cure2', n: 3},
				{a: 'Cure3', n: 4},
				{a: 'Life', n: 2},
				{a: 'Ether1/2', n: 3}
			])));
var $author$project$Location$jItems = $elm$core$Array$fromList(
	A2(
		$elm$core$List$map,
		function (_v0) {
			var name = _v0.a;
			var tier = _v0.n;
			return {a: name, O: $author$project$Location$Unseen, n: tier};
		},
		_List_fromArray(
			[
				{a: 'Siren', n: 5},
				{a: 'Hourglass', n: 5},
				{a: 'Starveil', n: 2},
				{a: 'Moonveil', n: 6},
				{a: 'Bacchus', n: 5},
				{a: 'Coffin', n: 5}
			])));
var $author$project$Location$Boss = {$: 1};
var $author$project$Location$CaveBahamut = 60;
var $author$project$Location$Character = function (a) {
	return {$: 0, a: a};
};
var $author$project$Location$Chest = function (a) {
	return {$: 3, a: a};
};
var $author$project$Location$Gated = 1;
var $author$project$Location$Hummingway = 59;
var $author$project$Location$Item = {$: 3};
var $author$project$Location$KeyItem = function (a) {
	return {$: 2, a: a};
};
var $author$project$Location$LunarPath = 61;
var $author$project$Location$LunarSubterrane = 62;
var $author$project$Location$MasamuneAltar = 67;
var $author$project$Flags$MoonBoss = 3;
var $author$project$Location$MurasameAltar = 63;
var $author$project$Location$RibbonRoom = 66;
var $author$project$Flags$Summon = 2;
var $author$project$Location$TrappedChest = function (a) {
	return {$: 4, a: a};
};
var $author$project$Location$WhiteSpearAltar = 65;
var $author$project$Location$WyvernAltar = 64;
var $author$project$Location$moon = _List_fromArray(
	[
		{
		b: 59,
		a: 'Hummingway',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 60,
		a: 'Cave Bahamut',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(2),
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 61,
		a: 'Lunar Path',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(2),
				$author$project$Location$TrappedChest(1)
			])
	},
		{
		b: 62,
		a: 'Lunar Palace',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Character(1),
				$author$project$Location$Chest(21),
				$author$project$Location$TrappedChest(9)
			])
	},
		{
		b: 63,
		a: 'Murasame Altar',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(3)
			])
	},
		{
		b: 64,
		a: 'Wyvern Altar',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(3)
			])
	},
		{
		b: 65,
		a: 'White Spear Altar',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(3)
			])
	},
		{
		b: 66,
		a: 'Ribbon Room',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(3)
			])
	},
		{
		b: 67,
		a: 'Masamune Altar',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(3)
			])
	}
	]);
var $author$project$Location$AdamantGrotto = 38;
var $author$project$Location$Agart = 34;
var $author$project$Location$AgartShops = 35;
var $author$project$Location$AntlionCave = 11;
var $author$project$Location$Armour = {$: 1};
var $author$project$Location$Baron = 20;
var $author$project$Location$BaronBasement = 25;
var $author$project$Location$BaronCastle = 24;
var $author$project$Location$BaronItemShop = 21;
var $author$project$Location$BaronKey = {$: 2};
var $author$project$Location$BaronSewer = 23;
var $author$project$Location$BaronWeaponShop = 22;
var $author$project$Location$CastleEblan = 39;
var $author$project$Location$CaveEblan = 40;
var $author$project$Location$CaveEblanShops = 41;
var $author$project$Location$CaveMagnes = 31;
var $author$project$Location$CaveMagnesChests = 30;
var $author$project$Location$Damcyan = 10;
var $author$project$Location$DarknessCrystal = {$: 6};
var $author$project$Location$EarthCrystal = {$: 7};
var $author$project$Location$FabulDefence = 14;
var $author$project$Location$FabulShops = 13;
var $author$project$Location$Falcon = 5;
var $author$project$Flags$Free = 5;
var $author$project$Location$Giant = 43;
var $author$project$Location$Hook = {$: 9};
var $author$project$Location$Kaipo = 5;
var $author$project$Location$KaipoBed = 7;
var $author$project$Location$KaipoShops = 6;
var $author$project$Flags$Main = 0;
var $author$project$Location$MistCave = 0;
var $author$project$Location$MistDragon = 1;
var $author$project$Location$MistVillage = 1;
var $author$project$Location$MistVillageMom = 4;
var $author$project$Location$MistVillagePackage = 3;
var $author$project$Location$MistVillageShops = 2;
var $author$project$Location$MtHobs = 12;
var $author$project$Location$MtOrdeals = 19;
var $author$project$Location$Mysidia = 17;
var $author$project$Location$MysidiaShops = 18;
var $author$project$Location$Package = {$: 0};
var $author$project$Location$Pseudo = function (a) {
	return {$: 17, a: a};
};
var $author$project$Location$RatTail = {$: 12};
var $author$project$Location$Requirement = function (a) {
	return {$: 6, a: a};
};
var $author$project$Location$SandRuby = {$: 1};
var $author$project$Location$Sheila1 = 15;
var $author$project$Location$Sheila2 = 16;
var $author$project$Location$Silvera = 36;
var $author$project$Location$SilveraShops = 37;
var $author$project$Location$Toroia = 26;
var $author$project$Location$ToroiaCastle = 28;
var $author$project$Location$ToroiaShops = 27;
var $author$project$Location$ToroiaTreasury = 29;
var $author$project$Location$TwinHarp = {$: 10};
var $author$project$Location$Ungated = 0;
var $author$project$Location$UpperBabil = 42;
var $author$project$Flags$Vanilla = 6;
var $author$project$Location$Waterfall = 9;
var $author$project$Location$WateryPass = 8;
var $author$project$Location$Weapon = {$: 0};
var $author$project$Location$YangBonk = 4;
var $author$project$Location$YangTalk = 3;
var $author$project$Location$Zot1 = 32;
var $author$project$Location$Zot2 = 33;
var $author$project$Location$surface = _List_fromArray(
	[
		{
		b: 0,
		a: 'Mist Cave',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 1,
		a: 'Mist Village',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(7)
			])
	},
		{
		b: 2,
		a: 'Mist Village',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour)
			])
	},
		{
		b: 3,
		a: 'Mist - Package',
		c: _List_fromArray(
			[$author$project$Location$Package]),
		d: _List_fromArray(
			[
				$author$project$Location$Character(1),
				$author$project$Location$Boss
			])
	},
		{
		b: 4,
		a: 'Mist Village - Mom',
		c: _List_fromArray(
			[
				$author$project$Location$Pseudo(1)
			]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 5,
		a: 'Kaipo',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(1)
			])
	},
		{
		b: 6,
		a: 'Kaipo',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 7,
		a: 'Kaipo',
		c: _List_fromArray(
			[$author$project$Location$SandRuby]),
		d: _List_fromArray(
			[
				$author$project$Location$Character(1)
			])
	},
		{
		b: 8,
		a: 'Watery Pass',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Character(0),
				$author$project$Location$Chest(19)
			])
	},
		{
		b: 9,
		a: 'Waterfall',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 10,
		a: 'Damcyan',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Character(0),
				$author$project$Location$Chest(13)
			])
	},
		{
		b: 11,
		a: 'Antlion Cave',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(13)
			])
	},
		{
		b: 12,
		a: 'Mt. Hobs',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Character(1),
				$author$project$Location$Chest(5)
			])
	},
		{
		b: 13,
		a: 'Fabul',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 14,
		a: 'Fabul Defence',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$Chest(10)
			])
	},
		{
		b: 15,
		a: 'Sheila 1',
		c: _List_fromArray(
			[
				$author$project$Location$Pseudo(3)
			]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 16,
		a: 'Sheila 2',
		c: _List_fromArray(
			[
				$author$project$Location$Pseudo(4)
			]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 17,
		a: 'Mysidia',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Character(0),
				$author$project$Location$Character(0)
			])
	},
		{
		b: 18,
		a: 'Mysidia',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 19,
		a: 'Mt. Ordeals',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Character(0),
				$author$project$Location$Boss,
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Boss,
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 20,
		a: 'Baron Inn',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Boss,
				$author$project$Location$Character(1),
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(13)
			])
	},
		{
		b: 21,
		a: 'Baron',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 22,
		a: 'Baron',
		c: _List_fromArray(
			[$author$project$Location$BaronKey]),
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour)
			])
	},
		{
		b: 23,
		a: 'Baron Sewer',
		c: _List_fromArray(
			[$author$project$Location$BaronKey]),
		d: _List_fromArray(
			[
				$author$project$Location$Chest(9)
			])
	},
		{
		b: 24,
		a: 'Baron Castle',
		c: _List_fromArray(
			[$author$project$Location$BaronKey]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Boss,
				$author$project$Location$Character(1),
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(20)
			])
	},
		{
		b: 25,
		a: 'Baron Basement',
		c: _List_fromArray(
			[$author$project$Location$BaronKey]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(2)
			])
	},
		{
		b: 26,
		a: 'Toroia',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 27,
		a: 'Toroia',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 28,
		a: 'Toroia Castle',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(5),
				$author$project$Location$Chest(9)
			])
	},
		{
		b: 29,
		a: 'Toroia Treasury',
		c: _List_fromArray(
			[$author$project$Location$EarthCrystal]),
		d: _List_fromArray(
			[
				$author$project$Location$Chest(18)
			])
	},
		{
		b: 30,
		a: 'Cave Magnes',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(10)
			])
	},
		{
		b: 31,
		a: 'Cave Magnes',
		c: _List_fromArray(
			[$author$project$Location$TwinHarp]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(10)
			])
	},
		{
		b: 32,
		a: 'Tower of Zot 1',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Chest(5),
				$author$project$Location$TrappedChest(1)
			])
	},
		{
		b: 33,
		a: 'Tower of Zot 2',
		c: _List_fromArray(
			[$author$project$Location$EarthCrystal]),
		d: _List_fromArray(
			[
				$author$project$Location$Character(1),
				$author$project$Location$Character(1),
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 34,
		a: 'Agart',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(1)
			])
	},
		{
		b: 35,
		a: 'Agart',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 36,
		a: 'Silvera',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(3)
			])
	},
		{
		b: 37,
		a: 'Silvera',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 38,
		a: 'Adamant Grotto',
		c: _List_fromArray(
			[$author$project$Location$Hook, $author$project$Location$RatTail]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 39,
		a: 'Castle Eblan',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(19),
				$author$project$Location$TrappedChest(3)
			])
	},
		{
		b: 40,
		a: 'Cave Eblan',
		c: _List_fromArray(
			[$author$project$Location$Hook]),
		d: _List_fromArray(
			[
				$author$project$Location$Character(1),
				$author$project$Location$Chest(21),
				$author$project$Location$TrappedChest(1)
			])
	},
		{
		b: 41,
		a: 'Eblan',
		c: _List_fromArray(
			[$author$project$Location$Hook]),
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 42,
		a: 'Upper Bab-il',
		c: _List_fromArray(
			[$author$project$Location$Hook]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Boss,
				$author$project$Location$Chest(7),
				$author$project$Location$TrappedChest(1),
				$author$project$Location$Requirement(
				$author$project$Location$Pseudo(5))
			])
	},
		{
		b: 43,
		a: 'Giant of Bab-il',
		c: _List_fromArray(
			[$author$project$Location$DarknessCrystal]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Boss,
				$author$project$Location$Character(1),
				$author$project$Location$Chest(7),
				$author$project$Location$TrappedChest(1)
			])
	}
	]);
var $author$project$Location$Adamant = {$: 13};
var $author$project$Location$DwarfCastle = 44;
var $author$project$Location$DwarfCastleShops = 45;
var $author$project$Location$Feymarch = 50;
var $author$project$Location$FeymarchKing = 52;
var $author$project$Location$FeymarchQueen = 53;
var $author$project$Location$FeymarchShops = 51;
var $author$project$Location$Kokkol = 57;
var $author$project$Location$KokkolShop = 58;
var $author$project$Location$LegendSword = {$: 14};
var $author$project$Location$LowerBabil = 46;
var $author$project$Location$LowerBabilCannon = 47;
var $author$project$Location$LucaKey = {$: 3};
var $author$project$Location$Pan = {$: 11};
var $author$project$Location$SealedCave = 56;
var $author$project$Location$SylphCave1 = 48;
var $author$project$Location$SylphCave2 = 49;
var $author$project$Location$Tomra = 54;
var $author$project$Location$TomraShops = 55;
var $author$project$Location$TowerKey = {$: 5};
var $author$project$Flags$Warp = 1;
var $author$project$Location$underground = _List_fromArray(
	[
		{
		b: 44,
		a: 'Dwarf Castle',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$Character(1),
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$KeyItem(1),
				$author$project$Location$Chest(18)
			])
	},
		{
		b: 45,
		a: 'Dwarf Castle',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 46,
		a: 'Lower Bab-il',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(12),
				$author$project$Location$TrappedChest(4)
			])
	},
		{
		b: 47,
		a: 'Super Cannon',
		c: _List_fromArray(
			[$author$project$Location$TowerKey]),
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6)
			])
	},
		{
		b: 48,
		a: 'Sylph Cave',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Requirement(
				$author$project$Location$Pseudo(3)),
				$author$project$Location$Chest(25),
				$author$project$Location$TrappedChest(7)
			])
	},
		{
		b: 49,
		a: 'Sylph Cave',
		c: _List_fromArray(
			[$author$project$Location$Pan]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(2),
				$author$project$Location$Requirement(
				$author$project$Location$Pseudo(3)),
				$author$project$Location$Requirement(
				$author$project$Location$Pseudo(4)),
				$author$project$Location$Chest(25),
				$author$project$Location$TrappedChest(7)
			])
	},
		{
		b: 50,
		a: 'Feymarch',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Chest(20),
				$author$project$Location$TrappedChest(1)
			])
	},
		{
		b: 51,
		a: 'Feymarch',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 52,
		a: 'Feymarch King',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(2)
			])
	},
		{
		b: 53,
		a: 'Feymarch Queen',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Boss,
				$author$project$Location$KeyItem(2)
			])
	},
		{
		b: 54,
		a: 'Tomra',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(6)
			])
	},
		{
		b: 55,
		a: 'Tomra',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
			])
	},
		{
		b: 56,
		a: 'Sealed Cave',
		c: _List_fromArray(
			[$author$project$Location$LucaKey]),
		d: _List_fromArray(
			[
				$author$project$Location$KeyItem(0),
				$author$project$Location$KeyItem(6),
				$author$project$Location$Boss,
				$author$project$Location$Chest(19)
			])
	},
		{
		b: 57,
		a: 'Kokkol',
		c: _List_Nil,
		d: _List_fromArray(
			[
				$author$project$Location$Chest(4)
			])
	},
		{
		b: 58,
		a: 'Kokkol',
		c: _List_fromArray(
			[$author$project$Location$LegendSword, $author$project$Location$Adamant]),
		d: _List_fromArray(
			[
				$author$project$Location$Shop($author$project$Location$Weapon),
				$author$project$Location$Shop($author$project$Location$Armour),
				$author$project$Location$Shop($author$project$Location$Item)
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
		if ((value.$ === 5) && (value.a.$ === 3)) {
			var _v1 = value.a;
			return _List_fromArray(
				[
					$author$project$Location$Shop(
					$author$project$Location$Healing($author$project$Location$healingItems)),
					$author$project$Location$Shop(
					$author$project$Location$JItem($author$project$Location$jItems))
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
					$author$project$Location$Shop(
					$author$project$Location$Other(''))
				])) : vals;
	};
	var finish = F2(
		function (area, l) {
			return {
				bc: area,
				cW: A2($elm$core$List$any, isShop, l.d),
				b: l.b,
				a: l.a,
				as: $elm$core$Array$fromList(
					A2(
						$elm$core$List$map,
						$author$project$Location$Property($author$project$Location$Unseen),
						addOther(
							A2($elm$core$List$concatMap, expandShop, l.d)))),
				c: $Gizra$elm_all_set$EverySet$fromList(l.c),
				O: $author$project$Location$Unseen
			};
		});
	return $pzp1997$assoc_list$AssocList$fromList(
		$elm$core$List$reverse(
			A2(
				$elm$core$List$map,
				function (l) {
					return _Utils_Tuple2(l.b, l);
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
var $author$project$Objective$Boss = 1;
var $author$project$Objective$Character = 0;
var $author$project$Objective$DefeatBoss = function (a) {
	return {$: 5, a: a};
};
var $author$project$Objective$Elements = 28;
var $author$project$Objective$Fiends = {$: 2};
var $author$project$Objective$Kainazzo = 13;
var $author$project$Objective$Milon = 7;
var $author$project$Objective$MilonZ = 8;
var $author$project$Objective$Quest = 2;
var $author$project$Objective$Rubicant = 22;
var $author$project$Objective$Valvalis = 16;
var $author$project$Flags$Win = 1;
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.i)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.i, tail);
		return (notAppended < 0) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			h: builder.h + 1,
			i: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			j: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.j),
			h: builder.h + 1,
			i: $elm$core$Elm$JsArray$empty
		} : {j: builder.j, h: builder.h, i: appended});
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
		h: (len / $elm$core$Array$branchFactor) | 0,
		i: tail
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
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
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
var $author$project$Flags$parseG = F2(
	function (_switch, flags) {
		if (_switch === 'warp') {
			return _Utils_update(
				flags,
				{
					f: A2($Gizra$elm_all_set$EverySet$insert, 1, flags.f),
					dl: true
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
						f: A2($Gizra$elm_all_set$EverySet$insert, 6, flags.f)
					});
			case 'main':
				return _Utils_update(
					flags,
					{
						f: A2($Gizra$elm_all_set$EverySet$insert, 0, flags.f)
					});
			case 'summon':
				return _Utils_update(
					flags,
					{
						f: A2($Gizra$elm_all_set$EverySet$insert, 2, flags.f)
					});
			case 'moon':
				return _Utils_update(
					flags,
					{
						f: A2($Gizra$elm_all_set$EverySet$insert, 3, flags.f)
					});
			case 'trap':
				return _Utils_update(
					flags,
					{
						f: A2($Gizra$elm_all_set$EverySet$insert, 4, flags.f)
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
					{c$: true});
			case 'key':
				return _Utils_update(
					flags,
					{
						f: A2($Gizra$elm_all_set$EverySet$remove, 5, flags.f)
					});
			default:
				return flags;
		}
	});
var $author$project$Objective$ClassicGiant = {$: 1};
var $author$project$Flags$Crystal = 0;
var $author$project$Objective$ClassicForge = {$: 0};
var $author$project$Objective$DarkMatterHunt = {$: 3};
var $author$project$Objective$DoQuest = function (a) {
	return {$: 6, a: a};
};
var $author$project$Objective$GetCharacter = function (a) {
	return {$: 4, a: a};
};
var $author$project$Objective$Antlion = 3;
var $author$project$Objective$Asura = 24;
var $author$project$Objective$Bahamut = 27;
var $author$project$Objective$Baigan = 12;
var $author$project$Objective$CPU = 29;
var $author$project$Objective$Calbrena = 17;
var $author$project$Objective$DLunars = 33;
var $author$project$Objective$DMist = 0;
var $author$project$Objective$DarkElf = 14;
var $author$project$Objective$DarkImps = 20;
var $author$project$Objective$DarkKnight = 9;
var $author$project$Objective$DrLugae = 19;
var $author$project$Objective$EvilWall = 23;
var $author$project$Objective$Gauntlet = 6;
var $author$project$Objective$Golbez = 18;
var $author$project$Objective$Guards = 10;
var $author$project$Objective$KQEblan = 21;
var $author$project$Objective$Karate = 11;
var $author$project$Objective$Leviatan = 25;
var $author$project$Objective$MagusSisters = 15;
var $author$project$Objective$MomBomb = 5;
var $author$project$Objective$Octomamm = 2;
var $author$project$Objective$Odin = 26;
var $author$project$Objective$Officer = 1;
var $author$project$Objective$Ogopogo = 34;
var $author$project$Objective$PaleDim = 30;
var $author$project$Objective$Plague = 32;
var $author$project$Objective$Waterhag = 4;
var $author$project$Objective$Wyvern = 31;
var $author$project$Objective$bossFromString = function (boss) {
	switch (boss) {
		case 'dmist':
			return $elm$core$Maybe$Just(0);
		case 'officer':
			return $elm$core$Maybe$Just(1);
		case 'octomamm':
			return $elm$core$Maybe$Just(2);
		case 'antlion':
			return $elm$core$Maybe$Just(3);
		case 'waterhag':
			return $elm$core$Maybe$Just(4);
		case 'mombomb':
			return $elm$core$Maybe$Just(5);
		case 'fabulgauntlet':
			return $elm$core$Maybe$Just(6);
		case 'milon':
			return $elm$core$Maybe$Just(7);
		case 'milonz':
			return $elm$core$Maybe$Just(8);
		case 'mirrorcecil':
			return $elm$core$Maybe$Just(9);
		case 'guard':
			return $elm$core$Maybe$Just(10);
		case 'karate':
			return $elm$core$Maybe$Just(11);
		case 'baigan':
			return $elm$core$Maybe$Just(12);
		case 'kainazzo':
			return $elm$core$Maybe$Just(13);
		case 'darkelf':
			return $elm$core$Maybe$Just(14);
		case 'magus':
			return $elm$core$Maybe$Just(15);
		case 'valvalis':
			return $elm$core$Maybe$Just(16);
		case 'calbrena':
			return $elm$core$Maybe$Just(17);
		case 'golbez':
			return $elm$core$Maybe$Just(18);
		case 'lugae':
			return $elm$core$Maybe$Just(19);
		case 'darkimp':
			return $elm$core$Maybe$Just(20);
		case 'kingqueen':
			return $elm$core$Maybe$Just(21);
		case 'rubicant':
			return $elm$core$Maybe$Just(22);
		case 'evilwall':
			return $elm$core$Maybe$Just(23);
		case 'asura':
			return $elm$core$Maybe$Just(24);
		case 'leviatan':
			return $elm$core$Maybe$Just(25);
		case 'odin':
			return $elm$core$Maybe$Just(26);
		case 'bahamut':
			return $elm$core$Maybe$Just(27);
		case 'elements':
			return $elm$core$Maybe$Just(28);
		case 'cpu':
			return $elm$core$Maybe$Just(29);
		case 'paledim':
			return $elm$core$Maybe$Just(30);
		case 'wyvern':
			return $elm$core$Maybe$Just(31);
		case 'plague':
			return $elm$core$Maybe$Just(32);
		case 'dlunar':
			return $elm$core$Maybe$Just(33);
		case 'ogopogo':
			return $elm$core$Maybe$Just(34);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Objective$Cecil = 0;
var $author$project$Objective$Cid = 9;
var $author$project$Objective$Edge = 10;
var $author$project$Objective$Edward = 4;
var $author$project$Objective$FuSoYa = 11;
var $author$project$Objective$Kain = 1;
var $author$project$Objective$Palom = 7;
var $author$project$Objective$Porom = 8;
var $author$project$Objective$Rosa = 5;
var $author$project$Objective$Rydia = 2;
var $author$project$Objective$Tellah = 3;
var $author$project$Objective$Yang = 6;
var $author$project$Objective$charFromString = function (_char) {
	switch (_char) {
		case 'cecil':
			return $elm$core$Maybe$Just(0);
		case 'kain':
			return $elm$core$Maybe$Just(1);
		case 'rydia':
			return $elm$core$Maybe$Just(2);
		case 'tellah':
			return $elm$core$Maybe$Just(3);
		case 'edward':
			return $elm$core$Maybe$Just(4);
		case 'rosa':
			return $elm$core$Maybe$Just(5);
		case 'yang':
			return $elm$core$Maybe$Just(6);
		case 'palom':
			return $elm$core$Maybe$Just(7);
		case 'porom':
			return $elm$core$Maybe$Just(8);
		case 'cid':
			return $elm$core$Maybe$Just(9);
		case 'edge':
			return $elm$core$Maybe$Just(10);
		case 'fusoya':
			return $elm$core$Maybe$Just(11);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
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
var $author$project$Objective$AntlionCave = 2;
var $author$project$Objective$BaronBasement = 16;
var $author$project$Objective$BaronCastle = 7;
var $author$project$Objective$BaronInn = 6;
var $author$project$Objective$BigWhale = 32;
var $author$project$Objective$CaveBahamut = 18;
var $author$project$Objective$CaveMagnes = 8;
var $author$project$Objective$DwarfCastle = 10;
var $author$project$Objective$Fabul = 4;
var $author$project$Objective$Falcon = 12;
var $author$project$Objective$FeymarchKing = 15;
var $author$project$Objective$FeymarchQueen = 14;
var $author$project$Objective$Forge = 34;
var $author$project$Objective$Giant = 17;
var $author$project$Objective$LowerBabil = 11;
var $author$project$Objective$MagmaKey = 29;
var $author$project$Objective$MasamuneAltar = 23;
var $author$project$Objective$MistCave = 0;
var $author$project$Objective$MtHobs = 3;
var $author$project$Objective$MtOrdeals = 5;
var $author$project$Objective$MurasameAltar = 19;
var $author$project$Objective$Package = 24;
var $author$project$Objective$PanReturn = 36;
var $author$project$Objective$PanWake = 35;
var $author$project$Objective$Pass = 38;
var $author$project$Objective$PinkTail = 37;
var $author$project$Objective$RatTail = 33;
var $author$project$Objective$RibbonRoom = 22;
var $author$project$Objective$SandRuby = 25;
var $author$project$Objective$SealedCave = 13;
var $author$project$Objective$SuperCannon = 30;
var $author$project$Objective$TowerZot = 9;
var $author$project$Objective$Treasury = 28;
var $author$project$Objective$TwinHarp = 27;
var $author$project$Objective$UnlockSealedCave = 31;
var $author$project$Objective$UnlockSewer = 26;
var $author$project$Objective$Waterfall = 1;
var $author$project$Objective$WhiteSpearAltar = 21;
var $author$project$Objective$WyvernAltar = 20;
var $author$project$Objective$questFromString = function (quest) {
	switch (quest) {
		case 'mistcave':
			return $elm$core$Maybe$Just(0);
		case 'waterfall':
			return $elm$core$Maybe$Just(1);
		case 'antlionnest':
			return $elm$core$Maybe$Just(2);
		case 'hobs':
			return $elm$core$Maybe$Just(3);
		case 'fabul':
			return $elm$core$Maybe$Just(4);
		case 'ordeals':
			return $elm$core$Maybe$Just(5);
		case 'baroninn':
			return $elm$core$Maybe$Just(6);
		case 'baroncastle':
			return $elm$core$Maybe$Just(7);
		case 'magnes':
			return $elm$core$Maybe$Just(8);
		case 'zot':
			return $elm$core$Maybe$Just(9);
		case 'dwarfcastle':
			return $elm$core$Maybe$Just(10);
		case 'lowerbabil':
			return $elm$core$Maybe$Just(11);
		case 'falcon':
			return $elm$core$Maybe$Just(12);
		case 'sealedcave':
			return $elm$core$Maybe$Just(13);
		case 'monsterqueen':
			return $elm$core$Maybe$Just(14);
		case 'monsterking':
			return $elm$core$Maybe$Just(15);
		case 'baronbasement':
			return $elm$core$Maybe$Just(16);
		case 'giant':
			return $elm$core$Maybe$Just(17);
		case 'cavebahamut':
			return $elm$core$Maybe$Just(18);
		case 'murasamealtar':
			return $elm$core$Maybe$Just(19);
		case 'crystalaltar':
			return $elm$core$Maybe$Just(20);
		case 'whitealtar':
			return $elm$core$Maybe$Just(21);
		case 'ribbonaltar':
			return $elm$core$Maybe$Just(22);
		case 'masamunealtar':
			return $elm$core$Maybe$Just(23);
		case 'burnmist':
			return $elm$core$Maybe$Just(24);
		case 'curefever':
			return $elm$core$Maybe$Just(25);
		case 'unlocksewer':
			return $elm$core$Maybe$Just(26);
		case 'music':
			return $elm$core$Maybe$Just(27);
		case 'toroiatreasury':
			return $elm$core$Maybe$Just(28);
		case 'magma':
			return $elm$core$Maybe$Just(29);
		case 'supercannon':
			return $elm$core$Maybe$Just(30);
		case 'unlocksealedcave':
			return $elm$core$Maybe$Just(31);
		case 'bigwhale':
			return $elm$core$Maybe$Just(32);
		case 'traderat':
			return $elm$core$Maybe$Just(33);
		case 'forge':
			return $elm$core$Maybe$Just(34);
		case 'wakeyang':
			return $elm$core$Maybe$Just(35);
		case 'tradepan':
			return $elm$core$Maybe$Just(36);
		case 'tradepink':
			return $elm$core$Maybe$Just(37);
		case 'pass':
			return $elm$core$Maybe$Just(38);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$toLower = _String_toLower;
var $author$project$Objective$fromString = function (str) {
	var _v0 = A2(
		$elm$core$String$split,
		'_',
		$elm$core$String$toLower(str));
	_v0$7:
	while (true) {
		if (_v0.b) {
			if (!_v0.b.b) {
				switch (_v0.a) {
					case 'classicforge':
						return $elm$core$Maybe$Just($author$project$Objective$ClassicForge);
					case 'classicgiant':
						return $elm$core$Maybe$Just($author$project$Objective$ClassicGiant);
					case 'fiends':
						return $elm$core$Maybe$Just($author$project$Objective$Fiends);
					case 'dkmatter':
						return $elm$core$Maybe$Just($author$project$Objective$DarkMatterHunt);
					default:
						break _v0$7;
				}
			} else {
				if (!_v0.b.b.b) {
					switch (_v0.a) {
						case 'char':
							var _v1 = _v0.b;
							var _char = _v1.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Objective$GetCharacter,
								$author$project$Objective$charFromString(_char));
						case 'boss':
							var _v2 = _v0.b;
							var boss = _v2.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Objective$DefeatBoss,
								$author$project$Objective$bossFromString(boss));
						case 'quest':
							var _v3 = _v0.b;
							var quest = _v3.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Objective$DoQuest,
								$author$project$Objective$questFromString(quest));
						default:
							break _v0$7;
					}
				} else {
					break _v0$7;
				}
			}
		} else {
			break _v0$7;
		}
	}
	return $elm$core$Maybe$Nothing;
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
								G: A2($Gizra$elm_all_set$EverySet$insert, 0, flags.G)
							});
					case 'boss':
						return _Utils_update(
							flags,
							{
								G: A2($Gizra$elm_all_set$EverySet$insert, 1, flags.G)
							});
					case 'quest':
						return _Utils_update(
							flags,
							{
								G: A2($Gizra$elm_all_set$EverySet$insert, 2, flags.G)
							});
					default:
						var num = _switch;
						var _v11 = $elm$core$String$toInt(num);
						if (!_v11.$) {
							var n = _v11.a;
							return _Utils_update(
								flags,
								{cm: n});
						} else {
							return flags;
						}
				}
			});
		var parseMode = F2(
			function (mode, flags) {
				var _v9 = $author$project$Objective$fromString(mode);
				if (!_v9.$) {
					var objective = _v9.a;
					return _Utils_update(
						flags,
						{
							cK: _Utils_eq(objective, $author$project$Objective$ClassicGiant),
							C: A2($elm$core$Array$push, objective, flags.C)
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
							{at: c});
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
								{bU: 1});
						case 'crystal':
							return _Utils_update(
								incomingFlags,
								{bU: 0});
						default:
							return incomingFlags;
					}
				default:
					var num = _v0.a;
					var _v7 = _v0.b;
					var objectiveStr = _v7.a;
					var _v8 = _Utils_Tuple2(
						$elm$core$String$toInt(num),
						$author$project$Objective$fromString(objectiveStr));
					if ((!_v8.a.$) && (!_v8.b.$)) {
						var objective = _v8.b.a;
						return _Utils_update(
							incomingFlags,
							{
								C: A2($elm$core$Array$push, objective, incomingFlags.C)
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
					{cX: false});
			case 'pushbtojump':
				return _Utils_update(
					flags,
					{c9: true});
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
					{aS: true, c4: true});
			case 'key':
				return _Utils_update(
					flags,
					{aS: true, c5: true});
			case 'chests':
				return _Utils_update(
					flags,
					{aS: true});
			default:
				return flags;
		}
	});
var $author$project$Flags$parseS = F2(
	function (_switch, flags) {
		switch (_switch) {
			case 'cabins':
				return _Utils_update(
					flags,
					{bR: true});
			case 'empty':
				return _Utils_update(
					flags,
					{bR: true});
			default:
				return flags;
		}
	});
var $author$project$Flags$parseT = F2(
	function (_switch, flags) {
		if (_switch === 'empty') {
			return _Utils_update(
				flags,
				{c0: true});
		} else {
			return flags;
		}
	});
var $author$project$Flags$parseFlag = F2(
	function (flag, flags) {
		var _v0 = $elm$core$String$uncons(flag);
		_v0$8:
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
					case 'T':
						var _v4 = _v0.a;
						var opts = _v4.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseT,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'S':
						var _v5 = _v0.a;
						var opts = _v5.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseS,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'N':
						var _v6 = _v0.a;
						var opts = _v6.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseN,
							flags,
							A2($elm$core$String$split, '/', opts));
					case 'G':
						var _v7 = _v0.a;
						var opts = _v7.b;
						return A3(
							$elm$core$List$foldl,
							$author$project$Flags$parseG,
							flags,
							A2($elm$core$String$split, '/', opts));
					case '-':
						var _v8 = _v0.a;
						var opt = _v8.b;
						return A2($author$project$Flags$parseOther, opt, flags);
					default:
						break _v0$8;
				}
			} else {
				break _v0$8;
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
		var requiredObjectives = (!flags.at) ? ($elm$core$Array$length(flags.C) + flags.cm) : flags.at;
		return _Utils_update(
			flags,
			{at: requiredObjectives});
	};
	var fixupObjectiveTypes = function (flags) {
		return $Gizra$elm_all_set$EverySet$isEmpty(flags.G) ? _Utils_update(
			flags,
			{
				G: $Gizra$elm_all_set$EverySet$fromList(
					_List_fromArray(
						[0, 1, 2]))
			}) : flags;
	};
	var fixupKeyItems = function (flags) {
		var keyItems = A2($Gizra$elm_all_set$EverySet$member, 6, flags.f) ? A2(
			$Gizra$elm_all_set$EverySet$diff,
			flags.f,
			$Gizra$elm_all_set$EverySet$fromList(
				_List_fromArray(
					[0, 2, 3]))) : A2($Gizra$elm_all_set$EverySet$insert, 0, flags.f);
		return _Utils_update(
			flags,
			{f: keyItems});
	};
	var fixupFiends = function (flags) {
		var objectives = A2(
			$elm$core$List$member,
			$author$project$Objective$Fiends,
			$elm$core$Array$toList(flags.C)) ? A2(
			$elm$core$Array$filter,
			$elm$core$Basics$neq($author$project$Objective$Fiends),
			A2(
				$elm$core$Array$append,
				flags.C,
				$elm$core$Array$fromList(
					_List_fromArray(
						[
							$author$project$Objective$DefeatBoss(7),
							$author$project$Objective$DefeatBoss(8),
							$author$project$Objective$DefeatBoss(13),
							$author$project$Objective$DefeatBoss(16),
							$author$project$Objective$DefeatBoss(22),
							$author$project$Objective$DefeatBoss(28)
						])))) : flags.C;
		return _Utils_update(
			flags,
			{C: objectives});
	};
	var _default = {
		cK: false,
		cX: true,
		f: $Gizra$elm_all_set$EverySet$singleton(5),
		c$: false,
		bR: false,
		c0: false,
		bU: 1,
		C: $elm$core$Array$empty,
		aS: false,
		c4: false,
		c5: false,
		c9: false,
		G: $Gizra$elm_all_set$EverySet$empty,
		cm: 0,
		at: 0,
		dl: false
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
var $author$project$Pages$Top$Unset = function (a) {
	return {$: 1, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area = F4(
	function (top, left, width, height) {
		return {dD: height, ab: left, cy: top, en: width};
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed = 2;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$State = $elm$core$Basics$identity;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$initialState = {
	aN: A4($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area, 0, 0, 0, 0),
	O: 2,
	cx: A4($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area, 0, 0, 0, 0)
};
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
						h: 0,
						i: A3(
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
var $author$project$Pages$Top$updateRandomObjectives = F2(
	function (flags, objectives) {
		var delta = flags.cm - $elm$core$Array$length(objectives);
		return (delta > 0) ? A2(
			$elm$core$Array$append,
			objectives,
			A2(
				$elm$core$Array$repeat,
				delta,
				$author$project$Pages$Top$Unset($rundis$elm_bootstrap$Bootstrap$Dropdown$initialState))) : ((delta < 0) ? A3($elm$core$Array$slice, 0, delta, objectives) : objectives);
	});
var $author$project$Pages$Top$with = F2(
	function (b, a) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Pages$Top$init = function (url) {
	var flagString = 'Kmain/summon/moon Gwarp Nkey O1:char_kain/2:quest_antlionnest/random:3,char,boss/req:4';
	var flags = $author$project$Flags$parse(flagString);
	var randomObjectives = A2($author$project$Pages$Top$updateRandomObjectives, flags, $elm$core$Array$empty);
	return A2(
		$author$project$Pages$Top$with,
		$elm$core$Platform$Cmd$none,
		{
			X: $Gizra$elm_all_set$EverySet$empty,
			br: $Gizra$elm_all_set$EverySet$empty,
			bx: $pzp1997$assoc_list$AssocList$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(0, 0),
						_Utils_Tuple2(2, 0),
						_Utils_Tuple2(3, 1)
					])),
			by: flagString,
			K: flags,
			ac: $author$project$Location$all,
			cm: randomObjectives,
			fo: url,
			em: false
		});
};
var $author$project$Pages$Top$DropdownMsg = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			j: _List_Nil,
			h: 0,
			i: A3(
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
					var offset = builder.h * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						j: A2($elm$core$List$cons, mappedLeaf, builder.j),
						h: builder.h + 1,
						i: builder.i
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$ListenClicks = 1;
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {c2: oldTime, d2: request, ec: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.d2;
		var oldTime = _v0.c2;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.ec;
		var oldTime = _v0.c2;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {dV: pids, ec: subs};
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
		return {dz: event, b: key};
	});
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
			state.dV,
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
		var key = _v0.b;
		var event = _v0.dz;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.ec);
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
var $rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus = F2(
	function (status, _v0) {
		var stateRec = _v0;
		return _Utils_update(
			stateRec,
			{O: status});
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$subscriptions = F2(
	function (state, toMsg) {
		var status = state.O;
		switch (status) {
			case 0:
				return $elm$browser$Browser$Events$onAnimationFrame(
					function (_v1) {
						return toMsg(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus, 1, state));
					});
			case 1:
				return $elm$browser$Browser$Events$onClick(
					$elm$json$Json$Decode$succeed(
						toMsg(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus, 2, state))));
			default:
				return $elm$core$Platform$Sub$none;
		}
	});
var $author$project$Pages$Top$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		$elm$core$Array$toList(
			A2(
				$elm$core$Array$indexedMap,
				F2(
					function (index, randomObjective) {
						if (randomObjective.$ === 1) {
							var dropdown = randomObjective.a;
							return A2(
								$rundis$elm_bootstrap$Bootstrap$Dropdown$subscriptions,
								dropdown,
								$author$project$Pages$Top$DropdownMsg(index));
						} else {
							return $elm$core$Platform$Sub$none;
						}
					}),
				model.cm)));
};
var $author$project$Location$Checked = 5;
var $author$project$Pages$Top$Set = function (a) {
	return {$: 0, a: a};
};
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
var $author$project$Pages$Top$getContext = function (model) {
	var toMaybe = function (randomObjective) {
		if (!randomObjective.$) {
			var objective = randomObjective.a;
			return $elm$core$Maybe$Just(objective);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return {
		X: model.X,
		br: model.br,
		bx: model.bx,
		K: model.K,
		cm: $Gizra$elm_all_set$EverySet$fromList(
			A2(
				$elm$core$List$filterMap,
				toMaybe,
				$elm$core$Array$toList(model.cm))),
		em: model.em
	};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
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
var $author$project$Location$Bosses = 1;
var $author$project$Location$TrappedChests = 4;
var $author$project$Location$valueToFilter = function (value) {
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
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Location$getProperties = F2(
	function (_v0, _v1) {
		var flags = _v0.K;
		var warpGlitchUsed = _v0.em;
		var filterOverrides = _v0.bx;
		var location = _v1;
		var toTuple = function (_v7) {
			var index = _v7.a;
			var _v8 = _v7.b;
			var status = _v8.a;
			var value = _v8.b;
			return _Utils_Tuple3(index, status, value);
		};
		var notFilteredOut = function (_v6) {
			var value = _v6.b;
			return 1 !== A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$andThen,
					function (filter) {
						return A2($pzp1997$assoc_list$AssocList$get, filter, filterOverrides);
					},
					$author$project$Location$valueToFilter(value)));
		};
		var exists = function (_v5) {
			var value = _v5.b;
			switch (value.$) {
				case 0:
					if (!value.a) {
						var _v3 = value.a;
						return !flags.c$;
					} else {
						var _v4 = value.a;
						return !(flags.cK && (location.b === 43));
					}
				case 2:
					var itemClass = value.a;
					return (!(warpGlitchUsed && (location.b === 56))) && ((!((location.b === 24) && ((itemClass === 6) && (!flags.c5)))) && A2($Gizra$elm_all_set$EverySet$member, itemClass, flags.f));
				default:
					return true;
			}
		};
		return A2(
			$elm$core$List$map,
			toTuple,
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, notFilteredOut),
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeR, $elm$core$Tuple$second, exists),
					$elm$core$Array$toIndexedList(location.as))));
	});
var $author$project$Location$getStatus = function (_v0) {
	var location = _v0;
	return location.O;
};
var $author$project$Location$getKey = function (_v0) {
	var location = _v0;
	return location.b;
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
var $author$project$Pages$Top$randomObjectiveToMaybe = function (o) {
	if (!o.$) {
		var objective = o.a;
		return $elm$core$Maybe$Just(objective);
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
var $author$project$Pages$Top$toggle = F2(
	function (item, set) {
		return A2($Gizra$elm_all_set$EverySet$member, item, set) ? A2($Gizra$elm_all_set$EverySet$remove, item, set) : A2($Gizra$elm_all_set$EverySet$insert, item, set);
	});
var $author$project$Location$Dismissed = {$: 3};
var $author$project$Location$SeenSome = function (a) {
	return {$: 2, a: a};
};
var $author$project$Location$countable = function (value) {
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
		var _v1 = A2($elm$core$Array$get, index, location.as);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var status = _v2.a;
			var value = _v2.b;
			var newStatus = function () {
				var _v3 = _Utils_Tuple3(
					hard,
					$author$project$Location$countable(value),
					status);
				_v3$3:
				while (true) {
					switch (_v3.c.$) {
						case 0:
							if ((!_v3.a) && (!_v3.b.$)) {
								var total = _v3.b.a;
								var _v4 = _v3.c;
								return (total > 1) ? $author$project$Location$SeenSome(1) : $author$project$Location$Dismissed;
							} else {
								break _v3$3;
							}
						case 2:
							if ((!_v3.a) && (!_v3.b.$)) {
								var total = _v3.b.a;
								var seen = _v3.c.a;
								return (_Utils_cmp(seen + 1, total) < 0) ? $author$project$Location$SeenSome(seen + 1) : $author$project$Location$Dismissed;
							} else {
								break _v3$3;
							}
						case 3:
							var _v5 = _v3.c;
							return $author$project$Location$Unseen;
						default:
							break _v3$3;
					}
				}
				return $author$project$Location$Dismissed;
			}();
			return _Utils_update(
				location,
				{
					as: A3(
						$elm$core$Array$set,
						index,
						A2($author$project$Location$Property, newStatus, value),
						location.as)
				});
		} else {
			return location;
		}
	});
var $author$project$Location$toggleStatus = F2(
	function (status, _v0) {
		var location = _v0;
		var newStatus = _Utils_eq(location.O, status) ? $author$project$Location$Unseen : status;
		return _Utils_update(
			location,
			{O: newStatus});
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
var $author$project$Pages$Top$innerUpdate = F2(
	function (msg, model) {
		var toggleProperty = F4(
			function (key, index, hard, newModel) {
				return _Utils_update(
					newModel,
					{
						ac: A3(
							$author$project$Location$update,
							key,
							$elm$core$Maybe$map(
								A2($author$project$Location$toggleProperty, index, hard)),
							newModel.ac)
					});
			});
		switch (msg.$) {
			case 0:
				var objective = msg.a;
				return _Utils_update(
					model,
					{
						br: A2($author$project$Pages$Top$toggle, objective, model.br)
					});
			case 1:
				var index = msg.a;
				var objective = msg.b;
				return _Utils_update(
					model,
					{
						cm: A3(
							$elm$core$Array$set,
							index,
							$author$project$Pages$Top$Set(objective),
							model.cm)
					});
			case 2:
				var index = msg.a;
				return _Utils_update(
					model,
					{
						cm: A3(
							$elm$core$Array$set,
							index,
							$author$project$Pages$Top$Unset($rundis$elm_bootstrap$Bootstrap$Dropdown$initialState),
							model.cm)
					});
			case 3:
				var index = msg.a;
				var dropdown = msg.b;
				var _v1 = A2($elm$core$Array$get, index, model.cm);
				if ((!_v1.$) && (_v1.a.$ === 1)) {
					return _Utils_update(
						model,
						{
							cm: A3(
								$elm$core$Array$set,
								index,
								$author$project$Pages$Top$Unset(dropdown),
								model.cm)
						});
				} else {
					return model;
				}
			case 4:
				var requirement = msg.a;
				return _Utils_update(
					model,
					{
						X: A2($author$project$Pages$Top$toggle, requirement, model.X)
					});
			case 5:
				var filter = msg.a;
				return _Utils_update(
					model,
					{
						bx: A3(
							$pzp1997$assoc_list$AssocList$update,
							filter,
							function (state) {
								if (state.$ === 1) {
									return $elm$core$Maybe$Just(0);
								} else {
									if (!state.a) {
										var _v3 = state.a;
										return (filter === 5) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(1);
									} else {
										var _v4 = state.a;
										return A2(
											$elm$core$List$member,
											filter,
											_List_fromArray(
												[0, 2])) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing;
									}
								}
							},
							model.bx)
					});
			case 6:
				var location = msg.a;
				var status = msg.b;
				var newLocation = A2($author$project$Location$toggleStatus, status, location);
				var requirements = $Gizra$elm_all_set$EverySet$fromList(
					A2(
						$elm$core$List$filterMap,
						function (_v6) {
							var value = _v6.c;
							if (value.$ === 6) {
								var req = value.a;
								return $elm$core$Maybe$Just(req);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						},
						A2(
							$author$project$Location$getProperties,
							$author$project$Pages$Top$getContext(model),
							newLocation)));
				var attainedRequirements = function () {
					var _v5 = $author$project$Location$getStatus(newLocation);
					switch (_v5.$) {
						case 0:
							return A2($Gizra$elm_all_set$EverySet$diff, model.X, requirements);
						case 3:
							return A2($Gizra$elm_all_set$EverySet$union, model.X, requirements);
						default:
							return model.X;
					}
				}();
				return _Utils_update(
					model,
					{
						X: attainedRequirements,
						ac: A2($author$project$Location$insert, newLocation, model.ac)
					});
			case 7:
				var key = msg.a;
				var index = msg.b;
				return A4(toggleProperty, key, index, false, model);
			case 8:
				var key = msg.a;
				var index = msg.b;
				return A4(toggleProperty, key, index, true, model);
			case 9:
				var key = msg.a;
				var index = msg.b;
				return A4(
					toggleProperty,
					key,
					index,
					false,
					_Utils_update(
						model,
						{em: !model.em}));
			default:
				var flagString = msg.a;
				var flags = $author$project$Flags$parse(flagString);
				var randomObjectives = A2($author$project$Pages$Top$updateRandomObjectives, flags, model.cm);
				var filterOverrides = (flags.c0 && (!_Utils_eq(
					A2($pzp1997$assoc_list$AssocList$get, 3, model.bx),
					$elm$core$Maybe$Just(0)))) ? A3($pzp1997$assoc_list$AssocList$insert, 3, 1, model.bx) : model.bx;
				var completedObjectives = A2(
					$Gizra$elm_all_set$EverySet$intersect,
					model.br,
					$Gizra$elm_all_set$EverySet$fromList(
						A2(
							$elm$core$List$append,
							$elm$core$Array$toList(flags.C),
							A2(
								$elm$core$List$filterMap,
								$author$project$Pages$Top$randomObjectiveToMaybe,
								$elm$core$Array$toList(randomObjectives)))));
				return _Utils_update(
					model,
					{br: completedObjectives, bx: filterOverrides, by: flagString, K: flags, cm: randomObjectives});
		}
	});
var $author$project$Pages$Top$update = F2(
	function (msg, model) {
		return A2(
			$author$project$Pages$Top$with,
			$elm$core$Platform$Cmd$none,
			A2($author$project$Pages$Top$innerUpdate, msg, model));
	});
var $author$project$Location$Checks = 0;
var $author$project$Location$Shops = 1;
var $author$project$Pages$Top$UpdateFlags = function (a) {
	return {$: 10, a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Pages$Top$displayIf = F2(
	function (predicate, html) {
		return predicate ? html : $elm$html$Html$text('');
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
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
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
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
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Pages$Top$ToggleFilter = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Icon$img = function (src_) {
	return A2(
		$elm$html$Html$img,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$src(src_)
			]),
		_List_Nil);
};
var $author$project$Icon$boss = {
	u: 'boss',
	y: $author$project$Icon$img('img/sprites/Monster3-Front.gif')
};
var $author$project$Icon$character = {
	u: 'character',
	y: $author$project$Icon$img('img/sprites/Mini1-Front.gif')
};
var $author$project$Icon$chest = {
	u: 'chest',
	y: $author$project$Icon$img('img/sprites/BlueChest1.gif')
};
var $author$project$Icon$keyItem = {
	u: 'key-item',
	y: $author$project$Icon$img('img/sprites/Key-edit.gif')
};
var $author$project$Icon$trappedChest = {
	u: 'trapped-chest',
	y: $author$project$Icon$img('img/sprites/RedChest2.gif')
};
var $author$project$Icon$visible = {
	u: 'checked',
	y: $author$project$Icon$img('img/sprites/SecurityEye.gif')
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
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
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
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Pages$Top$viewFilters = function (model) {
	var viewFilter = function (filter) {
		var stateClass = function () {
			var _v0 = A2($pzp1997$assoc_list$AssocList$get, filter, model.bx);
			if (!_v0.$) {
				if (!_v0.a) {
					var _v1 = _v0.a;
					return 'show';
				} else {
					var _v2 = _v0.a;
					return 'hide';
				}
			} else {
				return 'unset';
			}
		}();
		var icon = $author$project$Icon$fromFilter(filter);
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('filter'),
					$elm$html$Html$Attributes$class(stateClass),
					$elm$html$Html$Attributes$class(icon.u),
					$elm$html$Html$Events$onClick(
					$author$project$Pages$Top$ToggleFilter(filter))
				]),
			_List_fromArray(
				[
					A2($elm$html$Html$map, $elm$core$Basics$never, icon.y)
				]));
	};
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('filters')
			]),
		A2(
			$elm$core$List$map,
			viewFilter,
			_List_fromArray(
				[0, 2, 1, 3, 4, 5])));
};
var $author$project$Location$Crystal = {$: 8};
var $author$project$Location$MagmaKey = {$: 4};
var $author$project$Location$Pass = 0;
var $author$project$Location$PinkTail = {$: 16};
var $author$project$Location$Spoon = {$: 15};
var $author$project$Pages$Top$ToggleRequirement = function (a) {
	return {$: 4, a: a};
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
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$Pages$Top$displayCellIf = F2(
	function (predicate, html) {
		return predicate ? html : A2($elm$html$Html$td, _List_Nil, _List_Nil);
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
var $author$project$Location$isPseudo = function (requirement) {
	if (requirement.$ === 17) {
		return true;
	} else {
		return false;
	}
};
var $pzp1997$assoc_list$AssocList$size = function (_v0) {
	var alist = _v0;
	return $elm$core$List$length(alist);
};
var $Gizra$elm_all_set$EverySet$size = function (_v0) {
	var d = _v0;
	return $pzp1997$assoc_list$AssocList$size(d);
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Pages$Top$viewKeyItems = F2(
	function (flags, attained) {
		var req = F2(
			function (requirement, _class) {
				return A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Pages$Top$ToggleRequirement(requirement))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('requirement ' + _class, true),
											_Utils_Tuple2(
											'disabled',
											!A2($Gizra$elm_all_set$EverySet$member, requirement, attained))
										]))
								]),
							_List_Nil)
						]));
			});
		var numAttained = $Gizra$elm_all_set$EverySet$size(
			A2(
				$Gizra$elm_all_set$EverySet$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Location$isPseudo),
				attained));
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('requirements')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(req, $author$project$Location$Crystal, 'crystal'),
							A2(
							$author$project$Pages$Top$displayCellIf,
							flags.aS,
							A2(
								req,
								$author$project$Location$Pseudo(0),
								'pass')),
							A2(req, $author$project$Location$Hook, 'hook'),
							A2(req, $author$project$Location$DarknessCrystal, 'darkness-crystal')
						])),
					A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(req, $author$project$Location$EarthCrystal, 'earth-crystal'),
							A2(req, $author$project$Location$TwinHarp, 'twin-harp'),
							A2(req, $author$project$Location$Package, 'package'),
							A2(req, $author$project$Location$SandRuby, 'sand-ruby')
						])),
					A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(req, $author$project$Location$BaronKey, 'baron-key'),
							A2(req, $author$project$Location$MagmaKey, 'magma-key'),
							A2(req, $author$project$Location$TowerKey, 'tower-key'),
							A2(req, $author$project$Location$LucaKey, 'luca-key')
						])),
					A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(req, $author$project$Location$Adamant, 'adamant'),
							A2(req, $author$project$Location$LegendSword, 'legend-sword'),
							A2(req, $author$project$Location$Pan, 'pan'),
							A2(req, $author$project$Location$Spoon, 'spoon')
						])),
					A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Pages$Top$displayCellIf,
							!A2($Gizra$elm_all_set$EverySet$member, 5, flags.f),
							A2(
								req,
								$author$project$Location$Pseudo(1),
								'mist-dragon')),
							A2(req, $author$project$Location$RatTail, 'rat-tail'),
							A2(
							$author$project$Pages$Top$displayCellIf,
							!A2($Gizra$elm_all_set$EverySet$member, 6, flags.f),
							A2(req, $author$project$Location$PinkTail, 'pink-tail')),
							A2(
							$author$project$Pages$Top$displayCellIf,
							flags.cX,
							A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('requirement total', true),
												_Utils_Tuple2('key-bonus-reached', numAttained >= 10)
											]))
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Pages$Top$displayIf,
										numAttained > 0,
										$elm$html$Html$text(
											$elm$core$String$fromInt(numAttained)))
									])))
						]))
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
var $author$project$Location$UndergroundAccess = 2;
var $author$project$Location$areaAccessible = F2(
	function (attained, _v0) {
		var location = _v0;
		var _v1 = location.bc;
		switch (_v1) {
			case 0:
				return true;
			case 1:
				return A2(
					$Gizra$elm_all_set$EverySet$member,
					$author$project$Location$Pseudo(2),
					attained);
			default:
				return A2($Gizra$elm_all_set$EverySet$member, $author$project$Location$DarknessCrystal, attained);
		}
	});
var $author$project$Objective$isBoss = function (objective) {
	switch (objective.$) {
		case 2:
			return true;
		case 5:
			return true;
		default:
			return false;
	}
};
var $author$project$Location$outstandingObjectives = function (context) {
	var combinedObjectives = A2(
		$Gizra$elm_all_set$EverySet$union,
		context.cm,
		$Gizra$elm_all_set$EverySet$fromList(
			$elm$core$Array$toList(context.K.C)));
	return (_Utils_cmp(
		$Gizra$elm_all_set$EverySet$size(context.br),
		context.K.at) > -1) ? $Gizra$elm_all_set$EverySet$empty : A2($Gizra$elm_all_set$EverySet$diff, combinedObjectives, context.br);
};
var $author$project$Location$defaultFiltersFrom = function (context) {
	var trappedKeyItems = A2($Gizra$elm_all_set$EverySet$member, 4, context.K.f);
	var outstanding = $author$project$Location$outstandingObjectives(context);
	var onDarkMatterHunt = A2(
		$elm$core$List$member,
		$author$project$Objective$DarkMatterHunt,
		$elm$core$Array$toList(context.K.C)) && ((!A2($Gizra$elm_all_set$EverySet$member, $author$project$Objective$DarkMatterHunt, context.br)) && (!$Gizra$elm_all_set$EverySet$isEmpty(outstanding)));
	var bossesHaveValue = function () {
		var huntingDMist = (!A2($Gizra$elm_all_set$EverySet$member, 5, context.K.f)) && (!A2(
			$Gizra$elm_all_set$EverySet$member,
			$author$project$Location$Pseudo(1),
			context.X));
		var activeBossHunt = !$Gizra$elm_all_set$EverySet$isEmpty(
			A2($Gizra$elm_all_set$EverySet$filter, $author$project$Objective$isBoss, outstanding));
		return activeBossHunt || huntingDMist;
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
		context.bx);
};
var $author$project$Location$isClass = F2(
	function (_class, _v0) {
		var location = _v0;
		return _Utils_eq(_class === 1, location.cW);
	});
var $author$project$Location$requirementsMet = F2(
	function (attained, _v0) {
		var location = _v0;
		return $Gizra$elm_all_set$EverySet$isEmpty(
			A2($Gizra$elm_all_set$EverySet$diff, location.c, attained));
	});
var $author$project$Location$filterByContext = F3(
	function (_class, c, _v0) {
		var locations = _v0;
		var undergroundAccess = c.K.c9 || (A2($Gizra$elm_all_set$EverySet$member, $author$project$Location$MagmaKey, c.X) || A2(
			$Gizra$elm_all_set$EverySet$member,
			$author$project$Location$Pseudo(5),
			c.X));
		var jumpable = $Gizra$elm_all_set$EverySet$fromList(
			_List_fromArray(
				[23, 24, 25, 31, 33, 40, 41, 42]));
		var attainedRequirements = undergroundAccess ? A2(
			$Gizra$elm_all_set$EverySet$insert,
			$author$project$Location$Pseudo(2),
			c.X) : c.X;
		var context = _Utils_update(
			c,
			{X: attainedRequirements});
		var filters = $author$project$Location$filtersFrom(context);
		var propertiesHaveValue = function (location) {
			return A2(
				$elm$core$List$any,
				function (_v2) {
					var value = _v2.c;
					var _v3 = _Utils_Tuple2(
						value,
						$author$project$Location$valueToFilter(value));
					if (_v3.a.$ === 6) {
						if ((_v3.a.a.$ === 17) && (_v3.a.a.a === 5)) {
							var _v4 = _v3.a.a.a;
							return !undergroundAccess;
						} else {
							return true;
						}
					} else {
						if (!_v3.b.$) {
							var filter = _v3.b.a;
							return A2($Gizra$elm_all_set$EverySet$member, filter, filters);
						} else {
							return false;
						}
					}
				},
				A2($author$project$Location$getProperties, context, location));
		};
		var hasValue = function (location) {
			return A2($author$project$Location$isClass, 1, location) || propertiesHaveValue(location);
		};
		var requirementsMetFor = function (key) {
			return A2(
				$elm$core$Maybe$withDefault,
				false,
				A2(
					$elm$core$Maybe$map,
					$author$project$Location$requirementsMet(attainedRequirements),
					A2($pzp1997$assoc_list$AssocList$get, key, locations)));
		};
		var hasNoValue = function (_v1) {
			var l = _v1;
			return (l.b === 30) && requirementsMetFor(31);
		};
		var isRelevant = function (location) {
			var l = location;
			return (!A2($author$project$Location$isClass, _class, location)) ? false : (((l.b === 48) && requirementsMetFor(49)) ? false : (_Utils_eq(l.O, $author$project$Location$Dismissed) ? (!A2(
				$elm$core$Maybe$withDefault,
				1,
				A2($pzp1997$assoc_list$AssocList$get, 5, context.bx))) : (hasValue(location) && ((!hasNoValue(location)) && (A2($author$project$Location$areaAccessible, attainedRequirements, location) && ((context.K.c9 && A2($Gizra$elm_all_set$EverySet$member, l.b, jumpable)) || A2($author$project$Location$requirementsMet, attainedRequirements, location)))))));
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
	return location.bc;
};
var $pzp1997$assoc_list$AssocList$values = function (_v0) {
	var alist = _v0;
	return A2($elm$core$List$map, $elm$core$Tuple$second, alist);
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
		return {eN: index, eR: match, e0: number, ff: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{ew: false, eT: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm_community$string_extra$String$Extra$regexFromString = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$fromString,
	$elm$core$Maybe$withDefault($elm$regex$Regex$never));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm$core$String$cons = _String_cons;
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
				return $.eR;
			},
			$elm_community$string_extra$String$Extra$toSentenceCase));
	return A3(
		$elm$regex$Regex$replace,
		$elm_community$string_extra$String$Extra$regexFromString('^([a-z])|\\s+([a-z])'),
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.eR;
			},
			uppercaseMatch),
		ws);
};
var $author$project$Location$Seen = {$: 1};
var $author$project$Pages$Top$ToggleLocationStatus = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Location$getName = function (_v0) {
	var location = _v0;
	return location.a;
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
var $author$project$Pages$Top$onRightClick = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'contextmenu',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$Location$statusToString = function (status) {
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
var $author$project$Pages$Top$HardToggleProperty = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Pages$Top$ToggleProperty = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Pages$Top$ToggleWarpGlitchUsed = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $author$project$Icon$armour = {
	u: 'armour',
	y: $author$project$Icon$img('img/sprites/Armor.gif')
};
var $author$project$Icon$healing = {
	u: 'healing',
	y: $author$project$Icon$img('img/sprites/RecoveryItem.gif')
};
var $author$project$Icon$jItem = {
	u: 'jItem',
	y: $author$project$Icon$img('img/sprites/Hourglass.gif')
};
var $author$project$Icon$other = {
	u: 'other',
	y: $author$project$Icon$img('img/sprites/Summon.gif')
};
var $author$project$Icon$weapon = {
	u: 'weapon',
	y: $author$project$Icon$img('img/sprites/KnightSword.gif')
};
var $author$project$Icon$fromValue = function (value) {
	_v0$10:
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
			case 5:
				switch (value.a.$) {
					case 0:
						var _v1 = value.a;
						return $elm$core$Maybe$Just($author$project$Icon$weapon);
					case 1:
						var _v2 = value.a;
						return $elm$core$Maybe$Just($author$project$Icon$armour);
					case 4:
						return $elm$core$Maybe$Just($author$project$Icon$healing);
					case 5:
						return $elm$core$Maybe$Just($author$project$Icon$jItem);
					case 6:
						return $elm$core$Maybe$Just($author$project$Icon$other);
					default:
						break _v0$10;
				}
			default:
				break _v0$10;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Pages$Top$viewProperty = F2(
	function (location, _v0) {
		var index = _v0.a;
		var status = _v0.b;
		var value = _v0.c;
		var msg = _Utils_eq(
			value,
			$author$project$Location$KeyItem(1)) ? $author$project$Pages$Top$ToggleWarpGlitchUsed : $author$project$Pages$Top$ToggleProperty;
		var extraClass = function () {
			_v3$3:
			while (true) {
				switch (value.$) {
					case 2:
						if (value.a === 1) {
							var _v4 = value.a;
							return 'warp';
						} else {
							break _v3$3;
						}
					case 3:
						return 'countable';
					case 4:
						return 'countable';
					default:
						break _v3$3;
				}
			}
			return '';
		}();
		var count = function () {
			var _v2 = _Utils_Tuple2(
				$author$project$Location$countable(value),
				status);
			if (!_v2.a.$) {
				if (_v2.b.$ === 2) {
					var total = _v2.a.a;
					var seen = _v2.b.a;
					return total - seen;
				} else {
					var total = _v2.a.a;
					return total;
				}
			} else {
				return 0;
			}
		}();
		var _v1 = $author$project$Icon$fromValue(value);
		if (!_v1.$) {
			var icon = _v1.a;
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('icon'),
						$elm$html$Html$Attributes$class(icon.u),
						$elm$html$Html$Attributes$class(extraClass),
						$elm$html$Html$Attributes$class(
						$author$project$Location$statusToString(status)),
						$elm$html$Html$Events$onClick(
						A2(
							msg,
							$author$project$Location$getKey(location),
							index)),
						$author$project$Pages$Top$onRightClick(
						A2(
							$author$project$Pages$Top$HardToggleProperty,
							$author$project$Location$getKey(location),
							index))
					]),
				_List_fromArray(
					[
						A2($elm$html$Html$map, $elm$core$Basics$never, icon.y),
						A2(
						$author$project$Pages$Top$displayIf,
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
								])))
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Pages$Top$viewLocation = F2(
	function (context, location) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('name'),
						$elm$html$Html$Attributes$class(
						$author$project$Location$statusToString(
							$author$project$Location$getStatus(location))),
						$elm$html$Html$Events$onClick(
						A2($author$project$Pages$Top$ToggleLocationStatus, location, $author$project$Location$Dismissed)),
						$author$project$Pages$Top$onRightClick(
						A2($author$project$Pages$Top$ToggleLocationStatus, location, $author$project$Location$Seen))
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
							$author$project$Pages$Top$viewProperty(location),
							A2($author$project$Location$getProperties, context, location)))
					]))
			]);
	});
var $author$project$Pages$Top$viewLocations = F2(
	function (model, locClass) {
		var context = $author$project$Pages$Top$getContext(model);
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
							$author$project$Pages$Top$viewLocation(context),
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
					A3($author$project$Location$filterByContext, locClass, context, model.ac))));
	});
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
var $author$project$Flags$rewardToString = function (reward) {
	if (!reward) {
		return 'crystal';
	} else {
		return 'win';
	}
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Pages$Top$SetRandomObjective = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Objective$bosses = A2(
	$elm$core$List$map,
	$author$project$Objective$DefeatBoss,
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]));
var $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownItem = $elm$core$Basics$identity;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$class('dropdown-item')
					]),
				attributes),
			children);
	});
var $author$project$Objective$characters = A2(
	$elm$core$List$map,
	$author$project$Objective$GetCharacter,
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropDir = function (maybeDir) {
	var toAttrs = function (dir) {
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'drop' + function () {
					if (!dir) {
						return 'left';
					} else {
						return 'right';
					}
				}())
			]);
	};
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2($elm$core$Maybe$map, toAttrs, maybeDir));
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownAttributes = F2(
	function (status, config) {
		return _Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('btn-group', true),
							_Utils_Tuple2('show', status !== 2),
							_Utils_Tuple2('dropup', config.aJ)
						]))
				]),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Dropdown$dropDir(config.aD),
				config.be));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$menuStyles = F2(
	function (_v0, config) {
		var status = _v0.O;
		var toggleSize = _v0.cx;
		var menuSize = _v0.aN;
		var px = function (n) {
			return $elm$core$String$fromFloat(n) + 'px';
		};
		var translate = F3(
			function (x, y, z) {
				return 'translate3d(' + (px(x) + (',' + (px(y) + (',' + (px(z) + ')')))));
			});
		var _default = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0')
			]);
		var _v1 = _Utils_Tuple2(config.aJ, config.aD);
		_v1$0:
		while (true) {
			if (!_v1.b.$) {
				if (_v1.b.a === 1) {
					if (_v1.a) {
						break _v1$0;
					} else {
						var _v2 = _v1.b.a;
						return _default;
					}
				} else {
					if (_v1.a) {
						break _v1$0;
					} else {
						var _v3 = _v1.b.a;
						return _Utils_ap(
							_default,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Attributes$style,
									'transform',
									A3(translate, (-toggleSize.en) - menuSize.en, 0, 0))
								]));
					}
				}
			} else {
				if (_v1.a) {
					break _v1$0;
				} else {
					return _Utils_ap(
						_default,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$Attributes$style,
								'transform',
								A3(translate, -toggleSize.en, toggleSize.dD, 0))
							]));
				}
			}
		}
		return _Utils_ap(
			_default,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					A3(translate, -toggleSize.en, -menuSize.dD, 0))
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownMenu = F3(
	function (state, config, items) {
		var status = state.O;
		var menuSize = state.aN;
		var wrapperStyles = (status === 2) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'height', '0'),
				A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]) : _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]);
		return A2(
			$elm$html$Html$div,
			wrapperStyles,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('dropdown-menu', true),
										_Utils_Tuple2('dropdown-menu-right', config.bG),
										_Utils_Tuple2('show', status !== 2)
									]))
							]),
						_Utils_ap(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$menuStyles, state, config),
							config.bP)),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var x = _v0;
							return x;
						},
						items))
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$applyModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 1:
				return _Utils_update(
					options,
					{bG: true});
			case 0:
				return _Utils_update(
					options,
					{aJ: true});
			case 4:
				var attrs_ = option.a;
				return _Utils_update(
					options,
					{be: attrs_});
			case 2:
				var dir = option.a;
				return _Utils_update(
					options,
					{
						aD: $elm$core$Maybe$Just(dir)
					});
			default:
				var attrs_ = option.a;
				return _Utils_update(
					options,
					{bP: attrs_});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$defaultOptions = {be: _List_Nil, aD: $elm$core$Maybe$Nothing, bG: false, aJ: false, bP: _List_Nil};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toConfig = function (options) {
	return A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Dropdown$applyModifier, $rundis$elm_bootstrap$Bootstrap$Dropdown$defaultOptions, options);
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdown = F2(
	function (state, _v0) {
		var status = state.O;
		var toggleMsg = _v0.fm;
		var toggleButton = _v0.fl;
		var items = _v0.eP;
		var options = _v0.e5;
		var config = $rundis$elm_bootstrap$Bootstrap$Dropdown$toConfig(options);
		var _v1 = toggleButton;
		var buttonFn = _v1;
		return A2(
			$elm$html$Html$div,
			A2($rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownAttributes, status, config),
			_List_fromArray(
				[
					A2(buttonFn, toggleMsg, state),
					A3($rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownMenu, state, config, items)
				]));
	});
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $rundis$elm_bootstrap$Bootstrap$Dropdown$header = function (children) {
	return A2(
		$elm$html$Html$h6,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dropdown-header')
			]),
		children);
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Objective$quests = A2(
	$elm$core$List$map,
	$author$project$Objective$DoQuest,
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]));
var $author$project$Objective$bossToString = function (boss) {
	switch (boss) {
		case 0:
			return 'D. Mist';
		case 1:
			return 'Officer';
		case 2:
			return 'Octomamm';
		case 3:
			return 'Antlion';
		case 4:
			return 'Waterhag';
		case 5:
			return 'MomBomb';
		case 6:
			return 'the Fabul Gauntlet';
		case 7:
			return 'Milon';
		case 8:
			return 'Milon Z.';
		case 9:
			return 'D.Knight';
		case 10:
			return 'the Guards';
		case 11:
			return 'Karate';
		case 12:
			return 'Baigan';
		case 13:
			return 'Kainazzo';
		case 14:
			return 'the Dark Elf';
		case 15:
			return 'the Magus Sisters';
		case 16:
			return 'Valvalis';
		case 17:
			return 'Calbrena';
		case 18:
			return 'Golbez';
		case 19:
			return 'Dr. Lugae';
		case 20:
			return 'the Dark Imps';
		case 21:
			return 'K.Eblan and Q.Eblan';
		case 22:
			return 'Rubicant';
		case 23:
			return 'EvilWall';
		case 24:
			return 'Asura';
		case 25:
			return 'Leviatan';
		case 26:
			return 'Odin';
		case 27:
			return 'Bahamut';
		case 28:
			return 'Elements';
		case 29:
			return 'CPU';
		case 30:
			return 'Pale Dim';
		case 31:
			return 'Wyvern';
		case 32:
			return 'Plague';
		case 33:
			return 'D.Lunars';
		default:
			return 'Ogopogo';
	}
};
var $author$project$Objective$charToString = function (_char) {
	switch (_char) {
		case 0:
			return 'Cecil';
		case 1:
			return 'Kain';
		case 2:
			return 'Rydia';
		case 3:
			return 'Tellah';
		case 4:
			return 'Edward';
		case 5:
			return 'Rosa';
		case 6:
			return 'Yang';
		case 7:
			return 'Palom';
		case 8:
			return 'Porom';
		case 9:
			return 'Cid';
		case 10:
			return 'Edge';
		default:
			return 'FuSoYa';
	}
};
var $author$project$Objective$questToString = function (quest) {
	switch (quest) {
		case 0:
			return 'Defeat the boss of the Mist Cave';
		case 1:
			return 'Defeat the boss of the Waterfall';
		case 2:
			return 'Complete the Antlion Nest';
		case 3:
			return 'Rescue the hostage on Mt. Hobs';
		case 4:
			return 'Defend Fabul';
		case 5:
			return 'Complete Mt. Ordeals';
		case 6:
			return 'Defeat the bosses of Baron Inn';
		case 7:
			return 'Liberate Baron Castle';
		case 8:
			return 'Complete Cave Magnes';
		case 9:
			return 'Complete the Tower of Zot';
		case 10:
			return 'Defeat the bosses of Dwarf Castle';
		case 11:
			return 'Defeat the boss of Lower Bab-il';
		case 12:
			return 'Launch the Falcon';
		case 13:
			return 'Complete the Sealed Cave';
		case 14:
			return 'Defeat the queen at the Town of Monsters';
		case 15:
			return 'Defeat the king at the Town of Monsters';
		case 16:
			return 'Defeat the Baron Castle basement throne';
		case 17:
			return 'Complete the Giant of Bab-il';
		case 18:
			return 'Complete Cave Bahamut';
		case 19:
			return 'Conquer the vanilla Murasame altar';
		case 20:
			return 'Conquer the vanilla Crystal Sword altar';
		case 21:
			return 'Conquer the vanilla White Spear altar';
		case 22:
			return 'Conquer the vanillla Ribbon room';
		case 23:
			return 'Conquer the vanilla Masamune Altar';
		case 24:
			return 'Burn village Mist with the Package';
		case 25:
			return 'Cure the fever with the SandRuby';
		case 26:
			return 'Unlock the swere with the Baron Key';
		case 27:
			return 'Break the Dark Elf\'s spell with the TwinHarp';
		case 28:
			return 'Open the Toroia Treasury with the Earth Crystal';
		case 29:
			return 'Drop the Magma Key into the Agart well';
		case 30:
			return 'Destroy the Super Cannon';
		case 31:
			return 'Unlock the Sealed Cave';
		case 32:
			return 'Raise the Big Whale';
		case 33:
			return 'Trade away the Rat Tail';
		case 34:
			return 'Have Kokkol forge Legend Sword with Adamant';
		case 35:
			return 'Wake Yang with the Pan';
		case 36:
			return 'Return the Pan to Yang\'s wife';
		case 37:
			return 'Trade away the Pink Tail';
		default:
			return 'Unlock the Pass door in Toroia';
	}
};
var $author$project$Objective$toString = function (objective) {
	switch (objective.$) {
		case 0:
			return 'Classic Forge the Crystal';
		case 1:
			return 'Classic Giant%';
		case 2:
			return 'Fiends%';
		case 3:
			return 'Dark Matter Hunt';
		case 4:
			var characterObjective = objective.a;
			return 'Get ' + $author$project$Objective$charToString(characterObjective);
		case 5:
			var bossObjective = objective.a;
			return 'Defeat ' + $author$project$Objective$bossToString(bossObjective);
		default:
			var questObjective = objective.a;
			return $author$project$Objective$questToString(questObjective);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownToggle = $elm$core$Basics$identity;
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 0:
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						d8: $elm$core$Maybe$Just(size)
					});
			case 1:
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						R: $elm$core$Maybe$Just(coloring)
					});
			case 2:
				return _Utils_update(
					options,
					{bi: true});
			case 3:
				var val = modifier.a;
				return _Utils_update(
					options,
					{bw: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						be: _Utils_ap(options.be, attrs)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {be: _List_Nil, bi: false, R: $elm$core$Maybe$Nothing, bw: false, d8: $elm$core$Maybe$Nothing};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role) {
		case 0:
			return 'primary';
		case 1:
			return 'secondary';
		case 2:
			return 'success';
		case 3:
			return 'info';
		case 4:
			return 'warning';
		case 5:
			return 'danger';
		case 6:
			return 'dark';
		case 7:
			return 'light';
		default:
			return 'link';
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just('sm');
		case 2:
			return $elm$core$Maybe$Just('md');
		case 3:
			return $elm$core$Maybe$Just('lg');
		default:
			return $elm$core$Maybe$Just('xl');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.bi),
						_Utils_Tuple2('disabled', options.bw)
					])),
				$elm$html$Html$Attributes$disabled(options.bw)
			]),
		_Utils_ap(
			function () {
				var _v0 = A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.d8);
				if (!_v0.$) {
					var s = _v0.a;
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.R;
					if (!_v1.$) {
						if (!_v1.a.$) {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-outline-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.be)));
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$Open = 0;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$nextStatus = function (status) {
	switch (status) {
		case 0:
			return 2;
		case 1:
			return 2;
		default:
			return 0;
	}
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight = A2($elm$json$Json$Decode$field, 'offsetHeight', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth = A2($elm$json$Json$Decode$field, 'offsetWidth', $elm$json$Json$Decode$float);
var $elm$json$Json$Decode$map4 = _Json_map4;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft = A2($elm$json$Json$Decode$field, 'offsetLeft', $elm$json$Json$Decode$float);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent = F2(
	function (x, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'offsetParent',
					$elm$json$Json$Decode$null(x)),
					A2($elm$json$Json$Decode$field, 'offsetParent', decoder)
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop = A2($elm$json$Json$Decode$field, 'offsetTop', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft = A2($elm$json$Json$Decode$field, 'scrollLeft', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop = A2($elm$json$Json$Decode$field, 'scrollTop', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position = F2(
	function (x, y) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var x_ = _v0.a;
				var y_ = _v0.b;
				return A2(
					$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent,
					_Utils_Tuple2(x_, y_),
					A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, x_, y_));
			},
			A5(
				$elm$json$Json$Decode$map4,
				F4(
					function (scrollLeft_, scrollTop_, offsetLeft_, offsetTop_) {
						return _Utils_Tuple2((x + offsetLeft_) - scrollLeft_, (y + offsetTop_) - scrollTop_);
					}),
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop));
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (_v0, width, height) {
			var x = _v0.a;
			var y = _v0.b;
			return {dD: height, ab: x, cy: y, en: width};
		}),
	A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, 0, 0),
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth,
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$childNode = function (idx) {
	return $elm$json$Json$Decode$at(
		_List_fromArray(
			[
				'childNodes',
				$elm$core$String$fromInt(idx)
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$nextSibling = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'nextSibling', decoder);
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['className']),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$fail = _Json_fail;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$isToggle = A2(
	$elm$json$Json$Decode$andThen,
	function (_class) {
		return A2($elm$core$String$contains, 'dropdown-toggle', _class) ? $elm$json$Json$Decode$succeed(true) : $elm$json$Json$Decode$succeed(false);
	},
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className);
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toggler = F2(
	function (path, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$andThen,
					function (res) {
						return res ? A2($elm$json$Json$Decode$at, path, decoder) : $elm$json$Json$Decode$fail('');
					},
					A2($elm$json$Json$Decode$at, path, $rundis$elm_bootstrap$Bootstrap$Dropdown$isToggle)),
					A2(
					$elm$json$Json$Decode$andThen,
					function (_v0) {
						return A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
							_Utils_ap(
								path,
								_List_fromArray(
									['parentElement'])),
							decoder);
					},
					A2(
						$elm$json$Json$Decode$at,
						_Utils_ap(
							path,
							_List_fromArray(
								['parentElement'])),
						$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className)),
					$elm$json$Json$Decode$fail('No toggler found')
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$sizeDecoder = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2(
		$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
		_List_fromArray(
			['target']),
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea),
	A2(
		$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
		_List_fromArray(
			['target']),
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$nextSibling(
			A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$childNode, 0, $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea))));
var $rundis$elm_bootstrap$Bootstrap$Dropdown$clickHandler = F2(
	function (toMsg, state) {
		var status = state.O;
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var b = _v0.a;
				var m = _v0.b;
				return $elm$json$Json$Decode$succeed(
					toMsg(
						{
							aN: m,
							O: $rundis$elm_bootstrap$Bootstrap$Dropdown$nextStatus(status),
							cx: b
						}));
			},
			$rundis$elm_bootstrap$Bootstrap$Dropdown$sizeDecoder);
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$togglePrivate = F4(
	function (buttonOptions, children, toggleMsg, state) {
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(buttonOptions),
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-toggle'),
						$elm$html$Html$Attributes$type_('button'),
						A2(
						$elm$html$Html$Events$on,
						'click',
						A2($rundis$elm_bootstrap$Bootstrap$Dropdown$clickHandler, toggleMsg, state))
					])),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toggle = F2(
	function (buttonOptions, children) {
		return A2($rundis$elm_bootstrap$Bootstrap$Dropdown$togglePrivate, buttonOptions, children);
	});
var $author$project$Pages$Top$ToggleObjective = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Top$UnsetRandomObjective = function (a) {
	return {$: 2, a: a};
};
var $author$project$Pages$Top$viewObjective = F3(
	function (objective, completed, randomIndex) {
		var onClickNoPropagate = function (msg) {
			return A2(
				$elm$html$Html$Events$stopPropagationOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2(msg, true)));
		};
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
					$author$project$Pages$Top$ToggleObjective(objective))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('icon state')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Objective$toString(objective))
						])),
					function () {
					var _v0 = _Utils_Tuple2(completed, randomIndex);
					if ((!_v0.a) && (!_v0.b.$)) {
						var index = _v0.b.a;
						return A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('icon delete'),
									onClickNoPropagate(
									$author$project$Pages$Top$UnsetRandomObjective(index))
								]),
							_List_Nil);
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$Pages$Top$viewEditableObjective = F4(
	function (index, randomObjective, completedObjectives, objectiveTypes) {
		var item = function (objective) {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2($author$project$Pages$Top$SetRandomObjective, index, objective))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Objective$toString(objective))
					]));
		};
		var section = F3(
			function (objectiveType, header, objectives) {
				return A2($Gizra$elm_all_set$EverySet$member, objectiveType, objectiveTypes) ? A2(
					$elm$core$List$cons,
					$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
						_List_fromArray(
							[
								$elm$html$Html$text(header)
							])),
					A2($elm$core$List$map, item, objectives)) : _List_Nil;
			});
		if (!randomObjective.$) {
			var objective = randomObjective.a;
			return A3(
				$author$project$Pages$Top$viewObjective,
				objective,
				A2($Gizra$elm_all_set$EverySet$member, objective, completedObjectives),
				$elm$core$Maybe$Just(index));
		} else {
			var dropdown = randomObjective.a;
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('objective unset')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Dropdown$dropdown,
						dropdown,
						{
							eP: _Utils_ap(
								A3(section, 0, 'Character Hunts', $author$project$Objective$characters),
								_Utils_ap(
									A3(section, 1, 'Boss Hunts', $author$project$Objective$bosses),
									A3(section, 2, 'Quests', $author$project$Objective$quests))),
							e5: _List_Nil,
							fl: A2(
								$rundis$elm_bootstrap$Bootstrap$Dropdown$toggle,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('(Set random objective)')
									])),
							fm: $author$project$Pages$Top$DropdownMsg(index)
						})
					]));
		}
	});
var $author$project$Pages$Top$viewObjectives = function (model) {
	var random = $elm$core$Array$toList(
		A2(
			$elm$core$Array$indexedMap,
			F2(
				function (i, o) {
					return A4($author$project$Pages$Top$viewEditableObjective, i, o, model.br, model.K.G);
				}),
			model.cm));
	var numRequired = model.K.at;
	var numCompleted = $Gizra$elm_all_set$EverySet$size(model.br);
	var fixed = $elm$core$Array$toList(
		A2(
			$elm$core$Array$map,
			function (o) {
				return A3(
					$author$project$Pages$Top$viewObjective,
					o,
					A2($Gizra$elm_all_set$EverySet$member, o, model.br),
					$elm$core$Maybe$Nothing);
			},
			model.K.C));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('objectives')
			]),
		_List_fromArray(
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
								'(' + ($elm$core$String$fromInt(numCompleted) + ('/' + ($elm$core$String$fromInt(numRequired) + (' to ' + ($author$project$Flags$rewardToString(model.K.bU) + ')'))))))
							]))
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('objectives')
					]),
				_Utils_ap(fixed, random))
			]));
};
var $author$project$Pages$Top$view = function (model) {
	return {
		eu: _List_fromArray(
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
										$elm$html$Html$Events$onInput($author$project$Pages$Top$UpdateFlags)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(model.by)
									]))
							])),
						$author$project$Pages$Top$viewObjectives(model),
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
								A2($author$project$Pages$Top$viewKeyItems, model.K, model.X)
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
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Locations'),
										$author$project$Pages$Top$viewFilters(model)
									])),
								A2($author$project$Pages$Top$viewLocations, model, 0)
							])),
						A2(
						$author$project$Pages$Top$displayIf,
						(!model.K.bR) || model.K.c4,
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
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Shops')
										])),
									A2($author$project$Pages$Top$viewLocations, model, 1)
								])))
					]))
			]),
		fj: 'FFIV Free Enterprise Tracker'
	};
};
var $author$project$Pages$Top$page = $author$project$Spa$Page$element(
	{eO: $author$project$Pages$Top$init, fg: $author$project$Pages$Top$subscriptions, fn: $author$project$Pages$Top$update, fp: $author$project$Pages$Top$view});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Spa$Url$toQueryDict = function (queryString) {
	var second = A2(
		$elm$core$Basics$composeR,
		$elm$core$List$drop(1),
		$elm$core$List$head);
	var toTuple = function (list) {
		return A2(
			$elm$core$Maybe$map,
			function (first) {
				return _Utils_Tuple2(
					first,
					A2(
						$elm$core$Maybe$withDefault,
						'',
						second(list)));
			},
			$elm$core$List$head(list));
	};
	var decode = A2(
		$elm$core$Basics$composeR,
		$elm$url$Url$percentDecode,
		$elm$core$Maybe$withDefault(''));
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			A2($elm$core$Tuple$mapBoth, decode, decode),
			A2(
				$elm$core$List$filterMap,
				toTuple,
				A2(
					$elm$core$List$map,
					$elm$core$String$split('='),
					A2($elm$core$String$split, '&', queryString)))));
};
var $author$project$Spa$Url$create = F3(
	function (params, key, url) {
		return {
			b: key,
			e6: params,
			da: A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Dict$empty,
				A2($elm$core$Maybe$map, $author$project$Spa$Url$toQueryDict, url.da)),
			d$: url
		};
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Spa$Document$map = F2(
	function (fn, doc) {
		return {
			eu: A2(
				$elm$core$List$map,
				$elm$html$Html$map(fn),
				doc.eu),
			fj: doc.fj
		};
	});
var $author$project$Spa$Generated$Pages$upgrade = F3(
	function (toModel, toMsg, page) {
		var update_ = F2(
			function (msg, model) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(page.fn, msg, model));
			});
		var load_ = F2(
			function (model, shared) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(page.bN, shared, model));
			});
		var init_ = F2(
			function (params, shared) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(
						page.eO,
						shared,
						A3($author$project$Spa$Url$create, params, shared.b, shared.fo)));
			});
		var bundle_ = function (model) {
			return {
				bN: function (_v0) {
					return load_(model);
				},
				cr: function (_v1) {
					return page.cr(model);
				},
				fg: function (_v2) {
					return A2(
						$elm$core$Platform$Sub$map,
						toMsg,
						page.fg(model));
				},
				fp: function (_v3) {
					return A2(
						$author$project$Spa$Document$map,
						toMsg,
						page.fp(model));
				}
			};
		};
		return {bk: bundle_, eO: init_, fn: update_};
	});
var $author$project$Spa$Generated$Pages$pages = {
	bS: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$NotFound__Model, $author$project$Spa$Generated$Pages$NotFound__Msg, $author$project$Pages$NotFound$page),
	cy: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Top__Model, $author$project$Spa$Generated$Pages$Top__Msg, $author$project$Pages$Top$page)
};
var $author$project$Spa$Generated$Pages$init = function (route) {
	if (!route) {
		return $author$project$Spa$Generated$Pages$pages.cy.eO(0);
	} else {
		return $author$project$Spa$Generated$Pages$pages.bS.eO(0);
	}
};
var $author$project$Spa$Generated$Pages$bundle = function (bigModel) {
	if (!bigModel.$) {
		var model = bigModel.a;
		return $author$project$Spa$Generated$Pages$pages.cy.bk(model);
	} else {
		var model = bigModel.a;
		return $author$project$Spa$Generated$Pages$pages.bS.bk(model);
	}
};
var $author$project$Spa$Generated$Pages$save = function (model) {
	return $author$project$Spa$Generated$Pages$bundle(model).cr(0);
};
var $author$project$Main$init = F3(
	function (flags, url, key) {
		var _v0 = A3($author$project$Shared$init, flags, url, key);
		var shared = _v0.a;
		var sharedCmd = _v0.b;
		var _v1 = A2(
			$author$project$Spa$Generated$Pages$init,
			$author$project$Main$fromUrl(url),
			shared);
		var page = _v1.a;
		var pageCmd = _v1.b;
		var savedShare = A2($author$project$Spa$Generated$Pages$save, page, shared);
		return _Utils_Tuple2(
			A2($author$project$Main$Model, savedShare, page),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd)
					])));
	});
var $author$project$Shared$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Spa$Generated$Pages$subscriptions = function (model) {
	return $author$project$Spa$Generated$Pages$bundle(model).fg(0);
};
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Shared,
				$author$project$Shared$subscriptions(model.H)),
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Pages,
				$author$project$Spa$Generated$Pages$subscriptions(model.N))
			]));
};
var $author$project$Spa$Document$toBrowserDocument = function (doc) {
	return {eu: doc.eu, fj: doc.fj};
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Spa$Generated$Pages$load = function (model) {
	return $author$project$Spa$Generated$Pages$bundle(model).bN(0);
};
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.d_;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.dA,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.da,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.dW,
					_Utils_ap(http, url.dE)),
				url.dU)));
};
var $author$project$Shared$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Spa$Generated$Pages$update = F2(
	function (bigMsg, bigModel) {
		var _v0 = _Utils_Tuple2(bigMsg, bigModel);
		_v0$2:
		while (true) {
			if (!_v0.a.$) {
				if (!_v0.b.$) {
					var msg = _v0.a.a;
					var model = _v0.b.a;
					return A2($author$project$Spa$Generated$Pages$pages.cy.fn, msg, model);
				} else {
					break _v0$2;
				}
			} else {
				if (_v0.b.$ === 1) {
					var msg = _v0.a.a;
					var model = _v0.b.a;
					return A2($author$project$Spa$Generated$Pages$pages.bS.fn, msg, model);
				} else {
					break _v0$2;
				}
			}
		}
		return _Utils_Tuple2(bigModel, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				if (!msg.a.$) {
					var url = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.H.b,
							$elm$url$Url$toString(url)));
				} else {
					var href = msg.a.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 1:
				var url = msg.a;
				var original = model.H;
				var shared = _Utils_update(
					original,
					{fo: url});
				var _v1 = A2(
					$author$project$Spa$Generated$Pages$init,
					$author$project$Main$fromUrl(url),
					shared);
				var page = _v1.a;
				var pageCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							N: page,
							H: A2($author$project$Spa$Generated$Pages$save, page, shared)
						}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd));
			case 2:
				var sharedMsg = msg.a;
				var _v2 = A2($author$project$Shared$update, sharedMsg, model.H);
				var shared = _v2.a;
				var sharedCmd = _v2.b;
				var _v3 = A2($author$project$Spa$Generated$Pages$load, model.N, shared);
				var page = _v3.a;
				var pageCmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: page, H: shared}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd)
							])));
			default:
				var pageMsg = msg.a;
				var _v4 = A2($author$project$Spa$Generated$Pages$update, pageMsg, model.N);
				var page = _v4.a;
				var pageCmd = _v4.b;
				var shared = A2($author$project$Spa$Generated$Pages$save, page, model.H);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: page, H: shared}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd));
		}
	});
var $author$project$Shared$view = F2(
	function (_v0, model) {
		var page = _v0.N;
		var toMsg = _v0.fk;
		return {
			eu: _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('layout')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('page')
								]),
							page.eu)
						]))
				]),
			fj: page.fj
		};
	});
var $author$project$Spa$Generated$Pages$view = function (model) {
	return $author$project$Spa$Generated$Pages$bundle(model).fp(0);
};
var $author$project$Main$view = function (model) {
	return A2(
		$author$project$Shared$view,
		{
			N: A2(
				$author$project$Spa$Document$map,
				$author$project$Main$Pages,
				$author$project$Spa$Generated$Pages$view(model.N)),
			fk: $author$project$Main$Shared
		},
		model.H);
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		eO: $author$project$Main$init,
		e2: $author$project$Main$UrlChanged,
		e3: $author$project$Main$LinkClicked,
		fg: $author$project$Main$subscriptions,
		fn: $author$project$Main$update,
		fp: A2($elm$core$Basics$composeR, $author$project$Main$view, $author$project$Spa$Document$toBrowserDocument)
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));