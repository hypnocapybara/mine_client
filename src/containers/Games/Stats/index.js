import React from 'react';
import _ from 'lodash';
import schema from 'libs/state';

import { Spinner } from 'components';
import { isLoadingResponse, isSuccessResponse } from 'services/base';
import { statsService } from 'services/stats';


class Stats extends React.Component {
  componentDidMount() {
    const { tree, token } = this.props;
    statsService(tree, token);
  }

  render() {
    const response = this.props.tree.get();
    if (_.isEmpty(response) || isLoadingResponse(response)) {
      return (<Spinner />);
    }

    if (isSuccessResponse(response)) {
      return (
        <div className="text-center" style={{ margin: '1rem 0' }}>
          <p>Users score:</p>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Username</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {_.map(response.data, (user) => (
                <tr key={`stats-${user.username}`}>
                  <td>{`${user.username}`}</td>
                  <td>{user.wins}</td>
                  <td>{user.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else {
      return null;
    }
  }
}


export default schema({}, {
  token: ['userCursor', 'data', 'token'],
})(Stats);
