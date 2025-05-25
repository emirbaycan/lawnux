<?php

class Mailer
{
    private $host = 'localhost';
    private $port = 587;
    private $username = '@mail_user@';
    private $password = '@mail_password@';
    private $from_mail = '@mail_email@';
    private $from_title = '@mail_title@';
    private $charset = 'UTF-8';

    public function php_mailer($email, $title, $mail)
    {
        require $_SERVER['DOCUMENT_ROOT'].'/api/lib/PHPmailer/class.phpmailer.php';
        
        $results = (object) [];

        $a = new PHPMailer(); 
        $a->IsSMTP();
        $a->Host = $this->host;
        $a->Port = $this->port;
        $a->Username = $this->username;
        $a->Password = $this->password;
        $a->SetFrom($this->from_mail, $this->from_title);
        $a->AddAddress($email);
        $a->CharSet = $this->charset;
        $a->Subject = $title;
        $a->MsgHTML($mail);
        $a->send();

        $results->result = 1;
            
        return $results;
    }
}
