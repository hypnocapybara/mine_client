import React from 'react';
import _ from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import schema, {isLoadingCursor, isSuccessCursor} from 'libs/state';
import { getUserByToken } from 'services/auth';
import { Spinner } from 'components/Spinner';
import Login from './containers/Login';
import Registration from './containers/Registration';
import Games from './containers/Games';
import GameDetail from './containers/GameDetail';
import { getToken, clearToken } from 'services/token';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginTab: 'login'
    };

    this.goLogin = this.goLogin.bind(this);
    this.goRegistration = this.goRegistration.bind(this);
  }

  async componentDidMount() {
    const token = getToken();
    if (token) {
      const tokenResult = await getUserByToken(this.props.tree.userCursor, token);
      if (tokenResult.status === 'fail') {
        // clear bad token
        clearToken();
      }
    } else {
      this.props.tree.userCursor.set({});
    }
  }

  goLogin() {
    this.props.tree.userCursor.set({}); // To clear errors
    this.setState({ loginTab: 'login' });
  }

  goRegistration() {
    this.props.tree.userCursor.set({}); // To clear errors
    this.setState({ loginTab: 'registration' });
  }

  renderContent() {
    const { tree } = this.props;
    const { loginTab } = this.state;

    if (_.isUndefined(tree.userCursor.get()) || isLoadingCursor(tree.userCursor)) {
      return (<Spinner />);
    }

    if (isSuccessCursor(tree.userCursor)) {
      const user = tree.userCursor.get('data');

      if (!_.isEmpty(user.currentGame)) {
        return (
          <GameDetail
            tree={tree.gameDetail}
            userCursor={tree.userCursor}
          />
        );
      }

      return (
        <Games
          tree={tree.games}
          userCursor={tree.userCursor}
        />
      );
    }

    if (loginTab === 'registration') {
      return (
        <Registration
          tree={tree.userCursor}
          goLogin={this.goLogin}
        />
      );
    }

    return (
      <Login
        tree={tree.userCursor}
        goRegistration={this.goRegistration}
      />
    );
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <div className="card formCard">
              <div className="text-center">
                <h1>Minesweeper</h1>
              </div>
              <hr />

              {this.renderContent()}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default schema({})(App)
