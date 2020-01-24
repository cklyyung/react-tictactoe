import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(x,y) {
      return (
        <Square
          key={(x,y)}
          value={this.props.squares[x][y]}
          onClick={() => this.props.onClick(x,y)}
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
        }],
        stepNumber: 0,
        xIsNext: true,
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

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button
              style={ move === this.state.stepNumber ? { fontWeight: 'bold' } : { fontWeight: 'normal' } }
              onClick={() => this.jumpTo(move)}
            >
                {desc}
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
            <div>{status}</div>
            <ol>{moves}</ol>
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
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  