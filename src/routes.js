import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import List from './pages/List';
import Feirante from './pages/Feirante';
import Edit from './pages/Edit';

export default function Routes() {
   return (
      <BrowserRouter>
         <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/list' component={List} />
            <Route path='/feirante/:id' component={Feirante} />
            <Route path='/edit' component={Edit} />
         </Switch>
      </BrowserRouter>
   )
}