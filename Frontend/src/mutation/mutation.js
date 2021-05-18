import { gql } from 'apollo-boost';

const userSignUpMutation = gql`
mutation ($email: String, $name: String, $password: String){
    userSignup(email: $email, name: $name, password: $password){
      status message
    }
}
`;

const userLoginMutation = gql`
mutation ($email: String, $password: String){
    userLogin(email: $email, password: $password){
      status message
    }
}
`;

const profileUpdateMutation = gql`
mutation ($email: String, $name: String, $phone: String, 
    $currency: String, $language: String, $timezone: String, $avatar: String){
    profileUpdate(email: $email, name: $name, phone: $phone, 
        currency: $currency, timezone: $timezone, language: $language, avatar: $avatar){
        message
        status
    }
}
`;

const newGroupMutation = gql`
mutation ($name: String, $image: String, $fileSelected: String, $creator: String){
    newGroup(name: $name, image: $image, fileSelected: $fileSelected, creator: $creator){
      name
    }
}
`;

export {
  userSignUpMutation, userLoginMutation, newGroupMutation, profileUpdateMutation,
};
