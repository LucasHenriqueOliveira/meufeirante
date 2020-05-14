import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Footer from '../../shared/Footer';
import Header from '../../shared/Header';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import toldImg from '../../assets/told.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.css';

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
    paper: {
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
            marginTop: 10
        },
        marginTop: 20,
        textAlign: 'center'
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        paddingTop: 10,
        paddingBottom: 10
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    title: {
        marginTop: 20,
    },
    cidade: {
        fontSize: 14,
        fontWeight: 700,
        marginTop: 5,
    },
    list: {
        marginTop: 3,
        marginBottom: 3,
        paddingInlineStart: 0
    },
    told: {
        width: '100%',
        marginBottom: -25,
        marginTop: 30
    },
    loading: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20
    }
}));

export default function Feirante() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let { id } = useParams();
    let [feirante, setFeirante] = useState({});
    let [loading, setLoding] = useState(true);

    const formatPhone = (tel) => {
		return "(" + tel.substring(0, 2) + ") " + tel.substring(2, 7) + "-" + tel.substring(7, 11);
	}

    useEffect(() => {
        try {
            api.get('feirante/' + id ).then(response => {
                
                if (response.data.length) {
                    setFeirante(response.data[0]);
                    setLoding(false);
                } else {
                    setLoding(false);
                    enqueueSnackbar('Feirante não encontrado!', { 
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        }
                    });
                }
            });
        } catch(error) {
            setLoding(false);
            enqueueSnackbar('Feirante não encontrado!', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }, [enqueueSnackbar]);

    const handleMessage = (tel) => {
		window.open('https://api.whatsapp.com/send?phone=55'+tel+'&text=Olá!%20Gostaria%20de%20informações%20dos%20produtos.&source=&data=', '_blank');
	}

    return (
        <div>
            <Header />
            <main className={classes.layout}>
                {loading && (
                    <div className={classes.loading}>
                        <CircularProgress />
                    </div>
                )}
                
                {!loading && (
                <div>
                    <img src={toldImg} alt="Feira" className={classes.told} />
                    <Paper className={classes.paper}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {feirante.nomeDaBarraca}
                        </Typography>
                        <Container className={classes.heroContent}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    {feirante.email}
                                </Grid>
                            </Grid>
                            <Typography variant="h6" className={classes.title}>
                                Telefone
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ul className={classes.list}>
                                        {(feirante.telefonesWhatsapp).map((telefone, index) => (
                                            <li key={index}>{formatPhone(telefone)}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" className={classes.title}>
                                Produtos
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ul className={classes.list}>
                                        {(feirante.produtos).map((produto, index) => (
                                            <li key={index}>{produto.descricao}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" className={classes.title}>
                                Tipo
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ul className={classes.list}>
                                        {(feirante.tiposDeProdutos).map((tipo, index) => (
                                            <li key={index}>{tipo.descricao}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                            <Typography variant="h6" className={classes.title}>
                                Bairros
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <ul className={classes.list}>
                                        {(feirante.bairrosDeEntrega).map((bairro, index) => (
                                            <li key={index}>{bairro.nome}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                            { feirante.enderecoLocalDeAtendimento && (
                            <div>
                                <Typography variant="h6" className={classes.title}>
                                    Atendimento Local
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        {feirante.enderecoLocalDeAtendimento}
                                    </Grid>
                                </Grid>
                            </div>
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                <Button size="small" onClick={() => handleMessage(feirante.telefonePrincipal)} color="primary">
                                    Envie uma mensagem
                                </Button>
                                </Grid>
                            </Grid>
                        </Container>
                    </Paper>
                </div>
                )}
            </main>
            <Footer />
        </div>
    );
}