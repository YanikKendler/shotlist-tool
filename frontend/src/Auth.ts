import auth0, {Auth0DecodedHash, Auth0ParseHashError, WebAuth} from 'auth0-js';
import {Config} from "@/util/Utils"

export interface AuthUser {
    email: string;
    sub: string;
    isSocial?: boolean;
}

interface CustomAuthResult extends Auth0DecodedHash {
    appState?: {
        targetUrl?: string;
    };
}

class Auth {
    private auth0: WebAuth
    private readonly authFlag: string
    private idToken: string = "no-token"
    private authUser: AuthUser | null = null

    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'login.shotly.at',
            clientID: '4FPKDtlCQjAToOwAEiG6ZrL0eW2UXlx4',
            responseType: 'id_token token',
            redirectUri: Config.frontendURL + '/callback',
            audience: 'https://dev-pvlm4i5qpteni14h.us.auth0.com/api/v2/',
            scope: 'openid profile email',
            overrides: {
                __tenant: "dev-pvlm4i5qpteni14h",
                __token_issuer: 'https://login.shotly.at/'
            },
        })

        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.isAuthenticated = this.isAuthenticated.bind(this)
        this.getTokenSilently = this.getTokenSilently.bind(this)
        this.silentAuth = this.silentAuth.bind(this)

        this.authFlag = 'isLoggedIn'
    }

    login() {
        this.auth0.authorize()
    }

    loginForPro(){
        this.auth0.authorize({
            appState: { targetUrl: '/pro' }
        });
    }

    logout() {
        localStorage.setItem(this.authFlag, JSON.stringify(false));
        this.auth0.logout({
            returnTo: Config.frontendURL,
        });
    }

    getIdToken() {
        return this.idToken
    }

    getUser() {
        return this.authUser
    }

    async getTokenSilently() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({},(err, authResult) => {
                if (err) {
                    console.error("Silent auth error", err)
                    return reject(err)
                }

                this.setSession(authResult)
                resolve(authResult.accessToken)
            })
        })
    }

    handleAuthentication() {
        return new Promise<string>((resolve, reject) => {
            this.auth0.parseHash({ hash: window.location.hash }, (error: Auth0ParseHashError | null, authResult: CustomAuthResult | null) => {
                if (error) {
                    reject(error)
                    console.error(error)
                }

                if(!authResult) {
                    return reject("authResult is null")
                }

                this.setSession(authResult)

                if(!authResult.accessToken) {
                    return reject("missing accessToken")
                }

                this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
                    resolve(authResult.appState?.targetUrl || '/dashboard');
                })
            })
        })
    }

    setSession(authResult: Auth0DecodedHash) {
        if(!authResult || !authResult.idToken) {
            console.error("missing id token")
            return
        }
        this.idToken = authResult.idToken;

        if(!authResult.idTokenPayload.sub || !authResult.idTokenPayload.email || !authResult.idTokenPayload.name){
            console.error("missing data in id token payload")
            return
        }

        this.authUser = {
            email: authResult.idTokenPayload.email,
            sub: authResult.idTokenPayload.sub,
            isSocial: authResult.idTokenPayload.sub.startsWith("google-oauth2|")
        }
        localStorage.setItem(this.authFlag, JSON.stringify(true))
    }

    silentAuth() {
        if(!this.isAuthenticated()) return null

        return new Promise<Auth0DecodedHash>((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (err) {
                    console.error(err)
                    localStorage.removeItem(this.authFlag);
                    return reject(err);
                }
                this.setSession(authResult);
                resolve(authResult);
            });
        });
    }

    isAuthenticated() {
        return JSON.parse(localStorage.getItem(this.authFlag) || 'false');
    }
}

const auth = new Auth();

export default auth;
