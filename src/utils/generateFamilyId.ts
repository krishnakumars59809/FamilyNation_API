export const generateFamilyId=(firstName: string)=> {
  const namePart = firstName.substring(0, 3).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${namePart}-${randomPart}`;
}