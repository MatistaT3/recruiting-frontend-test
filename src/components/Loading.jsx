import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );
};

export default Loading;
