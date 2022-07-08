// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'g8rfsp339f'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'abheist.us.auth0.com',            // Auth0 domain
  clientId: 'fySFw22XSW91XD4HD4nUcreM6SNdZfL0',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
