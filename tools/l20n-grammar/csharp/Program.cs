using System;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;

namespace csharp
{
    class Program
    {
        static void Main(string[] args)
        {
          String input = "<entity1 \"entity val\">";
          ICharStream stream = CharStreams.fromstring(input);
          ITokenSource lexer = new L20nLexer(stream);
          ITokenStream tokens = new CommonTokenStream(lexer);
          L20nParser parser = new L20nParser(tokens);
          parser.BuildParseTree = true;
          IParseTree tree = parser.document();
          CustomListener listener = new CustomListener();
          ParseTreeWalker.Default.Walk(listener, tree);
        }
    }
}
