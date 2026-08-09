import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, Text, View } from "react-native";
import type { Exercise } from "@/lib/videos";
import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite, useFavorites } from "@/lib/favorites";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const favorites = useFavorites();
  const favorited = isFavorite(favorites, exercise.name);
  const player = useVideoPlayer(exercise.url, (player) => {
    player.loop = true;
  });

  const heartPopScale = useSharedValue(0);
  const heartPopOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    badgeScale.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 260 }),
      withSpring(1, { damping: 8 }),
    );
  }, [favorited, badgeScale]);

  const heartPopStyle = useAnimatedStyle(() => ({
    opacity: heartPopOpacity.value,
    transform: [{ scale: heartPopScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const handlePlayPause = () => {
    if (!player.playing) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = () => {
    toggleFavorite(exercise);
    heartPopScale.value = 0;
    heartPopOpacity.value = 1;
    heartPopScale.value = withSequence(
      withSpring(1.15, { damping: 9, stiffness: 500 }),
      withSpring(1, { damping: 10 }),
    );
    heartPopOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 500 }, () => {}),
    );
  };

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) handlePlayPause();
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) handleLike();
    });

  const composedGesture = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <GestureDetector gesture={composedGesture}>
      <View
        style={{
          overflow: "hidden",
          backgroundColor: "#141414",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        }}
      >
        <View style={{ height: 220, backgroundColor: "#e9e9eb" }}>
          <VideoView
            player={player}
            style={{ flex: 1 }}
            contentFit="cover"
            nativeControls={false}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
              },
              heartPopStyle,
            ]}
            pointerEvents="none"
          >
            <SymbolView
              name="heart.fill"
              tintColor="#faf7f7"
              size={72}
              fallback={
                <Text style={{ fontSize: 64, color: "#faf7f7" }}>♥</Text>
              }
            />
          </Animated.View>
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
              <Animated.View style={badgeStyle}>
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
              </Animated.View>
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
              width: "75%",
            }}
            selectable
            numberOfLines={1}
          >
            {exercise.title}
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
      </View>
    </GestureDetector>
  );
}
