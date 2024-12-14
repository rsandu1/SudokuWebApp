import React, { useState } from 'react';
import { Container, Form, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import './NavBar.css'
import { useSudoku } from '../../context/SudokuContext';

const NavBar = () => {
    const { difficulty, setDifficulty, startGame, setIsPaused, setTimer, setCurDifficulty, inGame, setInGame, retrieveGame } = useSudoku();
    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
    };

    // Handle dialogue states.
    const [open, setOpen] = useState(false);

    const [newOpen, setNewOpen] = useState(false);

    // Handle board ID for game retrieval 
    const [boardId, setBoardId] = useState('');

    const handleInputChange = (e) => {
        setBoardId(e.target.value); 
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewOpen = () => {
        setNewOpen(true);
    };

    const handleNewClose = () => {
        setNewOpen(false);
    };

    // Handle confirm start game
    const handleConfirmNewGame = () => {
        startGame();
        setTimer(0);
        setInGame(true);
        setNewOpen(false);
        setIsPaused(false);
        setCurDifficulty(difficulty);
    };

    // Handle confirm retrieve game
    const handleConfirmRetrieveGame = () => {
        console.log('Clicked Retrieve');
        console.log("Board ID:", boardId);
        setOpen(false);
        retrieveGame(boardId);

    };

    return (
        <Navbar
            fixed="top"
            expand="sm"
            className="navbar mb-3"
        >
            <Container fluid>
                <Navbar.Brand className="navbar-title">Sudoku Game</Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-sm"
                    aria-labelledby="offcanvasNavbarLabel-expand-sm"
                    placement="end"
                    className="navbar-offcanvas"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-sm">
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <NavDropdown
                                title="New Game"
                                id="offcanvasNavbarDropdown-expand-sm"
                            >
                                {/* Difficulty Selection */}
                                <NavDropdown.Item>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Form.Select
                                            value={difficulty}
                                            onChange={handleDifficultyChange}
                                            aria-label="Difficulty Select"
                                            style={{ minWidth: '120px' }}
                                        >
                                            <option value="0">Easy</option>
                                            <option value="1">Medium</option>
                                            <option value="2">Hard</option>
                                        </Form.Select>
                                    </div>
                                </NavDropdown.Item>

                                {/* New Game Button */}
                                <NavDropdown.Item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNewOpen}
                                    >
                                        New Game
                                    </Button>
                                </NavDropdown.Item>

                                {/* Warning Message to confirm start new game */}
                                <div>
                                    <Dialog open={newOpen} onClose={handleNewClose}>
                                        <DialogTitle>Start Game</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                {inGame ? 'Are you sure you want to start a new game? This will overwrite the current progress.'
                                                : 'Are you sure you want to start a new game?'}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleNewClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleConfirmNewGame} color="grey" autoFocus>
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </NavDropdown>
                            <NavDropdown
                                title="Retrieve Game"
                                id="offcanvasNavbarDropdown-expand-sm"
                            >
                                <NavDropdown.Item>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Control type="email" placeholder="Board ID" value={boardId} onChange={handleInputChange} />
                                        </Form.Group>
                                    </div>

                                    <NavDropdown.Item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleOpen}
                                        >
                                            Retrieve Game
                                        </Button>
                                    </NavDropdown.Item>

                                    {/* Warning Message to confirm retrieve game */}
                                    <div>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogTitle>Retrieve Game</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Are you sure you want to retrieve the game? This will overwrite the current progress.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleConfirmRetrieveGame} color="grey" autoFocus>
                                                    Yes
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};


export default NavBar;
