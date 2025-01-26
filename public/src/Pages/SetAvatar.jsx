import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loader from "../Assets/loader.gif";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { setAvatarRoute } from "../Utils/APIRoutes";
import { Buffer } from "buffer";

export default function SetAvatar() {
  let navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(()=>{
    console.log(selectedAvatar);
  },[selectedAvatar])
  const api = `https://api.multiavatar.com/4645646`;

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
  
      if (!user) {
        toast.error("User not found. Please log in again.", toastOptions);
        navigate("/login");
        return;
      }
  
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
  
      console.log("API Response:", data); // Log the entire response for debugging
  
      if (data && data.isSet === true) {
        console.log("Avatar successfully set:", data.image);
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
  
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        toast.success("Avatar set successfully!", toastOptions);
        navigate("/");
      } else {
        console.error("Avatar setting failed. Response:", data);
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      console.error("Error setting profile picture:", error);
      toast.error("Something went wrong. Please try again later.", toastOptions);
    }
  };
  
  

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pic an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64, ${avatar}`}
                    alt="avatar"
                    onClick={() => {
                      setSelectedAvatar(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as profile picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
