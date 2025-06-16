import { Linking } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const AboutModal = ({
  aboutModalVisible,
  setAboutModalVisible,
}: {
  aboutModalVisible: boolean;
  setAboutModalVisible: (visible: boolean) => void;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={aboutModalVisible}
      onRequestClose={() => setAboutModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-xl p-4 w-full max-h-[80%]">
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text className="text-xl font-bold mb-2 text-center">
              About Rate My Day
            </Text>

            <Text className="text-base text-gray-700 mb-4">
              Rate My Day is a simple app designed to help you track your daily mood and reflections. Our mission is to empower users to better understand their emotional well-being through easy journaling and self-reflection.
              {"\n\n"}Key Features:
              {"\n"}● Daily mood ratings (1–10 scale)
              {"\n"}● Personal notes (encrypted for privacy)
              {"\n"}● Visual statistics and streak tracking
              {"\n"}● Data export for personal use
              {"\n\n"}The app is developed and maintained by the Winnovate team, based in Aarhus, Denmark. We are committed to protecting your privacy and providing a distraction-free experience.
              {"\n\n"}Contact:
              {"\n"}Winnovate
              {"\n"}Email: winnovatedk@gmail.com
              
              
              {"\n\n"}Thank you for using Rate My Day!
            </Text>
            <Text className="text-base text-gray-700 mb-4">
                {"\n\n"}Acknowledgements:
                <TouchableOpacity onPress={() => Linking.openURL("https://www.flaticon.com/free-icons/cloud")}>
                  <Text style={{ color: "#2563eb", textDecorationLine: "underline" }}>
                    Some of the Cloud icons created by Freepik - Flaticon
                  </Text>
                </TouchableOpacity>
            </Text>
          </ScrollView>
          <TouchableOpacity
            className="bg-blue-500 rounded-md py-2 px-4 items-center"
            onPress={() => setAboutModalVisible(false)}
          >
            <Text className="text-white text-base font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AboutModal;