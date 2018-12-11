import React, { Component } from 'react';
import { formatWithCommas } from '../utils';
import { getArtist, followArtist, doesUserFollowArtist } from '../spotify';

import Loader from './Loader';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';
const { colors, fontSizes, spacing } = theme;

const ArtistContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  height: 100%;
  text-align: center;
`;
const Artwork = styled.div`
  ${mixins.coverShadow};
  img {
    object-fit: cover;
    width: 300px;
    height: 300px;
    border-radius: 100%;
  }
`;
const ArtistName = styled.h1`
  font-size: 70px;
  margin-top: ${spacing.md};
`;
const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: ${spacing.md};
  text-align: center;
`;
const Stat = styled.div`
  margin: 0 ${spacing.base};
`;
const Number = styled.div`
  color: ${colors.blue};
  font-weight: 700;
  font-size: ${fontSizes.md};
  text-transform: capitalize;
`;
const NumLabel = styled.p`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${spacing.xs};
`;
const FollowButton = styled.button`
  ${mixins.greenButton};
  margin-top: 50px;
  padding: 12px 50px;
  background-color: ${props => (props.isFollowing ? 'transparent' : colors.green)};
  border: 1px solid ${props => (props.isFollowing ? 'white' : 'transparent')};
  &:hover,
  &:focus {
    background-color: ${props => (props.isFollowing ? 'transparent' : colors.offGreen)};
  }
`;

class ArtistInfo extends Component {
  state = {
    artist: null,
    isFollowing: null,
  };

  componentDidMount() {
    this.getData();
    this.isFollowing();
  }

  async getData() {
    const { artistId } = this.props;

    try {
      const { data } = await getArtist(artistId);
      this.setState({ artist: data });
    } catch (e) {
      console.error(e);
    }
  }

  follow = async () => {
    const { artistId } = this.props;

    try {
      const { data } = await followArtist(artistId);
      this.setState({ isFollowing: true });
    } catch (e) {
      console.error(e);
    }
  };

  isFollowing = async () => {
    const { artistId } = this.props;

    try {
      const { data } = await doesUserFollowArtist(artistId);
      this.setState({ isFollowing: data[0] });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { artist, isFollowing } = this.state;

    return (
      <React.Fragment>
        {artist ? (
          <ArtistContainer>
            <Artwork>
              <img src={artist.images[0].url} alt="Artist Artwork" />
            </Artwork>
            <div>
              <ArtistName>{artist.name}</ArtistName>
              <Stats>
                <Stat>
                  <Number>{formatWithCommas(artist.followers.total)}</Number>
                  <NumLabel>Followers</NumLabel>
                </Stat>
                {artist.genres && (
                  <Stat>
                    <Number>
                      {artist.genres.map(genre => (
                        <div key={genre}>{genre}</div>
                      ))}
                    </Number>
                    <NumLabel>Genres</NumLabel>
                  </Stat>
                )}
                {artist.popularity && (
                  <Stat>
                    <Number>{artist.popularity}%</Number>
                    <NumLabel>Popularity</NumLabel>
                  </Stat>
                )}
              </Stats>
            </div>
            <FollowButton isFollowing={isFollowing} onClick={this.follow}>
              {isFollowing ? 'Following' : 'Follow'}
            </FollowButton>
          </ArtistContainer>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default ArtistInfo;
