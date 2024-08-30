/**
 * messager.js
 *
 * Provides functionality to display informational and error messages to the user.
 * It allows subscribing to message updates and handles the timing and display logic for messages.
 *
 * Exports:
 * - `info(message)`: Displays an informational message to the user.
 * - `error(message)`: Displays an error message to the user.
 * - `subscribeToMessages(setMessage)`: Subscribes to message updates.
 */

let currentSetMessage = null;
let messageTimeout = null;

/**
 * Subscribes a function to receive message updates.
 * @param {function} setMessage - The function to call with the message object when a message should be displayed.
 * @returns {function} A function that can be called to unsubscribe.
 */
export function subscribeToMessages(setMessage) {
  currentSetMessage = setMessage;
  return () => {
    currentSetMessage = null;
    clearTimeout(messageTimeout);
  };
}

function displayMessage(text, type) {
  if (currentSetMessage) {
    clearTimeout(messageTimeout);
    currentSetMessage({ text, type });
    messageTimeout = setTimeout(
      () => currentSetMessage({ text: "", type: "" }),
      8000
    );
  }
}

/**
 * Displays a message to the user briefly.
 * @param {string} message - The message to be displayed.
 */
export function info(message) {
  displayMessage(message, "info");
}

/**
 * Displays an error message to the user briefly.
 * @param {string} message - The message to be displayed as an error.
 */
export function error(message) {
  const errorMessage = `Virhe: ${message}`;
  displayMessage(errorMessage, "error");
}
