import React, { Component } from 'react';
import { getRecentlyPlayed } from '../spotify';
import { catchErrors } from '../utils';

import Loader from './Loader';
import TrackItem from './TrackItem';

import styled from 'styled-components/macro';
import { Main } from '../styles';

const TracksContainer = styled.ul`
  margin-top: 50px;
`;

class RecentlyPlayed extends Component {
  state = {
    recentlyPlayed: null,
  };

  componentDidMount() {
    catchErrors(this.getData());
  }

  async getData() {
    const { data } = await getRecentlyPlayed();
    this.setState({ recentlyPlayed: data });
  }

  render() {
    const { recentlyPlayed } = this.state;

    return (
      <Main>
        <h2>Recently Played Tracks</h2>
        <TracksContainer>
          {recentlyPlayed ? (
            recentlyPlayed.items.map(({ track }, i) => <TrackItem track={track} key={i} />)
          ) : (
            <Loader />
          )}
        </TracksContainer>
      </Main>
    );
  }
}

export default RecentlyPlayed;
