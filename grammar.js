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
    source_file: ($) => repeat(seq($.instruction, $.newline)),

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

    from_instruction: ($) => seq("FROM", $.argument),

    parameter_instruction: ($) =>
      seq("PARAMETER", $.argument, $.parameter_value),
    requires_instruction: ($) => seq("REQUIRES", $.argument),
    message_instruction: ($) => seq("MESSAGE", $.argument, $.argument),
    template_instruction: ($) => seq("TEMPLATE", token(/"""([\s\S]*?)"""/)),
    system_instruction: ($) => seq("SYSTEM", token(/"""([\s\S]*?)"""/)),
    license_instruction: ($) => seq("LICENSE", token(/"""([\s\S]*?)"""/)),
    adapter_instruction: ($) => seq("ADAPTER", $.argument),

    /*
    single_value_instruction: ($) => seq(
      from_instruction: ($) => seq("FROM", $._string),
    )
    */

    argument: ($) => token(/[^\s]+/),
    parameter_value: ($) => choice($.number, $.quoted_string),
    number: ($) => token(/-?\d+(\.\d+)?/),
    quoted_string: ($) => token(/"[^"]*"/),
    newline: ($) => token(/\n/),
    comment: ($) => token(/#[^\n]*/),
  },

  extras: ($) => [/\s+/, $.comment],
});
