import Ember from 'ember';
import isPromise from 'ember-promise-tools/utils/is-promise';
import isFulfilled from 'ember-promise-tools/utils/is-fulfilled';
import getPromiseContent from 'ember-promise-tools/utils/get-promise-content';
import PromiseResolver from 'ember-promise-tools/mixins/promise-resolver';

export default Ember.Component.extend(PromiseResolver, {
  classNames: ['ui', 'checkbox', 'radio'],
  classNameBindings: ['checked:checked', 'readonly:read-only'],

  init() {
    this._super(...arguments);

    if (Ember.isBlank(this.get('name'))) {
      this.set('name', 'default');
      Ember.Logger.warn("The required component parameter of 'name' was not passed into the ss-radio component");
    }
  },

  checked: Ember.computed('value', 'current', function() {
    let value = this._getValue('value');
    let current = this._getValue('current');
    if (value === current) {
      return true;
    }

    this._scheduleValue(value, 'value');
    this._scheduleValue(current, 'current');
    return false;
  }),

  click(event) {
    if (this.get('disabled') || this.get('readonly')) {
      return;
    }

    let action = this.get('onChange');
    if (typeof action === 'function') {
      let value = this.get('value');
      action(value);
    }
  },

  _getValue(name) {
    let value = this.get(name);
    if (isPromise(value) && isFulfilled(value)) {
      return getPromiseContent(value);
    }

    return value;
  },

  _scheduleValue(value, name) {
    if (isPromise(value)) {
      if (!isFulfilled(value)) {
        return this.resolvePromise(value, () => this.notifyPropertyChange(name));
      }
    }
    return true;
  }

});


