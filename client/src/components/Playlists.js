import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPlaylists } from '../spotify';

import FeatureChart from './FeatureChart';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';

const Container = styled(Section)``;
const Wrapper = styled.div`
  ${mixins.flexBetween};
  align-items: flex-start;
`;
const PlaylistsContainer = styled(Section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: ${theme.spacing.md};
  width: 100%;
`;
const Playlist = styled.div`
  text-align: center;
`;
const PlaylistImage = styled.img`
  object-fit: cover;
  cursor: pointer;
`;
const PlaylistName = styled.a`
  margin: ${theme.spacing.base} 0 5px;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid ${theme.colors.white};
  }
`;
const PlaylistDetails = styled.div`
  text-transform: uppercase;
  margin-bottom: 5px;
  color: ${theme.colors.lightGrey};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: 1px;
`;

class Playlists extends Component {
  static propTypes = {
    playlists: PropTypes.object,
  };

  state = {
    playlists: null,
    chartPlaylist: null,
  };

  componentDidMount() {
    getPlaylists().then(res => this.setState({ playlists: res.data }));
  }

  showFeatureChart(playlist) {
    this.setState({ chartPlaylist: playlist });
  }

  render() {
    const { playlists, chartPlaylist } = this.state;

    return (
      <Container>
        <h2>Your Playlists</h2>
        <Wrapper>
          <PlaylistsContainer>
            {playlists &&
              playlists.items.map((playlist, i) => (
                <Playlist key={i} onClick={() => this.showFeatureChart(playlist)}>
                  {playlist.images.length && <PlaylistImage src={playlist.images[0].url} alt="" />}
                  <PlaylistName href={playlist.external_urls.spotify} target="_blank">
                    {playlist.name}
                  </PlaylistName>
                  <PlaylistDetails>{playlist.tracks.total} Tracks</PlaylistDetails>
                </Playlist>
              ))}
          </PlaylistsContainer>

          {/* <FeatureChart chartPlaylist={chartPlaylist} /> */}
        </Wrapper>
      </Container>
    );
  }
}

export default Playlists;
