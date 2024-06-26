import React from 'react';

import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ButtonType } from '../utils/types';

export default function useButtonType(type: ButtonType) {
  const AddButton = () => (
    <Entypo
      name='add-to-list'
      size={24}
      color='black'
    />
  );

  const EditButton = () => (
    <AntDesign
      name='edit'
      size={24}
      color='black'
    />
  );

  const DeleteButton = () => (
    <MaterialCommunityIcons
      name='playlist-minus'
      size={24}
      color='black'
    />
  );

  const actionButton =
    type === 'add' ? AddButton : type === 'delete' ? DeleteButton : EditButton;

  return actionButton;
}
