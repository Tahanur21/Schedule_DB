import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-primary-50">
      <Sidebar />
      <main className="flex-1 p-8 page-enter overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
