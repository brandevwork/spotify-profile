import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getTopArtistsShort, getTopArtistsMedium, getTopArtistsLong } from '../spotify';

import Loader from './Loader';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';
const { colors, fontSizes, spacing } = theme;

const Container = styled(Section)``;
const Header = styled.header`
  ${mixins.flexBetween};
  h2 {
    margin-bottom: 0;
  }
`;
const Ranges = styled.div`
  display: flex;
`;
const RangeButton = styled.button`
  background-color: transparent;
  font-size: ${fontSizes.base};
  color: ${props => (props.isActive ? colors.white : colors.lightGrey)};
  span {
    padding-bottom: 3px;
    border-bottom: 1px solid ${props => (props.isActive ? colors.white : `transparent`)};
  }
`;
const ArtistsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 25px;
  margin-top: 50px;
`;
const Artist = styled.div`
  text-align: center;
`;
const ArtistLink = styled.a`
  position: relative;
  width: 100%;
`;
const ArtistImage = styled.img`
  border-radius: 100%;
  object-fit: cover;
  width: 200px;
  height: 200px;
`;
const ArtistName = styled.a`
  margin: ${spacing.base} 0;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid ${colors.white};
  }
`;

class TopArtists extends Component {
  static propTypes = {
    topArtists: PropTypes.object,
  };

  state = {
    topArtists: null,
    activeRange: 'long',
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const { data } = await getTopArtistsLong();
      this.setState({ topArtists: data });
    } catch (e) {
      console.error(e);
    }
  }

  async changeRange(range) {
    const apiCall =
      range === 'long'
        ? getTopArtistsLong()
        : range === 'medium'
        ? getTopArtistsMedium()
        : range === 'short'
        ? getTopArtistsShort()
        : getTopArtistsLong();

    try {
      const { data } = await apiCall;
      this.setState({ topArtists: data, activeRange: range });
    } catch (e) {
      console.error(e);
    }
  }

  setActiveRange = range => this.changeRange(range);

  render() {
    const { topArtists, activeRange } = this.state;

    return (
      <Container>
        <Header>
          <h2>Top Artists</h2>
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
        <ArtistsContainer>
          {topArtists ? (
            topArtists.items.map(({ external_urls, images, name }, i) => (
              <Artist key={i}>
                <ArtistLink href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  <ArtistImage src={images[1].url} alt="Artist Avatar" />
                </ArtistLink>
                <ArtistName href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {name}
                </ArtistName>
              </Artist>
            ))
          ) : (
            <Loader />
          )}
        </ArtistsContainer>
      </Container>
    );
  }
}

export default TopArtists;
