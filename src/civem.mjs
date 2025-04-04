/* global document, window */

function handleValidEvent(event) {
  if (event.target.type.toUpperCase() === 'RADIO') {
    const radioGroup = document.getElementsByName(event.target.name);

    radioGroup.forEach((radio) => {
      radio.setCustomValidity('');
    });
  } else {
    event.target.setCustomValidity('');
  }

  event.target.checkValidity();
}

export function getInputHandler(inputCallback) {
  return function (event) {
    handleValidEvent(event);

    if (inputCallback) {
      inputCallback(event);
    }
  };
}

export function getInvalidHandler(invalidCallback) {
  return function (event) {
    const element = event.target;
    const { validity } = element;

    if (validity.valid) {
      handleValidEvent(event);
      return;
    }

    const suffix = validity.valueMissing
      ? 'value-missing'
      : validity.typeMismatch
        ? 'type-mismatch'
        : validity.patternMismatch
          ? 'pattern-mismatch'
          : validity.tooLong
            ? 'too-long'
            : validity.rangeUnderflow
              ? 'range-underflow'
              : validity.rangeOverflow
                ? 'range-overflow'
                : validity.stepMismatch
                  ? 'step-mismatch'
                  : validity.badInput
                    ? 'bad-input'
                    : validity.customError
                      ? 'custom-error'
                      : '';

    const specificErrormessage = element.getAttribute('data-errormessage-' + suffix);
    const genericErrormessage = element.getAttribute('data-errormessage');

    if (suffix && specificErrormessage) {
      element.setCustomValidity(specificErrormessage);
    } else if (genericErrormessage) {
      element.setCustomValidity(genericErrormessage);
    } else {
      element.setCustomValidity(element.validationMessage);
    }

    if (invalidCallback) {
      invalidCallback(event);
    }
  };
}

export function initValidation(formElement) {
  if (!formElement.willValidate) {
    return;
  }

  if (formElement.tagName.toUpperCase() === 'SELECT' || formElement.type.toUpperCase() === 'RADIO' || formElement.type.toUpperCase() === 'CHECKBOX' || formElement.type.toUpperCase() === 'FILE') {
    formElement.onchange = getInputHandler(formElement.onchange);
  } else {
    formElement.oninput = getInputHandler(formElement.oninput);
  }

  formElement.oninvalid = getInvalidHandler(formElement.oninvalid);
}

export function civem() {
  const formElements = [];
  const inputElements = Array.from(document.getElementsByTagName('input'));

  inputElements.forEach((input) => {
    formElements.push(input);
  });

  const textareaElements = Array.from(document.getElementsByTagName('textarea'));

  textareaElements.forEach((textarea) => {
    formElements.push(textarea);
  });

  const selectElements = Array.from(document.getElementsByTagName('select'));

  selectElements.forEach((select) => {
    formElements.push(select);
  });

  formElements.forEach((formElement) => {
    initValidation(formElement);
  });
}

(function () {
  window.addEventListener('load', civem, false);
})();
