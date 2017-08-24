// Generated from L20nLexer.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u000bU\b\u0001\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003",
    "\u0004\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007",
    "\t\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0003\u0002\u0003\u0002",
    "\u0003\u0002\u0003\u0002\u0007\u0002\u001b\n\u0002\f\u0002\u000e\u0002",
    "\u001e\u000b\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0005\u0006\u0005,\n\u0005\r\u0005\u000e\u0005-\u0003\u0006",
    "\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0007\u00077\n\u0007\f\u0007\u000e\u0007:\u000b\u0007\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\b\u0003\b\u0007",
    "\bD\n\b\f\b\u000e\bG\u000b\b\u0003\b\u0003\b\u0003\t\u0006\tL\n\t\r",
    "\t\u000e\tM\u0003\t\u0003\t\u0003\n\u0003\n\u0003\n\u0003\n\u0004\u001c",
    "8\u0002\u000b\u0004\u0003\u0006\u0004\b\u0005\n\u0006\f\u0007\u000e",
    "\b\u0010\t\u0012\n\u0014\u000b\u0004\u0002\u0003\u0006\u0004\u0002\u000b",
    "\f\u000f\u000f\u0005\u00022;C\\c|\u0003\u0002$$\u0005\u0002\u000b\f",
    "\u000f\u000f\"\"\u0002Y\u0002\u0004\u0003\u0002\u0002\u0002\u0002\u0006",
    "\u0003\u0002\u0002\u0002\u0002\b\u0003\u0002\u0002\u0002\u0003\n\u0003",
    "\u0002\u0002\u0002\u0003\f\u0003\u0002\u0002\u0002\u0003\u000e\u0003",
    "\u0002\u0002\u0002\u0003\u0010\u0003\u0002\u0002\u0002\u0003\u0012\u0003",
    "\u0002\u0002\u0002\u0003\u0014\u0003\u0002\u0002\u0002\u0004\u0016\u0003",
    "\u0002\u0002\u0002\u0006\"\u0003\u0002\u0002\u0002\b&\u0003\u0002\u0002",
    "\u0002\n+\u0003\u0002\u0002\u0002\f/\u0003\u0002\u0002\u0002\u000e1",
    "\u0003\u0002\u0002\u0002\u0010?\u0003\u0002\u0002\u0002\u0012K\u0003",
    "\u0002\u0002\u0002\u0014Q\u0003\u0002\u0002\u0002\u0016\u0017\u0007",
    "1\u0002\u0002\u0017\u0018\u0007,\u0002\u0002\u0018\u001c\u0003\u0002",
    "\u0002\u0002\u0019\u001b\u000b\u0002\u0002\u0002\u001a\u0019\u0003\u0002",
    "\u0002\u0002\u001b\u001e\u0003\u0002\u0002\u0002\u001c\u001d\u0003\u0002",
    "\u0002\u0002\u001c\u001a\u0003\u0002\u0002\u0002\u001d\u001f\u0003\u0002",
    "\u0002\u0002\u001e\u001c\u0003\u0002\u0002\u0002\u001f \u0007,\u0002",
    "\u0002 !\u00071\u0002\u0002!\u0005\u0003\u0002\u0002\u0002\"#\u0007",
    ">\u0002\u0002#$\u0003\u0002\u0002\u0002$%\b\u0003\u0002\u0002%\u0007",
    "\u0003\u0002\u0002\u0002&\'\t\u0002\u0002\u0002\'(\u0003\u0002\u0002",
    "\u0002()\b\u0004\u0003\u0002)\t\u0003\u0002\u0002\u0002*,\t\u0003\u0002",
    "\u0002+*\u0003\u0002\u0002\u0002,-\u0003\u0002\u0002\u0002-+\u0003\u0002",
    "\u0002\u0002-.\u0003\u0002\u0002\u0002.\u000b\u0003\u0002\u0002\u0002",
    "/0\u0007<\u0002\u00020\r\u0003\u0002\u0002\u000212\u0007$\u0002\u0002",
    "23\u0007$\u0002\u000234\u0007$\u0002\u000248\u0003\u0002\u0002\u0002",
    "57\u000b\u0002\u0002\u000265\u0003\u0002\u0002\u00027:\u0003\u0002\u0002",
    "\u000289\u0003\u0002\u0002\u000286\u0003\u0002\u0002\u00029;\u0003\u0002",
    "\u0002\u0002:8\u0003\u0002\u0002\u0002;<\u0007$\u0002\u0002<=\u0007",
    "$\u0002\u0002=>\u0007$\u0002\u0002>\u000f\u0003\u0002\u0002\u0002?E",
    "\u0007$\u0002\u0002@A\u0007^\u0002\u0002AD\u0007$\u0002\u0002BD\n\u0004",
    "\u0002\u0002C@\u0003\u0002\u0002\u0002CB\u0003\u0002\u0002\u0002DG\u0003",
    "\u0002\u0002\u0002EC\u0003\u0002\u0002\u0002EF\u0003\u0002\u0002\u0002",
    "FH\u0003\u0002\u0002\u0002GE\u0003\u0002\u0002\u0002HI\u0007$\u0002",
    "\u0002I\u0011\u0003\u0002\u0002\u0002JL\t\u0005\u0002\u0002KJ\u0003",
    "\u0002\u0002\u0002LM\u0003\u0002\u0002\u0002MK\u0003\u0002\u0002\u0002",
    "MN\u0003\u0002\u0002\u0002NO\u0003\u0002\u0002\u0002OP\b\t\u0003\u0002",
    "P\u0013\u0003\u0002\u0002\u0002QR\u0007@\u0002\u0002RS\u0003\u0002\u0002",
    "\u0002ST\b\n\u0004\u0002T\u0015\u0003\u0002\u0002\u0002\n\u0002\u0003",
    "\u001c-8CEM\u0005\u0007\u0003\u0002\b\u0002\u0002\u0006\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function L20nLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

L20nLexer.prototype = Object.create(antlr4.Lexer.prototype);
L20nLexer.prototype.constructor = L20nLexer;

L20nLexer.EOF = antlr4.Token.EOF;
L20nLexer.Comment = 1;
L20nLexer.Open = 2;
L20nLexer.Ws = 3;
L20nLexer.Identifier = 4;
L20nLexer.Colon = 5;
L20nLexer.MultiString = 6;
L20nLexer.String = 7;
L20nLexer.Space = 8;
L20nLexer.Close = 9;

L20nLexer.Inside = 1;

L20nLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

L20nLexer.prototype.modeNames = [ "DEFAULT_MODE", "Inside" ];

L20nLexer.prototype.literalNames = [ null, null, "'<'", null, null, "':'", 
                                     null, null, null, "'>'" ];

L20nLexer.prototype.symbolicNames = [ null, "Comment", "Open", "Ws", "Identifier", 
                                      "Colon", "MultiString", "String", 
                                      "Space", "Close" ];

L20nLexer.prototype.ruleNames = [ "Comment", "Open", "Ws", "Identifier", 
                                  "Colon", "MultiString", "String", "Space", 
                                  "Close" ];

L20nLexer.prototype.grammarFileName = "L20nLexer.g4";



exports.L20nLexer = L20nLexer;

