import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  Accordion,
  AccordionLayoutTransition,
  Button,
  Chip,
  useThemeColor,
} from "heroui-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { WorkoutChecklist } from "@/components/workout-checklist";
import { getAllExercises } from "@/lib/exercises";
import { buildMockWeekWorkouts } from "@/lib/mock-workouts";
import { formatWeekDayDate, getCurrentWeekDays, toDateKey } from "@/lib/week";
import { getWorkout, setWorkout, useWorkouts } from "@/lib/workouts";

export default function Week() {
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayDay =
    weekDays.find((weekDay) => weekDay.isToday)?.day ?? weekDays[0].day;

  const [expandedDay, setExpandedDay] = useState<string | undefined>(todayDay);

  const workouts = useWorkouts();
  const catalog = useMemo(() => getAllExercises(), []);
  const accentForeground = useThemeColor("accent-foreground");

  const hasSeededMockData = useRef(false);
  useEffect(() => {
    if (hasSeededMockData.current || catalog.length === 0) return;
    hasSeededMockData.current = true;

    const mockWorkouts = buildMockWeekWorkouts(catalog, weekDays);
    weekDays.forEach((weekDay) => {
      const dateKey = toDateKey(weekDay.date);
      if (getWorkout(workouts, dateKey).length === 0) {
        setWorkout(dateKey, mockWorkouts[dateKey]);
      }
    });
  }, [catalog, weekDays, workouts]);

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        layout={AccordionLayoutTransition}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Accordion
          selectionMode="single"
          value={expandedDay}
          onValueChange={setExpandedDay}
          classNames={{
            container: "bg-surface",
            separator: "bg-separator",
          }}
        >
          {weekDays.map((weekDay) => {
            const dateKey = toDateKey(weekDay.date);
            const exercises = getWorkout(workouts, dateKey);
            const hasWorkout = exercises.length > 0;

            return (
              <Accordion.Item key={weekDay.day} value={weekDay.day}>
                <Accordion.Trigger className="px-5 py-6">
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-5xl font-extrabold uppercase tracking-wide text-surface-foreground">
                        {weekDay.day}
                      </Text>
                      {weekDay.isToday ? (
                        <Chip size="sm" variant="soft" color="accent">
                          Today
                        </Chip>
                      ) : null}
                    </View>
                    {weekDay.isToday && (
                      <Text className="text-sm text-muted">
                        {formatWeekDayDate(weekDay.date)}
                      </Text>
                    )}
                  </View>
                </Accordion.Trigger>
                <Accordion.Content className="gap-3 pb-5">
                  {hasWorkout ? (
                    <WorkoutChecklist dateKey={dateKey} exercises={exercises} />
                  ) : null}
                  <Button
                    size="sm"
                    onPress={() =>
                      router.push({
                        pathname: "/picker",
                        params: { date: dateKey },
                      })
                    }
                  >
                    <SymbolView
                      name={hasWorkout ? "pencil" : "plus"}
                      tintColor={accentForeground}
                      size={14}
                      fallback={
                        <Text style={{ color: accentForeground }}>
                          {hasWorkout ? "✎" : "+"}
                        </Text>
                      }
                    />
                    <Button.Label>
                      {hasWorkout ? "Update Workout" : "Create Workout"}
                    </Button.Label>
                  </Button>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Animated.ScrollView>
    </View>
  );
}
