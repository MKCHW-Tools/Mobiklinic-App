import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, DIMENS} from '../constants/styles';


const CopyRight = () => {
  return (
    <View>
      <Text style={styles.copy}>
        © {new Date().getFullYear()} Mobiklinic. All rights reserved.
      </Text>
    </View>
  );
};

export default CopyRight;

const styles = StyleSheet.create({
  copy: {
    color: '#888',
    fontSize: 12,
    marginTop: 40,
    backgroundColor:COLORS.WHITE_LOW
  },
});
