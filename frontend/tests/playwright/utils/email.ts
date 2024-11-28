import jsdom from "jsdom";
const { JSDOM } = jsdom;

import axios from 'axios';

axios.defaults.headers.get["Accept"] = "application/json";

/** Regular expression used to match for a link, taken from {@link https://stackoverflow.com/a/3809435/24037665|Stack Overflow} */
// const LINK_REGEX = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/);

/** Given an email address, it retrieves the ID of the latest email
 * If there is no email in the inbox of the given address, then it will try again up until maxTries.
 * 
 * See {@link https://github.com/inbucket/inbucket/wiki/REST-GET-mailbox} for the response data format and how the API endpoint works.
 * 
 * @param address Inbox to find newest email in
 * @param maxTries How many attempts to receive an email
 * @returns ID of the latest email, null if no email has been received
 */
async function getLatestEmail(address: string, maxTries: number): Promise<string | null> {
    let emailID: string | null = null;

    const requestURL = new URL(`/api/v1/mailbox/${address}`, process.env.INBUCKET_URL).href;
    let nTries = 0;
    let found = false;
    while(nTries < maxTries && !found ) {
        const response = await axios.get(requestURL);
        const responseData = response.data;
                
        if(Object.keys(responseData).length > 0) {
            const sortedInbox = responseData.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
            emailID = sortedInbox.at(-1).id;
            found = true;
        } else {
            nTries += 1;
        }
    }

    if(emailID) {
        return emailID;
    } else {
        return null;
    }
}

/** Given an address and an email ID, get the response body for the email associated with the ID.
 * 
 * See {@link https://github.com/inbucket/inbucket/wiki/REST-GET-message} for the response data format and how the API endpoint works.
 * @param address Inbox that the email ID given is located in
 * @param id ID of the email
 * @returns Textual representation of the email body if it exists, null otherwise
 */
async function getEmailBody(address: string, id: string): Promise<string | null> {
    const requestURL = new URL(`/api/v1/mailbox/${address}/${id}`, process.env.INBUCKET_URL).href;
    
    const response = await axios.get(requestURL);
    if(response.status !== 200) {
        return null;
    }
    const responseData = response.data;
    return responseData.body.html;
}

/** Given an address, purge the mailbox
 * 
 * See {@link https://github.com/inbucket/inbucket/wiki/REST-DELETE-mailbox} for the response data format and how the API endpoint works.
 * @param address Email address to purge
 * @returns True if it succeeded (HTTP 200), false otherwise
 */
async function purgeMailbox(address: string): Promise<boolean> {
    const requestURL = new URL(`/api/v1/mailbox/${address}`, process.env.INBUCKET_URL).href;

    const response = await axios.delete(requestURL);
    return response.status === 200;
}

/** Unrelated email function but helper function to retrieve the first link from an email body
 * 
 * @param body The body of the email
 * @returns The first link 
 */
function getLinkFromEmailBody(body: string): string | null {
    const dom = new JSDOM(body);
    const links = dom.window.document.getElementsByTagName('a');
    if(links.length === 0) return null;
    return links[0].href;
}

export { getLatestEmail, getEmailBody, purgeMailbox, getLinkFromEmailBody };