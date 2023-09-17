const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncHandler;

// Another Handler From My Made :)

function hello(fn) {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        state: "fail",
        data: err,
      });
    }
  };
}
