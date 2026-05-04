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
    source_file: ($) => repeat(seq($._instruction, $._newline)),

    _instruction: ($) =>
      choice(
        $.from_instruction,
        $.parameter_instruction,
        $.requires_instruction,
        $.message_instruction,
        $.template_instruction,
        $.system_instruction,
        $.adapter_instruction,
        $.license_instruction
      ),

    from_instruction: ($) => seq("FROM", $.model_source),
    parameter_instruction: ($) =>
      seq("PARAMETER", $.argument, $.parameter_value),
    requires_instruction: ($) => seq("REQUIRES", $.version),
    message_instruction: ($) => seq("MESSAGE", $.argument, $.argument),
    template_instruction: ($) => seq("TEMPLATE", $.multiline_string),
    system_instruction: ($) => seq("SYSTEM", $.multiline_string),
    license_instruction: ($) => seq("LICENSE", $.multiline_string),
    adapter_instruction: ($) => seq("ADAPTER", $.file_path),

    model_source: ($) => choice($.model_ref, $.model_ref_with_tag, $.file_path),
    
    model_ref: ($) => token(/[a-zA-Z0-9_.-]+/),
    model_ref_with_tag: ($) => token(/[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.-]+/),
    file_path: ($) => token(/(\.\/|\/)[^\s]+/),
    version: ($) => token(/\d+\.\d+\.\d+/),

    argument: ($) => token(/[^\s]+/),
    parameter_value: ($) => choice($.number, $.quoted_string),
    number: ($) => token(/-?\d+(\.\d+)?/),
    quoted_string: ($) => token(/"[^"]*"/),
    multiline_string: ($) => seq('"""', repeat(/.|\n/), '"""'),
    _newline: ($) => token(/\n/),
    comment: ($) => token(/#[^\n]*/),
  },

  extras: ($) => [/\s+/, $.comment],
});
