var React = require('react');

var Leaderboard = React.createClass({
  render: function() {
    return (
      <div className="leaderboardPage">
        <div className="userSide">
          <h1 className="lbHeader">Statistics</h1>
          <section>
            <div className="tbl-header">
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Score</th>
                    <th>Level</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="tbl-content">
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>Advanced</td>
                    <td>2000</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td>Classic</td>
                    <td>1980</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>Advanced</td>
                    <td>1760</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>Relaxed</td>
                    <td>1580</td>
                    <td>19</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="boardSide">
          <h1 className="lbHeader">Leaderboards</h1>
          <section>
            <div className="tbl-header">
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Username</th>
                    <th>Score</th>
                    <th>Level</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="tbl-content">
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>Advanced</td>
                    <td>Adam</td>
                    <td>2000</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td>Classic</td>
                    <td>Taylor</td>
                    <td>1980</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>Advanced</td>
                    <td>Julian</td>
                    <td>1760</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>Relaxed</td>
                    <td>Ruth</td>
                    <td>1580</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>Silent</td>
                    <td>Virginia</td>
                    <td>70</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>Advanced</td>
                    <td>Adam</td>
                    <td>2000</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td>Classic</td>
                    <td>Taylor</td>
                    <td>1980</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>Advanced</td>
                    <td>Julian</td>
                    <td>1760</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>Relaxed</td>
                    <td>Ruth</td>
                    <td>1580</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>Silent</td>
                    <td>Virginia</td>
                    <td>70</td>
                    <td>2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    )
  }
});

module.exports = Leaderboard
