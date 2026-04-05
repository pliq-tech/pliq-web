import { Container, Skeleton, Spacer, Stack } from "@pliq/ui";

export default function Loading() {
  return (
    <Container size="lg">
      <Spacer size="xl" />
      <Stack direction="vertical" gap="md">
        <Skeleton width="30%" height="3.2rem" />
        <Skeleton width="100%" height="20rem" />
        <Stack direction="horizontal" gap="md">
          <Skeleton width="33%" height="12rem" />
          <Skeleton width="33%" height="12rem" />
          <Skeleton width="33%" height="12rem" />
        </Stack>
      </Stack>
    </Container>
  );
}
