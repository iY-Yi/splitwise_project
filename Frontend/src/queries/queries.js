import { gql } from 'apollo-boost';
// query User($email: String){
const getUserProfileQuery = gql`
query($email : String){
  getUserProfile(email:$email){
    email name avatar phone currency timezone language    
  }
}`;

const getUserProfileTest = `
{
  getUserProfileTest{
    email name avatar phone currency timezone language
  }
}`;

export { getUserProfileQuery, getUserProfileTest };

