import React from 'react';
import { TouchableHighlight, FlatList, Text, View, StyleSheet } from 'react-native';
import { WebView, ActivityIndicator, Platform } from 'react-native';
import { Image, Card, Overlay } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvents, showEventItem, hideEventItem } from '../actions/eventsAction';
import AWS from 'aws-sdk/clients/lambda';
import Colors from '../constants/Colors';

var lambda = new AWS({
  region: 'eu-west-1',
  accessKeyId: 'AKIAR7ILU4G7WDV6Y5JL',
  secretAccessKey: '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'
});
var iCalURL = 'http://www.dannyboyjazzandblues.com/?plugin=all-in-one-event-calendar&controller=ai1ec_exporter_controller&action=export_events&ai1ec_cat_ids=516&xml=true';

class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Gig Guide ',
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    var params = {

      FunctionName: 'arn:aws:lambda:eu-west-1:135852777919:function:dbJabEvents'
    }

    lambda.invoke(params).promise()
    .then(results => {
      var parsedResults = JSON.parse(results.Payload)
      this.props.getEvents(parsedResults.body.data);
    })
    .catch(err => {
      console.log("ERROR:", err)
    })
  }

  
  showEvent = (eventItem) => {
    this.props.showEventItem(eventItem);
  }


  render() {
    return (
      <View>
      <FlatList style={styles.eventList}
        data={this.props.dbjab.eventData}
        ListEmptyComponent={<ActivityIndicator size="large" color={Colors.tintColor} />}
        renderItem={({item}) => (
          <TouchableHighlight onPress={()=> this.showEvent(item.eventDescription)}>
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
                  {item.eventDay} {item.eventStart} - {item.eventEnd} @ {item.eventVenue}
                </Text>
              </View>
            </View>
          }
          </Card>
          </TouchableHighlight>

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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: '#fff',
    flex: 1
  },
  eventList: {
    paddingTop: 10
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
    fontSize: 16
  },
  cardExcerpt: {
    paddingTop: 10
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
    showEventItem,
    hideEventItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
