import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Footer from '../../shared/Footer';
import Header from '../../shared/Header';
import Auth from '../../shared/auth';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../../services/api';
import Table from '@material-ui/core/Table';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';
import InputMask from "react-input-mask";
import './styles.css';

const useStyles = makeStyles((theme) => ({
	layout: {
		width: 'auto',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
		marginTop: theme.spacing(6),
		marginBottom: theme.spacing(6),
		padding: theme.spacing(3),
		},
	},
	heroContent: {
		backgroundColor: theme.palette.background.paper,
		paddingTop: 10,
		paddingBottom: 10
	},
	buttons: {
		textAlign: 'center',
	},
	button: {
		marginTop: 10,
		marginLeft: theme.spacing(1),
	},
	icon: {
		color: '#000'
	},
	addBairro: {
		color: '#000',
		paddingRight: 0,
		paddingBottom: 5,
		paddingTop: 0
	},
	table: {
		marginTop: 15,
    	marginBottom: 15
	},
	divider: {
		marginTop: 10,
    	marginBottom: 10
	}
}));

export default function Edit() {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    const [neighborhood, setNeighborhood] = useState([]);
	const [products, setProducts] = useState([]);
	const [types, setTypes] = useState([]);
	const [cities, setCities] = useState([]);
	const [neighborhoods, setNeighborhoods] = useState([]);
	const [open, setOpen] = useState(false);
	
	const isLoggedIn = Auth.isLoggedIn();
	const history = useHistory();
	
	if (!isLoggedIn) {
		history.push('/');
	}

	const token = Auth.getToken();
	const dados = JSON.parse(Auth.getDados());
	const [feirante, setFeirante] = useState(dados[0]);
	const [bairrosEntrega, setBairrosEntrega] = useState(dados[0].bairrosDeEntrega);

	const states = [
		{ sigla: 'AC', nome: 'acre' },
		{ sigla: 'AL', nome: 'alagoas' },
		{ sigla: 'AP', nome: 'amapa' },
		{ sigla: 'AM', nome: 'amazonas' },
		{ sigla: 'BA', nome: 'bahia' },
		{ sigla: 'CE', nome: 'ceara' },
		{ sigla: 'DF', nome: 'distritofederal' },
		{ sigla: 'ES', nome: 'espiritosanto' },
		{ sigla: 'GO', nome: 'goias' },
		{ sigla: 'MA', nome: 'maranhao' },
		{ sigla: 'MT', nome: 'matogrosso' },
		{ sigla: 'MS', nome: 'matogrossodosul' },
		{ sigla: 'MG', nome: 'minasgerais' },
		{ sigla: 'PA', nome: 'para' },
		{ sigla: 'PB', nome: 'paraiba' },
		{ sigla: 'PR', nome: 'parana' },
		{ sigla: 'PE', nome: 'pernambuco' },
		{ sigla: 'PI', nome: 'piaui' },
		{ sigla: 'RJ', nome: 'riodejaneiro' },
		{ sigla: 'RN', nome: 'riograndedonorte' },
		{ sigla: 'RS', nome: 'riograndedosul' },
		{ sigla: 'RO', nome: 'rondonia' },
		{ sigla: 'RR', nome: 'roraima' },
		{ sigla: 'SC', nome: 'santacatarina' },
		{ sigla: 'SP', nome: 'saopaulo' },
		{ sigla: 'SE', nome: 'sergipe' },
		{ sigla: 'TO', nome: 'tocantins' }
	];

	useEffect(() => {

        api.get('produtos').then(response => {
			let produtos = [];
			response.data.forEach(element => {
				let obj = {id: element._id, checked: false, nome: element.descricao};
				
				if(feirante.hasOwnProperty('produtos')){
					feirante.produtos.forEach(produto => {
						if (element._id === produto._id) {
							obj.checked = true;
						}
					});
				}
				
				produtos.push(obj);
			});
            setProducts(produtos);
		});
		
		api.get('tiposProdutos').then(response => {
            let tipos_produto = [];
			response.data.forEach(element => {
				let obj = {id: element._id, checked: false, nome: element.descricao, explicacao: element.explicacao};
				
				if(feirante.hasOwnProperty('tiposDeProdutos')){
					feirante.tiposDeProdutos.forEach(tipo => {
						if (element._id === tipo._id) {
							obj.checked = true;
						}
					});
				}
				
				tipos_produto.push(obj);
			});
			setTypes(tipos_produto);
		});
	}, []);

	function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
	
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
		let bairro = { _id: neighborhood.id, municipio: city.id, nome: neighborhood.name};
		setBairrosEntrega(bairrosEntrega => [...bairrosEntrega, bairro]);
        setUf('');
        setCity('');
        setNeighborhood('');
        setOpen(false);
	};

	const handleRemove = (bairro) => {
        let bairros = bairrosEntrega.filter(function( obj ) {
            return obj._id !== bairro._id;
        });
		setBairrosEntrega(bairros);
	}

	const handleChange = (event) => {
		setFeirante({ ...feirante, [event.target.name]: event.target.value });
	};
	
	const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
	};
	
	const handleChangeProduto = (produto) => {
		setProducts(products.map(item => item.id === produto.id ? {...item, checked : !produto.checked} : item ));
	};

	const handleChangeTipo = (tipo) => {
		setTypes(types.map(item => item.id === tipo.id ? {...item, checked : !tipo.checked} : item ));
	};

	async function handleEdit(event) {
		event.preventDefault();

		let produtos = [];
		products.forEach(element => {
			if (element.checked) {
				produtos.push(element.id);
			}
		});

		let tipos = [];
		types.forEach(element => {
			if (element.checked) {
				tipos.push(element.id);
			}
		});

		let bairros = [];
		bairrosEntrega.forEach(element => {
			bairros.push(element._id)
		});

		if (!feirante.nomeDaBarraca || !feirante.email || !feirante.telefonePrincipal 
			|| bairros.length === 0 || produtos.length === 0 || tipos.length === 0) {
			   enqueueSnackbar('Favor preencher os campos obrigatórios!', { 
				  variant: 'error',
				  anchorOrigin: {
					 vertical: 'top',
					 horizontal: 'center',
					},
			   });
			   return false;
		}

		const tel = feirante.telefonePrincipal.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '');

		const data = {
			_id: feirante._id,
			nomeDaBarraca: feirante.nomeDaBarraca,
			email: feirante.email,
			telefonePrincipal: tel,
			telefonesWhatsapp: [tel],
			produtos: produtos,
			tiposDeProdutos: tipos,
			bairrosDeEntrega: bairros,
			enderecoLocalDeAtendimento: feirante.enderecoLocalDeAtendimento
		}

		try {
			await api.put('feirante', data, { 
				headers: {"Authorization" : "Bearer " + token }
			}).then(response => {
				if(response.data.ok) {
					localStorage.setItem('dados', JSON.stringify(response.data.dados));
					enqueueSnackbar(response.data.message, { 
						variant: 'success',
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center',
						},
					});
				} else {
					enqueueSnackbar(response.data.message, { 
						variant: 'info',
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center',
						},
					});
				}
			});
		 } catch(error) {
			enqueueSnackbar('Erro ao salvar os dados!', { 
				   variant: 'error',
				   anchorOrigin: {
					   vertical: 'top',
					   horizontal: 'center',
					 },
			   });
		 }
	}

	return (
		<div>
			<Header />
			<main className={classes.layout}>
				<Paper className={classes.paper}>
					<Typography gutterBottom variant="h5" component="h2" align="center">
						Alterar o perfil
					</Typography>
					<Container className={classes.heroContent}>
						<form className={classes.root}>
							<Grid container spacing={1}>
								<Grid item xs={12} sm={12} md={12}>
									<TextField
										required
										label="Nome da barraca"
										name="nomeDaBarraca"
										value={feirante.nomeDaBarraca}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<TextField
										required
										type="email" 
										label="E-mail"
										name="email"
										value={feirante.email}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<InputMask
										mask="(99) 99999-9999"
										value={feirante.telefonePrincipal}
										disabled={false}
										onChange={handleChange}
										maskChar=" "
										>
										{() => <TextField required label="WhatsApp" fullWidth name="telefonePrincipal" />}
									</InputMask>
									{/* 
									<TextField
										required
										label="WhatsApp"
										name="telefonePrincipal"
										value={feirante.telefonePrincipal}
										onChange={handleChange}
									/>
									*/}
								</Grid>
								<Grid item xs={12}>
									<Table className={classes.table} size="small" aria-label="a dense table">
										<TableHead>
											<TableRow>
												<TableCell><b>Bairros adicionados</b></TableCell>
												<TableCell align="right">
													<IconButton onClick={handleClickOpen} className={classes.addBairro} aria-label="Adicionar bairro">
														<AddCircleIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{bairrosEntrega.map((row) => (
												<TableRow key={row._id}>
													<TableCell component="th" scope="row">
														{row.nome + ', ' + capitalize(row.municipio.split(':')[2]) + '/' + row.municipio.split(':')[0].toUpperCase()}
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
															<MenuItem key={state.sigla} value={state.sigla}>
															{state.sigla}
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
									<FormLabel component="legend">Produto</FormLabel>
									<FormGroup row>
										{products.map((product) => (
											<FormControlLabel
												key={product.id}
												control={<Checkbox checked={product.checked} 
												onClick={() => handleChangeProduto(product)} 
												name={product.nome} />}
												label={product.nome}
											/>
										))}
									</FormGroup>
								</Grid>
								<Grid item xs={12} className={classes.divider}>
									<Divider />
								</Grid>
								<Grid item xs={12}>
									<FormLabel component="legend">Tipo</FormLabel>
									<FormGroup row>
										{types.map((type) => (
											<FormControlLabel
												key={type.id}
												control={<Checkbox checked={type.checked} 
												onClick={() => handleChangeTipo(type)} 
												name={type.nome} />}
												label={type.nome}
											/>
										))}
									</FormGroup>
								</Grid>
								<Grid item xs={12} className={classes.divider}>
									<Divider />
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<TextField 
										label="Endereço do atendimento local" 
										name="enderecoLocalDeAtendimento"
										value={feirante.enderecoLocalDeAtendimento}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12} className={classes.buttons}>
									<Button
										variant="contained"
										color="primary"
										onClick={handleEdit}
										className={classes.button}
										>
										Alterar
									</Button>
								</Grid>
							</Grid>
						</form>
					</Container>
				</Paper>
			</main>
			<Footer />
		</div>
	);
}