---
title: Busy Indicator
description: Displays feedback about a current process. A user can infer that the system is functioning. Best for a system processes that precludes further user action until their completion.
demo:
  embedded:
  - name: Busy Form Example
    slug: example-index
  pages:
  - name: On the Page Body
    slug: example-body
  - name: Busy Input Elements
    slug: example-inputs
  - name: Non Blocking Busy Indicator
    slug: example-non-blocking
  - name: Smaller Size
    slug: example-small
  - name: Nested Busy Indicators
    slug: test-nested
  - name: transparent Overlay
    slug: example-transparent-overlay
  - name: Ajax Calls
    slug: test-ajax-calls
---

## Code Example

To use the busy indicator place it on a element with class `busy`. Keep in mind it will center itself on that element.
You can provide the options inline in the `data-options`. This example below uses the initializer. If you're not using the initializer, call `$('#busy-form').busyindicator()` to initialize the plugin.

```html
<form id="busy-form" class="busy" action="#" method="POST" data-options="{ 'displayDelay': 100, 'timeToComplete': 4000 }">
  <div class="field">
    <label for="busy-field-name">Name</label>
    <input type="text" id="busy-field-name" name="busy-field-name" value="" />
  </div>
  <div class="field">
    <label for="busy-field-address">Address</label>
    <input type="text" id="busy-field-address" name="busy-field-address" value="" />
  </div>
  <div class="field">
    <label for="busy-field-cats">Number of Cats</label>
    <input type="text" id="busy-field-cats" name="busy-field-cats" value="" />
  </div>
  <div class="field">
    <button type="submit" id="submit" class="btn-primary">Submit</button>
  </div>
</form>

```

When a task happens that requires the indicator, you can trigger the event on the element to force this indicator to show.

```javascript
$('#busy-form button[type="submit"]').click(function(e) {
  e.preventDefault();
  $('#busy-form').trigger('start.busyindicator');
});

```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Responsive Guidelines

Busy Indicators that block UI will usually be placed at a "container" or "form" level, and will cover the container or form elements with an overlay. The overlay should stretch to cover the width and height of the container or form.
