# Content

"Content" is the default type of statement contained in a template. It does not have a specific start- or end-token. It ends when other statments start.
Since all other statement types start with two or more opening mustache-statements, "Content" ends when such an opening mustache statement is found.

"Content" is copied verbatim to the output.

[](./content.hb-spec.json)

## Escaped mustache statements

If an opening mustache tokens such as `{{`, `{{{` or `{{{{` is prefixed with a `\`, it is considered "Content" and the backslash is removed from the
output.

[](./escaped-content.hb-spec.json)
