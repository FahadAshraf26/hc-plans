export function validateFileHeaders(fileObject, expectedHeaders){
    const missingHeaders = expectedHeaders.filter(header => !(header in fileObject));
    if (missingHeaders.length > 0) {
      return false;
    }
    return true;
  }