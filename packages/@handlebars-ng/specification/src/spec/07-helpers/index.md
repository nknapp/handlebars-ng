# Helpers

The user can register helpers with the Handlebars runtime
A mustache-statement with a single id is interpreted as helper call.

[](./helper-without-args.hb-spec.json)

If a helper-name and an input property have the same value, the helper is chosen.

[](./helpers-have-precedence-over-input-props.hb-spec.json)

## Helper parameters
