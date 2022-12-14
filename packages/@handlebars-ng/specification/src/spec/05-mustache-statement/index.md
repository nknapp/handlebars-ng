# The Mustache Statement

A mustache statement defines a placeholder in the output. The placeholder is replaced by a value that is resolved from the input object
via a `PathExpression`. In the most simple form, the `PathExpression` is the name of a property in the input object.

More complex expressions are possible and described in a later chapter (TODO).

```
MustacheStatement =
    HtmlEscapedMustacheStatement |
    UnescapedMustacheStatement

HtmlEscapedMustacheStatement =
    "{{" [ "~" ] PathExpression [ "~" ] "}}"

UnescapedMustacheStatement =
    "{{{" [ "~" ] PathExpression [ "~" ] "}}}"
```

## Html escaped Mustache Statement

When using `{{` and `}}`, the resolved value is HTML-escaped using the following substitutions:

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

## White space control

A "~" at the beginning or at the end of a mustache statements declares that white space before (or respectively after) the mustache
must be removed from the output.

White spec control is done by the parser. The `value` property of adjacent `ContentStatement`-nodes is trimmed accordingly, the `original` property is preserved.

[](./white-space-control-escaped.hb-spec.json)

[](./white-space-control-unescaped.hb-spec.json)

Nodes with empty `value` property are preserved to allow tools to recreate the exact template from an AST.

[]/./white-space-control-empty-nodes.hb-spec.json)

## TODO: White space between mustaches and expressions is ignored
