<?php 
    $this->renderPartial('/site/_generate-stego');
    $this->renderPartial('/site/_encode-stego');
    $this->renderPartial('/site/_decode-stego');
    $this->renderPartial('/site/_login');
    $this->renderPartial('/site/_navbar');
    $this->renderPartial('/site/_userImages');
?>
<script type="text/javascript">
    $('.navbar').hide();
    $('.userImages').hide();


    function createUser(emailAddress, password)
    {
        var user = new Parse.User();
        user.set("username", emailAddress);
        user.set("password", password);
        user.set("email", emailAddress);
        user.signUp(null, {
            success: function(user) {
                console.log(user);
                // Hooray! Let them use the app now.
                alert("Created The user");
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    function loginUser(emailAddress, password)
    {
        Parse.User.logIn(emailAddress, password, {
            success: function(user) {
                // Do stuff after successful login.
                alert("Successfullly Logged In");
                $('.login').hide();
                $('.navbar').show();
                findUserImages();

            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    function logoutUser()
    {
        $('.navbar').hide();
        $('.login').show();
        clearLoginText();
    }

    function findUserImages()
    {
        var Images = Parse.Object.extend("Images");
        var query = new Parse.Query(Images);
        query.include("user_id");
        query.find({
            success: function(results) {
                displayUserImages(results);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
</script>