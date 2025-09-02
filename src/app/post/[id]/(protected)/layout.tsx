import ProtectedWrapper from "@/core/protected-wrapper";

const PostProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedWrapper redirectTo="/feed">
      <section>{children}</section>
    </ProtectedWrapper>
  );
};

export default PostProtectedLayout;
