# Path ParameterExpression

[Path ParameterExpression Grammar](../handlebars.grammar#PathExpressions)

A path expression is a list of ids separated by dots. It is resolved by recursively retrieving the property matching the id
of the current input object.

[](./path-expression-dots.hb-spec.json)

If the id matches no property of the object, an empty string is returned. (TODO: Or does it return "undefined" or "null", which is
converted to an empty string by the mustache-statements?)

[](./path-expression-resolves-to-nothing.hb-spec.json)

If a prefix of the path expressions that resolves to nothing, the result is also an empty string.

[](./path-expression-too-long.hb-spec.json)

A path expression may contain ids separated by slashes

[](./path-expression-slashes.hb-spec.json)

Dots and slashes may be mixed.

[](./path-expression-dots-and-slashes.hb-spec.json)

## Literal segments

Identifiers may contain any unicode character except for the following.

[Testcases for invalid ids](./invalid-ids/)

It may be wise to allow multiple templates in such a test-case. Otherwise we need one file per illegal character.

Ids with special charactares must be wrapped in `[` and `]`. It may than not include a closing `]`.

[](./id-in-square-brackets.hb-spec.json)

[](./id-)

## TODO: Quotes to allow invalid chars

The original Handlebars parser also allows Literal expressions to be the

In https://github.com/handlebars-lang/docs/pull/119 it was pointed out that the following also works

```handlebars
{{"id containing spaces"}}
{{"id containing spaces"}}
```

but the following does not

```handlebars
{{ 'id containing spaces'.moreProp}}
{{ "id containing spaces".moreProps}}
```

This is because the `{{ 'id containing spaces' }}` interpreted by the parser as LiteralString, where quotes are allowed, but
`{{ 'id containing spaces'.moreProp}}` is a contains a PathExpressions, where quotes aren't allowed.

This could be considered a bug in the parser.
