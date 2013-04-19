<?php

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /login
 */
class LoginResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function login() {

        // parse request
        parse_str($this->request->data, $request);

        $email = $request['email'];
        $password = $request['password'];

        // get the user from the credentials
        $user = User::GetByEmailPassword($email, $password);

        if($user!=null){
            
            // create a session from the user
            AuthUser::Create($user);

            // return a successful response (200)
            return new Tonic\Response(Tonic\Response::OK);
        }
        else{
            // return an unauthorized exception (401)
            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
    }
}

?>