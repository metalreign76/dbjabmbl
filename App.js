import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset'
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import dbjabReducer from './reducers/dbjabReducer';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvents, resetEvents, problemWithEvents } from './actions/eventsAction';
import wpAPI from 'wpapi'
import { getPosts } from './actions/postsAction';
import { Ionicons } from '@expo/vector-icons';


const getEventsAPI = 'https://5amdysgq4a.execute-api.eu-west-1.amazonaws.com/default/dbJabEvents';

const store = createStore(dbjabReducer);

class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  loadEvents() {
    return new Promise((resolve, reject) => {
      axios.get(getEventsAPI)
      .then(results => {
        store.dispatch(getEvents(results.data.events));
        resolve();
      })
      .catch(err => {
        console.log("ERROR:", err)
        store.dispatch(problemWithEvents());
        resolve();
      })
    })
  }

  loadNews() {
    return new Promise((resolve, reject) => {
      var wp = new wpAPI({ endpoint: 'http://www.dannyboyjazzandblues.com/wp-json' })
      wp.posts().categories( 3 )
      .param( 'after', new Date( '2019-01-01' ) )
      .then( list => {
        store.dispatch(getPosts(list))
        resolve();
      })
      .catch(err => {
        console.log("ERROR:", err)
        reject();
      })
    })
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={ store }>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        </Provider>
      );
    }
  } 

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([ 
        require('./assets/images/2019_App_Header_1200x600.png'),
        require('./assets/images/dbjabBackground.png'),
        require('./assets/images/oops.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
      }),
      this.loadEvents(),
      this.loadNews()
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
