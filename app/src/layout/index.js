import React, {Component} from 'react';
import Home from '../sub-layout/home'
import View from '../sub-layout/view'
import {Router, Route, Switch} from 'react-router-dom'

import {history} from '../history'

class Layout extends Component{

    render(){
        return(
            <div className = {'app-layout'}>
                <Router history = {history}>
                    <Switch>
                        <Route exact path = {'/'} component = {Home} />
                        <Route exact path = {'/share/:id'} component = {View} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Layout;