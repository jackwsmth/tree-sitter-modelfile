/**
 * @file A tree-sitter parser for Ollama's Modelfile.
 * @author Jack Smith <jackwsmth@proton.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "modelfile",

  rules: {
    source_file: ($) => repeat(seq($.instruction, "\n")),

    instruction: ($) =>
      choice(
        $.from_instruction,
        $.parameter_instruction,
        $.requires_instruction,
        $.message_instruction,
        $.template_instruction,
        $.system_instruction,
        $.adapter_instruction,
      ),

    // could split keywords into their categories, and then abstract them.
    // so like single val keywords, double val keywords, triple quote keywords
    // e.g. single_value_instruction: ($) => seq(choice("FROM", "REQUIRES", "ADAPTER")),
    // single_value_keywords: ($) => choice("FROM", "REQUIRES", "ADAPTER")

    from_instruction: ($) => seq("FROM", token(/.*/)),
    parameter_instruction: ($) => seq("PARAMETER", token(/.*/), token(/.*/)),
    requires_instruction: ($) => seq("REQUIRES", token(/.*/)),
    message_instruction: ($) => seq("MESSAGE", token(/.*/), token(/.*/)),
    template_instruction: ($) => seq("TEMPLATE", token(/"""([\s\S]*?)"""/)),
    system_instruction: ($) => seq("SYSTEM", token(/"""([\s\S]*?)"""/)),
    license_instruction: ($) => seq("LICENSE", token(/"""([\s\S]*?)"""/)),
    adapter_instruction: ($) => seq("ADAPTER", token(/.*/)),

    /*
    single_value_instruction: ($) => seq(
      from_instruction: ($) => seq("FROM", $._string),
    )
    */

    comment: ($) => token(/#[^\n]*/),
  },

  extras: ($) => [/[ \t]/, $.comment],
});
