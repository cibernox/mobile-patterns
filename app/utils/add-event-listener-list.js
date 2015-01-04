export default function addEventListenerList(list, event, callback, useCapture = false) {
  for (var i = 0, l = list.length; i < l; i++) {
    list[i].addEventListener(event, callback, useCapture);
  }
}
