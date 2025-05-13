import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  calculateWeeklyAverages,
  getAverageRatingsPerMonth,
  getRatingsforLastMonth,
  getRatingsForLastWeek,
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
import Toast from "react-native-toast-message";
import useAuthStore from "@/stores/AuthStateStore";
import { useRatingStorePb } from "@/stores/RatingStorePb";
import useStore from "@/stores/isRatingSetStore";

interface TimeSeriesData extends Record<string, unknown> {
  Label: string;
  Rating: number;
}

const GraphComponent = ({ timerange }: { timerange: string }) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const currentDate = new Date();
  const font = useFont(inter, 12);
  const { session } = useAuthStore();
  const { isRatingUpdated } = useStore();
  const { graphWeeklyRatings, graphMonthlyRatings, graphYearlyRatings } =
    useRatingStorePb();
  const CustomLine = ({ points }: { points: PointsArray }) => {
    const { path } = useLinePath(points, { curveType: "cardinal" });
    const animPath = useAnimatedPath(path);

    return (
      <Path path={animPath} style="stroke" strokeWidth={3} color="#bae6fd" />
    );
  };
  const showToast = (text: string) => {
    Toast.show({
      type: "error",
      text1: text,
      position: "bottom",
    });
  };

  useEffect(() => {
    if (session) {
      switch (timerange) {
        case "Monthly":
          if (graphMonthlyRatings.length === 0) {
            showToast("There is no ratings for the current month.");
            return;
          }
          const formattedData = graphMonthlyRatings.map((item) => {
            const [day, month] = item.Label.split("-");
            const currentYear = new Date().getFullYear();
            const formattedDateString = `${currentYear}-${month}-${day}`;
            const formattedDate = new Date(formattedDateString);
            return {
              ...item,
              Label: formattedDate,
            };
          });

          const weeklyAveragesData = calculateWeeklyAverages(
            formattedData,
            currentDate.getFullYear()
          );
          setData(weeklyAveragesData);

          break;
        case "Weekly":
          if (graphWeeklyRatings.length === 0) {
            showToast("There is no ratings for the current week.");
            return;
          }
          setData(graphWeeklyRatings);

          break;
        case "Yearly":
          if (graphYearlyRatings.length === 0) {
            showToast("There is no ratings for the current year.");
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

          const formattedYearlyData = graphYearlyRatings
            .map((rating, index) => ({
              Label: months[index],
              Rating: rating,
            }))
            .filter((datapoint) => datapoint.Rating !== 0);

          setData(formattedYearlyData);

          break;
      }
    }
  }, [timerange, session, graphWeeklyRatings, graphMonthlyRatings, graphYearlyRatings]);

  return (
    <View className="h-full w-full">
      <View className="p-6 pr-9 items-center">
        <View className="w-full h-full">
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
            <View className="w-full justify-center">
              <ActivityIndicator size={60} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default GraphComponent;
