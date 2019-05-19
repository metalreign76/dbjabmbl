import React from 'react';
import { Platform, TouchableOpacity, FlatList, Text, View, StyleSheet } from 'react-native';
import { Modal, WebView, ActivityIndicator } from 'react-native';
import { Icon, Image, Card } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showEventItem, hideEventItem } from '../actions/eventsAction';

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
  }
  
  showEvent(eventItem) {
    this.props.showEventItem(eventItem);
  }
 
  render() {
    return (
      <View style={styles.pageContainer}>
      <FlatList style={styles.eventList}
        data={this.props.dbjab.eventData}
        ListEmptyComponent={<ActivityIndicator size="large" color='#fff' />}
        renderItem={({item}) => (
          <TouchableOpacity onPress={()=> this.showEvent(item.eventDescription)}>
          <Card 
            containerStyle={styles.container} 
            key={item.key}
          >
          {
            <View style={styles.containerView}>
              <View style={styles.titlesView}>
                  <Image
                    source={{ uri: item.eventImage }}
                    style={styles.eventImage}
                    PlaceholderContent={<ActivityIndicator />}
                  />
                <Text style={styles.cardTitle}> 
                  {item.eventName}
                </Text>
              </View>
              <View style={styles.excerptView}>
                <Text style={styles.cardExcerpt}> 
                  {item.eventDay} {item.eventStartTime} - {item.eventEndTime} @ {item.eventVenue}
                </Text>
              </View>
            </View>
          }
          </Card>
          </TouchableOpacity>

        )}
      />
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
