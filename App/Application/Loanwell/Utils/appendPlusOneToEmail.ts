export default function appendPlusOneToEmail(email: string): string {
  const [localPart, domainPart] = email.split('@');
  const newLocalPart = `${localPart}+1`;

  return `${newLocalPart}@${domainPart}`;
}