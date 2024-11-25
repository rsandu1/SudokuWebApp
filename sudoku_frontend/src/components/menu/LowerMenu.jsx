import React from 'react';
import { Box, Button, Stack, Switch, FormControlLabel, Typography } from '@mui/material';
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
                {/* Undo */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UndoIcon />}
                    onClick={undo}
                >
                    Undo
                </Button>

                {/* Redo */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RedoIcon />}
                >
                    Redo
                </Button>

                {/* Hint */}
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<LightbulbIcon />}
                >
                    Hint
                </Button>

                {/* Note */}
                {/* <Button
                    variant="contained"
                    color="warning"
                    startIcon={<NoteAddIcon />}
                >
                    Note
                </Button> */}

                {/* Check Sudoku */}
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                >
                    Check Sudoku
                </Button>
                <Box sx={{
                    color: 'white',
                    bgcolor: '#ED6C02',
                    borderRadius: 1,
                    paddingBottom: 1
                }}>
                    <FormControlLabel
                        control={<Switch color="primary" />}
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <NoteAddIcon />
                                <Typography variant="body1">Note</Typography>
                            </Box>
                        }
                        labelPlacement="bottom"
                    />
                </Box>

            </Stack>
        </Box>
    );
};

export default LowerMenu;
