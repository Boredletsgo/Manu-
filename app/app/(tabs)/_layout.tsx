import { Tabs } from "expo-router";
import { View } from "react-native";

import { Icon, type IconName } from "../../components/icons";
import { LogoMark } from "../../components/Logo";
import { theme } from "../../lib/theme";
import { useTheme } from "../../lib/ThemeContext";

export default function TabsLayout() {
  const { colors } = useTheme();
  const tabIcon =
    (name: IconName) =>
    ({ color }: { color: string }) =>
      <Icon name={name} color={color} size={24} />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerTint,
        headerTitleStyle: { fontFamily: theme.fonts.heading, fontWeight: "700" },
        headerTitleAlign: "left",
        headerLeft: () => (
          <View style={{ marginLeft: theme.spacing(2), justifyContent: "center" }}>
            <LogoMark height={26} theme={colors.logo} />
          </View>
        ),
        sceneContainerStyle: { backgroundColor: colors.bg },
        tabBarStyle: { backgroundColor: colors.tabBg, borderTopColor: colors.tabBorder },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontFamily: theme.fonts.bodyMedium, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Manuō",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: tabIcon("home"),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: tabIcon("book"),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Tutor",
          tabBarIcon: tabIcon("robot"),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: tabIcon("bulb"),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: tabIcon("chart"),
        }}
      />
    </Tabs>
  );
}
