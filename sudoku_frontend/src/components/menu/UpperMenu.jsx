import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, MenuItem, Select, Typography } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './menu.css'
import { useSudoku } from '../../context/SudokuContext';

const UpperMenu = () => {
    // Set Difficulty
    const { difficulty, setDifficulty, startGame ,isPaused, setIsPaused} = useSudoku();
    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value); // Directly call setDifficulty
    };

    // Timer
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval = null;
        if (!isPaused) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPaused]);
    
    const handleStartGameButton = () => {
        startGame();
        setTimer(0);
        setIsPaused(true);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                borderRadius: 2,
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                {/* Start New Game Button */}
                <Button variant="contained" color="success" onClick={handleStartGameButton}>
                    START NEW GAME
                </Button>

                {/* Difficulty Dropdown */}
                <Select
                    labelId="difficulty-select-label"
                    id="difficulty-select"
                    value={difficulty}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                    notched={false}
                    sx={{
                        marginLeft: 2,
                        minWidth: 120,
                        color: 'rgba(255, 255, 255, 0.87)', // Text color
                        backgroundColor: 'transparent',
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.12)', // Change background on focus
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.87)', // Change border color on focus
                            },
                        },
                    }}
                >
                    <MenuItem value="0">9x9 40</MenuItem>
                    <MenuItem value="1">9x9 20</MenuItem>
                    <MenuItem value="2">4x4 12</MenuItem>
                </Select>

                {/* Timer */}
                <Typography variant="h6" sx={{
                    marginLeft: 2
                }}>
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </Typography>

                {/* Pause Game Button */}
                <Button
                    variant="contained"
                    color={isPaused ? "success" : "error"}
                    startIcon={isPaused ? <PlayArrowIcon/> : <PauseIcon />}
                    onClick={() => setIsPaused((prev) => !prev)}
                >
                    {isPaused ? 'Resume' : 'Pause'}
                </Button>
            </Stack>
        </Box>
    );
};

export default UpperMenu;