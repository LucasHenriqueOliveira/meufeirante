import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputMask from "react-input-mask";

const useStyles = makeStyles((theme) => ({
	formControl: {
		fullWidth: true,
		display: 'flex',
    },
    dados: {
        padding: '0 20px',
        marginBottom: 15
    }
}));

export default function Dados({ setForm, formData, onChangeTel }) {
	const { nome, email, senha } = formData;
	const classes = useStyles();
	const [tel, setTel] = useState(localStorage.getItem('tel'));

	const handleChange = (event) => {
		setTel(event);
		onChangeTel(event);
	}

	return (
		<React.Fragment>
			<Grid container spacing={1} className={classes.dados}>
				<Grid item xs={12}>
					<TextField
						required
						id="nome"
						name="nome"
						label="Nome da barraca"
						fullWidth
						value={nome}
						onChange={setForm}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
                        type="email" 
                        id="email"
                        name="email"
                        autoComplete="email"
                        label="Email"
                        fullWidth
                        value={email}
						onChange={setForm}
					/>
				</Grid>
				<Grid item xs={12}>
					<InputMask
						mask="(99) 99999-9999"
						value={tel}
						disabled={false}
						onChange={e => handleChange(e.target.value)}
						maskChar=" "
						>
						{() => <TextField required label="WhatsApp" fullWidth name="whatsapp" />}
					</InputMask>
				</Grid>
				<Grid item xs={12}>
					<TextField
                        required
						id="senha"
						name="senha"
                        label="Senha"
                        type="password"
						fullWidth
						value={senha}
						onChange={setForm}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
