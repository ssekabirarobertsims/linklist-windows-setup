const CopyTextToClipboard = (text: string | number | boolean | object) => {
  // copy text passed in as arg to the windows clipboard
  window.navigator.clipboard.writeText(text as string); // as a string
};

export default CopyTextToClipboard;
