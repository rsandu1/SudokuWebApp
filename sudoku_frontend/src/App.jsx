import { SudokuProvider } from './context/SudokuContext';
import SudokuBoard from './components/board/SudokuBoard';
import LowerMenu from './components/menu/LowerMenu'
import UpperMenu from './components/menu/UpperMenu'
import NavBar from './components/nav/NavBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <><div>
      <SudokuProvider>
        <NavBar />
        <UpperMenu />
        <SudokuBoard />
        <LowerMenu />
      </SudokuProvider>
    </div></>
  );
}

export default App
