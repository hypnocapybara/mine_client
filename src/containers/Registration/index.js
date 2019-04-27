import React from 'react';
import { Form, Button } from 'react-bootstrap';
import schema from 'libs/state';
import { isFailResponse } from 'services/base';
import { registerService } from 'services/auth';


// Another approach: controlled inputs with values in local cursors
// of course, it's better to make input as separate component in real project
const model = {
  tree: {
    form: {
      username: '',
      password: '',
    }
  },
};


class Registration extends React.Component {
  constructor(props) {
    super(props);

    this.onSumbit = this.onSumbit.bind(this);
  }

  onSumbit(event) {
    event.preventDefault();

    const { username, password } = this.props.tree.get('form');
    registerService(this.props.tree, username, password);
  }

  render() {
    const usernameCursor = this.props.tree.form.username;
    const passwordCursor = this.props.tree.form.password;
    const { username, password } = this.props.tree.get('form');

    return (
      <div>
        <h2 className="text-center">Registration</h2>
        <Form onSubmit={this.onSumbit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              required type="text" value={username}
              placeholder="Enter username"
              onChange={(e) => usernameCursor.set(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              required type="password" value={password}
              placeholder="Enter password"
              onChange={(e) => passwordCursor.set(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Register
            </Button>

            <Button variant="info" type="button" onClick={this.props.goLogin}>
              Go Login
            </Button>
          </div>
        </Form>
        {this.renderError()}
      </div>
    )
  }

  renderError() {
    const response = this.props.tree.get();
    if (!response) {
      return null;
    }

    if (!isFailResponse(response)) {
      return null;
    }

    return (
      <div>
        <hr />
        <div className="text-danger text-center">
          {JSON.stringify(response.error.data)}
        </div>
      </div>
    );
  }
}

export default schema(model)(Registration)
