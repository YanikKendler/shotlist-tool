import auth0 from 'auth0-js';

class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'dev-pvlm4i5qpteni14h.us.auth0.com',
            clientID: '4FPKDtlCQjAToOwAEiG6ZrL0eW2UXlx4',
            responseType: 'id_token token',
            redirectUri: 'http://localhost:3000/callback',
            audience: 'https://dev-pvlm4i5qpteni14h.us.auth0.com/api/v2/',
            scope: 'openid profile email',
        });

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getTokenSilently = this.getTokenSilently.bind(this);
    }

    login() {
        this.auth0.authorize({}, (err, authResult) => {
            console.log(err, authResult)
        })
    }

    getAccessToken() {
        return this.accessToken
    }

    getIdToken() {
        return this.idToken
    }

    async getTokenSilently() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession((err, authResult) => {
                if (err) {
                    console.error("Silent auth error", err);
                    return reject(err);
                }

                this.setSession(authResult);
                resolve(authResult.accessToken);
            });
        });
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
            this.auth0.parseHash({ hash: window.location.hash }, function(err, authResult) {
                if (err) {
                    reject(err)
                    return console.log(err)
                }

                this.setSession(authResult)

                this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
                    console.log(user)
                    resolve(user)
                })
            }.bind(this))
        })
    }

    setSession(authResult) {
        this.idToken = authResult.idToken;
        this.accessToken = authResult.accessToken;
        console.log(authResult.accessToken)
        // set the time that the id token will expire at
        this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    }

    logout() {
        this.auth0.logout({
            returnTo: 'http://localhost:3000',
            clientID: '4FPKDtlCQjAToOwAEiG6ZrL0eW2UXlx4',
        });
    }

    silentAuth() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (err) return reject(err);
                this.setSession(authResult);
                resolve();
            });
        });
    }

    isAuthenticated() {
        // Check whether the current time is past the token's expiry time
        return new Date().getTime() < this.expiresAt;
    }
}

const auth = new Auth();

export default auth;
