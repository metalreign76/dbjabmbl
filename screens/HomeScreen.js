import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  SectionList,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { Icon,  Button, Card, ListItem } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvents, resetEvents, problemWithEvents } from '../actions/eventsAction';
import Colors from '../constants/Colors';
import GestureRecognizer from 'react-native-swipe-gestures';

const getEventsAPI = 'https://5amdysgq4a.execute-api.eu-west-1.amazonaws.com/default/dbJabEvents';

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.loadEvents = this.loadEvents.bind(this);
    this.resetEvents = this.resetEvents.bind(this);
  }

  resetEvents() {
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

  onSwipeLeft(gestureState) {
   console.log("Swipe Left detected");
   this.props.navigation.navigate("News")
  }

  render() {
    return (
      <GestureRecognizer
        onSwipeLeft={() => this.onSwipeLeft()}
        config={swipeConfig}
        style={{
          flex: 1
        }}
      >
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
              <Icon
                type='ionicon'
                name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'}
                size={26}
                iconStyle={{ marginBottom: -2, paddingLeft: 10 }}
                color={Colors.noticeText}
              />
            }
            iconRight
            onPress={this.resetEvents}          
            raised
          />
        </View>
        <View style={styles.eventList}>
        <SectionList
          ListEmptyComponent={<ActivityIndicator  size="large" color="#1D6292" />}
          sections={this.props.dbjab.eventsOnNowOnNext}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({section}) => {
            var arrowDirection = section.title == 'On Now' ? 'down' : 'forward';
            return (
              <View style={styles.sectionHeader}>
                <ImageBackground 
                  source={require('../assets/images/dbjabBackground.png')} 
                  style={styles.backgroundImageCSS}>
                  <Text style={styles.homePageSectionTitles}>
                    {section.title}
                  </Text>
                  <Icon
                    type='ionicon'
                    name={Platform.OS === 'ios' ? 'ios-arrow-' + arrowDirection : 'md-arrow-' + arrowDirection}
                    size={26}
                    iconStyle={styles.sectionHeaderIcon}
                    color={Colors.noticeText}
                  />
                </ImageBackground>
              </View>
            )
          }}
          renderItem={({item}) => {
            return (
              <ListItem 
                  containerStyle={styles.lessPadding}
                  leftIcon={{ 
                    type: 'ionicon',
                    name: Platform.OS === 'ios' ? 'ios-microphone' : 'md-microphone',
                    color: '#1D6292'
                  }}
                  title={item.gigDetails} 
                  titleStyle={styles.OnNoworOnNext}
                  bottomDivider={true}
              />
            )
        }}/>
        </View>
      </View>
      </GestureRecognizer>
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
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
  },
  OnNoworOnNext: {
    color: '#1D6292',
  },
  eventList: {
    flex: 1,
    marginTop: 15
  },
  sectionHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#1D6292'
  },
  lessPadding: {
    paddingTop: 7,
    paddingBottom: 7
  },
  backgroundImageCSS: {
    resizeMode: 'contain'
  },
  sectionHeaderIcon: {
    position: 'absolute',
    top: -35,
    left: 95
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
