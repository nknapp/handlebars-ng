# Literal ParameterExpression

A literal expression resolves to a constant value or the following types

- String
- Number
- Boolean
- `null`
- `undefined`

TODO: Undefined does not make sense in most non-js languages.

[Literal ParameterExpression Grammar](../handlebars.grammar#LiteralExpressions)

## String literals

A helper parameter wrapped in double quotes is a string literal.

[](./double-quoted-literal-string.hb-spec.json)

It can contain all characters special characters, but no double quote

[](./double-quoted-literal-string-with-invalid-chars.hb-spec.json)

A helper parameter wrapper in single quotes can contain all characters except a single quote.

[](./single-quoted-literal-string-with-invalid-chars.hb-spec.json)

## Number literals

[](./number-literal.hb-spec.json)

## Boolean literals

[](./true-literal.hb-spec.json)

[](./false-literal.hb-spec.json)
