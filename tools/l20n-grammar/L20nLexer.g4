lexer grammar L20nLexer;

Comment
  : '/*' .*? '*/'
  ;

Open
  : '<' -> pushMode(Inside)
  ;

Ws
  : ('\r' | '\n' | '\t') -> skip
  ;

mode Inside;

Identifier
    : [a-zA-Z0-9_]+
    ;

Colon
  : ':'
  ;

MultiString
  : '"""' .*? '"""'
  ;

String
  : '"' ('\\"' | ~["])* '"'
  ;

Space
  : [ \t\n\r]+ -> skip
  ;

Close
  : '>' -> popMode
  ;
