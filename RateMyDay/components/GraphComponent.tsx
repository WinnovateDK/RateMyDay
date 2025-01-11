import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  getRatingsforLastMonth,
  calculateWeeklyAverages,
  getRatingsForLastWeek,
  getAverageRatingsPerMonth,
} from "@/utills/RatingService";
import {
  CartesianChart,
  Scatter,
  useLinePath,
  useAnimatedPath,
  type PointsArray,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import inter from "../assets/fonts/Inter_24pt-Medium.ttf";
import AntDesign from "@expo/vector-icons/AntDesign";

interface TimeSeriesData extends Record<string, unknown> {
  Label: string;
  Rating: number;
}

const GraphComponent = ({ timerange }: { timerange: string }) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const currentDate = new Date();
  const font = useFont(inter, 12);

  const CustomLine = ({ points }: { points: PointsArray }) => {
    const { path } = useLinePath(points, { curveType: "cardinal" });
    const animPath = useAnimatedPath(path);

    return (
      <Path path={animPath} style="stroke" strokeWidth={3} color="#bae6fd" />
    );
  };

  useEffect(() => {
    switch (timerange) {
      case "Monthly":
        getRatingsforLastMonth().then((ratings) => {
          if (ratings.length === 0) {
            console.log("no ratings for this month");
            return;
          }
          const formattedData = ratings.map((item) => ({
            ...item,
            Label: new Date(item.Label),
          }));
          const weeklyAveragesData = calculateWeeklyAverages(
            formattedData,
            currentDate.getFullYear()
          );
          setData(weeklyAveragesData);
        });
        break;
      case "Weekly":
        getRatingsForLastWeek().then((ratings) => {
          if (ratings.length === 0) {
            console.log("no ratings for this week");
            return;
          }
          setData(ratings);
        });
        break;
      case "Yearly":
        getAverageRatingsPerMonth().then((ratings) => {
          if (ratings.length === 0) {
            console.log("no ratings for this week");
            return;
          }
          const months = [
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

          const formattedYearlyData = ratings.map((rating, index) => ({
            Label: months[index],
            Rating: rating,
          }));

          setData(formattedYearlyData);
        });
        break;
    }
  }, [timerange]);
  return (
    <View className="w-full">
      <View className="p-6 pr-9 justify-center items-center">
        <View className="w-full h-full bg-white rounded-lg">
          {data.length > 0 ? (
            <CartesianChart
              data={data}
              xKey="Label"
              yKeys={["Rating"]}
              axisOptions={{
                font,
                formatXLabel: (value) => (value !== undefined ? value : ""),
              }}
              domain={{ y: [0, 10] }}
              padding={2}
              viewport={{ y: [-1, 10] }}
            >
              {({ points }) => (
                <>
                  <CustomLine points={points.Rating} />
                  <Scatter
                    points={points.Rating}
                    shape="circle"
                    color="#bae6fd"
                    radius={5}
                  />
                </>
              )}
            </CartesianChart>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default GraphComponent;
