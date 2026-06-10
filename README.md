# Xsolla Buy Button Widget

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Overview

The Xsolla Buy Button Widget is a JavaScript embed that renders a product detail card (game key, physical good, virtual item, virtual currency, or bundle) directly on your webpage and opens the Xsolla Pay Station payment interface when the user clicks buy. It adapts to the user's device type, supports AMD and CommonJS module formats, and can be loaded from the Xsolla CDN, installed via Bower or npm, or imported as an ES6 module.

The widget is configured with a `project_id` and `sku` (or an `access_token` for projects already integrated via token). A live demo is available at [livedemo.xsolla.com/buy-button/](https://livedemo.xsolla.com/buy-button/).

## Requirements

- An Xsolla Publisher Account with at least one store item (game key, physical good, virtual item, virtual currency, or bundle) configured
- `project_id` from your Publisher Account, plus the item's `sku`
- A DOM element to render the widget into (passed as a jQuery selector via `widget_ui.target_element`)
- Node.js v10+ and [Bower](https://bower.io/) if building locally

## Install

**CDN (recommended):**

```html
<script src="https://cdn.xsolla.net/embed/buy-button/3.1.8/widget.min.js"></script>
```

**npm:**

```bash
npm install @xsolla/buy-button-widget
```

**Bower:**

```bash
bower install xsolla/buy-button-widget
```

**Local dev:**

```bash
npm install
bower install
gulp serve
```

## Usage

### Asynchronous loading (recommended)

```javascript
var options = {
    project_id: 'YOUR-PROJECT-ID',
    sku: 'YOUR-SKU',
    widget_ui: {
        target_element: '#widget-example-element'
    }
};
var s = document.createElement('script');
s.type = 'text/javascript';
s.async = true;
s.src = '//cdn.xsolla.net/embed/buy-button/3.1.8/widget.min.js';
s.addEventListener('load', function () {
    var widgetInstance = XBuyButtonWidget.create(options);
}, false);
document.getElementsByTagName('head')[0].appendChild(s);
```

### Events

```javascript
widgetInstance.on('status-done', function (event) {
    console.log('Payment complete');
});
```

Available events: `init`, `open`, `load`, `close`, `status`, `status-invoice`, `status-delivering`, `status-done`, `status-troubled`.

## Documentation

Full API reference and integration guides: [developers.xsolla.com](https://developers.xsolla.com/)

## Support

- [GitHub Issues](https://github.com/xsolla/buy-button-widget/issues)
- [Xsolla Developer Portal](https://developers.xsolla.com/)

## License

MIT. See [LICENSE](./LICENSE).
