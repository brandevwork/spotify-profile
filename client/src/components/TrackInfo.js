import React, { Component } from 'react';
import { formatDuration, getYear } from '../utils';
import { getTrackInfo } from '../spotify';

import Loader from './Loader';
import FeatureChart from './FeatureChart';

import styled from 'styled-components/macro';
import { theme, mixins, Section } from '../styles';
const { colors, fontSizes } = theme;

const TrackContainer = styled.div`
  display: flex;
  margin-bottom: 70px;
`;
const Artwork = styled.div`
  ${mixins.coverShadow};
  max-width: 250px;
  margin-right: 40px;
`;
const Info = styled.div`
  flex-grow: 1;
`;
const PlayTrackButton = styled.a`
  ${mixins.greenButton};
`;
const Title = styled.h1`
  font-size: 42px;
  margin: 0 0 5px;
`;
const ArtistName = styled.h2`
  color: ${colors.lightestGrey};
  font-weight: 700;
`;
const Album = styled.h3`
  color: ${colors.lightGrey};
  font-weight: 400;
  font-size: 16px;
`;
const AudioFeatures = styled.div`
  ${mixins.flexCenter};
  flex-direction: column;
`;
const Features = styled.div`
  ${mixins.flexBetween};
  justify-content: space-around;
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
  h4 {
    color: ${colors.lightGrey};
    font-size: ${fontSizes.sm};
    font-weight: 500;
  }
  p {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 0;
  }
`;
const DescriptionLink = styled.a`
  color: ${colors.lightGrey};
  margin: 30px auto 0;
  border-bottom: 1px solid ${colors.lightGrey};
`;

class TrackInfo extends Component {
  state = {
    track: null,
    audioAnalysis: null,
    audioFeatures: null,
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { trackId } = this.props;

    try {
      const { track, audioAnalysis, audioFeatures } = await getTrackInfo(trackId);
      this.setState({ track, audioAnalysis, audioFeatures });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { track, audioAnalysis, audioFeatures } = this.state;
    console.log(track, audioAnalysis);

    console.log(track && track.popularity);

    return (
      <React.Fragment>
        {track ? (
          <Section>
            <TrackContainer>
              <Artwork>
                <img src={track.album.images[0].url} alt="" />
              </Artwork>
              <Info>
                <Title>{track.name}</Title>
                <ArtistName>
                  {track.artists &&
                    track.artists.map(({ name }, i) => {
                      return (
                        <span key={i}>
                          {name}
                          {track.artists.length > 0 && i === track.artists.length - 1 ? '' : ','}
                          &nbsp;
                        </span>
                      );
                    })}
                </ArtistName>
                <Album>
                  {track.album.name} &middot; {getYear(track.album.release_date)}
                </Album>
                <PlayTrackButton
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer">
                  Play on Spotify
                </PlayTrackButton>
              </Info>
            </TrackContainer>

            {audioFeatures && (
              <AudioFeatures>
                <Features>
                  <div>
                    <p>{formatDuration(audioFeatures.duration_ms)}</p>
                    <h4>Duration</h4>
                  </div>
                  <div>
                    <p>{audioFeatures.mode === 1 ? 'Major' : 'Minor'}</p>
                    <h4>Modality</h4>
                  </div>
                  <div>
                    <p>{audioFeatures.key}</p>
                    <h4>Key</h4>
                  </div>
                  <div>
                    <p>{audioFeatures.time_signature}</p>
                    <h4>Time Signature</h4>
                  </div>
                  <div>
                    <p>{Math.round(audioFeatures.tempo)}</p>
                    <h4>Tempo (BPM)</h4>
                  </div>
                  <div>
                    <p>{track.popularity}</p>
                    <h4>Popularity</h4>
                  </div>
                </Features>

                <FeatureChart features={audioFeatures} type="" />

                <DescriptionLink
                  href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
                  target="_blank"
                  rel="noopener noreferrer">
                  See Full Description of Audio Features
                </DescriptionLink>
              </AudioFeatures>
            )}
          </Section>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default TrackInfo;
