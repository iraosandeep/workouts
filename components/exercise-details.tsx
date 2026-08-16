import { Chip, Typography } from "heroui-native";
import { View } from "react-native";

import { humanize, type Exercise } from "@/lib/exercises";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Typography type="body-sm" weight="semibold">
        {title}
      </Typography>
      {children}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View className="gap-1">
      {items.map((item, index) => (
        <Typography key={index} color="muted" type="body-sm">
          {"• "}
          {item}
        </Typography>
      ))}
    </View>
  );
}

export function ExerciseDetails({ exercise }: { exercise: Exercise }) {
  return (
    <View className="gap-4 bg-surface-secondary p-4">
      <View className="flex-row flex-wrap gap-2">
        <Chip size="sm" variant="soft" color="accent">
          {humanize(exercise.difficulty)}
        </Chip>
        <Chip size="sm" variant="soft" color="default">
          {humanize(exercise.type)}
        </Chip>
        {exercise.equipment.map((equipment) => (
          <Chip key={equipment} size="sm" variant="soft" color="default">
            {humanize(equipment)}
          </Chip>
        ))}
      </View>

      <Section title="Primary muscles">
        <Typography color="muted" type="body-sm">
          {exercise.primary_muscles.map(humanize).join(", ")}
        </Typography>
      </Section>

      {exercise.sets && exercise.rep_range && exercise.rest_seconds ? (
        <Section title="Sets, reps & rest">
          <View className="gap-1">
            <Typography color="muted" type="body-sm">
              Beginner: {exercise.sets.beginner} sets ·{" "}
              {exercise.rep_range.hypertrophy} reps · rest{" "}
              {exercise.rest_seconds.hypertrophy}s
            </Typography>
            <Typography color="muted" type="body-sm">
              Intermediate: {exercise.sets.intermediate} sets ·{" "}
              {exercise.rep_range.strength} reps · rest{" "}
              {exercise.rest_seconds.strength}s
            </Typography>
            <Typography color="muted" type="body-sm">
              Advanced: {exercise.sets.advanced} sets ·{" "}
              {exercise.rep_range.endurance} reps · rest{" "}
              {exercise.rest_seconds.endurance}s
            </Typography>
          </View>
        </Section>
      ) : null}

      <Section title="How to do it">
        <View className="gap-1">
          {exercise.instructions.map((instruction, index) => (
            <Typography key={index} color="muted" type="body-sm">
              {index + 1}. {instruction}
            </Typography>
          ))}
        </View>
      </Section>

      {exercise.form_cues.length > 0 ? (
        <Section title="Form cues">
          <BulletList items={exercise.form_cues} />
        </Section>
      ) : null}

      {exercise.common_mistakes.length > 0 ? (
        <Section title="Common mistakes">
          <BulletList items={exercise.common_mistakes} />
        </Section>
      ) : null}

      {exercise.injury_considerations?.length ? (
        <Section title="Injury considerations">
          <View className="gap-1">
            {exercise.injury_considerations.map((consideration, index) => (
              <Typography key={index} type="body-sm" className="text-danger">
                {"• "}
                {consideration}
              </Typography>
            ))}
          </View>
        </Section>
      ) : null}
    </View>
  );
}
