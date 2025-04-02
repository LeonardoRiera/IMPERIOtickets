const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999999999999999999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;