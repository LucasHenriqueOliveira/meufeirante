import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiCornerDownRight } from 'react-icons/fi';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.png';
import feiraImg from '../../assets/feira2.svg';

const useStyles = makeStyles((theme) => ({
    root: {
       '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none'
          }
       },
       '& .MuiFormLabel-root.Mui-focused': {
            color: 'transparent'
       }
    },
    select: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginRight: 10,
        marginLeft: 0,
        marginBottom: 0,
        marginTop: 3,
    },
    city: {
        textTransform: 'capitalize'
    }
}));

export default function Home() {
    const { enqueueSnackbar } = useSnackbar();
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    const history = useHistory();
    const classes = useStyles();
    const [cities, setCities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    const handleChangeUf = (uf) => {
        let ufLowerCase = uf.toLowerCase();
        setUf(uf);
        
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


    async function handleSearch(event) {
        event.preventDefault();
        
        if(!neighborhood) {
            enqueueSnackbar('Informe um bairro!', { 
                variant: 'warning',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            return false;
        }

        try {
            await api.get('feirantes/bairro/' + neighborhood.id).then(response => {
                if(response.data.length) {
                    history.push('/list', { detail: response.data});
                } else {
                    enqueueSnackbar('Não foi encontrado feirante para este bairro!', { 
                        variant: 'info',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        }
                    });
                }
            });
        } catch(error) {
            enqueueSnackbar('Erro ao retornar os feirantes!', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <div className="top_container">
            <section className="hero_section">
                <div className="hero-container container">
                    <div className="hero_detail-box">
                        <Link className="logo" to="/">
                            <img src={logoImg} alt="Feira" />  
                        </Link>
                        <h3> Bem-vindo!</h3>
                        <p>
                            Descubra os feirantes disponíveis para você...
                        </p>
                        <div className="hero_btn-container">
                            <form className={classes.root} onSubmit={handleSearch}>
                                <Grid container className={classes.root} spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <FormControl variant="outlined" className={classes.select}>
                                            <InputLabel id="labelUF">UF</InputLabel>
                                            <Select
                                                labelId="labelUF"
                                                value={uf}
                                                onChange={e => handleChangeUf(e.target.value)}
                                            >
                                                {states.map((state) => (
                                                <MenuItem key={state} value={state}>
                                                    {state}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={10}>
                                        <FormControl variant="outlined" className={classes.select}>
                                            <Autocomplete
                                                id="cidades"
                                                options={cities}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: '100%' }}
                                                value={city}
                                                onChange={(event, newValue) => {
                                                    handleChangeCity(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl variant="outlined" className={classes.select}>
                                            <Autocomplete
                                                id="bairros"
                                                options={neighborhoods}
                                                getOptionLabel={(option) => option.name}
                                                style={{ width: '100%' }}
                                                value={neighborhood}
                                                onChange={(event, newValue) => {
                                                    setNeighborhood(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Bairro" variant="outlined" />}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button type="submit" className="call_to-btn btn_white-border" >
                                    Pesquisar
                                </Button>
                            </form>

                            <Link className="back-link" to="/login">
                                <FiCornerDownRight size={16} />
                                Eu sou feirante
                            </Link>
                        </div>
                    </div>
                    <div className="hero_img-container">
                        <img src={feiraImg} alt="Feira" />
                    </div>
                </div>
            </section>
        </div>  
    )
}
