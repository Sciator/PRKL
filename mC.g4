grammar mC;

start: statement* EOF;

statement:
	ParCurBeg statement* ParCurEnd
	| expression Semicolon
	| stIf
	| stWhile
	| stDoWhile
	| stFor;

stIf:
	If ParRoundBeg expression ParRoundEnd statement (
		Else statement
	)?;
stWhile: While ParRoundBeg expression ParRoundEnd statement;
stDoWhile:
	Do statement While ParRoundBeg expression ParRoundEnd Semicolon;
stFor:
	For ParRoundBeg expression? Semicolon expression? Semicolon expression? ParRoundEnd statement;

// operators by precedence 
expression:
	fncCall
	| ParRoundBeg expression ParRoundEnd
	// ++ -- 
	| ((OpInc | OpDec) Variable)
	// - + ! ~
	| ((OpPlus | OpMinus | OpBitNeg | OpNeg) expression)
	// * / %
	| expression (OpMul | OpDiv | OpMod) expression
	// + -
	| expression (OpPlus | OpMinus) expression
	// << >> 
	| expression (OpBitShiftLeft | OpBitShiftRight) expression
	// == != 
	| expression (OpEq | OpEqNot) expression
	// < > <= >= 
	| expression (OpGt | OpGte | OpLt | OpLte) expression
	// & 
	| expression (OpBitAnd) expression
	// ^ 
	| expression (OpBitXor) expression
	// | 
	| expression (OpBitOr) expression
	// && 
	| expression (OpAnd) expression
	// || 
	| expression (OpOr) expression
	| assign
	| Boolean
	| number
	| String
	| Char
	| Variable;

arguments: (expression (Comma expression)*)?;

fncCall: Variable ParRoundBeg arguments ParRoundEnd;

assign:
	Variable OpAssign expression
	| Variable opAssignSpecial expression;

opAssignSpecial:
	(
		OpMul
		| OpDiv
		| OpMod
		| OpPlus
		| OpMinus
		| OpBitShiftLeft
		| OpBitShiftRight
		| OpAnd
		| OpOr
		| OpBitXor
	) OpAssign;

Boolean: (True | False);
number: (NumberPrefBin | NumberPrefHex)? Digits+;

/*
 * Lexer
 */

Ws: [ ] -> skip;
Nl: [\n\r] -> skip;

CommentMlBeg: '\\*';
CommentMlEnd: '*\\';
CommentSl: '//';

Comment: (CommentMlBeg .*? CommentMlEnd | CommentSl .*? Nl) -> skip;

String: StringDelimiter CharSequence StringDelimiter;
Char: '\'' ('\\' . | .) '\'';

// special symbols
Semicolon: ';';
Colon: ':';
Comma: ',';

// - operators
OpInc: '++';
OpDec: '--';
OpNeg: '!';

OpPlus: '+';
OpMinus: '-';
OpMul: '*';
OpDiv: '/';
OpMod: '%';

OpEq: '==';
OpEqNot: '!=';
OpLt: '<';
OpGt: '>';
OpLte: '<=';
OpGte: '>=';

OpBitShiftLeft: '<<';
OpBitShiftRight: '>>';
OpBitNeg: '~';
OpBitAnd: '&';
OpBitXor: '^';
OpBitOr: '|';

OpAnd: '&&' | 'and' | 'AND';
// todo: priorita ?
OpOr: '||' | 'or' | 'OR';

OpAssign: '=';

// - parenthesis
ParCurBeg: '{';
ParCurEnd: '}';
ParRoundBeg: '(';
ParRoundEnd: ')';
ParSquareBeg: '[';
ParSquareEnd: ']';

// keywords
If: 'if' | 'IF';
Else: 'else' | 'ELSE';
For: 'for' | 'FOR';
While: 'while' | 'WHILE';
Do: 'do' | 'DO';
True: 'true' | 'TRUE';
False: 'false' | 'FALSE';

NumberPrefBin: '0' ('b' | 'B');
NumberPrefHex: '0' ('x' | 'X');

Digits: [0-9]+;


Variable: AZ (AZ | Digits)*;

fragment StringDelimiter: '"';
fragment AZ: [a-zA-Z];
fragment CharSequence: ('\\"' | ~["\r\n])+?;
