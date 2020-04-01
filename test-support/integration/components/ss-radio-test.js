import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { defer } from 'rsvp';

module('Integration | Component | ss radio', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="fruit" label="Once a week"}}
          </div>
          <div class="field">
            {{ss-radio name="fruit" label="2-3 times a week"}}
          </div>
          <div class="field">
            {{ss-radio name="fruit" label="Once a day"}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
  });

  test('will start with selected current property', async function(assert) {
    assert.expect(3);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    this.set('frequency', 'weekly');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange shouldnt have been called');
  });

  test('selecting will update the bound property', async function(assert) {
    assert.expect(3);

    let count = 0;
    this.set('changed', (value) => {
      this.set('frequency', value);
      count++;
    });

    this.set('frequency', 'weekly');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    await click('.fields div:nth-child(3) .ui.radio');
    assert.equal('daily', this.get('frequency'));
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('selecting twice will update the bound property to the latest', async function(assert) {
    assert.expect(8);

    let count = 0;
    this.set('changed', (value) => {
      this.set('frequency', value);
      count++;
    });

    this.set('frequency', 'weekly');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    await click('.fields div:nth-child(3) .ui.radio');
    assert.equal('daily', this.get('frequency'));
    assert.dom('.fields div:nth-child(3) .ui.radio').hasClass('checked');

    await click('.fields div:nth-child(1) .ui.radio');
    assert.equal('weekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');

    await click('.fields div:nth-child(2) .ui.radio');
    assert.equal('biweekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 3, 'onChange should have been called three times');
  });

  test('setting disabled ignores click', async function(assert) {
    assert.expect(6);

    let count = 0;
    this.set('changed', (value) => {
      this.set('frequency', value);
      count++;
    });

    this.set('checked', false);
    this.set('disabled', true);
    this.set('frequency', 'weekly');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency disabled=disabled onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    await click('.fields div:nth-child(2) .ui.radio');

    assert.equal('weekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');

    this.set('disabled', false);

    await click('.fields div:nth-child(2) .ui.radio');
    assert.equal('biweekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('setting readonly ignores click', async function(assert) {
    assert.expect(6);

    let count = 0;
    this.set('changed', (value) => {
      this.set('frequency', value);
      count++;
    });

    this.set('checked', false);
    this.set('readonly', true);
    this.set('frequency', 'weekly');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency readonly=readonly onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    await click('.fields div:nth-child(2) .ui.radio');

    assert.equal('weekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');

    this.set('readonly', false);

    await click('.fields div:nth-child(2) .ui.radio');
    assert.equal('biweekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('setting binded value updates to current', async function(assert) {
    assert.expect(7);

    let count = 0;
    this.set('changed', (value) => {
      this.set('frequency', value);
      count++;
    });

    this.set('checked', false);
    this.set('disabled', true);
    this.set('frequency', 'weekly');
    this.set('value1', 'weekly1');
    this.set('value2', 'biweekly');
    this.set('value3', 'daily');
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value=value1 current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value=value3 current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    assert.equal('weekly', this.get('frequency'));
    this.set('value1', 'weekly');
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');

    this.set('frequency', 'biweekly');
    assert.equal('biweekly', this.get('frequency'));
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('will selected when current promise resolves', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    let deferred = defer();

    this.set('frequency', deferred.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    deferred.resolve('weekly');

    await settled();

    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(1) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('will selected when value promise resolves', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    let deferred = defer();

    this.set('frequency', 'biweekly');
    this.set('value2', deferred.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    deferred.resolve('biweekly');

    await settled();

    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('will selected when value promise resolves', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    let deferredCurrent = defer();
    let deferredValue = defer();

    this.set('frequency', deferredCurrent.promise);
    this.set('value3', deferredValue.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    deferredCurrent.resolve('daily');
    deferredValue.resolve('daily');

    await settled();

    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(3) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('will update properly if a static value is replaced for a promise on value', async function(assert) {
    assert.expect(8);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    let value2 = 'biweekly';

    this.set('frequency', 'biweekly');
    this.set('value2', value2);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');

    let deferred = defer();

    this.set('value2', deferred.promise);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    deferred.resolve('bi-weekly');

    await settled();

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('will update properly if a static value is replaced for a promise on current', async function(assert) {
    assert.expect(9);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    let current = 'biweekly';

    this.set('frequency', current);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            {{ss-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
          </div>
          <div class="field">
            {{ss-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
          </div>
        </div>
      </div>
    `);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');

    let deferred = defer();

    this.set('frequency', deferred.promise);

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').doesNotExist();

    deferred.resolve('biweekly');

    await settled();

    assert.dom('.ui.radio').exists({ count: 3 });
    assert.dom('.ui.radio.checked').exists();
    assert.dom('.fields div:nth-child(2) .ui.radio').hasClass('checked');
    assert.equal(count, 0, 'onChange should not have been called');
  });
});
