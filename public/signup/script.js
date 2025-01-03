const username = document.getElementById("username").value;
const name = document.getElementById("name").value;
const password = document.getElementById("password").value;

const data = { username, name, password };

console.log("script works");

async function getData() {
  const url = "/api/signup";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
