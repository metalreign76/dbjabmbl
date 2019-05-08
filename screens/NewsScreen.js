import React from 'react';
import { WebView, ActivityIndicator, Platform } from 'react-native';
import { TouchableHighlight, FlatList, Text, View, StyleSheet } from 'react-native';
import { Image, Card, Overlay } from 'react-native-elements'
import wpAPI from 'wpapi'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPosts, showNewsItem, hideNewsItem } from '../actions/postsAction';
import Colors from '../constants/Colors';

var wp;

class NewsScreen extends React.Component {
  static navigationOptions = {
    title: 'News',
  };

  constructor(props) {
    super(props);
    wp = new wpAPI({ endpoint: 'http://www.dannyboyjazzandblues.com/wp-json' })
  }

  componentWillMount() {
    wp.posts()
    .param( 'after', new Date( '2019-01-01' ) )
    .then( list => {
      this.props.getPosts(list)
    })
    .catch(err => {
      console.log("ERROR:", err)
    })
  }

  showNews = (newsItem) => {
    this.props.showNewsItem(newsItem);
  }

  render() {
    return (
      <View>
        <FlatList style={styles.newsList}
          data={this.props.dbjab.newsData}
          ListEmptyComponent={<ActivityIndicator size="large" color={Colors.tintColor} />}
          renderItem={({item}) => (
            <TouchableHighlight onPress={()=> this.showNews(item.fullPost)}>
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
            </TouchableHighlight>
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
    fontSize: 18
  },
  cardExcerpt: {
    paddingTop: 10
  },
  newsImage: {
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
    getPosts,
    showNewsItem,
    hideNewsItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
