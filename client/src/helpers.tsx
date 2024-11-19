export const colorValues = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'gray',
  'black',
  'magenta',
  'volcano',
  'gold',
  'lime',
  'cyan',
  'geekblue',
  '#f50',
];

export const AJAX = async (url: string, options: any = {}) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
