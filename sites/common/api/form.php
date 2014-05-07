<?php

/**
 * A public method to handle form submissions to Respond
 * @uri /form
 */
class FormResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function form() {

        // parse request
        parse_str($this->request->data, $request);

        $siteUniqId = SITE_UNIQ_ID;
        $pageUniqId = $request['pageUniqId'];
        $body = $request['body'];
    
        $site = Site::GetBySiteUniqId($siteUniqId);
        $page = Page::GetByPageUniqId($pageUniqId);

        if($site != null && $page != null){
            
            $subject = 'RespondCMS: Form Submission ['.$site['Name'].': '.$page['Name'].']';
            
            $content =  '<h3>Site Information</h3>'.
                        '<table>'.
                        '<tr>'.
                        '<td style="padding: 5px 25px 5px 0;">Site:</td>'.
                        '<td style="padding: 5px 0">'.$site['Name'].'</td>'.
                        '</tr>'.
                         '<tr>'.
                        '<td style="padding: 5px 25px 5px 0;">Page:</td>'.
                        '<td style="padding: 5px 0">'.$page['Name'].'</td>'.
                        '</tr>'.
                        '</table>'.
                        '<h3>Form Details</h3>'.
                        $body;
            
            
            // send an email
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $headers .= 'From: ' . $site['PrimaryEmail'] . "\r\n" .
                		'Reply-To: ' . $site['PrimaryEmail'] . "\r\n";
            
            // sends the email
            $to = $site['PrimaryEmail'];
            $from = $site['PrimaryEmail'];
            $fromName = $site['Name'];
            
            Utilities::SendEmail($to, $from, $fromName, $subject, $content);
            
            // return a successful response (200)
            return new Tonic\Response(Tonic\Response::OK);
            
        } else{ // unauthorized access

            return new Tonic\Response(Tonic\Response::UNAUTHORIZED);
        }
        
    }
}

?>