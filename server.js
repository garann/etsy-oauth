var express = require( "express" ),
    oauth = require( "oauth" ).OAuth;

var app = express.createServer(),
    api_key = "your api key",
    api_secret = "your api secret",
    entry = "/auth/etsy",
    callback = "/auth/etsy/callback",
    o = new oauth(
        "http://openapi.etsy.com/v2/oauth/request_token",
        "http://openapi.etsy.com/v2/oauth/access_token",
        api_key,
        api_secret,
        "1.0",
        "http://local.host:3754" + callback,
        "HMAC-SHA1"
    );

app.configure( function(){
  app.use( app.router );
  app.use( express.cookieParser() );
  app.use( express.session( { secret: "example secret" } ) );
});

app.get( entry, function( req, res ) {
    o.getOAuthRequestToken( function( err, token, token_secret, results ){
        if ( err ) {
            console.log( err );
        } else {
            req.session.oauth = {};
            req.session.oauth.token = token;
            req.session.oauth.token_secret = token_secret;
            res.redirect( results[ "login_url" ] );
        }
    });
});
app.get( callback, function( req, res ) {
    if ( req.session.oauth ) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var auth = req.session.oauth;
        o.getOAuthAccessToken(
            auth.token,
            auth.token_secret,
            auth.verifier, 
            function( err, token, token_secret, results ){
                if ( err ){
                    console.log( err );
                } else {
                    req.session.oauth.access_token = token;
                    req.session.oauth,access_token_secret = token_secret;
                    console.log( results );
                }
            }
        );
    }
});

app.listen( 3754 );