
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    selectUF: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginRight: 10,
        marginLeft: 0,
        marginBottom: 0,
        marginTop: 3,
    }
}));

export default function Estados() {
    const classes = useStyles();
    const [uf, setUf] = useState('');

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
     ];

    return (
        <React.Fragment>
            <FormControl variant="outlined" className={classes.selectUF}>
                <InputLabel id="labelUF">UF</InputLabel>
                <Select
                    labelId="labelUF"
                    value={uf}
                    onChange={e => setUf(e.target.value)}
                >
                    {states.map((state) => (
                    <MenuItem key={state} value={state}>
                        {state}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </React.Fragment>
  );
}