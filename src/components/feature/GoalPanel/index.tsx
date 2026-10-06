const GoalPanel = () => {
  return (
    <div
      style={{
        zIndex: 1000,
        position: "fixed",
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <img
        src="/images/goal.png"
        alt="Goal Image"
        style={{
          width: "750px",
          height: "750px",
        }}
      />
    </div>
  );
};

export default GoalPanel;
