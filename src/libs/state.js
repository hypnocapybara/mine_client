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

function initCursor(cursor, schema) {
  if (_.isFunction(schema)) {
    if (!cursor.exists()) {
      schema(cursor);
    }
  } else if (_.isPlainObject(schema)) {
    _.forEach(schema, (childSchema, path) => {
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

    _.forEach(props.parentProps, (prop, propName) => {
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

  componentWillUnmount() {
    _.forEach(this.props.parentProps, (cursor) => {
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
    const { mapTreeToProps, parentProps } = this.props;
    const tree = _.get(
      _.find(parentProps, (prop) => prop instanceof Baobab.Cursor),
      'tree');
    let treeProps = {};
    if (tree) {
      _.forEach(mapTreeToProps, (path, key) => treeProps[key] = tree.select(path).get());
    }

    return (
      <ChildComponent {...this.props.parentProps} {...treeProps} />
    );
  }
}


export default (model, mapTreeToProps) => (component) => {
  function _Component(props) {
    const schema = _.isFunction(model) ? model(props) : model;
    return (
      <TreeStateWrapper
        schema={schema}
        mapTreeToProps={mapTreeToProps}
        component={component}
        parentProps={props}
      />
    );
  }
  return _Component;
};
