import exercisesData from "@/exercises.json";

export type ExerciseCategory =
  | "strength"
  | "cardio"
  | "mobility"
  | "stretching"
  | "plyometric"
  | "rehabilitation";

export type ExerciseType = "compound" | "isolation";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ForceType = "push" | "pull" | "static" | "locomotion";

export type Laterality = "bilateral" | "unilateral" | "alternating";

export type MovementPattern =
  | "horizontal_push"
  | "horizontal_pull"
  | "vertical_push"
  | "vertical_pull"
  | "squat"
  | "hinge"
  | "lunge"
  | "carry"
  | "rotation"
  | "anti_rotation"
  | "anti_extension"
  | "anti_lateral_flexion"
  | "isolation"
  | "locomotion"
  | "jump"
  | "other";

export type PlaneOfMotion =
  "sagittal" | "frontal" | "transverse" | "multi_planar";

export type BodyPart =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "biceps"
  | "triceps"
  | "forearms"
  | "core"
  | "abs"
  | "obliques"
  | "lower_back"
  | "glutes"
  | "quadriceps"
  | "hamstrings"
  | "calves"
  | "legs"
  | "full_body";

export type Muscle =
  | "pectoralis_major"
  | "pectoralis_minor"
  | "latissimus_dorsi"
  | "trapezius"
  | "rhomboids"
  | "erector_spinae"
  | "deltoids"
  | "anterior_deltoid"
  | "lateral_deltoid"
  | "posterior_deltoid"
  | "biceps_brachii"
  | "triceps_brachii"
  | "brachialis"
  | "brachioradialis"
  | "forearm_flexors"
  | "forearm_extensors"
  | "rectus_abdominis"
  | "obliques"
  | "transverse_abdominis"
  | "gluteus_maximus"
  | "gluteus_medius"
  | "quadriceps"
  | "vastus_lateralis"
  | "vastus_medialis"
  | "rectus_femoris"
  | "hamstrings"
  | "biceps_femoris"
  | "semitendinosus"
  | "semimembranosus"
  | "adductors"
  | "gastrocnemius"
  | "soleus"
  | "hip_flexors"
  | "core";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "cable"
  | "machine"
  | "smith_machine"
  | "resistance_band"
  | "bench"
  | "pull_up_bar"
  | "dip_bar"
  | "bodyweight"
  | "box"
  | "landmine"
  | "none";

export type TrainingGoal =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "power"
  | "mobility"
  | "conditioning"
  | "fat_loss";

export const TRAINING_GOALS: TrainingGoal[] = [
  "strength",
  "hypertrophy",
  "endurance",
  "power",
  "mobility",
  "conditioning",
  "fat_loss",
];

export const DIFFICULTIES: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export type Exercise = {
  id: string;
  name: string;
  slug: string;

  category: ExerciseCategory;
  type: ExerciseType;

  body_parts: BodyPart[];

  primary_muscles: Muscle[];
  secondary_muscles: Muscle[];

  movement_pattern: MovementPattern;

  equipment: Equipment[];

  difficulty: Difficulty;

  force_type: ForceType;
  laterality: Laterality;
  plane_of_motion: PlaneOfMotion;

  goals: TrainingGoal[];

  instructions: string[];
  form_cues: string[];
  common_mistakes: string[];

  sets?: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };

  rep_range?: {
    strength: string;
    hypertrophy: string;
    endurance: string;
  };

  rest_seconds?: {
    strength: number;
    hypertrophy: number;
    endurance: number;
  };

  tempo?: string;

  injury_considerations?: string[];

  video?: {
    url: string;
  };

  tags: string[];
};

const exercises = exercisesData.exercises as Exercise[];

export function getAllExercises(): Exercise[] {
  return exercises;
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}

/** "pectoralis_major" -> "Pectoralis Major" */
export function humanize(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
