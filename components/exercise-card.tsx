import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { Accordion, Button, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { ExerciseDetails } from "@/components/exercise-details";
import { humanize, type Exercise } from "@/lib/exercises";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iconColor = useThemeColor("accent-soft-foreground");
  const backgroundColor = useThemeColor("background");
  const player = useVideoPlayer(exercise.video?.url ?? null, (player) => {
    player.loop = true;
    // These are silent demo clips — don't steal the audio session from
    // whatever the user is already listening to.
    player.muted = true;
    player.audioMixingMode = "mixWithOthers";
  });

  const handlePlayPause = () => {
    if (player.status !== "readyToPlay") return;

    if (!player.playing) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) handlePlayPause();
    });

  const composedGesture = Gesture.Exclusive(singleTap);

  return (
    <View
      className="overflow-hidden rounded-3xl bg-surface"
      style={{ boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)" }}
    >
      <GestureDetector gesture={composedGesture}>
        <View className="h-55 bg-surface-secondary">
          <VideoView
            player={player}
            style={{ flex: 1 }}
            contentFit="cover"
            nativeControls={false}
            pointerEvents="none"
          />
          <View className="absolute right-3 top-3 flex-row items-center gap-2">
            <Button isIconOnly size="sm" variant="secondary">
              <SymbolView
                name={isPlaying ? "pause.fill" : "play.fill"}
                tintColor={iconColor}
                size={16}
                fallback={<Text style={{ fontSize: 14 }}>▶</Text>}
              />
            </Button>
          </View>
        </View>
      </GestureDetector>
      <Accordion>
        <Accordion.Item value="details">
          <Accordion.Trigger className="bg-foreground px-4 py-4">
            <Text
              className="flex-1 text-[15px] font-bold text-background"
              numberOfLines={1}
              selectable
            >
              {exercise.name}
            </Text>
            <View className="bg-background px-2 py-1">
              <Text className="text-xs font-bold text-foreground">
                {humanize(exercise.category)}
              </Text>
            </View>
            <Accordion.Indicator iconProps={{ color: backgroundColor }} />
          </Accordion.Trigger>
          <Accordion.Content>
            <ExerciseDetails exercise={exercise} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </View>
  );
}
