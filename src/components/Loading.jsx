import { motion } from "framer-motion";

const LoadingDot = {
  display: "block",
  width: "1rem",
  height: "1rem",
  backgroundColor: "rgb(79, 70, 229)",
  borderRadius: "50%",
};

const LoadingContainer = {
  width: "5rem",
  height: "2rem",
  display: "flex",
  justifyContent: "space-around",
};

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const DotTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut",
};

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <motion.div
        style={LoadingContainer}
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          transition={DotTransition}
        />
      </motion.div>
      <span className="text-gray-500 font-medium">Cargando...</span>
    </div>
  );
};

export default Loading;
