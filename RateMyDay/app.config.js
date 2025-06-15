module.exports = {
  expo: {
    name: "RateMyDay",
    slug: "RateMyDay",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ratemyday",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "dk.winnovate.ratemyday",
      buildNumber: "1.0.0",
      supportsTablet: true,
      icon: "./assets/images/adaptive-icon.png",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "dk.winnovate.ratemyday",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff",
          sounds: ["./assets/notification.wav"],
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: "tromborg",
    extra: {
      EXPO_PUBLIC_POCKETBASE_URL: process.env.EXPO_PUBLIC_POCKETBASE_URL,
      router: {
        origin: false,
      },
      eas: {
        projectId: "3576a9b3-952e-4db9-9843-84d0217683f2",
      },
    },
  },
};
