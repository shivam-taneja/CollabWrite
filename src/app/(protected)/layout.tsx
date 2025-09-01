import ProtectedWrapper from "@/core/protected-wrapper";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedWrapper>
      <section className="bg-gray-50">{children}</section>
    </ProtectedWrapper>
  );
};

export default ProtectedLayout;
