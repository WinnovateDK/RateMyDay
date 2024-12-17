import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RMDColors } from "@/constants/Colors";
import { getRatingsforLastMonth } from "@/utills/RatingService";

const screenWidth = Dimensions.get("window").width;

type chartDataType = {
  labels: string[],
  data: number[]
}

export default function ChartScreen() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [data, setData] = useState<number[]>([]);
  const chartData: chartDataType = useMemo(()=> {
    let chartData: chartDataType = {labels: [], data: []};
    let labels = [];

    switch (timeRange) {
        case "weekly":
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          setData([4, 6, 5, 7, 8, 9, 10]);
          chartData.labels = labels;
          chartData.data = data;
          break;
  
        case "monthly":
          labels = ["Wk1", "Wk2", "Wk3", "Wk4"];
          getRatingsforLastMonth().then((ratings) => {
            console.log("rr: ", ratings);
            setData(ratings);
            chartData.data = data;
          })
          chartData.labels = labels;
          
          break;

        case "yearly": 
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          setData([5, 6, 7, 8, 6, 5, 7, 8, 9, 6, 5, 7]);
          chartData.labels = labels;
          chartData.data = data;
          break;
      }; 

      return chartData;
    }, [timeRange]);

  return (
    <View className="flex-1 bg-teal-900 p-4 self-center gap-8 justify-center">
      <View >
          <Text className="text-center text-4xl font-bold text-teal-50">See your ratings</Text>
      </View>
      
      {/* Chart */}
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
              {
                data: chartData.data,
              },
              {
                data:[0],
                withDots: false, 
              },
              {
                data:[10],
                withDots: false,
              }
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