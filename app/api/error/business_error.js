class BusinessError extends Error {
  constructor(err, text) {
    super();
    const { code, msg } = err;
    const name = 'GATEWAY ERROR';

    this.code = code;
    this.data = err;
    this.message = text || err.desc;
    this.name = name;
    this.status = 200;
  }
}

export default BusinessError;
