interface FeatureCardProps {
  title: string;
  description: string;
}

/**
 * Card component for displaying feature information.
 * Shows a title and description in a styled card layout.
 */
export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-transparent">
      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
        {title}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
