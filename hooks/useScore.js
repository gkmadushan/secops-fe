const useScore = (severity) => {
  const settings = {
    low: { color: "blue" },
    medium: { color: "orange" },
    high: { color: "red" },
  };

  return settings[severity.toLowerCase()] ?? { color: "default" };
};

export { useScore };
