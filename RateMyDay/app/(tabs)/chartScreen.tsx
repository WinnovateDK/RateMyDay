import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RMDColors } from "@/constants/Colors";

const screenWidth = Dimensions.get("window").width;

export default function ChartScreen() {
  // State for dropdown selection
  const [timeRange, setTimeRange] = useState("weekly");
  
  // Mock data for the chart
  const chartData: any = {
    "weekly": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [4, 6, 5, 7, 8, 9, 10],
    },
    "monthly": {
      labels: ["Wk1", "Wk2", "Wk3", "Wk4"],
      data: [5, 6, 7, 8],
    },
    "yearly": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [5, 6, 7, 8, 6, 5, 7, 8, 9, 6, 5, 7],
    },
  };

  const currentData = useMemo(() => {
    return chartData[timeRange]
  }, [chartData]);

  return (
    <View className="flex-1 bg-teal-900 p-4 self-center gap-8 justify-center">
      <View >
          <Text className="text-center text-4xl font-bold text-teal-50">See your ratings</Text>
      </View>
      
      {/* Chart */}
      <LineChart
        data={{
          labels: currentData.labels,
          datasets: [
            {
              data: currentData.data,
            },
          ],
        }}
        width={screenWidth - 32} // Subtract padding
        height={220}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: RMDColors.rmdDarkest, // Dark background
          backgroundGradientFrom: "#1e293b",
          backgroundGradientTo: "#1e293b",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green line
          labelColor: () => "#e5e7eb", // Light labels
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#22c55e",
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
      />
      <View className="flex">
        <Picker
          selectedValue={timeRange}
          onValueChange={(itemValue) => setTimeRange(itemValue)}
          style={{ width: 140, height: 40, backgroundColor: RMDColors.rmdMid, color: "#EFFEF0", borderRadius: 16}}
        >
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Yearly" value="yearly" />
        </Picker>
      </View>
    </View>
  );
}