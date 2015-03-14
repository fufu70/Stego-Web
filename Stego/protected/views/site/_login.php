<div class="login">
    <div class="header">
        <h1>Stego</h1>
    </div>
    <div class="panel panel-body"> 

        <ul class="tab-list">
            <li class="active"><a href="#login" data-toggle="tab">Log In</a></li>
            <li ><a href="#signup" data-toggle="tab">Create</a></li>
        </ul><br>
        <!-- Tab content -->
        <div class="tab-content">

            <div class="tab-pane fade in active" id="login">
                <form id="form_login" method="post">
                    <h3>Please log in</h3>
                    <div class="form-group">
                        <input name="DoorKeeper[email_address]" id="Login_emailAddress" type="email" class="form-control" placeholder="Email" autofocus required>
                        <input name="DoorKeeper[password]" id="Login_password" type="password" class="form-control" placeholder="Password" required>
                    </div>
                    <button id="loginButton" class="btn btn-lg btn-primary btn-block" type="button" data-loading-text="Loading..." autocomplete="off" >Log In</button>
                </form> 
            </div> <!-- /login -->

            <div class="tab-pane fade" id="signup">
                <form id="form_signup" method="post">
                    <h3>Create Account</h3>
                    <div class="form-group">
                        <input name="DoorKeeper[email_address]" id="Create_emailAddress" type="email" class="form-control" placeholder="Email" required>
                        <input name="DoorKeeper[password]" id="Create_password" type="password" class="form-control" placeholder="Password" required>
                        <input name="DoorKeeper[passwordRepeat]" id="Create_passwordRepeat" type="password" class="form-control" placeholder="Confirm Password" required>
                    </div>
                    <button class="btn btn-lg btn-primary btn-block" id="createAccountButton" type="button" data-loading-text="Loading..." autocomplete="off" >Create Account</button>
                </form> 
            </div> <!-- /signup -->
        </div> <!-- /tab-content -->


    </div>
</div>

<script type="text/javascript">
    $('#loginButton').click(function() {
        loginUser($('#Login_emailAddress').val(), $('#Login_password').val());
    });

    $('#createAccountButton').click(function() {
        if ($('#Create_password').val() == $('#Create_passwordRepeat').val())
        {
            createUser($('#Create_emailAddress').val(), $('#Create_password').val());
        }
        else
        {
            console.log("Cannot Create the User");
        }
    });

    function clearLoginText()
    {
        $('#Login_emailAddress').val("");
        $('#Login_password').val("");
    }
</script>