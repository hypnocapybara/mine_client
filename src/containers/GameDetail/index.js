import React from 'react';
import { Button } from 'react-bootstrap';
import schema from 'libs/state';
import { Logout } from 'components';
import { startGameService } from 'services/game';
import { isSuccessResponse } from 'services/base';
import GameField from './GameField';
import { isUserTurn } from './utils';
import ForeverAloneImage from './images/fa.png';
import LoseImage from './images/lose.png';
import WinImage from './images/win.png';


const model = {
  tree: {
    startGameResult: {}
  }
};

class GameDetail extends React.Component {
  constructor(props) {
    super(props);

    this.goBackPressed = this.goBackPressed.bind(this);
    this.onPlayAlonePressed = this.onPlayAlonePressed.bind(this);
  }

  render() {
    const user = this.props.userCursor.get('data');
    const gameCursor = this.props.userCursor.select('data', 'currentGame');

    return (
      <div>
        {this.renderStatus()}

        <hr />

        <GameField
          user={user}
          tree={gameCursor}
        />

        <Logout
          userCursor={this.props.userCursor}
        />
      </div>
    );
  }

  renderStatus() {
    const user = this.props.userCursor.get('data');
    const game = user.currentGame;

    if (game.status === 'created') {
      return (
        <div className="text-center">
          <p>Waiting for other player to join...</p>
          <p>Or press on picture to start play alone:</p>
          <p>
            <img src={ForeverAloneImage} onClick={this.onPlayAlonePressed}
                 alt="Forever Alone" style={{ cursor: 'pointer' }} />
          </p>
        </div>
      );
    }

    if (game.status === 'win' || game.status === 'lose') {
      return (
        <div className="text-center">
          {game.status === 'win' ?
            <div>
              <p>You win!</p>
              <p>
                <img src={WinImage} alt="win" />
              </p>
            </div>
          :
            <div>
                <p>You Lose!</p>
                <p>
                  <img src={LoseImage} alt="lose" />
                </p>
              </div>
          }
          <Button variant="primary" type="button" onClick={this.goBackPressed}>
            {'< Go back'}
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p>
          {`Flags left: ${game.restFlagsCount}`}
        </p>
        {game.secondPlayer ? this.renderCurrentTurn(user, game) : null}
      </div>
    );
  }

  renderCurrentTurn(user, game) {
    const otherPlayer = user.pk === game.firstPlayer.pk ? game.secondPlayer : game.firstPlayer;

    if (isUserTurn(user, game)) {
      return (
        <p>
          Your turn
        </p>
      );
    } else {
      return (
        <p>
          {`${otherPlayer.username} turn`}
        </p>
      );
    }
  }

  goBackPressed() {
    const currentGameCursor = this.props.userCursor.select('data', 'currentGame');
    currentGameCursor.set(null);
  }

  async onPlayAlonePressed() {
    const userDataCursor = this.props.userCursor.select('data');
    const { pk } = userDataCursor.get('currentGame');

    const result = await startGameService(
      this.props.tree.startGameResult,
      pk, userDataCursor.get('token'));

    if (isSuccessResponse(result)) {
      userDataCursor.select('currentGame').set(result.data);
    } else {
      // handle error
    }
  }
}

export default schema(model)(GameDetail);
