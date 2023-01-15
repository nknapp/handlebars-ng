# Path Expressions

```
    Id = everything except: Whitespace ! " # % & ' ( ) * + , . / ; < = > @ [ \ ] ^ ` { | } ~
    PathExpression = Id { PathExpressionTail }
    PathExpressionTail = "." Id | "/" Id
```

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

```
Whitespace ! " # % & ' ( ) * + , . / ; < = > @ [ \ ] ^ ` { | } ~
```

[Testcases for invalid ids](./invalid-ids/)

It may be wise to allow multiple templates in such a test-case. Otherwise we need one file per illegal character.

Ids with special charactares must be wrapped in `[` and `]`. It may than not include a closing `]`.

[](./id-in-square-brackets.hb-spec.json)
