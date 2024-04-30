const getAllAnimals = `
query Animals {
    animals {
        animal_name
        id
    }
}`;

const getAllSpecies = `
query Species {
    species {
        species_name
        id
    }
}`;


const login = `
mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      message
      token
      user {
        email
        id
        user_name
      }
    }
  }
  `;


  const checkToken = `
query CheckToken {
    checkToken {
      message
      user {
        user_name
      }
    }
  }
`;

export {
  login,
  checkToken,

};
