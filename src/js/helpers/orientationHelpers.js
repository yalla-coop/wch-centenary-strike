export function getOrientation() {
  if (Math.max(
    document.documentElement["clientWidth"],
    document.body["scrollWidth"],
    document.documentElement["scrollWidth"],
    document.body["offsetWidth"],
    document.documentElement["offsetWidth"]
  ) > Math.max(
    document.documentElement["clientHeight"],
    document.body["scrollHeight"],
    document.documentElement["scrollHeight"],
    document.body["offsetHeight"],
    document.documentElement["offsetHeight"]
  )) {
    return 'landscape';
  }
  return 'portrait'

}
export function setOrientation() {
  if (getOrientation() === 'portrait') {
    document.querySelector('body').classList.remove("landscape");
    document.querySelector('body').classList.add("portrait");
  } else {
    document.querySelector('body').classList.remove("portrait");
    document.querySelector('body').classList.add("landscape");
  }
}
