import React, { useState } from 'react';
import { View, Text } from 'react-native';
const styles = require('../css/style');

export default function SimpleImagePicker() {
  const [imageSource, setImageSource] = useState(null);
  return (
    <View
      style={[
        styles.centerItem,
        { backgroundColor: styles.darkBackground }
      ]}
    >
      <Text style={[styles.headingText5, { color: styles.ctaColor }]}>
        Simple Image Picker
      </Text>
    </View>
  );
}
