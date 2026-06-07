const fs = require("fs");
const path = require("path");
const selfsigned = require("selfsigned");

async function main() {
  const certsDir = path.join(__dirname, "../certs");
  const certPath = path.join(certsDir, "cert.pem");
  const keyPath = path.join(certsDir, "key.pem");

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log("HTTPS certificates already exist");
    return;
  }

  const localIp = process.env.LOCAL_IP || "192.168.1.15";

  const pems = await selfsigned.generate(
    [{ name: "commonName", value: "localhost" }],
    {
      days: 365,
      keySize: 2048,
      algorithm: "sha256",
      extensions: [
        {
          name: "subjectAltName",
          altNames: [
            { type: 2, value: "localhost" },
            { type: 2, value: localIp },
            { type: 7, ip: "127.0.0.1" },
            { type: 7, ip: localIp },
          ],
        },
      ],
    }
  );

  fs.mkdirSync(certsDir, { recursive: true });
  fs.writeFileSync(certPath, pems.cert);
  fs.writeFileSync(keyPath, pems.private);
  console.log(`Generated HTTPS certificates in ${certsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
