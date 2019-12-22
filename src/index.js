import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const highlight = props.highlight;
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ borderWidth: highlight }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const highlight = this.props.highlight;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.highlight && this.props.highlight.includes(i) ? 2 : 1}
      />
    );
  }

  render() {
    let culs = [];
    for (let i = 0; i < 3; i++) {
      let rows = [];
      for (let j = 0; j < 3; j++) {
        rows.push(this.renderSquare(i * 3 + j))
      }
      culs.push(<div key={i} className="board-row">{rows}</div>)
    }
    return culs;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      loc: '',
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();


    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        loc: '(' + Math.floor(i / 3) + ',' + i % 3 + ')',
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    const current = this.state.history[step];
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      loc: current.loc,
    });
  }

  handleSort() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const infos = calculateWinner(current.squares);
    const winner = infos.winner;
    const loc = current.loc;
    const isAscending = this.state.isAscending;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={move === this.state.stepNumber ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>{desc}</button>
        </li>
      );
    });
    if (!isAscending) {
      moves.reverse();
    }
    let status;
    if (infos.isDraw) {
      status = 'Game is draw';
    } else if (winner) {
      status = 'Winner' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlight={infos.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div style={{ marginLeft: '10px' }}>
          <div>{'Current Location:'} {loc}</div>
          <button
            onClick={(i) => this.handleSort(i)}
          >
            {isAscending ? 'Descending' : 'Ascending'}
          </button>

        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
    else if (i == (squares.length - 1)) {
      return{
        winner: null,
        line: null,
        isDraw: true,
      };
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      };
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: false,
  };
}