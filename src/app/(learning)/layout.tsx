export default function LearningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Minimal layout for learning/immersive mode
  // No Navbar or Footer
  return (
    <>
      {children}
    </>
  );
}
