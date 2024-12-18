import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RMDColors } from "@/constants/Colors";
import { getAmountOfDaysInCurrentMonth, getRatingsforLastMonth, getRatingsForLastWeek, getRatingsForLastYear } from "@/utills/RatingService";
import { getDatesInCurrentWeek } from "@/utills/CalendarUtills";

const screenWidth = Dimensions.get("window").width;

type chartDataType = {
  labels: string[],
  data: number[]
}

export default function ChartScreen() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [chartData, setChartData] = useState<chartDataType>({labels: [], data: [4, 6, 5, 7, 8, 9, 10]} as chartDataType);
  
  useEffect(()=> {
    switch (timeRange) {
        case "weekly":
          let days = getDatesInCurrentWeek();
          let labels: string[] = [];
          for(let i=0; i < days.length; i++){
            let temp = days[i].split("-")[2];
            labels.push(temp);
          }
          getRatingsForLastWeek().then((ratings) => {
            setChartData({labels: labels, data: ratings});
          });
          break;
  
        case "monthly":
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          getRatingsforLastMonth().then((ratings) => {
            const daysInMonth = getAmountOfDaysInCurrentMonth();
            const weeksInMonth = Math.ceil(daysInMonth / 7);
            const labels = Array.from({ length: weeksInMonth }, (_, i) => `Week ${i + 1}`);
            const data = Array(daysInMonth).fill(null);
            for (let i = 0; i < ratings.length; i++) {
              data[i] = ratings[i];
            }
            setChartData({labels: labels, data: data});
          });
          break;

        case "yearly": 
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          getRatingsForLastYear().then((ratings) => {
            setChartData({labels: labels, data: ratings});
          });
          break;
      }; 
    }, [timeRange]);

  return (
    <View className="flex-1 bg-emerald-200 p-4 self-center gap-8 justify-center">
      <View >
          <Text className="text-center text-4xl font-bold text-teal-900">See your ratings</Text>
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
          backgroundColor: RMDColors.rmdDark, // Dark background
          backgroundGradientFrom: RMDColors.rmdDark,
          backgroundGradientTo: RMDColors.rmdMidDark,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green line
          labelColor: () => "#e5e7eb", // Light labels
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "1",
            strokeWidth: "1",
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