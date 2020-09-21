const setFocus = (el) => {
  const currFocusPosition = el.value.indexOf('_')
  el.setSelectionRange(currFocusPosition,currFocusPosition)
};

const phone = document.getElementById("phone");

phone.value = phone.dataset.mask;

phone.addEventListener('click', () => setFocus(phone))

const prevInputData = [phone.dataset.mask]

phone.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (e.keyCode === 8) {
    e.target.value = prevInputData.pop();
    setFocus(e.target);

    if (prevInputData.length === 0) {
      prevInputData.push(phone.dataset.mask)
    }
    return;
  }

  if (e.keyCode < 46 || e.keyCode > 57) {
    return;
  }
  const newValue = e.target.value.replace("_", e.key);
  if (newValue === e.target.value) {
    return;
  }
  prevInputData.push(e.target.value);
  e.target.value = newValue;

  setFocus(e.target)
})