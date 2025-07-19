export const generateAccountNumber = (): string => {
  return 'ACC' + Math.floor(100000 + Math.random() * 900000); // ACC100000–ACC999999
};