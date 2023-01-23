const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  function createCandidate(data) {
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = createCandidate(data);
    }
  }

  candidate = candidate && typeof candidate !== "string" ? JSON.stringify(candidate) : TRIVIAL_PARTITION_KEY;

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = createCandidate(candidate);
  }

  return candidate;
};