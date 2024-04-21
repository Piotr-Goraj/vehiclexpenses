import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Image, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite/next';

import PrimaryButton from '../ui/buttons/PrimaryButton';
import ModalCard from './ModalCard';
import PrimaryDropdown from '../ui/PrimaryDropdown';
import colors from '../../utils/colors';
import { tablesNames } from '../../utils/types';

interface ImageModalProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
  vehicleId: number;
}

export default function VehicleImageModal({
  isModalVisible,
  onModal,
  vehicleId,
}: ImageModalProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [image, setImage] = useState<FileSystem.EncodingType.Base64 | null>(
    null
  );
  const [isImageSaved, setIsImageSaved] = useState<boolean>(true);
  const [isDropdownFocus, setIsDropdownFocus] = useState<boolean>(false);
  const [colorSelected, setColorSelected] = useState<string>('');

  const generateColorArray = (color: any, levels: number) => {
    const colorArray = [];
    for (let i = 100; i <= levels * 100; i += 100) {
      colorArray.push({ value: color[i] });
    }
    return colorArray;
  };

  const colorsDropdown = [
    ...generateColorArray(colors.red, 7),
    ...generateColorArray(colors.green, 7),
    ...generateColorArray(colors.blue, 7),
    ...generateColorArray(colors.yellow, 7),
    ...generateColorArray(colors.cyan, 7),
    ...generateColorArray(colors.magenta, 7),
    ...generateColorArray(colors.yellow, 7),
    ...generateColorArray(colors.grey, 7),
  ];

  const db = useSQLiteContext();

  useEffect(() => {
    setIsVisible(isModalVisible);

    return () => setImage(null);
  }, [isModalVisible]);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const base64Image = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      setImage(base64Image as FileSystem.EncodingType.Base64);
    }
  };

  const saveImage = async () => {
    if (image) {
      const result = await db.runAsync(
        'UPDATE vehicles SET image = ? WHERE id = ?',
        [image, vehicleId]
      );
      console.log('Image: ', result);

      setIsImageSaved(true);
      closeModal();
    } else {
      console.log('Error in adding image!');
      setIsImageSaved(false);
    }
  };

  const changeColorHandler = () => {
    db.runSync(`UPDATE ${tablesNames.vehicles} SET color = ? WHERE id = ?`, [
      colorSelected,
      vehicleId,
    ]);
    closeModal();
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={true}
      onConfirm={saveImage}
    >
      <View style={styles.imageContainer}>
        {!isImageSaved && <Text>Image didn't saved.</Text>}
        {image && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={styles.image}
          />
        )}
      </View>
      <PrimaryButton
        title='Pick an image'
        onPress={pickImage}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <PrimaryDropdown
          style={{ width: '50%' }}
          isLabel={false}
          title='Color'
          data={colorsDropdown}
          isDropdownFocus={isDropdownFocus}
          labelField='value'
          valueField='value'
          value={colorSelected}
          onFocus={() => setIsDropdownFocus(true)}
          onBlur={() => setIsDropdownFocus(false)}
          onChange={(item) => {
            setColorSelected(item.value);
            setIsDropdownFocus(false);
          }}
          maxHeight={170}
          renderItem={(item) => (
            <Text style={[styles.renderStyleColorText, { color: item.value }]}>
              {item.value}
            </Text>
          )}
        />
        <PrimaryButton
          title='Change color'
          onPress={changeColorHandler}
        />
      </View>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    marginVertical: 64,
    marginHorizontal: 16,
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerRoot: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageContainer: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 240,
  },
  renderStyleColorText: {
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold',
    fontSize: 16,
    height: 30,
  },
});
