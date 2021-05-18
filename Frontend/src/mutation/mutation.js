import { gql } from 'apollo-boost';

// const userSignUpMutation1 = 'mutation _($userInput: UserSignup) {addUser(user: $userInput) {email currency timezone}}';
const userSignUpMutation = gql`
mutation ($email: String, $name: String, $password: String){
    userSignup(email: $email, name: $name, password: $password){
        email
        currency
        timezone
    }
}
`;

export { userSignUpMutation };
