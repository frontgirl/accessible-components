import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom'
import Tabs from "../src/scripts/tabs";
import "../src/styles/index.scss";

const markup = `
                <div class="g-tab__tab-group" data-tabs>
                  <ul class="g-tab__tab-list">
                    <li class="g-tab__tab" data-tab data-testid="tab1"><a href="#tab1">Tab1</a></li>
                    <li class="g-tab__tab" data-tab data-testid="tab2"><a href="#tab2">Tab2</a></li>
                    <li class="g-tab__tab" data-tab data-testid="tab3"><a href="#tab3">Tab3</a></li>
                  </ul>

                  <section id="tab1" data-testid="tabpanel1"  class="g-tab__tab-panel" data-tab-panel>
                    <h3>Tab1</h3>
                  <p>Tab 1 content here...</p>
                  </section>

                  <section id="tab2" data-testid="tabpanel2" class="g-tab__tab-panel" data-tab-panel>
                    <h3>Tab2</h3>
                    <p>Tab2 content here...</p>
                  </section>

                  <section id="tab3" data-testid="tabpanel3" class="g-tab__tab-panel" data-tab-panel>
                    <h3>Tab3</h3>
                    <p>Tab3 content here...</p>
                  </section>
                </div>
                `;

test('tests if only first tab is open after Tabs initialized', () => {
  document.body.innerHTML = markup;
  const tabs = new Tabs;
  tabs.init();

  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("aria-hidden", "false");
  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("tabindex", "0");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("tabindex", "-1");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("tabindex", "-1");
});

test('tests if second tab is active after key right pressed', () => {
  document.body.innerHTML = markup;
  const tabs = new Tabs;
  tabs.init();
  // console.log(document.body.innerHTML);
  const keyEvent = new KeyboardEvent('keydown', {//Key Right
    bubbles: true, cancelable: true, keyCode: 39
  });
  //Emulate keypress event for tab 1
  document.body.querySelectorAll('[data-tab]')[0].dispatchEvent(keyEvent);
  // tab 2 becomes active
  expect(screen.queryByTestId('tab2')).toHaveAttribute("aria-selected", "true");
  //only tabpanel 2 is visible now
  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("tabindex", "-1");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("aria-hidden", "false");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("tabindex", "0");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("tabindex", "-1");
});

test('tests if last tab is active after end key pressed', () => {
  document.body.innerHTML = markup;
  const tabs = new Tabs;
  tabs.init();
  // console.log(document.body.innerHTML);
  const keyEvent = new KeyboardEvent('keydown', {//End key
    bubbles: true, cancelable: true, keyCode: 35
  });
  //Emulate keypress event for tab 1
  document.body.querySelectorAll('[data-tab]')[0].dispatchEvent(keyEvent);
  // tab 3 becomes active
  expect(screen.queryByTestId('tab3')).toHaveAttribute("aria-selected", "true");
  //only tabpanel 3 is visible now
  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel1')).toHaveAttribute("tabindex", "-1");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByTestId('tabpanel2')).toHaveAttribute("tabindex", "-1");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("aria-hidden", "false");
  expect(screen.queryByTestId('tabpanel3')).toHaveAttribute("tabindex", "0");
});


test('tests if exception throws then panel is missing', () => {
  const brokenMarkup = `<div class="g-tab__tab-group" data-tabs>
  <ul class="g-tab__tab-list">
    <li class="g-tab__tab" data-tab data-testid="tab1"><a href="#tab1">Tab1</a></li>
    <li class="g-tab__tab" data-tab data-testid="tab2"><a href="#tab2">Tab2</a></li>
    <li class="g-tab__tab" data-tab data-testid="tab3"><a href="#tab3">Tab3</a></li>
  </ul>

  <section id="tab1" data-testid="tabpanel1"  class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab1</h3>
  <p>Tab 1 content here...</p>
  </section>

  <section id="tab2" data-testid="tabpanel2" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab2</h3>
    <p>Tab2 content here...</p>
  </section>
  <!-- missing panel 3 -->
</div>
`;
  document.body.innerHTML = brokenMarkup;
  const tabs = new Tabs;
  expect(tabs.init).toThrow('The panel with id #tab3 does not exist. You can find an example of correct markdown at https://github.com/frontgirl/accessible-components');
});

test('tests if exception throws then tab is missing', () => {
  const brokenMarkup = `<div class="g-tab__tab-group" data-tabs>
  <ul class="g-tab__tab-list">
    <li class="g-tab__tab" data-tab data-testid="tab1"><a href="#tab1">Tab1</a></li>
    <!-- <li class="g-tab__tab" data-tab data-testid="tab2"><a href="#tab2">Tab2</a></li> -->
    <li class="g-tab__tab" data-tab data-testid="tab3"><a href="#tab3">Tab3</a></li>
  </ul>

  <section id="tab1" data-testid="tabpanel1"  class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab1</h3>
  <p>Tab 1 content here...</p>
  </section>

  <section id="tab2" data-testid="tabpanel2" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab2</h3>
    <p>Tab2 content here...</p>
  </section>

  <section id="tab3" data-testid="tabpanel3" class="g-tab__tab-panel" data-tab-panel>
    <h3>Tab3</h3>
    <p>Tab3 content here...</p>
  </section>
</div>
`;
  document.body.innerHTML = brokenMarkup;
  const tabs = new Tabs;
  expect(tabs.init).toThrow('The panel with id tab2 doesn\'t have matching tab. You can find an example of correct markdown at https://github.com/frontgirl/accessible-components');
});