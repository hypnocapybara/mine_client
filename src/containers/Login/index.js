import React from 'react';
import { Form, Button } from 'react-bootstrap';
import schema from 'libs/state';
import { isFailResponse } from 'services/base';
import { loginService } from 'services/auth';
import FellowLogo from './images/fellow.svg';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onSumbit = this.onSumbit.bind(this);
    // Uncontrolled component workflow example, but it is not for real projects
    this.inputUsername = React.createRef();
    this.inputPassword = React.createRef();
  }

  onSumbit(event) {
    event.preventDefault();

    const username = this.inputUsername.current.value;
    const password = this.inputPassword.current.value;
    loginService(this.props.tree, username, password);
  }

  render() {
    return (
      <div>
        <h2 className="text-center">Login</h2>
        <Form onSubmit={this.onSumbit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control required type="text" ref={this.inputUsername}
                          placeholder="Enter username" name="username" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" ref={this.inputPassword}
                          placeholder="Enter password" name="password" />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Login
            </Button>

            <Button variant="info" type="button" onClick={this.props.goRegistration}>
              Go Registration
            </Button>
          </div>
        </Form>
        <hr />
        {this.renderError()}
        <div className="text-center">
          <p>Made by Alex for</p>
          <p><img src={FellowLogo} alt="fellow" /></p>
        </div>
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
        <div className="text-danger text-center">
          {JSON.stringify(response.error.data)}
        </div>
        <hr />
      </div>
    );
  }
}

// Response can be stored in tree cursor, because we have similar answer
// on 3 actions: login. register, currentUser
export default schema({})(Login)
