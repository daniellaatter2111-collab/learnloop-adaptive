import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardHeading, CircularProgress, Pill } from "@/components/shared/Primitives";
import { Button } from "@/components/ui/button";
import type { LearningProfile } from "@/types";

export function LearningProfileCard({
  profile,
  readOnly = false,
  to = "/student/profile",
}: {
  profile: LearningProfile;
  readOnly?: boolean;
  to?: "/student/profile" | "/parent/profile";
}) {
  return (
    <Card>
      <CardHeading
        title="Your learning profile"
        description="LearnLoop adapts your content based on how you learn best."
      />
      <div className="flex items-center gap-5">
        <CircularProgress value={profile.confidence} caption="confidence" />
        <div>
          <p className="text-[15px] font-semibold capitalize">{profile.style} learner</p>
          <p className="meta-text">{profile.confidence}% confidence</p>
          <p className="mt-2 text-sm">
            Peak study time
            <span className="ml-1 font-medium">{profile.peakHours}</span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="meta-text mb-2">Preferred formats</p>
        <div className="flex flex-wrap gap-2">
          {profile.preferredFormats.map((f) => (
            <Pill key={f} tone="primary">
              {f}
            </Pill>
          ))}
        </div>
      </div>

      {!readOnly ? (
        <Button asChild variant="outline" className="mt-5 w-full sm:w-auto">
          <Link to={to}>
            View learning profile <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      ) : null}
    </Card>
  );
}
