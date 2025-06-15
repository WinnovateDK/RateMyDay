import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const TermsAndConditionsModal = ({ppModalVisible, setPPModalVisible} : {ppModalVisible: boolean, setPPModalVisible: (visible: boolean) => void}) => {
    return (
        <Modal
                animationType="fade"
                transparent={true}
                visible={ppModalVisible}
                onRequestClose={() => setPPModalVisible(false)}
              >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                  <View className="bg-white rounded-xl p-4 w-full max-h-[80%]">
                    <ScrollView showsVerticalScrollIndicator={true}>
                      <Text className="text-xl font-bold mb-2 text-center">
                        Terms and Conditions
                      </Text>
        
                      <Text className="text-sm text-gray-500 mb-4 text-center">
                        Last updated: June 15, 2025
                      </Text>
        
                      <Text className="text-base text-gray-700 mb-4">
                        Welcome to RateMyDay (the "App"), operated by the Winnovate
                        (unregistered trading name) team ("we," "us," or "our"). These
                        Terms and Conditions ("Terms") govern your access to and use of
                        the App, available on the Google Play Store and Apple App Store.
                        {"\n\n"}By downloading, installing, or using the App, you agree
                        to be bound by these Terms. If you do not agree, you may not
                        use the App.
                        {"\n\n"}1. Definitions{"\n"}
                        App: The mobile application provided by Winnovate that allows
                        users to log daily ratings and notes.
                        {"\n"}User: Any individual who downloads, installs, or uses the
                        App.
                        {"\n"}Services: The functionalities offered by the App,
                        including account creation, daily rating entry, encrypted note
                        storage, and access to historical data.
                        {"\n"}Content: Any text, data, or information users submit
                        through the App (e.g., ratings, notes).
                        {"\n\n"}2. Eligibility{"\n"}
                        You must be at least 16 years old to use the App. If you are
                        between 16 and 18, you must have parental or guardian consent.
                        By agreeing to these Terms, you represent and warrant that you
                        meet these eligibility requirements.
                        {"\n\n"}3. Account Registration{"\n"}
                        Sign-Up: To access the Services, you must register with a valid
                        email address and create a password.
                        {"\n"}Consent: During registration, you must consent to our
                        Privacy Policy and agree to the processing of your personal data
                        (email, daily ratings, notes).
                        {"\n"}Security: You are responsible for keeping your account
                        credentials confidential. Notify us immediately of any
                        unauthorized use.
                        {"\n\n"}4. Services and Use Restrictions{"\n"}
                        Permitted Use: You may use the App to track and reflect on your
                        daily experiences by logging ratings and notes.
                        {"\n"}Prohibited Conduct: You agree not to:
                        {"\n"}- Violate any law or infringe others’ rights.
                        {"\n"}- Submit offensive, abusive, or illegal Content.
                        {"\n"}- Reverse engineer, decompile, or manipulate the App.
                        {"\n"}- Interfere with the security or integrity of the App.
                        {"\n\n"}5. User Content{"\n"}
                        Ownership: You retain all rights in the Content you submit.
                        {"\n"}License: You grant Winnovate a non-exclusive, worldwide
                        license to store, display, and process your Content to provide
                        the Services.
                        {"\n"}Monitoring: We reserve the right to remove any Content
                        that violates these Terms.
                        {"\n\n"}6. Intellectual Property{"\n"}
                        All intellectual property rights in the App, including code,
                        design, trademarks, and logos, are owned by or licensed to
                        Winnovate. You may not copy, modify, or distribute any part of
                        the App without our prior written consent.
                        {"\n\n"}7. Disclaimer of Warranties{"\n"}
                        The App is provided "as is" and "as available." We disclaim all
                        warranties, whether express or implied, including merchantability,
                        fitness for a particular purpose, and non-infringement. We do not
                        guarantee the accuracy, reliability, or availability of the App.
                        {"\n\n"}8. Limitation of Liability{"\n"}
                        To the fullest extent permitted by law, Winnovate and its
                        affiliates, officers, or employees will not be liable for any
                        indirect, incidental, special, consequential, or punitive damages
                        arising from your use of the App, even if advised of the
                        possibility of such damages.
                        {"\n\n"}9. Indemnification{"\n"}
                        You agree to indemnify and hold harmless the members of the
                        Winnovate team and its affiliates from any claim or demand,
                        including reasonable attorneys’ fees, arising out of your use of
                        the App or violation of these Terms.
                        {"\n\n"}10. Modifications to the Terms{"\n"}
                        We may modify these Terms at any time by posting the updated
                        Terms in the App or on our website. The "Last updated" date will
                        reflect the change. Continued use of the App after modifications
                        constitutes acceptance of the new Terms.
                        {"\n\n"}11. Termination{"\n"}
                        We may suspend or terminate your access to the App at our
                        discretion, with or without notice, for conduct that we believe
                        violates these Terms or is harmful to other users.
                        {"\n\n"}12. Governing Law{"\n"}
                        These Terms are governed by and construed in accordance with the
                        laws of Denmark. Any disputes will be subject to the exclusive
                        jurisdiction of the Danish courts.
                        {"\n\n"}13. Contact Us{"\n"}
                        If you have any questions or concerns about these Terms, please
                        contact us at:
                        {"\n"}Winnovate
                        {"\n"}Email: winnovatedk@gmail.com
                      </Text>
                    </ScrollView>
                    <TouchableOpacity
                      className="bg-blue-500 rounded-md py-2 px-4 items-center"
                      onPress={() => setPPModalVisible(false)}
                    >
                      <Text className="text-white text-base font-semibold">Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
    )
}

export default TermsAndConditionsModal;