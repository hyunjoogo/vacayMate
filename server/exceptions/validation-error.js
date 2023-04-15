function validationError(res, message) {
  return res.status(400).json({message});
}

export default validationError;
