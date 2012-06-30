var express = require( "express" ),
    etsyAuth = require( "./lib/etsy-auth" );

var app = express.createServer(),
    api_key = "your key here",
    api_secret = "your secret here",
    entry = "/auth/etsy",
    callback = "/auth/etsy/callback",
    o = new etsyAuth(
        api_key,
        api_secret,
        "http://local.host:3754",
        callback
    );

app.configure( function(){
  app.use( express.cookieParser() );
  app.use( express.session( { secret: "example secret" } ) );
  app.use( app.router );
  app.use( express.static( __dirname + "/public" ) );
});

app.get( entry, function( req, res ) {
    o.getRequestToken( req, res );
});
app.get( callback, function( req, res ) {
    o.getAccessToken( req, res, function ( req, res ) {
        res.redirect( "/success.html" );
    });
});

app.listen( 3754 );