import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  SectionList,
  ActivityIndicator
} from 'react-native';
import { Button, Card, ListItem } from 'react-native-elements';
import { Icon } from 'expo';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvents, resetEvents, problemWithEvents } from '../actions/eventsAction';
import Colors from '../constants/Colors';

const getEventsAPI = 'https://5amdysgq4a.execute-api.eu-west-1.amazonaws.com/default/dbJabEvents';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);

    this.loadEvents = this.loadEvents.bind(this);
    this.resetEvents = this.resetEvents.bind(this);
  }

  componentWillMount() {
    this.loadEvents();
  }

  resetEvents() {
    console.log("Resetting...")
    this.props.resetEvents();
    if(this.props.dbjab.eventsError) {
      this.loadEvents()
    }
    else {
      console.log("Updating...")
      this.props.getEvents(this.props.dbjab.eventData);
    }
  }
  
  loadEvents() {
    console.log("Getting events")
    axios.get(getEventsAPI)
    .then(results => {
      this.props.getEvents(results.data.events);
    })
    .catch(err => {
      console.log("ERROR:", err)
      this.props.problemWithEvents();
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/DannyBoyHome.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.reloadEventsPanel}>
          <Button
            containerStyle={styles.refreshEventsButtonContainer}
            title="Update Whats On Now/Next"
            titleStyle={styles.homePageButtonTitle}
            buttonStyle={styles.refreshButton}
            icon={
              <Icon.Ionicons
                name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'}
                size={26}
                style={{ marginBottom: -2, paddingLeft: 10 }}
                color={Colors.noticeText}
              />
            }
            iconRight
            onPress={this.resetEvents}          
          />
        </View>
        <View style={styles.eventList}>
        <SectionList
          ListEmptyComponent={<ActivityIndicator  size="large" color="#1D6292" />}
          sections={this.props.dbjab.eventsOnNowOnNext}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({section}) => {
            return (
              <View>
                <Text style={styles.homePageSectionTitles}>{section.title}</Text>
              </View>
            )
          }}
          renderItem={({item}) => {
            return (
              <View style={styles.OnNoworOnNext}>
              <ListItem 
                  leftIcon={{ 
                    type: 'ionicon',
                    name: Platform.OS === 'ios' ? 'ios-microphone' : 'md-microphone',
                    color: '#1D6292'
                  }}
                  title={item.gigDetails} 
                  titleStyle={styles.OnNoworOnNext}
              />
              </View>
            )
        }}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeImage: {
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
  },
  reloadEventsPanel: {
    flexDirection: 'row'
  },
  refreshEventsButtonContainer: {
    marginLeft: 5,
    marginRight: 5,
    width: 350,
  },
  refreshButton: {
    backgroundColor: '#1D6292'
  },
  homePageButtonTitle: {
    color: '#fff'
  },
  homePageSectionTitles: {
    color: '#1D6292',
    marginTop: 5,
    padding: 3,
    fontSize: 18
  },
  OnNoworOnNext: {
    color: '#1D6292',
  },
  eventList: {
    flex: 1,
    marginTop: 15
  },
  eventsOnNowStyle: {
    height: 200
  }
});

const mapStateToProps = (state) => {
  const { dbjab } = state
  return { dbjab }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getEvents,
    resetEvents,
    problemWithEvents
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
