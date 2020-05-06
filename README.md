# Xsolla Pay2Play Widget

## Integration Guide

Xsolla team created a script to simplify the integration of Buy Button product into your website.

[See Demo](https://livedemo.xsolla.com/pay2play/)

Features:
* Widget can be easily embedded on your page, and will provide user the details about selling item (e.g. Digital Content, Physical Good, Virtual Item, Bundle)
* Payment Interface opening
* The most appropriate interface depending on the type of device
* Compliant with the AMD and CommonJS specification for defining modules

### Getting Started

You should have node v10+ and also you need to install [Bower](https://bower.io/).

```sh
npm install
bower install
gulp serve
```

### Getting the code

#### Linking to Xsolla CDN

Script is located on our CDN and is available here: [https://cdn.xsolla.net/embed/pay2play/3.0.0/widget.min.js](https://cdn.xsolla.net/embed/pay2play/3.0.0/widget.min.js). Use this URL to integrate script on your website.

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
        project_id: "YOUR-PROJECT-ID",
        sku: "YOUR-SKU",
        widget_ui: {
            target_element: '#widget-example-element'
        }
    };
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.async = true;
    s.src = "//cdn.xsolla.net/embed/pay2play/3.0.0/widget.min.js";
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
<script src="//cdn.xsolla.net/embed/pay2play/3.0.0/widget.min.js"></script>
<script>
    var widgetInstance = XPay2PlayWidget.create({
        project_id: "YOUR-PROJECT-ID",
        sku: "YOUR-SKU",
        widget_ui: {
            target_element: '#widget-example-element'
        }
    });
</script>
```

#### CommonJS

If your project uses CommonJS module format, you can access the widget by require()

``` javascript
var XPay2PlayWidget = require('PATH_TO_WIDGET/embed');
var widgetInstance = XPay2PlayWidget.create({
        project_id: "YOUR-PROJECT-ID",
        sku: "YOUR-SKU",
        widget_ui: {
            target_element: '#widget-example-element'
        }
});
```

#### RequireJS (AMD)

Also you can use widget with RequireJS loader

``` javascript
define(['PATH_TO_WIDGET/embed'], function (XPay2PlayWidget) {
    var widgetInstance = XPay2PlayWidget.create({
        project_id: "YOUR-PROJECT-ID",
        sku: "YOUR-SKU",
        widget_ui: {
            target_element: '#widget-example-element'
        }
    });
});
```

### Widget Options

* **access_token** — Access token (see [Get Token](https://developers.xsolla.com/api/v1/getting-started/#api_token_ui)). Use this parameter only if you are already integrated Xsolla through Access Token. Configuration through Project ID and Sku is preferable way to integrate widget
* **project_id** — Unique project identifier in Publisher Account
* **item_type** — One of values: "digital_content", "physical_good", "virtual_item", "virtual_currency", "bundle". Default value is "digital_content"
* **sku** — Unique identifier that refers to the particular stock keeping unit
* **drm** — Predefined DRM (e.g. Steam) for Digital Content item. Allows user to skip the DRM selection step
* **api_settings** 
    * **host** — Host for performing requests. The default value is **store.xsolla.com**
    * **api_host** — Host for performing API requests. The default value is **store.xsolla.com/api**
    * **sandbox** — Set **true** to test the payment process, **sandbox-secure.xsolla.com** will be used instead **secure.xsolla.com** to process payments (see [Testing the Payment Process](https://developers.xsolla.com/doc/pay-station/#guides_pay_station_testing_payment_process))
* **user** — Custom user data
    * **xsolla_login_token** — Xsolla Login user authorization token
    * **email** — User email, will be passed to Payment Interface
    * **country** — User country, will be passed to Payment Interface
    * **locale** — User locale, will be passed to Payment Interface
    * **currency** — Payment currency, will be passed to Payment Interface
* **widget_ui**
    * **theme** — Widget color theme, defining its appearance. Can be object { foreground : ['blue', 'red', 'green', 'gold'],  background : ['light', 'dark']. }
    * **template** — Template. Values: **string** 'standard' (default), **string** 'simple'.
    * **target_element** (required) — Element of the page, where the widget should be rendered (jQuery selector should be used, for example '#widget-example')
* **payment_ui** - Payment interface appearance parameters (see [Payment UI settings](https://developers.xsolla.com/api/v2/getting-started/#api_param_payment_ui_get_token_settings_ui))

The following parameters define the payment widget appearance, and coincide with [Xsolla PayStation Widget](https://github.com/xsolla/paystation-embed/) parameters.

* **payment_widget_ui** 
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

### Configuration Examples
#### Example 1 (Digital Content)
``` javascript
{
    project_id: "YOUR-PROJECT-ID",
    item_type: "digital_content",
    sku: "YOUR-SKU",
    widget_ui: {
        target_element: '#widget-example-element'
    }
}
```

#### Example 2 (Digital Content with predefined Drm)
``` javascript
{
    project_id: "YOUR-PROJECT-ID",
    item_type: "digital_content",
    sku: "YOUR-SKU",
    drm: "steam"
    widget_ui: {
        target_element: '#widget-example-element'
    }
}
```

#### Example 3 (Digital Content with Access Token integration)
``` javascript
{
    project_id: "YOUR-PROJECT-ID",
    item_type: "digital_content",
    access_token: "YOUR-ACCESS-TOKEN",
    widget_ui: {
        target_element: '#widget-example-element'
    }
}
```

#### Example 4 (Physical Good)
``` javascript
{
    project_id: "YOUR-PROJECT-ID",
    item_type: "physical_good",
    sku: "YOUR-SKU",
    widget_ui: {
        target_element: '#widget-example-element'
    }
}
```

#### Example 5 (Virtual Item with authorized user)
``` javascript
{
    project_id: "YOUR-PROJECT-ID",
    item_type: "virtual_item",
    sku: "YOUR-SKU",
    user: {
        xsolla_login_token: "XSOLLA-LOGIN-TOKEN"
    }
    widget_ui: {
        target_element: '#widget-example-element'
    }
}
```

### Widget API

#### Methods

You can refer to the widget object, using the following methods:

* **var widgetInstance = XPay2PlayWidget.create(options)** — Create the widget instance and render it on the page
* **widgetInstance.on(event, handler)** — Attach an event handler function for event to the widget.
    * **event** (string) — Event type.
    * **handler** (function) — A function to execute when the event is triggered.
* **widgetInstance.off(event, handler)** — Remove an event handler.
    * **event** (string) — Event type.
    * **handler** (function) — A handler function previously attached for the event.
    
#### Events

* **init** — Event on widget initialization
* **open** — Event on opening of the widget
* **load** — Event after payment interface (PayStation) was loaded
* **close** — Event after payment interface (PayStation) was closed
* **status** — Event when the user was moved on the status page
* **status-invoice** — Event when the user was moved on the status page, but the payment is not yet completed
* **status-delivering** — Event when the user was moved on the status page, payment was completed, and we’re sending payment notification
* **status-done** — Event when the user was moved on the status page, and the payment was completed successfully
* **status-troubled** — Event when the user was moved on the status page, but the payment failed

You can access list of events using XPay2PlayWidget.eventTypes object.