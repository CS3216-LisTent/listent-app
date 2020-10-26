import addMinutes from "date-fns/addMinutes";
import formatDistance from "date-fns/formatDistance";

export function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsDisplay = Math.floor(seconds % 60);
  return `${minutes}:${String(secondsDisplay).padStart(2, "0")}`;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateSince(timestamp) {
  return (
    formatDistance(
      new Date(),
      addMinutes(new Date(timestamp), -new Date().getTimezoneOffset())
    ) + " ago"
  );
}
