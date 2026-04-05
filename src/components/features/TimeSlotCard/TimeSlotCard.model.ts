export interface TimeSlotCardProps {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}
