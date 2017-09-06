// Generated from L20nLexer.g4 by ANTLR 4.7
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class L20nLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Comment=1, Open=2, Ws=3, Identifier=4, Colon=5, MultiString=6, String=7, 
		Space=8, Close=9;
	public static final int
		Inside=1;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "Inside"
	};

	public static final String[] ruleNames = {
		"Comment", "Open", "Ws", "Identifier", "Colon", "MultiString", "String", 
		"Space", "Close"
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


	public L20nLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "L20nLexer.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\13U\b\1\b\1\4\2\t"+
		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\3\2"+
		"\3\2\3\2\3\2\7\2\33\n\2\f\2\16\2\36\13\2\3\2\3\2\3\2\3\3\3\3\3\3\3\3\3"+
		"\4\3\4\3\4\3\4\3\5\6\5,\n\5\r\5\16\5-\3\6\3\6\3\7\3\7\3\7\3\7\3\7\7\7"+
		"\67\n\7\f\7\16\7:\13\7\3\7\3\7\3\7\3\7\3\b\3\b\3\b\3\b\7\bD\n\b\f\b\16"+
		"\bG\13\b\3\b\3\b\3\t\6\tL\n\t\r\t\16\tM\3\t\3\t\3\n\3\n\3\n\3\n\4\348"+
		"\2\13\4\3\6\4\b\5\n\6\f\7\16\b\20\t\22\n\24\13\4\2\3\6\4\2\13\f\17\17"+
		"\5\2\62;C\\c|\3\2$$\5\2\13\f\17\17\"\"\2Y\2\4\3\2\2\2\2\6\3\2\2\2\2\b"+
		"\3\2\2\2\3\n\3\2\2\2\3\f\3\2\2\2\3\16\3\2\2\2\3\20\3\2\2\2\3\22\3\2\2"+
		"\2\3\24\3\2\2\2\4\26\3\2\2\2\6\"\3\2\2\2\b&\3\2\2\2\n+\3\2\2\2\f/\3\2"+
		"\2\2\16\61\3\2\2\2\20?\3\2\2\2\22K\3\2\2\2\24Q\3\2\2\2\26\27\7\61\2\2"+
		"\27\30\7,\2\2\30\34\3\2\2\2\31\33\13\2\2\2\32\31\3\2\2\2\33\36\3\2\2\2"+
		"\34\35\3\2\2\2\34\32\3\2\2\2\35\37\3\2\2\2\36\34\3\2\2\2\37 \7,\2\2 !"+
		"\7\61\2\2!\5\3\2\2\2\"#\7>\2\2#$\3\2\2\2$%\b\3\2\2%\7\3\2\2\2&\'\t\2\2"+
		"\2\'(\3\2\2\2()\b\4\3\2)\t\3\2\2\2*,\t\3\2\2+*\3\2\2\2,-\3\2\2\2-+\3\2"+
		"\2\2-.\3\2\2\2.\13\3\2\2\2/\60\7<\2\2\60\r\3\2\2\2\61\62\7$\2\2\62\63"+
		"\7$\2\2\63\64\7$\2\2\648\3\2\2\2\65\67\13\2\2\2\66\65\3\2\2\2\67:\3\2"+
		"\2\289\3\2\2\28\66\3\2\2\29;\3\2\2\2:8\3\2\2\2;<\7$\2\2<=\7$\2\2=>\7$"+
		"\2\2>\17\3\2\2\2?E\7$\2\2@A\7^\2\2AD\7$\2\2BD\n\4\2\2C@\3\2\2\2CB\3\2"+
		"\2\2DG\3\2\2\2EC\3\2\2\2EF\3\2\2\2FH\3\2\2\2GE\3\2\2\2HI\7$\2\2I\21\3"+
		"\2\2\2JL\t\5\2\2KJ\3\2\2\2LM\3\2\2\2MK\3\2\2\2MN\3\2\2\2NO\3\2\2\2OP\b"+
		"\t\3\2P\23\3\2\2\2QR\7@\2\2RS\3\2\2\2ST\b\n\4\2T\25\3\2\2\2\n\2\3\34-"+
		"8CEM\5\7\3\2\b\2\2\6\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}