import React, { Component } from 'react';
import { getTopTracksShort, getTopTracksMedium, getTopTracksLong } from '../spotify';

import Loader from './Loader';
import Track from './Track';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';
const { colors, fontSizes } = theme;

const Header = styled.header`
  ${mixins.flexBetween};
  h2 {
    margin-bottom: 0;
  }
`;
const Ranges = styled.div`
  display: flex;
  margin-right: -11px;
`;
const RangeButton = styled.button`
  background-color: transparent;
  color: ${props => (props.isActive ? colors.white : colors.lightGrey)};
  font-size: ${fontSizes.base};
  font-weight: 500;
  padding: 11px;
  span {
    padding-bottom: 3px;
    border-bottom: 1px solid ${props => (props.isActive ? colors.white : `transparent`)};
  }
`;
const TracksContainer = styled.ul`
  margin-top: 50px;
`;

class TopTracks extends Component {
  state = {
    topTracks: null,
    activeRange: 'long',
  };

  apiCalls = {
    long: getTopTracksLong(),
    medium: getTopTracksMedium(),
    short: getTopTracksShort(),
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const { data } = await getTopTracksLong();
      this.setState({ topTracks: data });
    } catch (e) {
      console.error(e);
    }
  }

  async changeRange(range) {
    try {
      const { data } = await this.apiCalls[range];
      this.setState({ topTracks: data, activeRange: range });
    } catch (e) {
      console.error(e);
    }
  }

  setActiveRange = range => this.changeRange(range);

  render() {
    const { topTracks, activeRange } = this.state;

    return (
      <Section>
        <Header>
          <h2>Top Tracks</h2>
          <Ranges>
            <RangeButton
              isActive={activeRange === 'long'}
              onClick={() => this.setActiveRange('long')}>
              <span>All Time</span>
            </RangeButton>
            <RangeButton
              isActive={activeRange === 'medium'}
              onClick={() => this.setActiveRange('medium')}>
              <span>Last 6 Months</span>
            </RangeButton>
            <RangeButton
              isActive={activeRange === 'short'}
              onClick={() => this.setActiveRange('short')}>
              <span>Last 4 Weeks</span>
            </RangeButton>
          </Ranges>
        </Header>
        <TracksContainer>
          {topTracks ? (
            topTracks.items.map((track, i) => <Track track={track} key={i} />)
          ) : (
            <Loader />
          )}
        </TracksContainer>
      </Section>
    );
  }
}

export default TopTracks;
