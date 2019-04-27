import React, { Component } from 'react';
import Baobab from 'baobab';
import _ from 'lodash';


export function isLoadingCursor(cursor) {
  return cursor.get('status') === 'loading';
}

export function isSuccessCursor(cursor) {
  return cursor.get('status') === 'success';
}

export function isFailCursor(cursor) {
  return cursor.get('status') === 'fail';
}


function compareProps(oldProps, newProps) {
  const oldKeys = _.keys(oldProps);
  const newKeys = _.keys(newProps);

  if (oldKeys.length !== newKeys.length) {
    return false;
  }

  return !_.some(oldProps, (oldProp, key) => {
    if (oldProp instanceof Baobab.Cursor) {
      return oldProp.path !== newProps[key].path;
    }
    return !_.isEqual(oldProp, newProps[key]);
  });
}

function initCursor(cursor, schema) {
  if (_.isFunction(schema)) {
    if (!cursor.exists()) {
      schema(cursor);
    }
  } else if (_.isPlainObject(schema) && !_.isArray(schema)) {
    _.each(schema, (childSchema, path) => {
      initCursor(cursor.select(path), childSchema);
    });
  } else if (!cursor.exists()) {
    cursor.set(schema);
  }
}

class TreeStateWrapper extends Component {
  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.handleNewCursor = this.handleNewCursor.bind(this);

    _.each(props.parentProps, (prop, propName) => {
      if (prop instanceof Baobab.Cursor) {
        this.handleNewCursor(prop, propName);
     }
    });
  }

  handleNewCursor(cursor, cursorName) {
    const schema = this.props.schema[cursorName];
    if (schema) {
      initCursor(cursor, schema);
      cursor.tree.commit();
    }
    cursor.on('update', this.onUpdate);
  }

  componentWillReceiveProps(props) {
    _.each(props.parentProps, (prop, propName) => {
      if (prop instanceof Baobab.Cursor) {
        const oldProp = this.props.parentProps[propName];
        if (oldProp.path !== prop.path) {
          oldProp.off('update', this.onUpdate);
          this.handleNewCursor(prop, propName);
        }
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return !compareProps(this.props.parentProps, nextProps.parentProps);
  }

  componentWillUnmount() {
    _.each(this.props.parentProps, (cursor) => {
      if (cursor instanceof Baobab.Cursor) {
        cursor.off('update', this.onUpdate);
      }
    });
  }

  onUpdate() {
    this.forceUpdate();
  }

  render() {
    const ChildComponent = this.props.component;
    return (
      <ChildComponent {...this.props.parentProps} />
    );
  }
}


export default (model) => (component) => {
  function _Component(props) {
    const schema = _.isFunction(model) ? model(props) : model;
    return (
      <TreeStateWrapper
        schema={schema}
        component={component}
        parentProps={props}
      />
    );
  }
  return _Component;
};
