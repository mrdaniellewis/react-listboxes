# PostHTML - escape code

A post html plugin that turns the contents of a `<code>` element into an escaped string.

```html
<!-- Before -->
<code><b>bold</b></code>

<!-- After -->
<code>&lt;b>bold&lt;/b></code>
```

## Why?

Because [posthtml-markdown](https://github.com/OzymandiasTheGreat/posthtml-markdown)
does not escape html in code samples.
