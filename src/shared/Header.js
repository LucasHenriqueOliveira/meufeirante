
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import logoImg from '../assets/logo.png'; 
import { Link, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Auth from '../shared/auth';

const useStyles = makeStyles((theme) => ({
    logo: {
        width: 120,
    },
    divIcone: {
        textAlign: 'right',
        width: '100%'
    },
    icone: {
        fontSize: 35,
        color: '#f0f0f5'
    }
}));

const ITEM_HEIGHT = 48;

export default function Header() {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const isLoggedIn = Auth.isLoggedIn();
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logout = () => {
        handleClose();
        Auth.logout();
        history.push('/');
    }

    const handlePerfil = () => {
        history.push('/edit');
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Link to="/">
                        <img src={logoImg} className={classes.logo} alt="Feira" />  
                    </Link>
                    {isLoggedIn && (
                        <div className={classes.divIcone}>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <AccountCircle className={classes.icone} />
                            </IconButton>

                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                                }}
                            >
                                <MenuItem onClick={handlePerfil}>Meu perfil</MenuItem>
                                <MenuItem onClick={logout}>Sair</MenuItem>
                            </Menu>
                        </div>
                    )}
                    
                </Toolbar>
            </AppBar>
        </React.Fragment>
  );
}