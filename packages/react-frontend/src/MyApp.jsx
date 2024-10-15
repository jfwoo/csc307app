// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function removeOneCharacter(id, index) {
    fetch(`http://localhost:8000/users/${id}`, {
      method: 'DELETE',
    })
    .then((resposne) => {
      if (resposne.status === 204) {
        const updated = characters.filter((character, i) => i !== index);
        setCharacters(updated);
      }
     else {
      throw new Error("Failed to delete user");
    }
  })
    .catch((error) => {
      console.log(error);
    });
  }

  function updateList(person) { 
    postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json(); 
      }
      throw new Error("Failed to add user");
    })
      .then((addedUser) => setCharacters([...characters, addedUser]))
      .catch((error) => {
        console.log(error);
      })
}

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
      <Table 
        characterData={characters}
        removeCharacter={(id, index) => removeOneCharacter(id, index)} 
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;