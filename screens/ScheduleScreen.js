import React from 'react';
import { TouchableOpacity, FlatList, Text, View, StyleSheet } from 'react-native';
import { WebView, ActivityIndicator, Platform } from 'react-native';
import { Image, Card, Overlay } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showEventItem, hideEventItem } from '../actions/eventsAction';
import GestureRecognizer from 'react-native-swipe-gestures';

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

  onSwipeRight(gestureState) {
    console.log("Swipe Right detected");
    this.props.navigation.navigate("News")
   }
 
  render() {
    return (
      <GestureRecognizer
        onSwipeRight={() => this.onSwipeRight()}
        config={swipeConfig}
        style={{
          flex: 1
        }}
      >
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
      <Overlay 
        isVisible={this.props.dbjab.eventItemVisible}
        fullScreen={true}
        onBackdropPress={() => this.props.hideEventItem()}
      >
        <WebView
          source={{ html: this.props.dbjab.eventSelectedItem}}
          />
      </Overlay>
      </View>
      </GestureRecognizer>
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
