/* eslint-disable */
const antlr4 = require('antlr4/index');
const L20nLexer = require('../tools/l20n-grammar/js/L20nLexer').L20nLexer;
const L20nParser = require('../tools/l20n-grammar/js/L20nParser').L20nParser;
const L20nParserListener = require('../tools/l20n-grammar/js/L20nParserListener').L20nParserListener;
const path = require('path');

class EntityGrabber extends L20nParserListener {
  constructor() {
    super();
    this.results = {};
    this.currentEntity = '';
  }

  enterEntity(ctx) {
    const entityName = ctx.entityName().getText();
    this.currentEntity = entityName; // Keep this state for entering properties within the entity (see enterEntityProperty)
    this.results[entityName] = {};
  }

  exitEntity(ctx) {
    this.currentEntity = '';
  }

  enterEntityProperty(ctx) {
    const key = ctx.Identifier().getText();
    let value = ctx.String().getText();

    // The string value will include the quotes, remove them.
    if (value.endsWith('"') && value.startsWith('"')) {
      value = value.slice(1, value.length - 1);
    }

    this.results[this.currentEntity][key] = value;
  }
}

module.exports = function convert(grunt) {
  grunt.registerMultiTask('convert-l20n', 'Convert L20n files to JSON.', function multi() {
    this.files.forEach((file) => {
      file.src.forEach((src) => {
        const content = grunt.file.read(src);
        const chars = new antlr4.InputStream(content);
        const lexer = new L20nLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new L20nParser(tokens);
        parser.buildParseTrees = true;
        const tree = parser.document();
        const listener = new EntityGrabber();
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
        const results = JSON.stringify(listener.results, null, 2);

        const basename = path.basename(src, '.l20n');
        const outfile = path.join(file.dest, path.dirname(src), basename + '.json');
        grunt.file.write(outfile, results);
      });
    });
  });
};
