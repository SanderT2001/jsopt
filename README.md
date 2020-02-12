# JsOpt
JsOpt is a minimalistic Library to make working with Vanilla JavaScript more plesant.

## Start using
```html
<!-- Start: Vendors -->
<!-- Javascript -->
<!-- JsOpt -->
<script src="./src/jsopt-all.js"></script>
<!-- End: Vendors -->
```

## Examples
```javascript
$('.div').find('.anotherdiv');

$('.div').foreach((key, element) => {
    // Do something...
});

$('.div').changeInner('Change something');

$('.div').append($('.anotherdiv'));
$('.div').prepend($('.anotherdiv'));

$('.div').show();
$('.div').hide();

$('.div').attr('data-id', 123);
$('.div').css('display', 'none');

$(document).ready(() => {
    // Do something...
});

// Set Event Listener.
var jsoptElements = $('.div');
jsoptElements.on('click', (e) => {
    // Do something...
});

// Removes the Click Event
jsoptElements.off('click');

// Removes all the set Event Listeners.
jsoptElements.off(null);
```
