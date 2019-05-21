import React from 'react';
import {
  Platform,
  Modal,
  StyleSheet,
  View,
  Text,
  SectionList,
  ActivityIndicator,
  ImageBackground,
  WebView,
  TouchableOpacity
} from 'react-native';
import { Image,  Icon,  Button, ListItem } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvents, showEventItem, hideEventItem, resetEvents, problemWithEvents } from '../actions/eventsAction';
import Colors from '../constants/Colors';

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
    this.showEvent = this.showEvent.bind(this);
  }

  resetEvents() {
    this.props.resetEvents();
    if(this.props.dbjab.eventsError) {
      this.loadEvents()
    }
    else {
      this.props.getEvents(this.props.dbjab.eventData);
    }
  }
  
  loadEvents() {
    axios.get(getEventsAPI)
    .then(results => {
      this.props.getEvents(results.data.events);
    })
    .catch(err => {
      console.log("ERROR:", err)
      this.props.problemWithEvents();
    })
  }

  showEvent(eventKey) {
    if((eventKey == "NOGIGSNOW")||(eventKey == "NOGIGSNEXT")) return;
    this.props.showEventItem(this.props.dbjab.eventData[eventKey].eventDescription);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/DannyBoyHome.png')}
          style={styles.welcomeImage}
          containerStyle={styles.homeImageContainer}
        />
        <Button
          title="Update Whats On Now/Next -"
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
            var eventKey = item.key;
            var imageToDisplay = (this.props.dbjab.eventData[eventKey].eventImage ? this.props.dbjab.eventData[eventKey].eventImage : null)
            return (
              <ListItem 
                  containerStyle={styles.lessPadding}
                  leftAvatar={
                    <Image
                      source={{ uri: imageToDisplay }}
                      style={styles.eventImage}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  }
                  rightIcon={{ 
                    type: 'ionicon',
                    name: Platform.OS === 'ios' ? 'ios-information-circle-outline' : 'md-information-circle-outline',
                    color: '#1D6292',
                    style: styles.infoIcon
                  }}
                  title={item.gigDetails} 
                  titleStyle={styles.OnNoworOnNext}
                  bottomDivider={true}
                  onPress={()=> this.showEvent(item.key)}
              />
            )
        }}/>
      <Modal 
        visible={this.props.dbjab.eventItemVisible}
        presentationStyle={'fullScreen'} 
        onDismiss={() => this.props.hideEventItem()}
        onRequestClose={() => this.props.hideEventItem()}
        animationType={'slide'}
      >
        <Icon
          type='ionicon'
          name={Platform.OS === 'ios' ? 'ios-close-circle-outline' : 'md-close-circle-outline'}
          size={30}
          iconStyle={styles.overlayIcon}
          color='#1D6292'
          onPress={() => this.props.hideEventItem()}
        />
        <WebView
          source={{ html: this.props.dbjab.eventSelectedItem}}
        />
      </Modal>
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
  homeImageContainer: {
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  welcomeImage: {
    height: 200,
    resizeMode: 'contain'
  },
  reloadEventsPanel: {
    flexDirection: 'row'
  },
  refreshButton: {
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#1D6292',
    marginLeft: 5,
    marginRight: 5,
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
  sectionHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#1D6292'
  },
  lessPadding: {
    paddingTop: 10,
    paddingBottom: 10
  },
  backgroundImageCSS: {
    resizeMode: 'contain'
  },
  sectionHeaderIcon: {
    position: 'absolute',
    top: -35,
    left: 95
  },
  overlayIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10
  },
  infoIcon: {
    alignSelf: 'flex-end'
  },
  eventImage: {
    width: 50,
    height: 50
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
    problemWithEvents,
    showEventItem,
    hideEventItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
