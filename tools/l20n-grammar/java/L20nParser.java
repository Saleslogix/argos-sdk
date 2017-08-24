// Generated from L20nParser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class L20nParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Comment=1, Open=2, Ws=3, Identifier=4, Colon=5, MultiString=6, String=7, 
		Space=8, Close=9;
	public static final int
		RULE_document = 0, RULE_entity = 1, RULE_entityName = 2, RULE_entityValue = 3, 
		RULE_entityProperty = 4, RULE_misc = 5;
	public static final String[] ruleNames = {
		"document", "entity", "entityName", "entityValue", "entityProperty", "misc"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, "'<'", null, null, "':'", null, null, null, "'>'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "Comment", "Open", "Ws", "Identifier", "Colon", "MultiString", "String", 
		"Space", "Close"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "L20nParser.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public L20nParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}
	public static class DocumentContext extends ParserRuleContext {
		public List<MiscContext> misc() {
			return getRuleContexts(MiscContext.class);
		}
		public MiscContext misc(int i) {
			return getRuleContext(MiscContext.class,i);
		}
		public List<EntityContext> entity() {
			return getRuleContexts(EntityContext.class);
		}
		public EntityContext entity(int i) {
			return getRuleContext(EntityContext.class,i);
		}
		public DocumentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_document; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterDocument(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitDocument(this);
		}
	}

	public final DocumentContext document() throws RecognitionException {
		DocumentContext _localctx = new DocumentContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_document);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(15);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(12);
					misc();
					}
					} 
				}
				setState(17);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(21);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Open) {
				{
				{
				setState(18);
				entity();
				}
				}
				setState(23);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(27);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Comment) {
				{
				{
				setState(24);
				misc();
				}
				}
				setState(29);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityContext extends ParserRuleContext {
		public EntityNameContext entityName() {
			return getRuleContext(EntityNameContext.class,0);
		}
		public EntityValueContext entityValue() {
			return getRuleContext(EntityValueContext.class,0);
		}
		public List<EntityPropertyContext> entityProperty() {
			return getRuleContexts(EntityPropertyContext.class);
		}
		public EntityPropertyContext entityProperty(int i) {
			return getRuleContext(EntityPropertyContext.class,i);
		}
		public EntityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entity; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterEntity(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitEntity(this);
		}
	}

	public final EntityContext entity() throws RecognitionException {
		EntityContext _localctx = new EntityContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_entity);
		int _la;
		try {
			setState(45);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(30);
				match(Open);
				setState(31);
				entityName();
				setState(32);
				entityValue();
				setState(33);
				match(Close);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(35);
				match(Open);
				setState(36);
				entityName();
				setState(37);
				entityValue();
				setState(39); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(38);
					entityProperty();
					}
					}
					setState(41); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==Identifier );
				setState(43);
				match(Close);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityNameContext extends ParserRuleContext {
		public TerminalNode Identifier() { return getToken(L20nParser.Identifier, 0); }
		public EntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityName; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterEntityName(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitEntityName(this);
		}
	}

	public final EntityNameContext entityName() throws RecognitionException {
		EntityNameContext _localctx = new EntityNameContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_entityName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(47);
			match(Identifier);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityValueContext extends ParserRuleContext {
		public TerminalNode String() { return getToken(L20nParser.String, 0); }
		public TerminalNode MultiString() { return getToken(L20nParser.MultiString, 0); }
		public EntityValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityValue; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterEntityValue(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitEntityValue(this);
		}
	}

	public final EntityValueContext entityValue() throws RecognitionException {
		EntityValueContext _localctx = new EntityValueContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_entityValue);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(49);
			_la = _input.LA(1);
			if ( !(_la==MultiString || _la==String) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityPropertyContext extends ParserRuleContext {
		public TerminalNode Identifier() { return getToken(L20nParser.Identifier, 0); }
		public TerminalNode String() { return getToken(L20nParser.String, 0); }
		public EntityPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityProperty; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterEntityProperty(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitEntityProperty(this);
		}
	}

	public final EntityPropertyContext entityProperty() throws RecognitionException {
		EntityPropertyContext _localctx = new EntityPropertyContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_entityProperty);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(51);
			match(Identifier);
			setState(52);
			match(Colon);
			setState(53);
			match(String);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MiscContext extends ParserRuleContext {
		public TerminalNode Comment() { return getToken(L20nParser.Comment, 0); }
		public MiscContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_misc; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).enterMisc(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof L20nParserListener ) ((L20nParserListener)listener).exitMisc(this);
		}
	}

	public final MiscContext misc() throws RecognitionException {
		MiscContext _localctx = new MiscContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_misc);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(55);
			match(Comment);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\13<\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\3\2\7\2\20\n\2\f\2\16\2\23\13\2\3\2"+
		"\7\2\26\n\2\f\2\16\2\31\13\2\3\2\7\2\34\n\2\f\2\16\2\37\13\2\3\3\3\3\3"+
		"\3\3\3\3\3\3\3\3\3\3\3\3\3\6\3*\n\3\r\3\16\3+\3\3\3\3\5\3\60\n\3\3\4\3"+
		"\4\3\5\3\5\3\6\3\6\3\6\3\6\3\7\3\7\3\7\2\2\b\2\4\6\b\n\f\2\3\3\2\b\t\2"+
		":\2\21\3\2\2\2\4/\3\2\2\2\6\61\3\2\2\2\b\63\3\2\2\2\n\65\3\2\2\2\f9\3"+
		"\2\2\2\16\20\5\f\7\2\17\16\3\2\2\2\20\23\3\2\2\2\21\17\3\2\2\2\21\22\3"+
		"\2\2\2\22\27\3\2\2\2\23\21\3\2\2\2\24\26\5\4\3\2\25\24\3\2\2\2\26\31\3"+
		"\2\2\2\27\25\3\2\2\2\27\30\3\2\2\2\30\35\3\2\2\2\31\27\3\2\2\2\32\34\5"+
		"\f\7\2\33\32\3\2\2\2\34\37\3\2\2\2\35\33\3\2\2\2\35\36\3\2\2\2\36\3\3"+
		"\2\2\2\37\35\3\2\2\2 !\7\4\2\2!\"\5\6\4\2\"#\5\b\5\2#$\7\13\2\2$\60\3"+
		"\2\2\2%&\7\4\2\2&\'\5\6\4\2\')\5\b\5\2(*\5\n\6\2)(\3\2\2\2*+\3\2\2\2+"+
		")\3\2\2\2+,\3\2\2\2,-\3\2\2\2-.\7\13\2\2.\60\3\2\2\2/ \3\2\2\2/%\3\2\2"+
		"\2\60\5\3\2\2\2\61\62\7\6\2\2\62\7\3\2\2\2\63\64\t\2\2\2\64\t\3\2\2\2"+
		"\65\66\7\6\2\2\66\67\7\7\2\2\678\7\t\2\28\13\3\2\2\29:\7\3\2\2:\r\3\2"+
		"\2\2\7\21\27\35+/";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}