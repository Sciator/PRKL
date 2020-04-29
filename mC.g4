grammar mC;

start: 
(statementMultiple | statementSingle) EOF;

statement: statementSingle | statementMultiple;
statementMultiple: ParCurBeg statementSingle* ParCurEnd;
statementSingle: exAssign Semicolon | stFunctionCall | stIf | stWhile | stDoWhile;

stFunctionCall:
	Variable ParRoundBeg (value (Comma value)*)? ParRoundEnd Semicolon;

stIf: If ParRoundBeg expression ParRoundEnd statement (Else statement)?;
stWhile: While ParRoundBeg expression ParRoundEnd statement;
stDoWhile: Do statement While ParRoundBeg expression ParRoundEnd Semicolon;

value: expression | String;

expression: exAssign | exBinOr
	;

// operators by precedence ++ -- - + ! ~
exUnaryIncDec: 
Variable
	| Number
	| Boolean
((OpInc | OpDec) Variable);
exUnary:
	exUnaryIncDec
	| ((OpPlus | OpMinus | OpBitNeg | OpNeg) exBinMulDivMod);

//    * / %
exBinMulDivMod:
	exUnary
	| exBinMulDivMod (OpMul | OpDiv | OpMod) exUnary;

//    + -
exBinPlusMinus:
	exBinMulDivMod
	| exBinPlusMinus (OpPlus | OpMinus) exBinMulDivMod;

// << >> 
exBinShift:
	exBinPlusMinus
	| exBinShift (OpBitShiftLeft | OpBitShiftRight) exBinPlusMinus;

// == != 
exBinIsEqNotEq:
	exBinShift
	| exBinIsEqNotEq (OpEq | OpEqNot) exBinShift;

// < > <= >= 
exBinLQ:
	exBinIsEqNotEq
	|  exBinIsEqNotEq (OpGt | OpGte | OpLt | OpLte) exBinLQ ;

// & 
exBinBitAnd: exBinLQ | exBinBitAnd (OpBitAnd) exBinLQ;

// ^ 
exBinBitXor: exBinBitAnd | exBinBitXor (OpBitXor) exBinBitAnd;

// | 
exBinBitOr: exBinBitXor | exBinBitOr (OpBitOr) exBinBitXor;

// && 
exBinAnd: exBinBitOr | 
exBinAnd (OpAnd) exBinBitOr;

// || 
exBinOr: exBinAnd | exBinOr (OpOr) exBinAnd;

// assign
exAssign: Variable opAssingAny exBinOr;

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

/*
 * Lexer
 */

String: '"' ('\\"' | .)*? '"';

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
fragment Char: [a-zA-Z];

Variable: Char (Char | Digits)*;
Number: (NumberPrefBin | NumberPrefHex)? Digits+;
Boolean: True | False;
