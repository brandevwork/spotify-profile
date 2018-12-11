import React, { Component } from 'react';
import { Link } from '@reach/router';
import { getTopArtistsShort, getTopArtistsMedium, getTopArtistsLong } from '../spotify';

import { IconInfo } from './icons';
import Loader from './Loader';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';
const { colors, fontSizes, spacing } = theme;

const Header = styled.header`
  ${mixins.flexBetween};
  h2 {
    margin: 0;
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
const ArtistsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 25px;
  margin-top: 50px;
`;
const Artist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Mask = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 100%;
  font-size: 20px;
  color: ${colors.white};
  opacity: 0;
  transition: ${theme.transition};
  svg {
    width: 25px;
  }
`;
const ArtistArtwork = styled(Link)`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  &:hover,
  &:focus {
    ${Mask} {
      opacity: 1;
    }
  }
  img {
    border-radius: 100%;
    object-fit: cover;
    width: 200px;
    height: 200px;
  }
`;
const ArtistName = styled.a`
  margin: ${spacing.base} 0;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
  }
`;

class TopArtists extends Component {
  state = {
    topArtists: null,
    activeRange: 'long',
  };

  apiCalls = {
    long: getTopArtistsLong(),
    medium: getTopArtistsMedium(),
    short: getTopArtistsShort(),
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
    try {
      const { data } = await this.apiCalls[range];
      this.setState({ topArtists: data, activeRange: range });
    } catch (e) {
      console.error(e);
    }
  }

  setActiveRange = range => this.changeRange(range);

  render() {
    const { topArtists, activeRange } = this.state;

    return (
      <Section>
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
            topArtists.items.map(({ id, external_urls, images, name }, i) => (
              <Artist key={i}>
                <ArtistArtwork to={`/artist/${id}`}>
                  {images.length && <img src={images[1].url} alt="Artist" />}
                  <Mask>
                    <IconInfo />
                  </Mask>
                </ArtistArtwork>
                <ArtistName href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {name}
                </ArtistName>
              </Artist>
            ))
          ) : (
            <Loader />
          )}
        </ArtistsContainer>
      </Section>
    );
  }
}

export default TopArtists;
