import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment} from 'semantic-ui-react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import NewPost from './Containers/NewPost';
import EditPost from './Containers/EditPost';
import NavList from './Containers/NavList';
import EditPostbyID from './Containers/EditPostbyID';

class App extends Component {
  render() {
    const App = () => (
      <Segment vertical>
        <Switch>
          <Route exact path='/' component={NavList} />
          <Route path='/newpost' component={NewPost} />
          <Route exact path='/editpost' component={EditPost} />
          <Route exact path='/editpost/:id/:authtok' component={EditPostbyID} />
        </Switch>
      </Segment >
    )
    return (
      <React.Fragment>
        <Header />
        <App />
        <Footer />
      </React.Fragment>

    );
  }
}

export default App;
