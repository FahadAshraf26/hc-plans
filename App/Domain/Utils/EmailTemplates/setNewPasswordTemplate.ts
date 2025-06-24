export default `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Password</title>
    <style>
      * {
        padding: 0px;
        margin: 0px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }
      body {
        background-color: #fafafa;
      }

      .container {
        padding: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
      }

      .form {
        padding:1rem;
        background-color: white;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid lightgrey;
        border-radius: 10px;
        flex-direction: column;
         box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
      }

      .form label {
        margin: 0.75rem auto;
        display: flex;
        justify-content: center;
        align-items:center;
        flex-wrap:wrap;
      }
      .form label span::before {
        content: "*";
        color: red;
      }

      .form label span {
        align-self: flex-start
      }

      .form label input {
        border-radius: 0.5rem;
        padding: 0.25rem;
        outline: none;
        line-height:1.6;
      }

      @media only screen and (min-width: 400px) {
        .form label {
          width: 400px;
          display: block;
          padding-left:1rem;
          padding-right:1rem;

        }

        .form label input {
          width: 100%;
          margin-top: 5px;
        }

        .form label span {
          width: 100%;
        }
      }


      .submitButton {
        cursor: pointer;
        outline: none;
        max-width: 200px;
        margin: 1.5rem auto;
        padding: 0.25rem 1rem;
        border-radius: 5px;
        background-color: #1890ff;
        color: white;
        border: #1890ff;
        transform: scale(1.1);
        transition: transform 250ms;
        font-size:16px;
        line-height:1.6;
      }

      .submitButton:hover {
        transform: scale(1.2);
      }

      .bg-green {
        background-color: green;
        color: white;
      }

      /* The Modal (background) */
      .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0, 0, 0); /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
        /* margin: 0 auto; */
        justify-content: center;
        align-items: center;
        border-radius: 10px;
      }

      /* Modal Content/Box */
      .modal-content {
        background-color: #fefefe;
        margin: 15% auto; /* 15% from the top and centered */
        padding: 20px 10px;
        border: 1px solid #888;
        width: 40ch; /* Could be more or less, depending on screen size */
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      /* The Close Button */
      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .close:hover,
      .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
    <form class="form" id="passwordForm">
    <img
    src="https://storage.googleapis.com/honeycomb-public-uploads/uploads/Honeycomb_Credit_Logo_Admin_Panel.png"
    alt="honeycomb-logo"
    width="180px"
    height="80px"
    style="display: block; margin-left: auto; margin-right: auto;"
    />
    <h2 style="margin-bottom:20px;">New Password</h2>
        <label for="password">
          <span> New Password: </span>
          <input id="password" type="password" required />
        </label>
        <label for="confirmPassword">
          <span>
            Confirm Password:
          </span>
          <input id="confirmPassword" type="password" required />
        </label>
        <p
          style="margin: auto; text-align: center; color: red; font-size: 0.8rem;"
          id="helpMessage"
        ></p>
        <button class="submitButton" id="submitButton" type="submit">
          Update Password!
        </button>
      </form>
    </div>
    <div id="myModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <p class="modalText">Password Updated Successfully!</p>
        <span class="close">&times;</span>
      </div>
    </div>
    <script>
      const modalText = document.getElementsByClassName("modalText")[0];
      const submitButton = document.getElementById("submitButton");
      const helpMessage = document.getElementById("helpMessage");
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirmPassword");
      const span = document.getElementsByClassName("close")[0];
      const passwordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      const modal = document.getElementById("myModal");
      window.onload = async (ev) => {
        const params = new URLSearchParams(
          document.location.search.substring(1)
        );
        const token = params.get("token");
        if (!token) {
          helpMessage.innerText = "invalid url!";
          return;
        }
      };

      span.onclick = function () {
        modal.style.display = "none";
        window.location.reload();
      };

      const verifyPassword = (value) => password.value.match(passwordRegex);

      password.addEventListener("change", () => {
        if (!verifyPassword(password.value)) {
          helpMessage.innerHTML =
            "Password must have at least 8 characters, an uppercase letter, a number, and a special character";
        } else helpMessage.innerHTML = "";
      });

      confirmPassword.addEventListener("change", () => {
        if (!verifyPassword(confirmPassword.value)) {
          helpMessage.innerHTML =
            "Password must have at least 8 characters, an uppercase letter, a number, and a special character";
        } else helpMessage.innerHTML = "";
      });

      const form = document.getElementById("passwordForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (helpMessage.innerText !== "") {
          return;
        }

        // if (!userId) {
        //   modalText.innerText = "invalid or expired token, closing...";
        //   modal.style.display = "flex";
        // }

        if (password.value !== confirmPassword.value) {
          helpMessage.innerHTML = "passwords do not match.";
          return;
        }

        await fetch("{@UPDATE_URL}", {
          method: "POST",
          body: JSON.stringify({ password: password.value }),
          headers: {
            "content-type": "application/json",
            "x-auth-token": new URLSearchParams(
              document.location.search.substring(1)
            ).get("token"),
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status === "error" || response.error) {
              helpMessage.innerText =
                "something went wrong, update password failed";
              setTimeout(() => {
                helpMessage.innerText = "";
              }, 3000);
            }
            if (response.status === "success") {
              modal.style.display = "flex";
            }
          })
          .catch(
            (err) =>
              (helpMessage.innerText =
                "something went wrong, update password failed")
          );
      });
    </script>
  </body>
</html>

`;
