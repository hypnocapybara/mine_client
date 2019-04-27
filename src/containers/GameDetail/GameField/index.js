import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import schema, { isLoadingCursor } from 'libs/state';
import { testFieldService, flagFieldService } from 'services/game';
import { SERVER_ADDRESS } from 'config/defaults';

import { isUserTurn } from '../utils';
import FlagImage from './images/flag.png';
import MineImage from './images/mine.png';
import LoaderImage from './images/loader.gif';
import s from './GameField.module.css';


const model = {
  serviceResult: {},
};


class GameField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastClickX: -1,
      lastClickY: -1,
    };

    this.onSocketGameMessage = this.onSocketGameMessage.bind(this);
  }

  componentDidMount() {
    const { pk } = this.props.tree.get();
    this.socket = new WebSocket(`ws://${SERVER_ADDRESS}/ws/game/${pk}/`);
    this.socket.onmessage = this.onSocketGameMessage;
  }

  componentWillUnmount() {
    this.socket.close();
  }

  onSocketGameMessage({ data }) {
    const message = JSON.parse(data);
    const game = JSON.parse(message.game);
    this.props.tree.set(game);
  }

  render() {
    const { user } = this.props;
    const { lastClickX, lastClickY } = this.state;

    const game = this.props.tree.get();
    const { secondPlayer, field } = game;
    const isMyTurn = game.status === 'in_progress' && (
      !secondPlayer || isUserTurn(user, game));

    return (
      <div className={s.wrapper}>
        <div className={s.board}>
          {_.map(field, (row, rowIndex) => (
           <div className={s.row} key={`row-${rowIndex}`}>
             {_.map(row, (col, colIndex) => {
               const mark = col[0];
               const visible = col[1];
               const flagged = col[2];

               const isInLoad = isLoadingCursor(this.props.tree.serviceResult);
               const isColAvailable = isMyTurn && !isInLoad && mark === ' ' && !visible && !flagged;
               const isLastClickCol = lastClickX === rowIndex && lastClickY === colIndex;
               const isColInLoad = isInLoad && isLastClickCol;

               return (
                 <div key={`row-${rowIndex}-col-${colIndex}`}
                      onClick={() => { isColAvailable && this.colClicked(rowIndex, colIndex) }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        isColAvailable && this.colRightClicked(rowIndex, colIndex)
                      }}
                      className={cx(s.col, {
                        [s.available]: isColAvailable,
                        [s.disabled]: visible,
                        [s.exploded]: mark === '*' && isLastClickCol,
                      })}>
                   <div className={s.colSymbol}>
                     {isColInLoad ? <img src={LoaderImage} alt="" /> : null}
                     {mark === '*' ? <img src={MineImage} alt="mine" /> : null}
                     {flagged ? <img src={FlagImage} alt="flag" /> : null}
                     {Number.isInteger(mark) ? mark : null}
                   </div>
                 </div>
             )})}
           </div>
          ))}
        </div>
      </div>
    );
  }

  colClicked(x, y) {
    this.handleClick(testFieldService, x, y);
  }

  colRightClicked(x, y) {
    this.handleClick(flagFieldService, x, y);
  }

  handleClick(service, x, y) {
    if (isLoadingCursor(this.props.tree.testResult)) {
      return;
    }

    this.setState({ lastClickX: x, lastClickY: y });

    const { user } = this.props;
    const { pk } = this.props.tree.get();

    service(this.props.tree.serviceResult, pk, x, y, user.token);
  }
}

export default schema(model)(GameField);
