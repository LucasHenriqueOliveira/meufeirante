import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
	formControl: {
		fullWidth: true,
        display: 'flex',
        padding: '0 20px',
    },
    tipos: {
        marginTop: 10,
        marginBottom: 10
    }
}));

export default function Produtos({ setForm, formData, onChangeProdutos, onChangeTiposProdutos }) {
    // const { products, types } = formData;
    const { enqueueSnackbar } = useSnackbar();
    const [produtos, setProdutos] = useState([]);
    const [tiposProdutos, setTipoProdutos] = useState([]);
    const classes = useStyles();

    useEffect(() => {
		try {
			api.get('produtos/').then(response => {
                let produtos = [];
                response.data.forEach(element => {
                    produtos.push({id: element._id, checked: false, nome: element.descricao});
                });
                setProdutos(produtos);
			});
		} catch(error) {
			enqueueSnackbar('Erro ao retornar os produtos!', { 
				variant: 'error',
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'center',
			  	},
			});
        }

        try {
			api.get('tiposProdutos/').then(response => {
				let tipos_produto = [];
                response.data.forEach(element => {
                    tipos_produto.push({id: element._id, checked: false, nome: element.descricao});
                });
                setTipoProdutos(tipos_produto);
			});
		} catch(error) {
			enqueueSnackbar('Erro ao retornar a lista de produtos!', { 
				variant: 'error',
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'center',
			  	},
			});
        }
    }, [enqueueSnackbar]);

    const handleChange = (produto) => {
        setProdutos(produtos.map(item => item.id === produto.id ? {...item, checked : !produto.checked} : item ));
        onChangeProdutos(produto);
    }

    const handleChangeTipo = (tipo) => {
        setTipoProdutos(tiposProdutos.map(item => item.id === tipo.id ? {...item, checked : !tipo.checked} : item ));
        onChangeTiposProdutos(tipo);
    }

	return (
		<React.Fragment>
			<Grid container spacing={1}>
				<Grid item xs={12}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Produtos</FormLabel>
                        <FormGroup>
                            {produtos.map((produto) => (
                                <FormControlLabel
                                    key={produto.id}
                                    control={<Checkbox checked={produto.checked} onClick={() => handleChange(produto)} name={produto.nome} />}
                                    label={produto.nome}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
				</Grid>
				<Grid item xs={12} className={classes.tipos}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Tipos</FormLabel>
                        <FormGroup>
                            {tiposProdutos.map((tipo) => (
                                <FormControlLabel
                                    key={tipo.id}
                                    control={<Checkbox checked={tipo.checked} onClick={() => handleChangeTipo(tipo)} name={tipo.nome} />}
                                    label={tipo.nome}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
