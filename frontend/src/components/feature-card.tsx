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
    <div className="p-4 rounded-lg dark:bg-transparent bg-white/50 backdrop-blur-sm">
      <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
        {title}
      </h3>
      <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
