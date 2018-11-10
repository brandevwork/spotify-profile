import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IconUser } from './icons';

import styled from 'styled-components/macro';
import { theme, mixins } from '../styles';

const Container = styled.header`
  display: flex;
  position: relative;
`;
const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 100%;
  margin-right: ${theme.spacing.md};
`;
const NoAvatar = styled.div`
  border: 2px solid currentColor;
  border-radius: 100%;
  padding: ${theme.spacing.md};
`;
const Label = styled.div`
  font-size: ${theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
`;
const Name = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin: 0;
`;
const Stats = styled.div`
  ${mixins.flexBetween};
  margin-top: ${theme.spacing.base};
`;
const Stat = styled.div`
  margin-right: ${theme.spacing.md};
`;
const Number = styled.div`
  color: ${theme.colors.green};
  font-weight: 700;
  font-size: ${theme.fontSizes.md};
`;
const NumLabel = styled.p`
  color: ${theme.colors.lightGrey};
  font-size: ${theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${theme.spacing.xs};
`;
// const LogoutButton = styled.a`
//   position: absolute;
//   top: 50px;
//   right: 50px;
//   background-color: ${theme.colors.green};
//   color: ${theme.colors.white};
//   border-radius: 30px;
//   padding: 12px 22px;
//   font-size: ${theme.fontSizes.xs};
//   font-weight: 700;
//   letter-spacing: 1px;
//   text-transform: uppercase;
//   text-align: center;
//   &:hover {
//     background-color: ${theme.colors.offGreen};
//   }
// `;

class User extends Component {
  render() {
    const { user, followedArtists, totalPlaylists } = this.props;

    return (
      <Container>
        <Avatar>
          {user.images.length > 0 ? (
            <img src={user.images[0].url} alt="avatar" />
          ) : (
            <NoAvatar>
              <IconUser />
            </NoAvatar>
          )}
        </Avatar>
        <div>
          <Label>{user.type}</Label>
          <Name>{user.display_name}</Name>
          <Stats>
            <Stat>
              <Number>{user.followers.total}</Number>
              <NumLabel>Followers</NumLabel>
            </Stat>
            {/* This is just artists followed, not users */}
            <Stat>
              <Number>{followedArtists.artists.items.length}</Number>
              <NumLabel>Following</NumLabel>
            </Stat>
            <Stat>
              <Number>{totalPlaylists}</Number>
              <NumLabel>Playlists</NumLabel>
            </Stat>
          </Stats>
        </div>
        {/* <LogoutButton href="http://localhost:3000">Log Out</LogoutButton> */}
      </Container>
    );
  }
}

User.propTypes = {
  user: PropTypes.object,
  followedArtists: PropTypes.object,
  totalPlaylists: PropTypes.number,
};

export default User;
