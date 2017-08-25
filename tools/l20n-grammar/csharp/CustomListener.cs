using System;
using Antlr4.Runtime;

public class CustomListener : L20nParserBaseListener {
  public override void EnterDocument(L20nParser.DocumentContext ctx) {
    System.Console.WriteLine("Document loaded");
  }

  public override void EnterEntity(L20nParser.EntityContext context) {
    System.Console.WriteLine("Entity Loaded: " + context.entityName().GetText());
  }
}