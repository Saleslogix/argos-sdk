parser grammar L20nParser;

options { tokenVocab=L20nLexer; }

document
  : misc* entity* misc*;

entity
  : '<' entityName entityValue '>'
  | '<' entityName entityValue entityProperty+ '>'
  ;

entityName
  : Identifier
  ;

entityValue
  : String
  | MultiString
  ;

entityProperty
  : Identifier ':' String
  ;

misc
  : Comment;
