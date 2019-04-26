import React from 'react';
import {FlatList, Text, View, StyleSheet } from 'react-native';
import wpAPI from 'wpapi'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPosts } from '../actions/postsAction';

var wp, titlesList;

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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.posts.titles}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});

const mapStateToProps = (state) => {
  const { posts } = state
  return { posts }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getPosts,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
