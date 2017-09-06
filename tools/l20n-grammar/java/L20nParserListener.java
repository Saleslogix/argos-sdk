// Generated from L20nParser.g4 by ANTLR 4.7
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link L20nParser}.
 */
public interface L20nParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link L20nParser#document}.
	 * @param ctx the parse tree
	 */
	void enterDocument(L20nParser.DocumentContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#document}.
	 * @param ctx the parse tree
	 */
	void exitDocument(L20nParser.DocumentContext ctx);
	/**
	 * Enter a parse tree produced by {@link L20nParser#entity}.
	 * @param ctx the parse tree
	 */
	void enterEntity(L20nParser.EntityContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#entity}.
	 * @param ctx the parse tree
	 */
	void exitEntity(L20nParser.EntityContext ctx);
	/**
	 * Enter a parse tree produced by {@link L20nParser#entityName}.
	 * @param ctx the parse tree
	 */
	void enterEntityName(L20nParser.EntityNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#entityName}.
	 * @param ctx the parse tree
	 */
	void exitEntityName(L20nParser.EntityNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link L20nParser#entityValue}.
	 * @param ctx the parse tree
	 */
	void enterEntityValue(L20nParser.EntityValueContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#entityValue}.
	 * @param ctx the parse tree
	 */
	void exitEntityValue(L20nParser.EntityValueContext ctx);
	/**
	 * Enter a parse tree produced by {@link L20nParser#entityProperty}.
	 * @param ctx the parse tree
	 */
	void enterEntityProperty(L20nParser.EntityPropertyContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#entityProperty}.
	 * @param ctx the parse tree
	 */
	void exitEntityProperty(L20nParser.EntityPropertyContext ctx);
	/**
	 * Enter a parse tree produced by {@link L20nParser#misc}.
	 * @param ctx the parse tree
	 */
	void enterMisc(L20nParser.MiscContext ctx);
	/**
	 * Exit a parse tree produced by {@link L20nParser#misc}.
	 * @param ctx the parse tree
	 */
	void exitMisc(L20nParser.MiscContext ctx);
}