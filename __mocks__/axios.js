const get = (url) => {
  return new Promise((resolve, reject) => {
    if (url === "http://linkroto/") {
      reject({ response: { status: 400 } });
    } else if (url === "http://failhttprequest/") {
      reject({ request: {}, message: "errorRequest" });
    } else if (url === "about:blank#hipervinculo") {
      reject({ message: "" });
    } else {
      resolve({ status: 200, statusText: "OK" });
    }
  });
};
exports.get = get;
