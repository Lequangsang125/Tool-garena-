const Skeleton = () => {
    return (
      <div className="w-full p-4 border border-gray-300 rounded-md animate-pulse">
        <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
        <div className="mt-2 h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    );
  };
  
  export default Skeleton;
  