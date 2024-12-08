import React, {useEffect } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './menu.css'
import { useSudoku } from '../../context/SudokuContext';

const UpperMenu = () => {
    // Set Difficulty
    const {boardID, curDifficulty, boardTypeText, isPaused, setIsPaused, timer, setTimer, inGame} = useSudoku();

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

                <Typography className='uppermenu-text' variant="h6">
                    Board ID : {boardID == 0 ? '' : boardID}
                </Typography>

                {/* Difficulty */}
                <Typography className='uppermenu-text' variant="h6">
                    Difficulty : {
                        (() => {
                            const difficultyText = boardTypeText[curDifficulty];
                            if (difficultyText === "9x9 25") {
                                return "Easy";
                            } else if (difficultyText === "9x9 45") {
                                return "Medium";
                            } else if (difficultyText === "9x9 60") {
                                return "Hard";
                            } else {
                                return "Unknown";
                            }
                        })()
                    }
                </Typography>

                {/* Timer */}
                <Typography className='uppermenu-text' variant="h6">
                    Timer: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </Typography>

                {/* Pause Game*/}
                {inGame && (<Button
                    variant="contained"
                    color={isPaused ? "success" : "error"}
                    startIcon={isPaused ? <PlayArrowIcon/> : <PauseIcon />}
                    onClick={() => setIsPaused((prev) => !prev)}
                    disabled={!inGame}
                >
                    {isPaused ? 'Resume' : 'Pause'}
                </Button>)}
            </Stack>
        </Box>
    );
};

export default UpperMenu;