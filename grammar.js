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

    from_instruction: ($) => seq("FROM", $.argument),

    parameter_instruction: ($) =>
      seq("PARAMETER", $.argument, $.parameter_value),
    requires_instruction: ($) => seq("REQUIRES", $.argument),
    message_instruction: ($) => seq("MESSAGE", $.argument, $.argument),
    template_instruction: ($) => seq("TEMPLATE", $.multiline_string),
    system_instruction: ($) => seq("SYSTEM", $.multiline_string),
    license_instruction: ($) => seq("LICENSE", $.multiline_string),
    adapter_instruction: ($) => seq("ADAPTER", $.argument),

    argument: ($) => token(/[^\s]+/),
    parameter_value: ($) => choice($.number, $.quoted_string),
    number: ($) => token(/-?\d+(\.\d+)?/),
    quoted_string: ($) => token(/"[^"]*"/),
    multiline_string: ($) => token(/"""([\s\S]*?)"""/),
    newline: ($) => token(/\n/),
    comment: ($) => token(/#[^\n]*/),
  },

  extras: ($) => [/\s+/, $.comment],
});
