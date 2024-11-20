import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import { getItem, setItem } from '@/utills/AsyncStorage';

const AddRatingComponent: React.FC = () => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const setScore = async (score: Number) => {
    const dateObject = new Date();
    const dateMonthYear = `${dateObject.getUTCDate()}${(dateObject.getUTCMonth()) + 1}${dateObject.getUTCFullYear()}`;
    await setItem(`rating${dateMonthYear}`, selectedScore);

  }

  const handleSubmit = () => {
    if (selectedScore === null) {
      Alert.alert('Error', 'Please select a value before submitting.');
    } else {
      setScore(selectedScore);
      Alert.alert('Success', `You submitted: ${selectedScore}`);
    }
  };

  const renderScale = () => {
    return Array.from({ length: 11 }, (_, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.circle,
          selectedScore === index ? styles.selectedCircle : null,
        ]}
        onPress={() => setSelectedScore(index)}
      >
        <Text style={styles.circleText}>{index}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How has your day been?</Text>
      <View style={styles.scaleContainer}>{renderScale()}</View>
      <Button title="Add" onPress={handleSubmit} />
      <Text>{selectedScore}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    maxWidth: '100%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedCircle: {
    backgroundColor: '#007bff',
  },
  circleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddRatingComponent;