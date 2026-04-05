import { Button, Container, EmptyState } from "@pliq/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container size="sm">
      <div style={{ paddingTop: "12rem", paddingBottom: "12rem" }}>
        <EmptyState
          title="Page not found"
          description="The page you are looking for does not exist or has been moved."
          action={
            <Link href="/">
              <Button variant="primary">Go Home</Button>
            </Link>
          }
        />
      </div>
    </Container>
  );
}
