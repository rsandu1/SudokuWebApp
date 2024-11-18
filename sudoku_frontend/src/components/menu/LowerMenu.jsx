import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSudoku } from '../../context/SudokuContext';

const LowerMenu = () => {
    const { undo } = useSudoku();
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
            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UndoIcon />}
                    onClick={undo}
                >
                    Undo
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RedoIcon />}
                >
                    Redo
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<LightbulbIcon />}
                >
                    Hint
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<NoteAddIcon />}
                >
                    Note
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                >
                    Check Sudoku
                </Button>
            </Stack>
        </Box>
    );
};

export default LowerMenu;
