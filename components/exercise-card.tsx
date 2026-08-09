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
      style={({ pressed }) => ({
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
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
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#1c1c1e" }}>
              {exercise.category}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            top: "-60%",
            bottom: 0,
            left: "80%",
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={isPlaying ? "pause.fill" : "play.fill"}
              tintColor="#1c1c1e"
              size={20}
              fallback={
                <Text style={{ fontSize: 18, color: "#1c1c1e" }}>▶</Text>
              }
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text
          style={{ fontSize: 15, fontWeight: "600", color: "white" }}
          selectable
        >
          {exercise.title}
        </Text>
      </View>
    </Pressable>
  );
}
