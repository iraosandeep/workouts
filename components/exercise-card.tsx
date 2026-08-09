import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, Text, View } from "react-native";
import type { Exercise } from "@/lib/videos";
import { useState } from "react";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(exercise.url, (player) => {
    player.loop = true;
  });

  const handlePlayPause = () => {
    if (!player.playing) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Pressable
      onPress={handlePlayPause}
      style={() => ({
        overflow: "hidden",
        backgroundColor: "#141414",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        // borderRadius: 12,
      })}
    >
      <View style={{ height: 220, backgroundColor: "#e9e9eb" }}>
        <VideoView
          player={player}
          style={{ flex: 1 }}
          contentFit="cover"
          nativeControls={false}
          pointerEvents="none"
        />
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#141414",
              // borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#faf7f7" }}>
              {exercise.category}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            top: "-70%",
            bottom: 0,
            left: "85%",
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={isPlaying ? "pause.fill" : "play.fill"}
              tintColor="#141414"
              size={20}
              fallback={
                <Text style={{ fontSize: 18, color: "#055bf0" }}>▶</Text>
              }
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: "#faf7f7" }}
          selectable
        >
          {exercise.title}
        </Text>
      </View>
    </Pressable>
  );
}
