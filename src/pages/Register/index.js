import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dados from './Dados';
import Bairros from './Bairros';
import Produtos from './Produtos';
import { useForm } from "react-hooks-helper";
import Paper from '@material-ui/core/Paper';
import './styles.css';
import logoImg from '../../assets/logo.png';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiOutlinedInput-root': {
         '& fieldset': {
           border: 'none'
         }
      },
      backgroundColor: '#fff'
   },
   selectUF: {
      '& .MuiSelect-select': {
         backgroundColor: '#fff',
         paddingRight: 10,
         marginLeft: 20,
         marginTop: 5
      },
      '& .MuiFormLabel-root': {
         marginLeft: 25,
      },
      width: '20%',
   },
   selectCity: {
      '& .MuiSelect-select': {
         backgroundColor: '#fff',
         paddingRight: 10,
         marginLeft: 20,
         marginTop: 5
      },
      '& .MuiFormLabel-root': {
         marginLeft: 35,
      },
      width: '80%',
      marginRight: 10
   },
   selectNeighborhood: {
      '& .MuiSelect-select': {
         backgroundColor: '#fff',
         paddingRight: 10,
         marginLeft: 20,
         marginTop: 5
      },
      '& .MuiFormLabel-root': {
         marginTop: 7,
         zIndex: 1,
         marginLeft: 28,
      },
      width: '100%',
      marginRight: 10
   },
   selectProducts: {
      '& .MuiSelect-select': {
         backgroundColor: '#fff',
         paddingRight: 10,
         marginLeft: 20,
         marginTop: 5
      },
      '& .MuiFormLabel-root': {
         marginTop: 7,
         zIndex: 1,
         marginLeft: 28,
      },
      width: '100%',
      marginRight: 10
   },
   selectType: {
      '& .MuiSelect-select': {
         backgroundColor: '#fff',
         paddingRight: 10,
         marginLeft: 20,
         marginTop: 5
      },
      '& .MuiFormLabel-root': {
         marginTop: 7,
         zIndex: 1,
         marginLeft: 28,
      },
      width: '100%',
      marginRight: 10
   },
   divider: {
      marginTop: 10
   },
   backButton: {
      marginRight: theme.spacing(1),
   },
   buttons: {
      textAlign: 'center',
      marginBottom: 20
   },
   fim: {
      padding: '0 20px',
      textAlign: 'center',
      marginTop: 20
   }
}));

const defaultData = {
	nome: '',
	email: '',
	whatsapp: '',
   senha: '',
   endereco: '',
   bairros: [],
   products: [],
   types: [],
   local: false
}

const steps = ['Dados', 'Bairros', 'Produtos'];

export default function Register() {
   const { enqueueSnackbar } = useSnackbar();
   const classes = useStyles();
   const [formData, setForm] = useForm(defaultData);
	const [activeStep, setActiveStep] = useState(0);
   const props = { formData, setForm };
   const history = useHistory();

   const getStepContent = (step) => {
      switch (step) {
         case 0:
            return <Dados {...props}  onChangeTel={handleChangeTel} />;
         case 1:
            return <Bairros {...props} onChangeBairros={handleChangeBairros} />;
         case 2:
            return <Produtos {...props} onChangeProdutos={handleChangeProdutos}  onChangeTiposProdutos={handleChangeTiposProdutos} />;
         default:
            throw new Error('Unknown step');
      }
   }

   const handleChangeTel = (tel) => {
      formData.whatsapp = tel;
      localStorage.setItem('tel', tel);
   }

   const handleChangeBairros = (arr, type) => {
      if(type === 'add') {
         formData.bairros.push(arr);
      } else {
         let bairros = formData.products.filter(function( obj ) {
            return obj.id !== arr.id;
         });
         formData.bairros = bairros;
      }
   }

   const handleChangeProdutos = (obj) => {
      obj.checked = !obj.checked;
      const found = formData.products.some(el => el.id === obj.id);
      if (!found){
         formData.products.push(obj);
      } else {
         formData.products.forEach((element, index) => {
            if (element.id === obj.id) {
               formData.products[index].checked = obj.checked;
            }
         });
      }
   }

   const handleChangeTiposProdutos = (obj) => {
      obj.checked = !obj.checked;
      const found = formData.types.some(el => el.id === obj.id);
      if (!found){
         formData.types.push(obj);
      } else {
         formData.types.forEach((element, index) => {
            if (element.id === obj.id) {
               formData.types[index].checked = obj.checked;
            }
         });
      }
   }

   const handleNext = (event) => {
		if (activeStep + 1 === steps.length) {
			submit(event);
		} else {
			setActiveStep(activeStep + 1);
		}
	};

   const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

   async function submit(event) {
      event.preventDefault();

      if (!formData.nome || !formData.email || !formData.whatsapp || !formData.senha 
         || formData.bairros.length === 0 || formData.products.length === 0 || formData.types.length === 0) {
            enqueueSnackbar('Favor preencher os campos obrigatórios!', { 
               variant: 'error',
               anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                 },
            });
            return false;
      }

      let produtos = [];
      formData.products.forEach(element => {
         if (element.checked) {
            produtos.push(element._id);
         }
      });

      let tipos = [];
      formData.types.forEach(element => {
         if (element.checked) {
            tipos.push(element._id);
         }
      });

      let bairros = [];
      formData.bairros.forEach(element => {
         bairros.push(element.id);
      });

      let tel = formData.whatsapp.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, '');

      const data = {
         nomeDaBarraca: formData.nome,
         email: formData.email,
         telefonePrincipal: tel,
         telefonesWhatsapp: [tel],
         produtos: produtos,
         tiposDeProdutos: tipos,
         bairrosDeEntrega: bairros,
         senha: formData.senha,
         enderecoLocalDeAtendimento: formData.endereco
      }

      try {
         await api.post('feirante', data).then(response => {
            localStorage.removeItem('tel');
				setActiveStep(activeStep + 1);
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

   const handleLogin = (event) => {
		event.preventDefault();
		history.push('/login');
	};


   return (
      <main className="register-container">
         <Paper className="content">
            <section>
               <Link to="/"> 
                  <img src={logoImg} alt="Register"/>
               </Link>

               <h1>Cadastro</h1>
               <p>Faça seu cadastro, entre na plataforma e seja visto por milhares de pessoas.</p>

               <Link className="back-link" to="/login">
                  <FiArrowLeft size={16} />
                  Voltar
               </Link>            
            </section>

            <form className={classes.root}>
               <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
					      <Step key={label}>
						      <StepLabel>{label}</StepLabel>
					      </Step>
                  ))}
               </Stepper>
               <React.Fragment>
                  {activeStep === steps.length ? (
                     <div className={classes.fim}>
                        <Typography variant="h6" gutterBottom>
                           Muito obrigado por se cadastrar.
                        </Typography>
                        <Button
                           onClick={handleLogin}
                           variant="contained"
                           color="primary"
                           size="large"
                           >
                              Fazer login
                        </Button>
                     </div>
   
                  ) : (
                     <React.Fragment>
                        {getStepContent(activeStep)}
                        <div className={classes.buttons}>
                           <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              className={classes.backButton}
                           >
                              Voltar
                           </Button>
                           <Button variant="contained" className="buttonNext" color="primary" onClick={handleNext}>
                              {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                           </Button>
                        </div>
                     </React.Fragment>
                  )}
               </React.Fragment>
            </form>
         </Paper>
      </main>
   )
}