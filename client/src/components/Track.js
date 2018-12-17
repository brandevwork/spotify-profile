import React, { Component } from 'react';
import { formatDuration, getYear, parsePitchClass } from '../utils';
import { getTrackInfo } from '../spotify';

import Loader from './Loader';
import FeatureChart from './FeatureChart';

import styled from 'styled-components/macro';
import { theme, mixins, media, Section } from '../styles';
const { colors, fontSizes } = theme;

const TrackContainer = styled.div`
  display: flex;
  margin-bottom: 70px;
  ${media.phablet`
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  `};
`;
const Artwork = styled.div`
  ${mixins.coverShadow};
  max-width: 250px;
  margin-right: 40px;
  ${media.tablet`
    max-width: 200px;
  `};
  ${media.phablet`
    margin: 0 auto;
  `};
`;
const Info = styled.div`
  flex-grow: 1;
  ${media.phablet`
    text-align: center;
    margin-top: 30px;
  `};
`;
const PlayTrackButton = styled.a`
  ${mixins.greenButton};
`;
const Title = styled.h1`
  font-size: 42px;
  margin: 0 0 5px;
  ${media.tablet`
    font-size: 30px;
  `};
`;
const ArtistName = styled.h2`
  color: ${colors.lightestGrey};
  font-weight: 700;
  text-align: left !important;
  ${media.tablet`
    font-size: 20px;
  `};
  ${media.phablet`
    text-align: center !important;
  `};
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
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
`;
const Feature = styled.div``;
const FeatureText = styled.h4`
  color: ${colors.lightestGrey};
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 0;
  ${media.phablet`
    font-size: 28px;
  `};
`;
const FeatureLabel = styled.p`
  color: ${colors.lightestGrey};
  font-size: ${fontSizes.xs};
  margin-bottom: 0;
`;
const DescriptionLink = styled.a`
  color: ${colors.lightestGrey};
  margin: 20px auto 0;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
    color: ${colors.white};
    border-bottom: 1px solid ${colors.white};
  }
`;

class Track extends Component {
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
    console.log(audioAnalysis);

    return (
      <React.Fragment>
        {track ? (
          <Section>
            <TrackContainer>
              <Artwork>
                <img src={track.album.images[0].url} alt="Album Artwork" />
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
                  <a
                    href={track.album.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer">
                    {track.album.name}
                  </a>{' '}
                  &middot; {getYear(track.album.release_date)}
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
                  <Feature>
                    <FeatureText>{formatDuration(audioFeatures.duration_ms)}</FeatureText>
                    <FeatureLabel>Duration</FeatureLabel>
                  </Feature>
                  <Feature>
                    <FeatureText>{parsePitchClass(audioFeatures.key)}</FeatureText>
                    <FeatureLabel>Key</FeatureLabel>
                  </Feature>
                  <Feature>
                    <FeatureText>{audioFeatures.mode === 1 ? 'Major' : 'Minor'}</FeatureText>
                    <FeatureLabel>Modality</FeatureLabel>
                  </Feature>
                  <Feature>
                    <FeatureText>{audioFeatures.time_signature}</FeatureText>
                    <FeatureLabel>Time Signature</FeatureLabel>
                  </Feature>
                  <Feature>
                    <FeatureText>{Math.round(audioFeatures.tempo)}</FeatureText>
                    <FeatureLabel>Tempo (BPM)</FeatureLabel>
                  </Feature>
                  <Feature>
                    <FeatureText>{track.popularity}%</FeatureText>
                    <FeatureLabel>Popularity</FeatureLabel>
                  </Feature>
                </Features>

                <FeatureChart features={audioFeatures} type="" />

                <DescriptionLink
                  href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
                  target="_blank"
                  rel="noopener noreferrer">
                  Full Description of Audio Features
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

export default Track;
