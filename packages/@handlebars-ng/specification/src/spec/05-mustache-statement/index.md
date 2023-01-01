# The Mustache Statement

A mustache statement defines a placeholder in the output. The placeholder is replaced by a value that is resolved from the input object
via a `PathExpression`. In the most simple form, the `PathExpression` is the name of a property in the input object.

More complex expressions are possible and described in a later chapter (TODO).

```
MustacheStatement =
    HtmlEscapedMustacheStatement |
    UnescapedMustacheStatement

HtmlEscapedMustacheStatement =
    "{{" PathExpression "}}"

UnescapedMustacheStatement =
    "{{{" PathExpression "}}}"
```

## Html escaped Mustache Statement

When using `{{` and `}}`, the resolved value is HTML-escaped which means that the following substitutions are applied:

```
Character    Substitute
    &           &amp;
    <           &lt;
    >           &gt;
    "           &quot:
    '           &#x27;
    `           &#x60;
    =           &#x3D;
```

[](./html-escaped-mustache.hb-spec.json)

## Unscaped Mustache Statement

When using `{{{` and `}}}`, the resolved value copied to the output as-is.

[](./unescaped-mustache.hb-spec.json)
