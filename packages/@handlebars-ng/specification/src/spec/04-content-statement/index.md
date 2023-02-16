# ContentStatement

ContentStatements do not have a specific start and end-token. By default, all parts of the template that are not
other statements are ContentStatements.

[Content Grammar](../handlebars.grammar#Content)

ContentStatements are copied verbatim to the output, except in the case described below.

[](./content.hb-spec.json)

## Escaped mustache statements

If an opening mustache tokens such as `{{`, `{{{` or `{{{{` is prefixed with a `\`, it does not start a mustache, but remains part of the ContentStatement. The backslash is not copied to the output.

[](./escaped-content.hb-spec.json)
