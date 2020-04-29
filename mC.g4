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

value: expression | String;

// operators by precedence 
expression:
	// function call
	Variable ParRoundBeg arguments ParRoundEnd
	// ++ -- - + ! ~
	| ((OpInc | OpDec) Variable)
	| ((OpPlus | OpMinus | OpBitNeg | OpNeg) expression)
	//    * / %
	| expression (OpMul | OpDiv | OpMod) expression
	//    + -
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
	// assigns
	| Variable opAssingAny expression
	| Boolean
	| Number
	| String
	| Char
	| Variable;

arguments:(expression (Comma expression)*)?;

opAssingAny:
	OpAssign
	| OpAssignMul
	| OpAssignDiv
	| OpAssignMod
	| OpAssignPlus
	| OpAssignMinus
	| OpAssignShiftLeft
	| OpAssignShiftRight
	| OpAssignAnd
	| OpAssignOr
	| OpAssignXor;

Boolean: (True | False);

/*
 * Lexer
 */

String: '"' ('\\"' | .)*? '"';
Char: '\'' ('\\' . | .) '\'';

// special symbols
Semicolon: ';';
Colon: ':';
Comma: ',';

CommentMlBeg: '\\*';
CommentMlEnd: '*\\';
CommentSl: '//';

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
OpAssignMul: '*=';
OpAssignDiv: '/=';
OpAssignMod: '%=';
OpAssignPlus: '+=';
OpAssignMinus: '-=';
OpAssignShiftLeft: '<<=';
OpAssignShiftRight: '>>=';
OpAssignAnd: '&=';
OpAssignOr: '|=';
OpAssignXor: '^=';

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
Int: 'int' | 'INT';
True: 'true' | 'TRUE';
False: 'false' | 'FALSE';

Ws: [ ] -> skip;
Nl: [\n\r] -> skip;

fragment NumberPrefBin: '0' ('b' | 'B');
fragment NumberPrefHex: '0' ('x' | 'X');

fragment Digits: [0-9]+;
fragment AZ: [a-zA-Z];

Variable: AZ (AZ | Digits)*;
Number: (NumberPrefBin | NumberPrefHex)? Digits+;
