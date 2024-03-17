function updatePointCounter(button, points) {
  const pointsContainer = button.closest(".pointsContainer");
  const pointCounter = pointsContainer.querySelector(".pointCounter");
  pointCounter.textContent = points;
}

export default updatePointCounter;
