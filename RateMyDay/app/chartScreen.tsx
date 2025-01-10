import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { RMDColors } from "@/constants/Colors";

import {
  getAverageRatingsPerMonth,
  getRatingsforLastMonth,
  getRatingsForLastWeek,
  getRatingsForLastYear,
  interpolateRating,
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

export default function ChartScreen() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [chartData, setChartData] = useState<chartDataType>({
    labels: ["Your", "Data", "Will", "Appear", "Here", "When", "You", "Log"],
    data: [4, 6, 5, 7, 8, 9, 10],
  } as chartDataType);

  useEffect(() => {
    switch (timeRange) {
      case "weekly":
        let days = getDatesInCurrentWeek();
        let labels: string[] = [];
        getRatingsForLastWeek().then((ratings) => {
          const labels: string[] = [];
          const data: number[] = [];

          ratings.map((rating) => {
            labels.push(rating.Label.split("-")[2]);
            data.push(rating.Rating);
          });
          setChartData({
            data: data,
            labels: labels,
          });
        });
        break;

      case "monthly":
        getRatingsforLastMonth().then((ratings) => {
          if (ratings.length === 0) {
            return;
          }
          const daysInMonth = getDatesInCurrentMonth();
          const amountOfDays = daysInMonth.length;
          const weeksInMonth = getWeekNumbersForCurrentMonth();
          console.log("weeksinmonth: ", weeksInMonth);
          const weeksInMonth2 = Math.ceil(amountOfDays / 7);
          const labelsArray = Array.from(
            { length: weeksInMonth.length },
            (_, i) => `Week ${weeksInMonth[i]}`
          );
          console.log("ratingslength", ratings);
          const data = Array(ratings.length).fill(null);
          for (let i = 0; i < ratings.length; i++) {
            if (ratings[i].Rating === null) {
              continue;
            }
            data[i] = ratings[i].Rating;
          }
          setChartData({ labels: labelsArray, data: data });
          console.log("chartdata: ", chartData);
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
        getAverageRatingsPerMonth().then((ratings) => {
          if (ratings.length === 0) {
            return;
          }
          const daysInYear = getDatesInCurrentYear();
          const amountOfDays = daysInYear.length;

          const labelsArray = Array.from(
            { length: labels.length },
            (_, i) => `${labels[i]}`
          );
          const data = Array(12).fill(null);
          for (let i = 0; i < ratings.length; i++) {
            data[i] = ratings[i];
          }
          setChartData({ labels: labelsArray, data: data });
          console.log("chartdata: ", chartData);
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
              data: [0],
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
