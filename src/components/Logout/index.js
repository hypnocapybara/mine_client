import React from 'react';
import { Button } from 'react-bootstrap';
import { clearToken } from 'services/token';


export class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  render() {
    return (
      <div className="text-center">
        <Button
          type="button"
          variant="warning"
          onClick={this.doLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  doLogout() {
    const { userCursor } = this.props;
    userCursor.set({});
    clearToken();
  }
}
