import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, Text, View } from "react-native";
import type { Exercise } from "@/lib/videos";
import { useState } from "react";
import { isFavorite, toggleFavorite, useFavorites } from "@/lib/favorites";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const favorites = useFavorites();
  const favorited = isFavorite(favorites, exercise.name);
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
          {/*<View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#faf7f7",
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#141414" }}>
              {exercise.category}
            </Text>
          </View>*/}
        </View>
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#141414",
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
          >
            <SymbolView
              name={isPlaying ? "pause.fill" : "play.fill"}
              tintColor="#faf7f7"
              size={16}
              fallback={
                <Text style={{ fontSize: 14, color: "#faf7f7" }}>▶</Text>
              }
            />
          </View>
          <Pressable
            onPress={() => toggleFavorite(exercise)}
            style={{
              backgroundColor: "#141414",
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
          >
            <SymbolView
              name={favorited ? "heart.fill" : "heart"}
              tintColor="#faf7f7"
              size={16}
              fallback={
                <Text style={{ fontSize: 14, color: "#faf7f7" }}>
                  {favorited ? "♥" : "♡"}
                </Text>
              }
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          padding: 14,
          paddingHorizontal: 8,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#faf7f7",
            width: "80%",
          }}
          selectable
          numberOfLines={1}
        >
          {exercise.title} {exercise.title}
        </Text>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "#faf7f7",
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#141414" }}>
            {exercise.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
