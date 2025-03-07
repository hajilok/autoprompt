import axios from "axios";
import fs from "fs/promises";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const url = (await fs.readFile("url.txt", "utf-8"))
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);

  const api = (await fs.readFile("api.txt", "utf-8"))
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);

  while (true) {
    for (let i = 0; i < url.length; i++) {
      try {
        const postUrl = await axios.post(
          `${url[i]}/v1/chat/completions`,
          {
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: "Hello siapakah kamu " },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${api}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const response = postUrl.data;
        console.log(response.choices[0].message);
      } catch (error) {
        if (error.response.status === 500) {
          console.log("Rate limit exceeded, please wait 1 minute");
        } else {
          console.log(error);
          console.log("Error, please check your url or api");
        }
      }
    }
    await delay(60000);
  }
};

main();
