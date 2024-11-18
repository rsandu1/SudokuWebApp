import './App.css'
import { SudokuProvider } from './context/SudokuContext';
import SudokuBoard from './components/board/SudokuBoard';
import LowerMenu from './components/menu/LowerMenu'
import UpperMenu from './components/menu/UpperMenu'
function App() {

  return (
    <><div>
      <h1>Sudoku Game</h1>
      <SudokuProvider>
        <UpperMenu />
        <SudokuBoard />
        <LowerMenu />
      </SudokuProvider>
    </div></>
  );
}

export default App
