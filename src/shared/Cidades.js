
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    selectCity: {
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
    const [city, setCity] = useState('');

    const cities = [
        
     ];

    return (
        <React.Fragment>
            <FormControl variant="outlined" className={classes.selectCity}>
                <InputLabel id="labelCity">Cidade</InputLabel>
                <Select
                    labelId="labelCity"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                >
                    {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                        {city}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </React.Fragment>
  );
}   