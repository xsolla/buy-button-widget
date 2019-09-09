# Xsolla Pay2Play Widget

## Integration Guide

Xsolla team created a script to simplify the integration of PayStation into your website. Please note: for the proper work of widget please make sure that you pass the 'access_token'. More information about getting 'access_token' parameter is available [here](https://developers.xsolla.com/api/v2/pay-station/#api_payment_ui).

[See Demo](https://livedemo.xsolla.com/pay2play/)

Features:
* Widget can be easily embed on your page, and will provide user the details about selling content, the list of available DRM and platforms, the choice of payment methods
* Payment Interface opening
* The most appropriate interface depending on the type of device
* Compliant with the AMD and CommonJS specification for defining modules

### Getting the code

#### Linking to Xsolla CDN

Script is located on our CDN and is available here: [https://static.xsolla.com/embed/pay2play/2.2.1/widget.min.js](https://static.xsolla.com/embed/pay2play/2.1.9/widget.min.js). Use this URL to integrate script on your website.

#### Installing with Bower

If you want to include the source code of widget as a part of your project, you can install the package using [Bower](http://bower.io/).

``` bash
$ bower install xsolla-pay2play-widget
```

### Script Loading

#### Asynchronous loading with callback (recommended)

``` javascript
<script>
    var options = {
        access_token: 'abcdef1234567890abcdef1234567890',
        target_element: '#widget-example-element'
    };
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.async = true;
    s.src = "//static.xsolla.com/embed/pay2play/2.2.1/widget.min.js";
    s.addEventListener('load', function (e) {
        var widgetInstance = XPay2PlayWidget.create(options);
    }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
</script>
```

It is necessary to perform XPay2PlayWidget.create() when the DOM is fully loaded. You can track the appropriate event, or add the script after the element, where widget should be rendered.

#### Synchronous loading (blocks content)

``` javascript
<script src="//static.xsolla.com/embed/pay2play/2.2.1/widget.min.js"></script>
<script>
    var widgetInstance = XPay2PlayWidget.create({
        access_token: 'abcdef1234567890abcdef1234567890',
        target_element: '#widget-example-element'
    });
</script>
```

#### CommonJS

If your project uses CommonJS module format, you can access the widget by require()

``` javascript
var XPay2PlayWidget = require('PATH_TO_WIDGET/embed');
var widgetInstance = XPay2PlayWidget.create({
    access_token: 'abcdef1234567890abcdef1234567890',
    target_element: '#widget-example-element'
});
```

#### RequireJS (AMD)

Also you can use widget with RequireJS loader

``` javascript
define(['PATH_TO_WIDGET/embed'], function (XPay2PlayWidget) {
    var widgetInstance = XPay2PlayWidget.create({
        access_token: 'abcdef1234567890abcdef1234567890',
        target_element: '#widget-example-element'
    });
});
```

### Widget Options

* **access_token** (required) — Access token
* **host** - Host for performing requests. The default value is **secure.xsolla.com**
* **sandbox** — Set **true** to test the payment process, sandbox-secure.xsolla.com will be used instead secure.xsolla.com
* **theme** — Widget color theme, defining its appearance. Can be object { foreground : ['blue', 'red', 'green', 'gold'],  background : ['light', 'dark']. }
* **template** - Template. Values: **string** 'standard' (default), **string** 'simple'.
* **target_element** (required) — Element of the page, where the widget should be rendered (jQuery selector should be used, for example '#widget-example')

The following parameters define the payment interface appearance, and coincide with [Xsolla PayStation Widget](https://github.com/xsolla/paystation-embed/) parameters.

* **lightbox** — Options for modal dialog that contains frame of PayStation
    * **width** — Width of lightbox frame. If null, depends on paystation width. Default is null
    * **height** — Height of lightbox frame. If null, depends on paystation height. Default is '100%'
    * **zIndex** — Property controls the vertical stacking order, default is 1000
    * **overlayOpacity** — Opacity of the overlay (from 0 to 1), default is '.6'
    * **overlayBackground** — Background of the overlay, default is '#000000'
    * **modal** - Lightbox frame cannot be closed, default false
    * **closeByClick** — Toggle if clicking the overlay should close lightbox, default true
    * **closeByKeyboard** — Toggle if pressing of ESC key should close lightbox, default true
    * **contentBackground** — Background of the frame, default is '#ffffff'
    * **contentMargin** — margin around frame, default '10px',
    * **spinner** — Type of animated loading spinner, can be 'xsolla', 'round', 'none' or 'custom', default is the first one
    * **spinnerColor** — Color of the spinner, not set by default
    * **spinnerUrl** — URL of custom spinner, default is null
    * **spinnerRotationPeriod** — Rotation period of custom spinner, default 0
* **childWindow** — Options for child window that contains PayStation. Suitable for mobile version
    * **target** — The target option specifies where to open the Paystation window, can be '_blank', '_self', '_parent', default is '_blank'

### Widget API

#### Methods

You can refer to the widget object, using the following methods:

* **XPay2PlayWidget.create(options)** — Create the widget instance and render it on the page
