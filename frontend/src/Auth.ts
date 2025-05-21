import auth0, {Auth0DecodedHash, Auth0ParseHashError, WebAuth} from 'auth0-js';

export interface AuthUser {
    name: string;
    email: string;
    sub: string;
}

class Auth {
    private auth0: WebAuth
    private readonly authFlag: string
    private idToken: string = "no-token"
    private authUser: AuthUser | null = null
    private FRONTEND_URL: string = ""


    constructor() {
        //this.FRONTEND_URL = "https://shotlist-tool-frontend-566625943723.europe-west1.run.app"
        this.FRONTEND_URL = "http://localhost:3000";

        console.log("Auth0 constructor", this.FRONTEND_URL)

        this.auth0 = new auth0.WebAuth({
            domain: 'dev-pvlm4i5qpteni14h.us.auth0.com',
            clientID: '4FPKDtlCQjAToOwAEiG6ZrL0eW2UXlx4',
            responseType: 'id_token token',
            redirectUri: this.FRONTEND_URL + '/callback',
            audience: 'https://dev-pvlm4i5qpteni14h.us.auth0.com/api/v2/',
            scope: 'openid profile email',
        });

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getTokenSilently = this.getTokenSilently.bind(this);
        this.silentAuth = this.silentAuth.bind(this);

        this.authFlag = 'isLoggedIn';
    }

    login() {
        this.auth0.authorize()
    }

    logout() {
        localStorage.setItem(this.authFlag, JSON.stringify(false));
        this.auth0.logout({
            returnTo: this.FRONTEND_URL,
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
                    console.error("Silent auth error", err);
                    return reject(err);
                }

                this.setSession(authResult);
                resolve(authResult.accessToken);
            })
        })
    }

    handleAuthentication() {
        return new Promise((resolve, reject) => {
            /*this.auth0.parseHash((err, authResult) => {
                if (err) return reject(err)
                if (!authResult || !authResult.idToken) {
                    return reject(err)
                }
                this.setSession(authResult)
                resolve()
            })*/
            this.auth0.parseHash({ hash: window.location.hash }, (error: Auth0ParseHashError | null, authResult: Auth0DecodedHash | null) => {
                if (error) {
                    reject(error)
                    console.log(error)
                }

                if(!authResult) {
                    return reject("authResult is null")
                }

                this.setSession(authResult)

                if(!authResult.accessToken) {
                    return reject("missing accessToken")
                }

                this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
                    console.log(user)
                    resolve(user)
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
            name: authResult.idTokenPayload.name,
            email: authResult.idTokenPayload.email,
            sub: authResult.idTokenPayload.sub,
        }
        console.log(authResult);
        localStorage.setItem(this.authFlag, JSON.stringify(true));
    }

    silentAuth() {
        if(!this.isAuthenticated()) return null

        return new Promise<Auth0DecodedHash>((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (err) {
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
