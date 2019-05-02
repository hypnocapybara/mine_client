import React from 'react';
import _ from 'lodash';
import schema from 'libs/state';
import { Button } from 'react-bootstrap';
import { gamesListService } from 'services/game';
import { Spinner, Logout } from 'components';
import { isLoadingResponse, isSuccessResponse } from 'services/base';
import { createGameService } from 'services/game';
import { joinGameService } from 'services/game';

import Stats from './Stats';


const model = {
  tree: {
    games: {},
    joinGameResult: {},
    createGameResult: {},
    stats: {},
  },
};

class Games extends React.Component {
  constructor(props) {
    super(props);

    this.createNewGame = this.createNewGame.bind(this);
  }

  componentDidMount() {
    const token = this.props.userCursor.get('data', 'token');
    gamesListService(
      this.props.tree.games,
      token);
  }

  async createNewGame() {
    const userDataCursor = this.props.userCursor.select('data');

    const result = await createGameService(
      this.props.tree.createGameResult,
      userDataCursor.get('token'));

    if (isSuccessResponse(result)) {
      userDataCursor.select('currentGame').set(result.data);
    } else {
      // handle error
    }
  }

  async joinGame(game) {
    const userDataCursor = this.props.userCursor.select('data');

    const result = await joinGameService(
      this.props.tree.joinGameResult,
      game.pk,
      userDataCursor.get('token'));

    if (isSuccessResponse(result)) {
      userDataCursor.select('currentGame').set(result.data);
    } else {
      // handle error
    }
  }

  render() {
    const { userCursor } = this.props;
    const user = userCursor.get('data');

    return (
      <div>
        <div className="text-center">
          {`Logged in as ${user.username}`}
        </div>

        <hr />

        <div className="text-center" style={{ marginBottom: '20px' }}>
          <Button
            type="button"
            variant="success"
            onClick={this.createNewGame}
          >
            Create New
          </Button>
        </div>

        <div className="text-center">Available games list:</div>
        {this.renderGamesList()}

        <Stats
          tree={this.props.tree.stats}
        />

        <Logout
          userCursor={userCursor}
        />
      </div>
    );
  }

  renderGamesList() {
    const games = this.props.tree.games.get();
    if (!games || isLoadingResponse(games)) {
      return (
        <Spinner />
      );
    }

    return (
      <table className="table table-bordered" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Game</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {_.map(games.data, (game) => (
            <tr key={`game-${game.pk}`}>
              <td>
                {`${game.firstPlayer.username}`}
              </td>
              <td>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => this.joinGame(game)}
                >
                  Join
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default schema(model)(Games);
