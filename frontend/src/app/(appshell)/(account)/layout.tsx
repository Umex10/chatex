
/**
 * Parallel-routes layout for the account section.
 * Renders the primary `children` slot alongside an optional `modal` intercepted-route slot.
 */
export default function AccountLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {/* Primary Page Content */}
      {children}
      {/* Intercepted Modal Slot */}
      {modal}
    </>
  );
}