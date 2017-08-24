# L20n Grammar

The `*.g4` files in this directory are [antlr4](https://github.com/antlr/antlr4) grammar files. This is *NOT* a complete L20n grammar. It is a small subset that the argos team uses, which is comments, entity values (string only), and entity properties. The L20n team has also recently changed the syntax. This grammar is for the v1.x-v3.x syntax, see [here](https://wiki.mozilla.org/L20n/Toolbox)


## Running Test File (test_l20n.txt)
* Setup antlr4 by reading the [getting started](https://github.com/antlr/antlr4/blob/master/doc/getting-started.md) wiki page
* Run `antlr4 L20nLexer.g4 L20nParser.g4`
  * This will generate java files, the code generation can be changed by reading the [antlr code generation targets wiki page](https://github.com/antlr/antlr4/blob/master/doc/targets.md)
* Compile the java files by running `javac L20n*.java`
* Run the test utility `grun`
  * `grun L20n document test_l20n.txt -tree`
  * If you omit the test_l20n.txt, it will read from stdin
* `grun` should then output the parser Three
  * Run `grun` by itself to see a list of flags
