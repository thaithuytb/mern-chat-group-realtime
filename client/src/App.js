import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthForm from './components/authForm/AuthForm';
import Landing from './components/authForm/Landing';
//import protect router
import Dashboard from './components/dashboard/Dashboard';
import Diary from './components/diaryForm/Diary';
import ProtectRoute from './components/privateRoute/ProtectRoute';
//import context
import AuthContextProvider from './contexts/authContext';
import PostsContextProvider from './contexts/postsContext';

import './App.css';
function App() {
  return (
    <AuthContextProvider>
      <PostsContextProvider>
        <div className="App">

          <Router>
            <Switch>
              <Route exact path='/' component={Landing} />
              {/* Protect Rote  */}
              <ProtectRoute path='/dashboard' component={Dashboard} />
              <Route exact path='/login' render={(props) => <AuthForm {...props} component='login' />} />
              <Route exact path='/register' render={(props) => <AuthForm {...props} component='register' />} />
              <ProtectRoute path='/diary' component={Diary} />
            </Switch>
          </Router>

        </div>
      </PostsContextProvider>
    </AuthContextProvider>

  );
}

export default App;
