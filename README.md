# Accessible Tabs Demo

Accessible tabs solution based on W3C [Example of tabs with Automatic Activation](https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html) and [How Tabs Should Really Work](https://cliener.tumblr.com/post/139412933763/how-tabs-should-really-work) blog post.


### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Test

```
npm run test
```

### Markup

The Tabs markup example:

```
<div class="g-tab__tab-group" data-tabs>
  <ul class="g-tab__tab-list">
    <li class="g-tab__tab" data-tab><a href="#tab1">Tab1</a></li>
    <li class="g-tab__tab" data-tab><a href="#tab2">Tab2</a></li>
    <li class="g-tab__tab" data-tab><a href="#tab3">Tab3</a></li>
  </ul>

  <section id="tab1" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab1</h3>
    <p>Tab 1 content here...</p>
  </section>

  <section id="tab2" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab2</h3>
    <p>Tab2 content here...</p>
  </section>

  <section id="tab3" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab3</h3>
    <p>Tab3 content here...</p>
  </section>
</div>
```

Note that the Tabs.js function is using data-attributes as elements selectors (such as `data-tabs`, `data-tab`, `data-tab-panel`). So the elements classes are using for styling purposes only and can be easily replaced to other if any requirements change.

### Usage
Keys support according to W3C [Example of tabs with Automatic Activation](https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html) specification:

#### Tab
- When focus moves into the tab list, places focus on the active tab element .
- When the tab list contains the focus, moves focus to the next element in the tab sequence, which is the tabpanel element.

### Right Arrow
- Moves focus to the next tab.
- If focus is on the last tab, moves focus to the first tab.
- Activates the newly focused tab.

#### Left Arrow
- Moves focus to the previous tab.
- If focus is on the first tab, moves focus to the last tab.
- Activates the newly focused tab.

#### Home 
Moves focus to the first tab and activates it.

#### End 
Moves focus to the last tab and activates it.

#### Del
Does not support Del key as tabs are not supposed to be deleted.


