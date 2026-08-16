import { Button, Input, Label, Tabs, TextField, useToast } from "heroui-native";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import {
  DIFFICULTIES,
  TRAINING_GOALS,
  getAllExercises,
  humanize,
  type Difficulty,
  type TrainingGoal,
} from "@/lib/exercises";
import { buildMockWeekWorkouts } from "@/lib/mock-workouts";
import { setProfile, useProfile } from "@/lib/profile";
import { getCurrentWeekDays, toDateKey } from "@/lib/week";
import { setWorkout } from "@/lib/workouts";

export default function Profile() {
  const { toast } = useToast();
  const profile = useProfile();
  const [name, setName] = useState(profile.name ?? "");
  const [weightKg, setWeightKg] = useState(profile.weightKg?.toString() ?? "");
  const [heightCm, setHeightCm] = useState(profile.heightCm?.toString() ?? "");
  const [primaryGoal, setPrimaryGoal] = useState<TrainingGoal>(
    profile.primaryGoal ?? TRAINING_GOALS[0],
  );
  const [experienceLevel, setExperienceLevel] = useState<Difficulty>(
    profile.experienceLevel ?? DIFFICULTIES[0],
  );

  const handleSave = () => {
    setProfile({
      name: name.trim() || undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      primaryGoal,
      experienceLevel,
    });
    toast.show({ variant: "success", label: "Profile saved" });
  };

  const handleSeedPlan = () => {
    Alert.alert(
      "Seed prebuilt plan?",
      "This replaces this week's workouts with the built-in push/pull/legs plan.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Seed",
          onPress: () => {
            const weekDays = getCurrentWeekDays();
            const mockWorkouts = buildMockWeekWorkouts(
              getAllExercises(),
              weekDays,
            );
            weekDays.forEach((weekDay) => {
              const dateKey = toDateKey(weekDay.date);
              setWorkout(dateKey, mockWorkouts[dateKey] ?? []);
            });
            toast.show({
              variant: "success",
              label: "Prebuilt plan seeded",
              description: "This week's workouts have been updated.",
            });
          },
        },
      ],
    );
  };

  const handleClearPlan = () => {
    Alert.alert(
      "Clear this week's plan?",
      "This removes every workout planned for this week. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            getCurrentWeekDays().forEach((weekDay) => {
              setWorkout(toDateKey(weekDay.date), []);
            });
            toast.show({
              variant: "default",
              label: "Plan cleared",
              description: "This week's workouts were removed.",
            });
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 20 }}
      >
        <Text className="text-2xl font-bold uppercase tracking-wide text-foreground">
          Profile
        </Text>

        <TextField>
          <Label>Name</Label>
          <Input value={name} onChangeText={setName} placeholder="Your name" />
        </TextField>

        <TextField>
          <Label>Weight (kg)</Label>
          <Input
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
            placeholder="e.g. 75"
          />
        </TextField>

        <TextField>
          <Label>Height (cm)</Label>
          <Input
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="decimal-pad"
            placeholder="e.g. 178"
          />
        </TextField>

        <View className="gap-2">
          <Text className="font-semibold text-foreground">Primary Goal</Text>
          <Tabs
            value={primaryGoal}
            onValueChange={(value) => setPrimaryGoal(value as TrainingGoal)}
          >
            <Tabs.List>
              <Tabs.ScrollView>
                <Tabs.Indicator />
                {TRAINING_GOALS.map((goal) => (
                  <Tabs.Trigger key={goal} value={goal}>
                    <Tabs.Label>{humanize(goal)}</Tabs.Label>
                  </Tabs.Trigger>
                ))}
              </Tabs.ScrollView>
            </Tabs.List>
          </Tabs>
        </View>

        <View className="gap-2">
          <Text className="font-semibold text-foreground">
            Experience Level
          </Text>
          <Tabs
            value={experienceLevel}
            onValueChange={(value) => setExperienceLevel(value as Difficulty)}
          >
            <Tabs.List>
              <Tabs.ScrollView>
                <Tabs.Indicator />
                {DIFFICULTIES.map((level) => (
                  <Tabs.Trigger key={level} value={level}>
                    <Tabs.Label>{humanize(level)}</Tabs.Label>
                  </Tabs.Trigger>
                ))}
              </Tabs.ScrollView>
            </Tabs.List>
          </Tabs>
        </View>

        <Button onPress={handleSave}>Save</Button>

        <View className="gap-2">
          <Text className="font-semibold text-foreground">
            This Week&apos;s Plan
          </Text>
          <View className="flex flex-row gap-2 justify-between items-center">
            <Button variant="secondary" onPress={handleSeedPlan}>
              Prebuilt Plan
            </Button>
            <Button variant="danger-soft" onPress={handleClearPlan}>
              Clear Plan
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
