import React from "react";
import "./AnimationSuccess.css";

const SuccessAnimation = () => {
  const [stars, setStars] = React.useState([]);

  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        animationDuration: Math.random() * 1 + 0.5 + "s",
      }));
    };

    setStars(generateStars());

    const timer = setTimeout(() => {
      setShowSuccess(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animation-container">
      <div className={`circle-container ${showSuccess ? "fade-out" : ""}`}>
        <div className="character"></div>

        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              animationDuration: star.animationDuration,
              animation: `falling ${star.animationDuration} linear infinite`,
            }}
          ></div>
        ))}
      </div>

      <div className={`success-circle ${showSuccess ? "fade-in" : ""}`}>
        <div className="checkmark"></div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
