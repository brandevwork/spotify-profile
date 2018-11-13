import axios from 'axios';

const getHashParams = () => {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

const getAccessToken = () => {
  const { error, access_token } = getHashParams();

  if (error) {
    alert('There was an error during authentication');
    console.error(error);
  }

  if (!access_token) {
    return;
  }

  const local_token = window.localStorage.getItem('spotify_access_token');

  if (!local_token) {
    window.localStorage.setItem('spotify_access_token', access_token);
  }

  return access_token;
};

export const token = getAccessToken();

const headers = { Authorization: `Bearer ${token}` };

export const getRecommendations = (tracks, callback) => {
  // get IDs of first 3 artists in topTracks
  const seed_artists = tracks.items
    .slice(0, 3)
    .map(track => track.artists[0].id)
    .join(',');

  // get IDS of 4th and 5th topTracks
  const seed_tracks = tracks.items
    .slice(3, 5)
    .map(track => track.id)
    .join(',');

  const url = `https://api.spotify.com/v1/recommendations?seed_artists=${seed_artists}&seed_tracks=${seed_tracks}`;

  axios
    .get(url, { headers })
    .then(res => {
      // console.log(res.data);
      callback(res.data);
    })
    .catch(error => console.error(error));
};

export const getPlaylistTracks = playlistId =>
  axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers });

export const getAudioFeaturesForTracks = (url, callback) => {
  axios
    .get(url, { headers })
    .then(res => {
      // console.log(res.data);
      callback(res.data);
    })
    .catch(error => console.error(error));
};

export const getUser = () => axios.get('https://api.spotify.com/v1/me', { headers });

export const getFollowing = () =>
  axios.get('https://api.spotify.com/v1/me/following?type=artist', { headers });

export const getRecentlyPlayed = () =>
  axios.get('https://api.spotify.com/v1/me/player/recently-played', { headers });

export const getTopArtistsShort = () =>
  axios.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term', {
    headers,
  });
export const getTopArtistsMedium = () =>
  axios.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', {
    headers,
  });
export const getTopArtistsLong = () =>
  axios.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', { headers });

export const getTopTracksShort = () =>
  axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', { headers });

export const getTopTracksMedium = () =>
  axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', {
    headers,
  });

export const getTopTracksLong = () =>
  axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term', {
    headers,
  });

export const getPlaylists = () => axios.get('https://api.spotify.com/v1/me/playlists', { headers });

export const getUserInfo = () =>
  axios.all([getUser(), getFollowing(), getPlaylists()]).then(
    axios.spread((user, followedArtists, playlists) => {
      return {
        user: user.data,
        followedArtists: followedArtists.data,
        playlists: playlists.data,
      };
    }),
  );
