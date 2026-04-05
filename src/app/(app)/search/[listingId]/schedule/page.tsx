"use client";

import {
  Alert,
  Button,
  Container,
  Grid,
  Heading,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@pliq/ui";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { TimeSlotCard } from "@/components/features/TimeSlotCard";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let day = 1; day <= 3; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    const times = [
      { start: "10:00", end: "11:00" },
      { start: "14:00", end: "15:00" },
    ];

    for (const time of times) {
      slots.push({
        id: `${dateStr}-${time.start}`,
        date: dateStr,
        startTime: time.start,
        endTime: time.end,
        isAvailable: Math.random() > 0.3,
      });
    }
  }

  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function ScheduleVisitPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = use(params);
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Stub: would call API to book the visit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch {
      setError("Failed to book visit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedSlot]);

  if (success) {
    return (
      <Container size="lg">
        <Stack gap="lg" align="center">
          <Spacer size="xl" />
          <Alert variant="success">
            Visit booked successfully! You will receive a confirmation.
          </Alert>
          <Button
            variant="primary"
            onClick={() => router.push(`/search/${listingId}`)}
          >
            Back to listing
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Heading level={1}>Schedule a Visit</Heading>
        <Text color="secondary">
          Select an available time slot to visit the property.
        </Text>

        {error && <Alert variant="error">{error}</Alert>}

        <Grid columns={2} gap="md">
          {TIME_SLOTS.map((slot) => (
            <TimeSlotCard
              key={slot.id}
              date={slot.date}
              startTime={slot.startTime}
              endTime={slot.endTime}
              isAvailable={slot.isAvailable}
              isSelected={selectedSlot === slot.id}
              onSelect={() => {
                if (slot.isAvailable) setSelectedSlot(slot.id);
              }}
            />
          ))}
        </Grid>

        <Spacer size="md" />

        <Button
          variant="primary"
          isDisabled={!selectedSlot || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? <Spinner size="sm" /> : "Confirm Booking"}
        </Button>
      </Stack>
    </Container>
  );
}
