const get = (url) => {
  return new Promise((resolve, reject) => {
    if (url === "http://linkRoto") {
      reject({ response: { status: 400 } });
    } else if (url === "http://failHttpRequest") {
      reject({ request: {}, message: "errorRequest" });
    } else if (url === "hipervinculo") {
      reject({ message: "" });
    } else {
      resolve({ status: 200, statusText: "OK" });
    }
  });
};
exports.get = get;

// const mymock = jest.fn();
