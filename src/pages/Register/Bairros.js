import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import api from '../../services/api';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Table from '@material-ui/core/Table';
import DeleteIcon from '@material-ui/icons/Delete';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
	formControl: {
		fullWidth: true,
		display: 'flex',
    },
    bairros: {
        padding: '0 20px',
        marginBottom: 15
    },
    title: {
        marginBottom: -10
    },
    fisico: {
        marginTop: 20
    },
    endereco: {
        marginTop: -15
    },
    button: {
        color: '#ef4e3f',
        border: '1px solid rgb(239,78,63,0.5)'
    },
    center: {
        textAlign: 'center'
    },
    icon: {
        cursor: 'pointer',
        color: '#000'
    }
}));

export default function Bairros({ setForm, formData, onChangeBairros }) {
    const { endereco } = formData;
    const { enqueueSnackbar } = useSnackbar();
    const [cities, setCities] = useState([]);
    const [neighborhoods,setNeighborhoods] = useState([]);
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    let list = localStorage.getItem('bairros');
    let bairros = [];
    if (list) {
        bairros = JSON.parse(list);
    }
    const [bairrosEntrega, setBairrosEntrega] = useState(bairros);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    
    const handleChangeUf = (uf) => {
        setUf(uf);
        let ufLowerCase = uf.toLowerCase();
        
        api.get('regioes/municipios/' + ufLowerCase).then(response => {
           let municipios = [];
           response.data.forEach(element => {
               municipios.push({ id: element._id, name: capitalize(element.nome_municipio)});
           });
           setCities(municipios);
        });
    };
  
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    const handleChangeCity = (city) => {
        if (city) {
           setCity(city);
     
           api.get('regioes/bairros/' + city.id).then(response => {
                let bairros = [];
                response.data.forEach(element => {
                    bairros.push({ id: element._id, name: capitalize(element.nome)});
                });
                setNeighborhoods(bairros);
           });
        }
    };

    const handleAdd = () => {
        let bairro = { id: neighborhood.id, uf: uf, city: city.name, neighborhood: neighborhood.name};
        let list = localStorage.getItem('bairros');
        if (list.length) {
            bairros = JSON.parse(list);
            bairros.push(bairro);
            localStorage.setItem('bairros', JSON.stringify(bairros));
        } else {
            localStorage.setItem('bairros', JSON.stringify(formData.bairros));
        }
        
        setBairrosEntrega(bairrosEntrega => [...bairrosEntrega, bairro]);
        setUf('');
        setCity('');
        setNeighborhood('');
        setOpen(false);
        onChangeBairros(bairro, 'add');
    };

    const handleRemove = (bairro) => {
        let bairros = bairrosEntrega.filter(function( obj ) {
            return obj.id !== bairro.id;
        });
        setBairrosEntrega(bairros);
        localStorage.setItem('bairros', JSON.stringify(bairros));
        onChangeBairros(bairro, 'remove');
    }

	return (
		<React.Fragment>
			<Grid container spacing={1} className={classes.bairros}>
                <Grid item xs={12} className={classes.title}>
                    <Typography variant="subtitle1" gutterBottom>
                        Informe os bairros que você realiza entrega
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.center}>
                    <Button size="small" onClick={handleClickOpen} className={classes.button} variant="outlined">
                        Adicionar
                    </Button>
                </Grid>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <Grid container spacing={1} className={classes.bairros}>
                            <Grid item xs={12}>
                                <FormControl className={classes.selectUF}>
                                    <InputLabel id="labelUF">UF</InputLabel>
                                    <Select
                                        className="uf"
                                        labelId="labelUF"
                                        value={uf}
                                        onChange={e => handleChangeUf(e.target.value)}
                                        input={<Input />}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state} value={state}>
                                            {state}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.selectCity}>
                                    <Autocomplete
                                        id="cidades"
                                        className="city"
                                        options={cities}
                                        getOptionLabel={(option) => option.name}
                                        value={city}
                                        onChange={(event, newValue) => {
                                            handleChangeCity(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Cidade" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.select}>
                                    <Autocomplete
                                        id="bairros"
                                        className="city"
                                        options={neighborhoods}
                                        getOptionLabel={(option) => option.name}
                                        value={neighborhood}
                                        onChange={(event, newValue) => {
                                            setNeighborhood(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Bairro" />}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fechar
                        </Button>
                        <Button onClick={handleAdd} color="primary">
                            Adicionar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid item xs={12}>
                    { bairrosEntrega.length > 0 && (
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                {bairrosEntrega.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.neighborhood + ', ' + row.city + '/' + row.uf}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link
                                                to="#"
                                                onClick={() => handleRemove(row)}>
                                                <DeleteIcon alt="Remover" className={classes.icon} />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Grid>
                <Grid item xs={12} className={classes.fisico}>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    Atende em um local físico
                    { checked && (
                        <TextField
                            className={classes.endereco}
                            id="endereco"
                            name="endereco"
                            label="Endereço Completo"
                            fullWidth
                            value={endereco}
                            onChange={setForm}
                        />
                    )}
                </Grid>
			</Grid>
		</React.Fragment>
	);
}
