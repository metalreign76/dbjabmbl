import React from 'react';
import { WebView, ActivityIndicator, Platform } from 'react-native';
import { TouchableOpacity, FlatList, Text, View, StyleSheet } from 'react-native';
import { Image, Card, Overlay } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPosts, showNewsItem, hideNewsItem } from '../actions/postsAction';
import GestureRecognizer from 'react-native-swipe-gestures';

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

var wp;

class NewsScreen extends React.Component {
  static navigationOptions = {
    title: 'News',
    headerTintColor: '#1D6292'
  };

  constructor(props) {
    super(props);
  }

  showNews = (newsItem) => {
    this.props.showNewsItem(newsItem);
  }

  onSwipeLeft(gestureState) {
    console.log("Swipe Left detected");
    this.props.navigation.navigate("Schedule")
  }

  onSwipeRight(gestureState) {
    console.log("Swipe Right detected");
    this.props.navigation.navigate("Home")
  }
 
  render() {
    return (
      <GestureRecognizer
        onSwipeLeft={() => this.onSwipeLeft()}
        onSwipeRight={() => this.onSwipeRight()}
        config={swipeConfig}
        style={{
          flex: 1
        }}
      > 
      <View style={styles.pageContainer}>
        <FlatList style={styles.newsList}
          data={this.props.dbjab.newsData}
          ListEmptyComponent={<ActivityIndicator size="large" color='#fff' />}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=> this.showNews(item.fullPost)}>
            <Card 
              containerStyle={styles.container} 
              key={item.key}
            >
            {
              <View style={styles.containerView}>
                <View style={styles.titlesView}>
                    <Image
                      source={{ uri: item.featuredImage }}
                      style={styles.newsImage}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                  <Text style={styles.cardTitle}> 
                    {item.title}
                  </Text>
                </View>
                <View style={styles.excerptView}>
                  <Text style={styles.cardExcerpt}> 
                    {item.excerpt}...
                  </Text>
                </View>
              </View>
            }
            </Card>
            </TouchableOpacity>
          )}
        />
        <Overlay 
          isVisible={this.props.dbjab.newsItemVisible}
          fullScreen={true}
          onBackdropPress={() => this.props.hideNewsItem()}
        >
          <WebView
            source={{ html: this.props.dbjab.newsSelectedItem}}
            />
        </Overlay>
      </View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: '#fff',
    flex: 1
  },
  newsList: {
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
    fontSize: 18,
    color: '#1D6292'
  },
  cardExcerpt: {
    paddingTop: 10,
    color: '#1D6292'
  },
  newsImage: {
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
    getPosts,
    showNewsItem,
    hideNewsItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
