# Xsolla Game Delivery Widget

## Integration Guide

Xsolla team created a script to simplify the integration of PayStation into your website. Please note: for the proper work of widget please make sure that you pass the ‘access_token’. More information about getting ‘access_token’ parameter is available [here](http://developers.xsolla.com/api.html#token).

[See Demo](http://livedemo.xsolla.com/pincodes/)

Features:
* <span style="background: yellow">Встраивание готового шаблона на страницу сайта, показ информации о продаваемом контенте, список DRM и платформ, выбор способа оплаты</span>
* <span style="background: yellow">Открытие интерфейса оплаты</span>
* the most appropriate interface depending on the type of device
* compliant with the AMD and CommonJS specification for defining modules

### Getting the code

#### Linking to Xsolla CDN

Script is located on our CDN and is available here: [https://static.xsolla.com/embed/game-delivery/1.0.0rc1/widget.min.js](https://static.xsolla.com/embed/game-delivery/1.0.0rc1/widget.min.js). Use this URL to integrate script on your website.

#### Installing with Bower

<span style="color: red">
    TODO: зарегистрировать в bower после открытия публичного репозитория в github (bower register xsolla-game-delivery-widget git://github.com/xsolla/game-delivery-widget.git)
</span>

If you want to include the source code of widget as a part of your project, you can install the package using [Bower](http://bower.io/).

``` bash
$ bower install xsolla-game-delivery-widget
```

### Script Loading

#### Asynchronous loading with callback (recommended)

``` javascript
<script>
    var options = {
        access_token: 'abcdef1234567890abcdef1234567890'
    };
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.async = true;
    s.src = "//static.xsolla.com/embed/game-delivery/1.0.0rc1/widget.min.js";
    s.addEventListener('load', function (e) {
        var widgetInstance = XGameDeliveryWidget.create(options);
    }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
</script>
```

<span style="background: yellow">
    Выполнять XGameDeliveryWidget.create() после загрузки DOM. Для этого можно воспользоваться соответствующим событием или добавить скрипт после элемента, в который происходит рендеринг
</span>

#### Synchronous loading (blocks content)

``` javascript
<script src="//static.xsolla.com/embed/game-delivery/1.0.0rc1/widget.min.js"></script>
<script>
    var widgetInstance = XGameDeliveryWidget.create({
        access_token: 'abcdef1234567890abcdef1234567890'
    });
</script>
```

#### CommonJS

If your project uses CommonJS module format, you can access the widget by require()

``` javascript
var XGameDeliveryWidget = require('PATH_TO_WIDGET/embed');
var widgetInstance = XGameDeliveryWidget.create({
   access_token: 'abcdef1234567890abcdef1234567890'
});
```

#### RequireJS (AMD)

Also you can use widget with RequireJS loader

``` javascript
define(['PATH_TO_WIDGET/embed'], function (XGameDeliveryWidget) {
    var widgetInstance = XGameDeliveryWidget.create({
       access_token: 'abcdef1234567890abcdef1234567890'
    });
});
```

### Widget Options

* **access_token** — Access token
* **sandbox** — Set **true** to test the payment process, sandbox-secure.xsolla.com will be used instead secure.xsolla.com
* **template** — <span style="background: yellow">шаблон для отображения, определяющий внешний вид ('tiny', 'compact', 'full')</span>
* **target_element** — <span style="background: yellow">элемент на странице, куда будет отрендерен виджет (в формате селектора jQuery, например, '#widget-example')</span>

<span style="background: yellow">Следующие параметры определяют отображение платежного интерфейса, совпадают с [Xsolla PayStation Widget](https://github.com/xsolla/paystation-embed/)</span>

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
    * **spinner** — Type of animated loading spinner, can be 'xsolla', 'round' or 'none', default is the first one
    * **spinnerColor** — Color of the spinner, not set by default
* **childWindow** — Options for child window that contains PayStation. Suitable for mobile version
    * **target** — The target option specifies where to open the Paystation window, can be '_blank', '_self', '_parent', default is '_blank'

### Widget API

#### Methods

You can refer to the widget object, using the following methods:

* **XGameDeliveryWidget.create(options)** — <span style="background: yellow">Создание экземпляра виджета и рендеринг его на странице сайта</span>
