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
  type PointsArray,
} from "victory-native";
import { Path } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import AntDesign from "@expo/vector-icons/AntDesign";

interface TimeSeriesData extends Record<string, unknown> {
  Label: string;
  Rating: number;
}

const chartScreen2 = () => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const currentDate = new Date();
  const [timerange, setTimerange] = useState("Weekly");
  //const font = useFont(inter, 12);

  const CustomLine = ({ points }: { points: PointsArray }) => {
    const { path } = useLinePath(points, { curveType: "cardinal" });
    return <Path path={path} style="stroke" strokeWidth={3} color="#a7f3d0" />;
  };

  const handleLeftArrowPress = () => {
    setTimerange((prev) =>
      prev === "Yearly" ? "Monthly" : prev === "Monthly" ? "Weekly" : "Yearly"
    );
  };

  const handleRightArrowPress = () => {
    setTimerange((prev) =>
      prev === "Weekly" ? "Monthly" : prev === "Monthly" ? "Yearly" : "Weekly"
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
          const filteredData = ratings.filter(
            (item) => item.Label !== undefined && item.Rating !== undefined
          );
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
    <View className="flex-1 justify-center bg-emerald-200">
      <View className="justify-center items-center p-4">
        <View className="w-full h-80 bg-white rounded-lg shadow p-4">
          <View className="flex-row w-full justify-between pb-2">
            <TouchableOpacity onPress={handleLeftArrowPress}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="align-middle">{timerange}</Text>
            <TouchableOpacity onPress={handleRightArrowPress}>
              <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {data.length > 0 ? (
            <CartesianChart
              data={data}
              xKey="Label"
              yKeys={["Rating"]}
              axisOptions={{
                //font,
                formatXLabel: (value) => (value !== undefined ? value : ""),
              }}
              domain={{ y: [0, 10] }}
              padding={10}
              viewport={{ y: [-1, 10] }}
            >
              {({ points }) => (
                <>
                  <CustomLine points={points.Rating} />
                  <Scatter
                    points={points.Rating}
                    shape="circle"
                    color="#a7f3d0"
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

export default chartScreen2;
