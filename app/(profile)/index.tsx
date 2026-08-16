import { Button, Input, Label, Tabs, TextField } from "heroui-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import {
  DIFFICULTIES,
  TRAINING_GOALS,
  humanize,
  type Difficulty,
  type TrainingGoal,
} from "@/lib/exercises";
import { setProfile, useProfile } from "@/lib/profile";

export default function Profile() {
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
      </ScrollView>
    </View>
  );
}
