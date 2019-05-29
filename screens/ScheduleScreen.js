import React from 'react';
import { Platform, Text, ScrollView, View, StyleSheet } from 'react-native';
import { ImageBackground, ActivityIndicator } from 'react-native';
import { Icon, Image, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showEventItem, hideEventItem } from '../actions/eventsAction';
import Accordion from 'react-native-collapsible/Accordion';

var accordianView = [];

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Gig Guide ',
    headerTintColor: '#1D6292'
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSections: []
    }
  
  }
  
  showEvent(eventItem) {
    this.props.showEventItem(eventItem);
  }
 
  _renderHeader = section => {
    return (
      <View style={styles.sectionHeader}>
        <ImageBackground 
          source={require('../assets/images/dbjabBackground.png')} 
          style={styles.backgroundImageCSS}>
          <Text style={styles.homePageSectionTitles}>
            {section.title}
          </Text>
        </ImageBackground>
      </View>
    );
  };
 
  _renderContent = section => {
    const eventSubList = section.content.map(event => {
        return (
        <ListItem 
            key={event.key}
            containerStyle={styles.lessPadding}
            leftAvatar={
              <Image
                source={{ uri: this.props.dbjab.eventData[event.key].eventImage }}
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
            title={
              <Text style={{fontWeight: 'bold'}}>{event.gigTitle}
                <Text style={{fontWeight: 'normal'}}>, </Text>
                  <Text style={{fontWeight: 'normal', color: 'darkorange'}}>{event.gigTimes}</Text>
                  <Text style={{fontWeight: 'normal', color: 'black'}}> @ </Text>
                  <Text style={{fontWeight: 'normal', color: 'dodgerblue'}}>{event.gigVenue}</Text>
              </Text> }
            bottomDivider={true}
            onPress={()=> this.showEvent(this.props.dbjab.eventData[event.key].eventDescription)}
        /> )
    })
    return (
      <View>{eventSubList}</View>
    );
  };
 
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };
 
  render() {
    return (

      <ScrollView>
        <Accordion
          sections={this.props.dbjab.gigsByDay}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  eventList: {
    paddingTop: 5
  },
  containerView: {
    flexDirection: 'column'
  },
  titlesView: {
    flexDirection: 'row'
  },
  excerptView: {
    flexDirection: 'row'
  },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    color: '#1D6292'
  },
  cardExcerpt: {
    paddingTop: 10,
    color: '#1D6292'
  },
  eventImage: {
    width: 50,
    height: 50
  },
  pageContainer: {
    backgroundColor: '#1D6292',
    height: '100%'
  },
  homePageSectionTitles: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
  },
  sectionHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#1D6292'
  },
  backgroundImageCSS: {
    resizeMode: 'contain'
  },
  overlayIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingRight: 10
  }
});

const mapStateToProps = (state) => {
  const { dbjab } = state
  return { dbjab }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showEventItem,
    hideEventItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
