export const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};
