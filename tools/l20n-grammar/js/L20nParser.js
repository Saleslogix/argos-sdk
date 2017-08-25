// Generated from L20nParser.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');
var L20nParserListener = require('./L20nParserListener').L20nParserListener;
var grammarFileName = "L20nParser.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u000b<\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0003",
    "\u0002\u0007\u0002\u0010\n\u0002\f\u0002\u000e\u0002\u0013\u000b\u0002",
    "\u0003\u0002\u0007\u0002\u0016\n\u0002\f\u0002\u000e\u0002\u0019\u000b",
    "\u0002\u0003\u0002\u0007\u0002\u001c\n\u0002\f\u0002\u000e\u0002\u001f",
    "\u000b\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0006\u0003*\n\u0003",
    "\r\u0003\u000e\u0003+\u0003\u0003\u0003\u0003\u0005\u00030\n\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0002\u0002\b",
    "\u0002\u0004\u0006\b\n\f\u0002\u0003\u0003\u0002\b\t\u0002:\u0002\u0011",
    "\u0003\u0002\u0002\u0002\u0004/\u0003\u0002\u0002\u0002\u00061\u0003",
    "\u0002\u0002\u0002\b3\u0003\u0002\u0002\u0002\n5\u0003\u0002\u0002\u0002",
    "\f9\u0003\u0002\u0002\u0002\u000e\u0010\u0005\f\u0007\u0002\u000f\u000e",
    "\u0003\u0002\u0002\u0002\u0010\u0013\u0003\u0002\u0002\u0002\u0011\u000f",
    "\u0003\u0002\u0002\u0002\u0011\u0012\u0003\u0002\u0002\u0002\u0012\u0017",
    "\u0003\u0002\u0002\u0002\u0013\u0011\u0003\u0002\u0002\u0002\u0014\u0016",
    "\u0005\u0004\u0003\u0002\u0015\u0014\u0003\u0002\u0002\u0002\u0016\u0019",
    "\u0003\u0002\u0002\u0002\u0017\u0015\u0003\u0002\u0002\u0002\u0017\u0018",
    "\u0003\u0002\u0002\u0002\u0018\u001d\u0003\u0002\u0002\u0002\u0019\u0017",
    "\u0003\u0002\u0002\u0002\u001a\u001c\u0005\f\u0007\u0002\u001b\u001a",
    "\u0003\u0002\u0002\u0002\u001c\u001f\u0003\u0002\u0002\u0002\u001d\u001b",
    "\u0003\u0002\u0002\u0002\u001d\u001e\u0003\u0002\u0002\u0002\u001e\u0003",
    "\u0003\u0002\u0002\u0002\u001f\u001d\u0003\u0002\u0002\u0002 !\u0007",
    "\u0004\u0002\u0002!\"\u0005\u0006\u0004\u0002\"#\u0005\b\u0005\u0002",
    "#$\u0007\u000b\u0002\u0002$0\u0003\u0002\u0002\u0002%&\u0007\u0004\u0002",
    "\u0002&\'\u0005\u0006\u0004\u0002\')\u0005\b\u0005\u0002(*\u0005\n\u0006",
    "\u0002)(\u0003\u0002\u0002\u0002*+\u0003\u0002\u0002\u0002+)\u0003\u0002",
    "\u0002\u0002+,\u0003\u0002\u0002\u0002,-\u0003\u0002\u0002\u0002-.\u0007",
    "\u000b\u0002\u0002.0\u0003\u0002\u0002\u0002/ \u0003\u0002\u0002\u0002",
    "/%\u0003\u0002\u0002\u00020\u0005\u0003\u0002\u0002\u000212\u0007\u0006",
    "\u0002\u00022\u0007\u0003\u0002\u0002\u000234\t\u0002\u0002\u00024\t",
    "\u0003\u0002\u0002\u000256\u0007\u0006\u0002\u000267\u0007\u0007\u0002",
    "\u000278\u0007\t\u0002\u00028\u000b\u0003\u0002\u0002\u00029:\u0007",
    "\u0003\u0002\u0002:\r\u0003\u0002\u0002\u0002\u0007\u0011\u0017\u001d",
    "+/"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, "'<'", null, null, "':'", null, null, null, 
                     "'>'" ];

var symbolicNames = [ null, "Comment", "Open", "Ws", "Identifier", "Colon", 
                      "MultiString", "String", "Space", "Close" ];

var ruleNames =  [ "document", "entity", "entityName", "entityValue", "entityProperty", 
                   "misc" ];

function L20nParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

L20nParser.prototype = Object.create(antlr4.Parser.prototype);
L20nParser.prototype.constructor = L20nParser;

Object.defineProperty(L20nParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

L20nParser.EOF = antlr4.Token.EOF;
L20nParser.Comment = 1;
L20nParser.Open = 2;
L20nParser.Ws = 3;
L20nParser.Identifier = 4;
L20nParser.Colon = 5;
L20nParser.MultiString = 6;
L20nParser.String = 7;
L20nParser.Space = 8;
L20nParser.Close = 9;

L20nParser.RULE_document = 0;
L20nParser.RULE_entity = 1;
L20nParser.RULE_entityName = 2;
L20nParser.RULE_entityValue = 3;
L20nParser.RULE_entityProperty = 4;
L20nParser.RULE_misc = 5;

function DocumentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_document;
    return this;
}

DocumentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DocumentContext.prototype.constructor = DocumentContext;

DocumentContext.prototype.misc = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(MiscContext);
    } else {
        return this.getTypedRuleContext(MiscContext,i);
    }
};

DocumentContext.prototype.entity = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(EntityContext);
    } else {
        return this.getTypedRuleContext(EntityContext,i);
    }
};

DocumentContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterDocument(this);
	}
};

DocumentContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitDocument(this);
	}
};




L20nParser.DocumentContext = DocumentContext;

L20nParser.prototype.document = function() {

    var localctx = new DocumentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, L20nParser.RULE_document);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 15;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 12;
                this.misc(); 
            }
            this.state = 17;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 21;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===L20nParser.Open) {
            this.state = 18;
            this.entity();
            this.state = 23;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 27;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===L20nParser.Comment) {
            this.state = 24;
            this.misc();
            this.state = 29;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EntityContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_entity;
    return this;
}

EntityContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityContext.prototype.constructor = EntityContext;

EntityContext.prototype.entityName = function() {
    return this.getTypedRuleContext(EntityNameContext,0);
};

EntityContext.prototype.entityValue = function() {
    return this.getTypedRuleContext(EntityValueContext,0);
};

EntityContext.prototype.entityProperty = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(EntityPropertyContext);
    } else {
        return this.getTypedRuleContext(EntityPropertyContext,i);
    }
};

EntityContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterEntity(this);
	}
};

EntityContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitEntity(this);
	}
};




L20nParser.EntityContext = EntityContext;

L20nParser.prototype.entity = function() {

    var localctx = new EntityContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, L20nParser.RULE_entity);
    var _la = 0; // Token type
    try {
        this.state = 45;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 30;
            this.match(L20nParser.Open);
            this.state = 31;
            this.entityName();
            this.state = 32;
            this.entityValue();
            this.state = 33;
            this.match(L20nParser.Close);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 35;
            this.match(L20nParser.Open);
            this.state = 36;
            this.entityName();
            this.state = 37;
            this.entityValue();
            this.state = 39; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 38;
                this.entityProperty();
                this.state = 41; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===L20nParser.Identifier);
            this.state = 43;
            this.match(L20nParser.Close);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EntityNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_entityName;
    return this;
}

EntityNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityNameContext.prototype.constructor = EntityNameContext;

EntityNameContext.prototype.Identifier = function() {
    return this.getToken(L20nParser.Identifier, 0);
};

EntityNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterEntityName(this);
	}
};

EntityNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitEntityName(this);
	}
};




L20nParser.EntityNameContext = EntityNameContext;

L20nParser.prototype.entityName = function() {

    var localctx = new EntityNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, L20nParser.RULE_entityName);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 47;
        this.match(L20nParser.Identifier);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EntityValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_entityValue;
    return this;
}

EntityValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityValueContext.prototype.constructor = EntityValueContext;

EntityValueContext.prototype.String = function() {
    return this.getToken(L20nParser.String, 0);
};

EntityValueContext.prototype.MultiString = function() {
    return this.getToken(L20nParser.MultiString, 0);
};

EntityValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterEntityValue(this);
	}
};

EntityValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitEntityValue(this);
	}
};




L20nParser.EntityValueContext = EntityValueContext;

L20nParser.prototype.entityValue = function() {

    var localctx = new EntityValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, L20nParser.RULE_entityValue);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 49;
        _la = this._input.LA(1);
        if(!(_la===L20nParser.MultiString || _la===L20nParser.String)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EntityPropertyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_entityProperty;
    return this;
}

EntityPropertyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityPropertyContext.prototype.constructor = EntityPropertyContext;

EntityPropertyContext.prototype.Identifier = function() {
    return this.getToken(L20nParser.Identifier, 0);
};

EntityPropertyContext.prototype.String = function() {
    return this.getToken(L20nParser.String, 0);
};

EntityPropertyContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterEntityProperty(this);
	}
};

EntityPropertyContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitEntityProperty(this);
	}
};




L20nParser.EntityPropertyContext = EntityPropertyContext;

L20nParser.prototype.entityProperty = function() {

    var localctx = new EntityPropertyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, L20nParser.RULE_entityProperty);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 51;
        this.match(L20nParser.Identifier);
        this.state = 52;
        this.match(L20nParser.Colon);
        this.state = 53;
        this.match(L20nParser.String);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function MiscContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = L20nParser.RULE_misc;
    return this;
}

MiscContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MiscContext.prototype.constructor = MiscContext;

MiscContext.prototype.Comment = function() {
    return this.getToken(L20nParser.Comment, 0);
};

MiscContext.prototype.enterRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.enterMisc(this);
	}
};

MiscContext.prototype.exitRule = function(listener) {
    if(listener instanceof L20nParserListener ) {
        listener.exitMisc(this);
	}
};




L20nParser.MiscContext = MiscContext;

L20nParser.prototype.misc = function() {

    var localctx = new MiscContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, L20nParser.RULE_misc);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 55;
        this.match(L20nParser.Comment);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.L20nParser = L20nParser;
