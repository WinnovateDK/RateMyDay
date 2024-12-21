import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { RMDColors } from "@/constants/Colors";

import {
  getRatingsforLastMonth,
  getRatingsForLastWeek,
  getRatingsForLastYear,
} from "@/utills/RatingService";
import {
  getDatesInCurrentMonth,
  getDatesInCurrentWeek,
  getDatesInCurrentYear,
  getWeekNumbersForCurrentMonth,
} from "@/utills/CalendarUtills";

const screenWidth = Dimensions.get("window").width;

type chartDataType = {
  labels: string[];
  data: number[];
};

function interpolateNullValues(data: number[]): number[] {
  const interpolatedData = [...data]; // Copy data array

  for (let i = 0; i < interpolatedData.length; i++) {
    if (interpolatedData[i] === null) {
      // Find the closest previous and next non-null values
      let prevIndex = i - 1;
      let nextIndex = i + 1;

      while (prevIndex >= 0 && interpolatedData[prevIndex] === null) {
        prevIndex--;
      }

      while (
        nextIndex < interpolatedData.length &&
        interpolatedData[nextIndex] === null
      ) {
        nextIndex++;
      }

      // Interpolate value if valid neighbors exist
      if (prevIndex >= 0 && nextIndex < interpolatedData.length) {
        const prevValue = interpolatedData[prevIndex];
        const nextValue = interpolatedData[nextIndex];
        interpolatedData[i] =
          prevValue +
          ((nextValue - prevValue) * (i - prevIndex)) / (nextIndex - prevIndex);
      } else if (prevIndex >= 0) {
        // If only previous value exists
        interpolatedData[i] = interpolatedData[prevIndex];
      } else if (nextIndex < interpolatedData.length) {
        // If only next value exists
        interpolatedData[i] = interpolatedData[nextIndex];
      }
    }
  }

  return interpolatedData;
}

export default function ChartScreen() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [chartData, setChartData] = useState<chartDataType>({
    labels: [],
    data: [4, 6, 5, 7, 8, 9, 10],
  } as chartDataType);

  useEffect(() => {
    switch (timeRange) {
      case "weekly":
        let days = getDatesInCurrentWeek();
        let labels: string[] = [];
        for (let i = 0; i < days.length; i++) {
          let temp = days[i].split("-")[2];
          labels.push(temp);
        }
        getRatingsForLastWeek().then((ratings) => {
          setChartData({ labels: labels, data: ratings });
        });
        break;

      case "monthly":
        getRatingsforLastMonth().then((ratings) => {
          const daysInMonth = getDatesInCurrentMonth();
          const amountOfDays = daysInMonth.length;
          const weeksInMonth = getWeekNumbersForCurrentMonth();
          const weeksInMonth2 = Math.ceil(amountOfDays / 7);
          const labelsArray = Array.from(
            { length: weeksInMonth.length },
            (_, i) => `Week ${weeksInMonth[i]}`
          );
          const data = Array(ratings.length).fill(null);
          for (let i = 0; i < ratings.length; i++) {
            if (ratings[i].rating === null) {
              continue;
            }
            data[i] = ratings[i].rating;
          }
          setChartData({ labels: labelsArray, data: data });
        });
        break;

      case "yearly":
        labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        getRatingsForLastYear().then((ratings) => {
          const daysInYear = getDatesInCurrentYear();
          const amountOfDays = daysInYear.length;

          const labelsArray = Array.from(
            { length: labels.length },
            (_, i) => `${labels[i]}`
          );
          const data = Array(amountOfDays).fill(null);
          for (let i = 0; i < ratings.length; i++) {
            if (ratings[i].rating === null) {
              continue;
            }
            data[i] = ratings[i].rating;
          }
          setChartData({ labels: labelsArray, data: data });
        });
        break;
    }
  }, [timeRange]);

  return (
    <View className="flex-1 bg-emerald-200 p-4 self-center gap-8 justify-center">
      <View>
        <Text className="text-center text-4xl font-bold text-teal-900">
          See your ratings
        </Text>
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
              data: [0],
              withDots: false,
            },
            {
              data: [10],
              withDots: false,
            },
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
          style={{
            width: 140,
            height: 40,
            backgroundColor: RMDColors.rmdMid,
            color: "#EFFEF0",
            borderRadius: 16,
          }}
        >
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Yearly" value="yearly" />
        </Picker>
      </View>
    </View>
  );
}
