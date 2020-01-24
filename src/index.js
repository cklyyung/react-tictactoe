import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button
        className={props.highlight ? "square-win" : "square"}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(x,y) {
      let winningLine = findWinningLine(this.props.squares);
      let highlight = (winningLine && winningLine.includes([x,y].toString())) ? true : null;
      return (
        <Square
          key={(x,y)}
          value={this.props.squares[x][y]}
          onClick={() => this.props.onClick(x,y)}
          highlight={highlight}
        />
      );
    }

    createSquares() {
      let rows = [];
      for(var i = 0; i < 3; i++){
        let squares = [];
        for(var j = 0; j < 3; j++){
          squares.push(this.renderSquare(i,j));
        }
        rows.push(<div key={i} className="board-row">{squares}</div>);
      }
      return rows;
    }
  
    render() {
      return (
        <div>
          {this.createSquares()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array.from(Array(3), () => Array(3).fill(null)),
          move: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        sortLeastRecent: true,
      };
    }

    handleClick(x,y) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.map((square) => square.slice());
      if (calculateWinner(squares) || squares[x][y]) {
        return;
      }
      squares[x][y] = this.state.xIsNext? 'X':'O';
      this.setState({
        history: history.concat([{
          squares:squares,
          move: [x,y],
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    toggleSort() {
      this.setState({
        sortLeastRecent: !this.state.sortLeastRecent,
      })
    }

    restart() {
      this.setState({
        stepNumber: 0,
        history: [{
          squares: Array.from(Array(3), () => Array(3).fill(null)),
          move: null,
        }],
        xIsNext: true
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' (' + history[move].move + ')':
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {move === this.state.stepNumber ? <b>{desc}</b> : desc}
            </button>
          </li>
        )
      });

      let status;
      if (winner === "draw") {
        status = 'It\'s a draw!';
      } else if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(x,y) => this.handleClick(x,y)}
            />
          </div>
          <div className="game-info">
            <div className="game">
              {status}
              <div className="game-info">
                <button onClick={() => this.restart()}>Restart</button>
              </div>
            </div>
            <div>
              <div className="game">
                <div>{this.state.sortLeastRecent ? 'Least Recent' : 'Most Recent'} Move At Top</div>
                <div className="game-info">
                  <button onClick={() =>this.toggleSort()}>
                    Swap
                  </button>
                </div>
              </div>
              <ol>{this.state.sortLeastRecent ? moves : moves.reverse()}</ol>
            </div>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    for (let i = 0; i < 3; i++) {
      if (squares[i][0] && squares[i][0] === squares[i][1]&& squares[i][0] === squares[i][2]) {
        return squares[i][0]; // horizontal win
      }
      else if (squares[0][i] && squares[0][i] === squares[1][i]&& squares[0][i] === squares[2][i]) {
        return squares[0][i]; // vertical win
      }
    }
    if (squares[1][1] && ((squares[1][1] === squares[0][0] && squares[1][1] === squares[2][2])
      || (squares[1][1] === squares[0][2] && squares[1][1] === squares[2][0]))) {
        return squares[1][1];
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (squares[i][j] == null) {
          return null;
        }
      }
    }
    return "draw";
  }
  
  function findWinningLine(squares) {
    let winningLine;
    for (let i = 0; i < 3; i++) {
      if (squares[i][0] && squares[i][0] === squares[i][1]&& squares[i][0] === squares[i][2]) {
        winningLine = [[i,0], [i,1], [i,2]]; // horizontal win
      }
      else if (squares[0][i] && squares[0][i] === squares[1][i]&& squares[0][i] === squares[2][i]) {
        winningLine = [[0,i], [1,i], [2,i]]; // vertical win
      }
    }
    if (squares[1][1] && squares[1][1] === squares[0][0] && squares[1][1] === squares[2][2]) {
      winningLine = [[0,0], [1,1], [2,2]]
    }
    if (squares[1][1] && squares[1][1] === squares[0][2] && squares[1][1] === squares[2][0]) {
      winningLine = [[2,0], [1,1], [0,2]]
    }
    if (winningLine) {
      return winningLine.map((coords) => coords.toString());
    }
    return winningLine;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  