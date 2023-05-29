type Values = {
  [key: string]: string;
};

const filterParams = (values: Values) => {
  const params = values;
  const paramsArray = Object.keys(params);

  if (paramsArray.length !== 0) {
    paramsArray.forEach((key) => {
      if (params[key] === "") {
        delete params[key];
      }
    });
  }
  return params;
};

export default filterParams;
