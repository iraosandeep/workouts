import { Select } from "heroui-native";

type MultiSelectFilterProps<T extends string> = {
  label: string;
  options: T[];
  selected: Set<T>;
  onSelectedChange: (next: Set<T>) => void;
  formatOption: (value: T) => string;
};

/** A labeled multi-select ("Muscle Groups") backed by heroui's Select in
 * `selectionMode="multiple"`, presented as a bottom sheet so long option
 * lists (e.g. every body part) stay comfortably tappable on mobile. */
export function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onSelectedChange,
  formatOption,
}: MultiSelectFilterProps<T>) {
  if (options.length === 0) return null;

  const value = options
    .filter((option) => selected.has(option))
    .map((option) => ({ value: option, label: formatOption(option) }));

  return (
    <Select
      selectionMode="multiple"
      presentation="bottom-sheet"
      value={value}
      onValueChange={(next) =>
        onSelectedChange(
          new Set(
            next
              .filter((option) => option !== undefined)
              .map((option) => option.value as T),
          ),
        )
      }
    >
      <Select.Trigger>
        <Select.Value
          placeholder={label}
          numberOfLines={1}
          ellipsizeMode="tail"
          className="flex-1"
        />
        <Select.TriggerIndicator />
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="bottom-sheet" snapPoints={["60%"]}>
          <Select.ListLabel>{label}</Select.ListLabel>
          {options.map((option) => (
            <Select.Item key={option} value={option} label={formatOption(option)} />
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
