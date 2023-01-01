# The Abstract Syntax Tree

The Abstract Syntax Tree of a Handlebars is a tree of JSON objects.
Every node in the tree has at least the following properties:

- **type**: Defines the node's class and implies which additional properties
  are present on the node,
- **loc**: Contains the location of the node in the template
  - **start**: The start of the node in the template
  - **end**: The end of the node in the template

Like in JavaScripts "splice" method, the **end** location is exclusive
(i.e. the first character _after_ the node.)

**start** and **end** consist of

- **line**: The line number of the character (first line is 1)
- **column**: The column of the charachter (fist columne is 0)

[](./empty.hb-spec.json)

[](./newline.hb-spec.json)

[](./newline-around-mustache.hb-spec.json)
