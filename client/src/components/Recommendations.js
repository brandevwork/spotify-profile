import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getPlaylistTracks } from '../spotify';
// import Track from './Track';
import styled from 'styled-components/macro';
// import { theme, mixins } from '../styles';

const Container = styled.div``;
const TracksContainer = styled.div``;

class Recommendations extends Component {
  static propTypes = {
    playlistId: PropTypes.string,
  };

  state = {
    tracks: null,
    recommendations: null,
  };

  componentDidMount() {
    const { playlistId } = this.props;

    getPlaylistTracks(playlistId)
      .then(res => this.setState({ tracks: res.data }))
      .then(() => {
        // const { tracks } = this.state;
        // console.log('get recommendations');
        // getRecommendationsForTracks(tracks.items).then(res =>
        //   this.setState({ recommendations: res.data }),
        // );
      });
  }

  render() {
    // const { recommendations } = this.state;
    // console.log(recommendations);
    return (
      <Container>
        <h2>Recommended Tracks Based On Insert Playlist Here</h2>
        <TracksContainer>
          {/* {recommendations &&
            recommendations.tracks.map((track, i) => <Track track={track} key={i} />)} */}
        </TracksContainer>
      </Container>
    );
  }
}

export default Recommendations;
