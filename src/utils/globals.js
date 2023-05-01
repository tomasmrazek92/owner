export const setInputElementValue = (elementName, value) => {
  $(`input[name=${elementName}]`).val(value);
};
