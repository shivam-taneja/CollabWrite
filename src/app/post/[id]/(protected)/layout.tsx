import ProtectedWrapper from "@/core/protected-wrapper";

const PostProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedWrapper redirectTo="/feed">
      <div className="p-4">{children}</div>
    </ProtectedWrapper>
  );
};

export default PostProtectedLayout;
