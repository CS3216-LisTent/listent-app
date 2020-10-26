import addHours from "date-fns/addHours";

export function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsDisplay = Math.floor(seconds % 60);
  return `${minutes}:${String(secondsDisplay).padStart(2, "0")}`;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateSince(timestamp) {
  let since;
  const tTime = addHours(new Date(timestamp), 8);
  const cTime = new Date();
  const sinceMin = Math.round((cTime - tTime) / 60000);
  if (sinceMin === 0) {
    const sinceSec = Math.round((cTime - tTime) / 1000);
    if (sinceSec < 10) {
      since = "less than 10 seconds ago";
    } else if (sinceSec < 20) {
      since = "less than 20 seconds ago";
    } else since = "half a minute ago";
  } else if (sinceMin === 1) {
    const sinceSec = Math.round((cTime - tTime) / 1000);
    if (sinceSec === 30) {
      since = "half a minute ago";
    } else if (sinceSec < 60) {
      since = "less than a minute ago";
    } else {
      since = "1 minute ago";
    }
  } else if (sinceMin < 45) {
    since = sinceMin + " minutes ago";
  } else if (sinceMin > 44 && sinceMin < 60) {
    since = "about 1 hour ago";
  } else if (sinceMin < 1440) {
    const sinceHr = Math.round(sinceMin / 60);
    if (sinceHr === 1) {
      since = "about 1 hour ago";
    } else since = "about " + sinceHr + " hours ago";
  } else if (sinceMin > 1439 && sinceMin < 2880) {
    since = "1 day ago";
  } else {
    const sinceDay = Math.round(sinceMin / 1440);
    since = sinceDay + " days ago";
  }
  return since;
}
