import React from 'react';
import { Modal, WebView, ActivityIndicator, Platform } from 'react-native';
import { TouchableOpacity, FlatList, Text, View, StyleSheet } from 'react-native';
import { Icon, Image, Card, Overlay } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPosts, showNewsItem, hideNewsItem } from '../actions/postsAction';

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
 
  render() {
    return (
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
        <Modal 
          visible={this.props.dbjab.newsItemVisible}
          presentationStyle={'fullScreen'} 
          onDismiss={() => this.props.hideNewsItem()}
          onRequestClose={() => this.props.hideNewsItem()}
          animationType={'slide'}
        >
          <Icon
              type='ionicon'
              name={Platform.OS === 'ios' ? 'ios-close-circle-outline' : 'md-close-circle-outline'}
              size={30}
              iconStyle={styles.overlayIcon}
              color='#1D6292'
              onPress={() => this.props.hideNewsItem()}
          />
          <WebView
            source={{ html: this.props.dbjab.newsSelectedItem}}
            contentInset={{top: 10, left: 5, bottom: 10, right: 5}}
          />
        </Modal>
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
    getPosts,
    showNewsItem,
    hideNewsItem
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
