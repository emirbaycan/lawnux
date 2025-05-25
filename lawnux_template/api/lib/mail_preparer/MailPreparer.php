<?php
class Kalenux
{
    private $api_key = '123456';
    private $template_url = 'https://lawnux.emirbaycan.com.tr/mails/';
    private function parse_data($a)
    {
        $r=[];
        foreach ($a as $b => $c) {
            $r[] = $b.'='.$c;
        }
        $r[] = 'api_key='.$this->api_key;
        return implode('&', $r);
    }
    public function get_template($template, $data)
    {
        $results = (object)[];
        
        $m = $this->parse_data($data);
        $m = $this->template_url.$template.'.kalenux.php?'.$m;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $m);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $file_text = curl_exec($curl);
        curl_close($curl);
        $results->text = $file_text;
        $results->result=1;
        
        return $results;
    }
}
