<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
unset($_SESSION);
session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
    <meta name="google-signin-client_id" content="1002341259414-8i6gasn2ip2eo5gumk7i87k66u8rsfvc.apps.googleusercontent.com">
</head>
<body>
    
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <script>
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
        });
    </script>
</body>
</html>
  