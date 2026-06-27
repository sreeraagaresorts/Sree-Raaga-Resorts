export const formatPhoneNumber = (phone) => {
  if (!phone) return "N/A";
  
  // Clean all whitespace
  const cleaned = phone.toString().replace(/\s+/g, '');
  
  let digits = cleaned;
  let hasPlus = cleaned.startsWith('+');
  if (hasPlus) {
    digits = cleaned.substring(1);
  }
  
  // Strip non-digits from digits part
  const numbersOnly = digits.replace(/\D/g, '');
  
  let mainNumber = numbersOnly;
  let countryCode = "+91";
  
  if (numbersOnly.startsWith('91') && numbersOnly.length > 10) {
    mainNumber = numbersOnly.substring(2);
  }
  
  if (mainNumber.length === 10) {
    const part1 = mainNumber.substring(0, 3);
    const part2 = mainNumber.substring(3, 6);
    const part3 = mainNumber.substring(6, 10);
    return `${countryCode} ${part1} ${part2} ${part3}`;
  }
  
  // If it's a 10-digit number without any country code prefix
  if (cleaned.length === 10) {
    const part1 = cleaned.substring(0, 3);
    const part2 = cleaned.substring(3, 6);
    const part3 = cleaned.substring(6, 10);
    return `+91 ${part1} ${part2} ${part3}`;
  }
  
  return phone;
};
