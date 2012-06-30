var oauth = require("oauth").OAuth;

var etsyAuth = function etsyAuth( key, secret, domain, callback ) {

    var that = this;

    this.o = new oauth(
        "http://openapi.etsy.com/v2/oauth/request_token",
        "http://openapi.etsy.com/v2/oauth/access_token",
        key,
        secret,
        "1.0",
        domain + ( callback || "/auth/etsy/callback" ),
        "HMAC-SHA1"
    );

    this.getRequestToken = function getRequestToken( req, res ) {
        that.o.getOAuthRequestToken( function( err, token, token_secret, results ){
            if ( err ) {
                console.log( err );
            } else {
                req.session.oauth = {};
                req.session.oauth.token = token;
                req.session.oauth.token_secret = token_secret;
                res.redirect( results[ "login_url" ] );
            }
        });
    };

    this.getAccessToken = function getAccessToken( req, res, callback ) {
        if ( req.session.oauth ) {
            req.session.oauth.verifier = req.query.oauth_verifier;
            var auth = req.session.oauth;
            that.o.getOAuthAccessToken(
                auth.token,
                auth.token_secret,
                auth.verifier, 
                function( err, token, token_secret, results ){
                    if ( err ){
                        console.log( err );
                    } else {
                        req.session.oauth.access_token = token;
                        req.session.oauth.access_token_secret = token_secret;
                        callback.call( this, req, res );
                    }
                }
            );
        }
    };

    return this;
};

module.exports = etsyAuth;