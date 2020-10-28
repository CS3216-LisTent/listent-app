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
  return formatDistance(new Date(), new Date(timestamp + "Z")) + " ago";
}

export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  return (
    /android/i.test(userAgent) ||
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
  );
}

export function abbreviateNumber(value) {
  if (!value) {
    return 0;
  }
  let newValue = value;
  if (value >= 1000) {
    let suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = "";
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum !== 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      let dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}
