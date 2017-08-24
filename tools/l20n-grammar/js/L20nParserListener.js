// Generated from L20nParser.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by L20nParser.
function L20nParserListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

L20nParserListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
L20nParserListener.prototype.constructor = L20nParserListener;

// Enter a parse tree produced by L20nParser#document.
L20nParserListener.prototype.enterDocument = function(ctx) {
};

// Exit a parse tree produced by L20nParser#document.
L20nParserListener.prototype.exitDocument = function(ctx) {
};


// Enter a parse tree produced by L20nParser#entity.
L20nParserListener.prototype.enterEntity = function(ctx) {
};

// Exit a parse tree produced by L20nParser#entity.
L20nParserListener.prototype.exitEntity = function(ctx) {
};


// Enter a parse tree produced by L20nParser#entityName.
L20nParserListener.prototype.enterEntityName = function(ctx) {
};

// Exit a parse tree produced by L20nParser#entityName.
L20nParserListener.prototype.exitEntityName = function(ctx) {
};


// Enter a parse tree produced by L20nParser#entityValue.
L20nParserListener.prototype.enterEntityValue = function(ctx) {
};

// Exit a parse tree produced by L20nParser#entityValue.
L20nParserListener.prototype.exitEntityValue = function(ctx) {
};


// Enter a parse tree produced by L20nParser#entityProperty.
L20nParserListener.prototype.enterEntityProperty = function(ctx) {
};

// Exit a parse tree produced by L20nParser#entityProperty.
L20nParserListener.prototype.exitEntityProperty = function(ctx) {
};


// Enter a parse tree produced by L20nParser#misc.
L20nParserListener.prototype.enterMisc = function(ctx) {
};

// Exit a parse tree produced by L20nParser#misc.
L20nParserListener.prototype.exitMisc = function(ctx) {
};



exports.L20nParserListener = L20nParserListener;