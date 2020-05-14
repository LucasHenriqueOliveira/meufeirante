class Auth {

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    logout = () => {
        localStorage.removeItem('dados');
        localStorage.removeItem('token');
        localStorage.removeItem('tel');
        localStorage.removeItem('bairros');
    }

    getToken = () => {
        return localStorage.getItem('token');
    }

    getDados = () => {
        return localStorage.getItem('dados');
    }
}

export default new Auth();
